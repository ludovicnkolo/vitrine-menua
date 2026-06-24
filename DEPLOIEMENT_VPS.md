# 🚀 GUIDE DE DÉPLOIEMENT VPS — MENUA CONSULTING
> **VPS OVHcloud vide → Site en production avec HTTPS**
> Stack : Next.js 16 · Prisma (SQLite → PostgreSQL) · Docker · Nginx · Let's Encrypt

---

## 📋 PRÉREQUIS AVANT DE COMMENCER

- ✅ VPS OVHcloud actif sous **Ubuntu 22.04 LTS** (recommandé)
- ✅ Domaine `menuaconsulting.com` pointant vers l'IP du VPS (enregistrement DNS `A`)
- ✅ Accès SSH root ou utilisateur sudo
- ✅ Accès email SMTP OVH configuré (`contact@menuaconsulting.com`)
- ✅ Code source sur un dépôt Git privé (GitHub / GitLab)

---

## ─────────────────────────────────────────────────
## PHASE 1 — PRÉPARATION DU SERVEUR VPS
## ─────────────────────────────────────────────────

### 1.1 — Connexion SSH au VPS

```bash
# Remplacer par l'IP réelle du VPS OVH — utilisateur courant : deploy-menua
ssh deploy-menua@152.228.143.122
```

> ℹ️ **Note importante** : vous n'êtes PAS connecté en `root` mais en tant qu'utilisateur normal (`deploy-menua`).
> Toutes les commandes système nécessitent le préfixe **`sudo`**. Le guide utilise `sudo` partout où c'est requis.

### 1.2 — Mise à jour complète du système

```bash
# Met à jour la liste des paquets disponibles (sudo requis car modifie /var/lib/apt)
sudo apt update

# Installe toutes les mises à jour de sécurité et système
sudo apt upgrade -y
```
> ⚠️ Ne pas sauter cette étape. Un VPS neuf peut avoir des failles connues non patchées.

### 1.3 — Création d'un utilisateur dédié (sécurité — éviter de tout faire en root)

> ⚠️ **Contrainte Linux** : les noms d'utilisateur doivent être en **minuscules uniquement**.
> Caractères autorisés : `a-z`, `0-9`, `-` (tiret), `_` (underscore).
> `deployMenua` → ❌ interdit | `deploy` → ✅ valide | `deploy-menua` → ✅ valide

```bash
# Crée l'utilisateur dédié au déploiement
sudo adduser deploy-menua

# Lui donne les droits sudo (pour exécuter des commandes admin ponctuellement)
sudo usermod -aG sudo deploy-menua

# Copie la clé SSH de ludovic vers le nouvel utilisateur
sudo rsync --archive --chown=deploy-menua:deploy-menua ~/.ssh /home/deploy-menua
```

> ✅ Désormais vous pouvez vous reconnecter via : `ssh deploy-menua@152.228.143.122`

### 1.4 — Configuration du pare-feu UFW (Uncomplicated Firewall)

```bash
# Autorise le port 22 (SSH) — OBLIGATOIRE sinon vous vous bloquez vous-même
sudo ufw allow OpenSSH

# Autorise le port 80 (HTTP) — utilisé par Certbot pour valider le domaine
sudo ufw allow 80/tcp

# Autorise le port 443 (HTTPS) — le site final en HTTPS
sudo ufw allow 443/tcp

# Active le pare-feu (bloque tout le reste par défaut)
sudo ufw enable

# Vérifie l'état du pare-feu
sudo ufw status
```
> ✅ Résultat attendu : ports 22, 80, 443 en "ALLOW"

---

## ─────────────────────────────────────────────────
## PHASE 2 — INSTALLATION DE DOCKER ET DOCKER COMPOSE
## ─────────────────────────────────────────────────

> Le projet utilise Docker pour containeriser Next.js et Nginx.
> Toute la stack tourne dans des conteneurs, donc **Node.js ne s'installe PAS directement sur le VPS**.

### 2.1 — Installation des dépendances pour télécharger Docker

```bash
# Installe les paquets nécessaires pour ajouter des dépôts externes sécurisés
sudo apt install -y ca-certificates curl gnupg lsb-release
```

### 2.2 — Ajout du dépôt officiel Docker

```bash
# Crée le répertoire pour stocker les clés GPG de confiance
sudo install -m 0755 -d /etc/apt/keyrings

# Télécharge et enregistre la clé GPG officielle de Docker
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc

# Donne les droits de lecture sur cette clé
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Ajoute le dépôt Docker à la liste des sources APT du système
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Recharge la liste des paquets pour inclure Docker
sudo apt update
```

### 2.3 — Installation de Docker et du plugin Compose

```bash
# Installe Docker Engine, le CLI, containerd et le plugin Docker Compose V2
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2.4 — Vérification de l'installation

```bash
# Doit afficher la version de Docker (ex: Docker version 25.x.x)
docker --version

# Doit afficher la version de Docker Compose V2 (ex: Docker Compose version v2.x.x)
docker compose version
```

### 2.5 — Autoriser l'utilisateur "deploy-menua" à utiliser Docker sans sudo

```bash
# Ajoute deploy-menua au groupe docker
# Cela évite de taper "sudo" avant chaque commande docker
sudo usermod -aG docker deploy-menua

# OBLIGATOIRE : déconnectez-vous et reconnectez-vous pour que le groupe soit actif
exit
# Puis reconnectez-vous : ssh deploy-menua@152.228.143.122

# Vérifiez que vous êtes bien dans le groupe docker
groups
# → Doit afficher : deploy-menua sudo docker ...
```

---

## ─────────────────────────────────────────────────
## PHASE 3 — RÉCUPÉRATION DU CODE SOURCE
## ─────────────────────────────────────────────────

### 3.1 — Installation de Git (si absent)

```bash
sudo apt install -y git
```

### 3.2 — Configuration de la clé SSH pour GitHub (clé existante)

> ℹ️ Votre clé SSH est **déjà enregistrée sur GitHub**.
> Emplacement sur votre PC : `/home/kratos-financials-inc/.ssh/id_ed25519_vitrineMenua`
> Il suffit de la **transférer vers le VPS** — pas besoin d'en générer une nouvelle.

#### Étape 1 — Transférer la clé privée depuis votre PC local vers le VPS

Exécuter ces commandes **sur votre machine locale** (pas sur le VPS) :

```bash
# Crée le dossier .ssh sur le VPS s'il n'existe pas
ssh deploy-menua@152.228.143.122 "mkdir -p ~/.ssh && chmod 700 ~/.ssh"

# Transfère la clé PRIVÉE (fichier sans .pub) depuis votre PC vers le VPS
scp /home/kratos-financials-inc/.ssh/id_ed25519_vitrineMenua \
    deploy-menua@152.228.143.122:~/.ssh/id_ed25519_vitrineMenua

# Transfère aussi la clé publique
scp /home/kratos-financials-inc/.ssh/id_ed25519_vitrineMenua.pub \
    deploy-menua@152.228.143.122:~/.ssh/id_ed25519_vitrineMenua.pub
```
> ✅ IP du VPS OVH : `152.228.143.122`
> ⚠️ La clé **privée** (`id_ed25519_vitrineMenua`) ne doit **jamais** être partagée ou commitée dans Git.

#### Étape 2 — Sécuriser les permissions sur le VPS

Revenir sur le **VPS** et définir les bonnes permissions :

```bash
# La clé privée doit être lisible uniquement par son propriétaire (600)
chmod 600 ~/.ssh/id_ed25519_vitrineMenua

# La clé publique peut être lisible par tous (644)
chmod 644 ~/.ssh/id_ed25519_vitrineMenua.pub

# Vérifie que les fichiers sont bien présents
ls -la ~/.ssh/
# → Doit afficher id_ed25519_vitrineMenua et id_ed25519_vitrineMenua.pub
```

#### Étape 3 — Configurer SSH pour utiliser cette clé avec GitHub

Comme la clé n'a pas le nom par défaut (`id_ed25519`), il faut indiquer à SSH quelle clé utiliser pour `github.com` :

```bash
# Crée ou édite le fichier de configuration SSH
nano ~/.ssh/config
```

**Contenu à coller dans le fichier `~/.ssh/config` :**

```
# Clé SSH pour GitHub — vitrine Menua
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_vitrineMenua
    IdentitiesOnly yes
```
> Sauvegarder : `Ctrl+O` → `Entrée` → `Ctrl+X`

```bash
# Sécurise le fichier de config (obligatoire, SSH le rejette sinon)
chmod 600 ~/.ssh/config
```

#### Étape 4 — Tester la connexion SSH avec GitHub

```bash
# Vérifie que GitHub reconnaît bien votre clé SSH
ssh -T git@github.com
# → Résultat attendu : "Hi ludovicnkolo! You've successfully authenticated..."
```

#### Étape 5 — Cloner le dépôt avec l'URL SSH (pas HTTPS)

```bash
# Utiliser l'URL SSH (git@github.com:...) — jamais l'URL HTTPS avec un mot de passe
git clone git@github.com:ludovicnkolo/vitrine-menua.git menua_consulting


# Entre dans le dossier du projet (renommé en menua_consulting)
cd menua_consulting
```
> Le paramètre `menua_consulting` à la fin renomme le dossier cloné pour correspondre au guide.

---

## ─────────────────────────────────────────────────
## PHASE 4 — CONFIGURATION DES VARIABLES D'ENVIRONNEMENT
## ─────────────────────────────────────────────────

> Le fichier `.env` contient les secrets de l'application.
> Il ne doit **JAMAIS** être commité dans Git (déjà listé dans `.gitignore`).

### 4.1 — Génération d'un secret JWT sécurisé

> ✅ **Déjà fait !** Vous avez généré votre secret JWT :
> ```
> k/e1zHuULwOtjDZTnG0c5hMgTgUUsjw7V9HV/0XbOdHiCUegAnpX+OelUwodKYG7JabRoihws3CF4A5Tlxe6Qg==
> ```
> Il est déjà utilisé dans le `.env` ci-dessous.

### 4.2 — Création du fichier `.env` de production

> ⚠️ Le fichier `.env.example` n'est pas inclus dans le dépôt Git (ignoré par `.gitignore`).
> Il faut créer le `.env` directement avec nano.

```bash
# Crée et ouvre le fichier .env directement dans nano
nano .env
```

**Copier-coller ce contenu exact dans nano :**

```env
# ─── BASE DE DONNÉES ───────────────────────────────────────────
# SQLite dans le volume Docker persistant (hors racine web)
DATABASE_URL="file:/app/data/prod.db"

# ─── AUTHENTIFICATION JWT ──────────────────────────────────────
# Secret généré avec : openssl rand -base64 64
JWT_SECRET="k/e1zHuULwOtjDZTnG0c5hMgTgUUsjw7V9HV/0XbOdHiCUegAnpX+OelUwodKYG7JabRoihws3CF4A5Tlxe6Qg=="
JWT_EXPIRES_IN="8h"

# ─── EMAIL (Nodemailer — SMTP OVHcloud) ────────────────────────
SMTP_HOST="ssl0.ovh.net"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="contact@menuaconsulting.com"
# Mot de passe de la boite email OVH (pas le mot de passe du compte OVH !)
SMTP_PASS="MOT_DE_PASSE_EMAIL_OVH"
SMTP_FROM="MENUA CONSULTING <contact@menuaconsulting.com>"

# Email qui reçoit les formulaires de contact du site vitrine
CONTACT_EMAIL_TO="contact@menuaconsulting.com"

# ─── STOCKAGE DOCUMENTS SÉCURISÉS ──────────────────────────────
# Chemin dans le volume Docker (hors racine web — inaccessible publiquement)
DOCUMENTS_STORAGE_PATH="/var/menua/documents"

# ─── NEXT.JS ───────────────────────────────────────────────────
# URL publique finale du site (important pour les redirections et le SEO)
NEXT_PUBLIC_SITE_URL="https://menuaconsulting.com"
NODE_ENV="production"
```

> ⚠️ **Remplacer `MOT_DE_PASSE_EMAIL_OVH`** par le vrai mot de passe de la boite `contact@menuaconsulting.com`.
> ⚠️ **Sauvegarder** : `Ctrl+O` → `Entrée` → `Ctrl+X` pour quitter nano.

### 4.3 — Sécurisation des permissions du fichier .env

```bash
# Seul le propriétaire (deploy-menua) peut lire/écrire ce fichier — personne d'autre
chmod 600 .env
```

---

## ─────────────────────────────────────────────────
## PHASE 5 — CONSTRUCTION ET LANCEMENT DES CONTENEURS
## ─────────────────────────────────────────────────

> Le `docker-compose.yml` orchestre deux conteneurs :
> - `menua_app` → Application Next.js (port 3000, interne uniquement)
> - `menua_nginx` → Reverse proxy Nginx (ports 80 et 443, exposés publiquement)

### 5.1 — Vérification de la structure Nginx

```bash
# Vérifie que le dossier de configuration Nginx existe bien
ls -la nginx/conf.d/
# → Doit afficher : default.conf
```

### 5.2 — Création des dossiers SSL pour Certbot (nécessaire avant le démarrage)

```bash
# Ces dossiers sont montés dans le conteneur Nginx pour Let's Encrypt
mkdir -p nginx/ssl
mkdir -p nginx/certbot/www
```

### 5.3 — Construction des images Docker et démarrage

```bash
# --build : force la reconstruction de l'image (Next.js compile ici)
# -d : démarre en mode "detached" (les conteneurs tournent en arrière-plan)
docker compose up --build -d
```
> ⏳ **Cette commande prend 3 à 7 minutes** lors du premier lancement.
> Elle compile le projet Next.js en production (`npm run build`) à l'intérieur du conteneur.

### 5.4 — Vérification que les conteneurs tournent

```bash
# Liste tous les conteneurs actifs
docker compose ps

# Résultat attendu :
# NAME            STATUS          PORTS
# menua_app       Up              3000/tcp
# menua_nginx     Up              0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

### 5.5 — Consultation des logs en temps réel (débogage)

```bash
# Affiche les logs de TOUS les conteneurs (Ctrl+C pour arrêter)
docker compose logs -f

# Affiche uniquement les logs de l'application Next.js
docker compose logs -f menua_app

# Affiche uniquement les logs du proxy Nginx
docker compose logs -f menua_nginx
```

### 5.6 — Test HTTP avant SSL

```bash
# Depuis le VPS lui-même, teste que l'app répond sur le port 3000
curl http://localhost:3000

# Depuis votre ordinateur (si DNS déjà configuré), ouvrir dans un navigateur :
# http://menuaconsulting.com
# → Le site doit s'afficher (sans HTTPS pour l'instant)
```

---

## ─────────────────────────────────────────────────
## PHASE 6 — INITIALISATION DE LA BASE DE DONNÉES (PRISMA)
## ─────────────────────────────────────────────────

> La base de données SQLite est créée dans le volume Docker `menua_db_data`.
> Cette étape crée toutes les tables définies dans `prisma/schema.prisma`.

### 6.1 — Application du schéma Prisma en production

```bash
# Exécute la commande prisma db push DANS le conteneur menua_app
# Crée ou met à jour les tables sans générer de fichiers de migration
docker compose exec menua_app npx prisma db push
```
> ✅ Résultat attendu : `Your database is now in sync with your Prisma schema.`

### 6.2 — Vérification des tables créées (optionnel)

```bash
# Ouvre un shell SQLite dans le conteneur pour inspecter la base
docker compose exec menua_app sh -c "npx prisma db execute --stdin <<< '.tables'"
```

### 6.3 — Création du premier compte Administrateur CRM

```bash
# Génère le hash bcrypt du mot de passe admin (remplacer MON_MOT_DE_PASSE)
docker compose exec menua_app node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('MON_MOT_DE_PASSE', 12).then(h => console.log(h));
"
```
> 📋 Copiez le hash généré. Ensuite, insérez le compte admin en base :

```bash
# Ouvre un REPL Node.js dans le conteneur pour insérer l'admin
docker compose exec menua_app node -e "
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.utilisateurCRM.create({
  data: {
    nom: 'Admin',
    prenom: 'Menua',
    email: 'contact@menuaconsulting.com',
    motDePasse: 'HASH_BCRYPT_GENERE_CI_DESSUS',
    role: 'ADMINISTRATEUR'
  }
}).then(u => { console.log('Admin créé :', u.email); db.\$disconnect(); });
"
```

---

## ─────────────────────────────────────────────────
## PHASE 7 — CERTIFICAT SSL HTTPS AVEC LET'S ENCRYPT
## ─────────────────────────────────────────────────

> ⚠️ **Cette phase ne fonctionne que si le DNS est déjà configuré.**
> Le domaine `menuaconsulting.com` doit pointer vers l'IP du VPS depuis au moins 15 minutes.

### 7.1 — Installation de Certbot sur le VPS (hors Docker)

```bash
# Installe Certbot (l'outil officiel Let's Encrypt)
sudo apt install -y certbot

# Vérifie l'installation
certbot --version
```

### 7.2 — Génération du certificat SSL (mode standalone)

```bash
# IMPORTANT : arrête temporairement Nginx pour libérer le port 80
docker compose stop menua_nginx

# Génère le certificat pour le domaine principal ET le sous-domaine www
# --standalone : Certbot lance son propre serveur HTTP temporaire sur le port 80
# --agree-tos  : accepte les conditions d'utilisation de Let's Encrypt
# -m           : email de contact pour les alertes d'expiration
sudo certbot certonly \
  --standalone \
  --agree-tos \
  --no-eff-email \
  -m contact@menuaconsulting.com \
  -d menuaconsulting.com \
  -d www.menuaconsulting.com
```
> ✅ Résultat attendu : `Certificate is saved at: /etc/letsencrypt/live/menuaconsulting.com/`

### 7.3 — Copie des certificats dans le dossier Nginx du projet

```bash
# Copie le certificat complet (fullchain = certificat + chaîne d'autorité)
sudo cp /etc/letsencrypt/live/menuaconsulting.com/fullchain.pem nginx/ssl/fullchain.pem

# Copie la clé privée
sudo cp /etc/letsencrypt/live/menuaconsulting.com/privkey.pem nginx/ssl/privkey.pem

# Sécurise les permissions (la clé privée ne doit être lisible que par root/docker)
chmod 600 nginx/ssl/privkey.pem
chmod 644 nginx/ssl/fullchain.pem
```

### 7.4 — Activation de la configuration HTTPS dans Nginx

```bash
# Ouvre la configuration Nginx
nano nginx/conf.d/default.conf
```

**Modifications à effectuer dans `default.conf` :**

1. Dans le bloc `server { listen 80; }` :
   - **Commenter** le bloc `location /` (proxy temporaire HTTP)
   - **Décommenter** le bloc `location /` pour la redirection 301 → HTTPS

2. **Décommenter entièrement** le bloc `server { listen 443 ssl http2; }` en dessous.

> Le fichier final doit avoir le bloc HTTP qui redirige vers HTTPS,
> et le bloc HTTPS qui fait le proxy vers `menua_app:3000`.

### 7.5 — Redémarrage de Nginx avec la nouvelle configuration

```bash
# Redémarre le conteneur Nginx (charge la nouvelle config SSL)
docker compose start menua_nginx

# Vérifie que Nginx démarre sans erreur
docker compose logs menua_nginx
```

### 7.6 — Test HTTPS final

```bash
# Teste que le certificat SSL est valide et que le site répond en HTTPS
curl -I https://menuaconsulting.com
# → Doit retourner HTTP/2 200 avec les en-têtes de sécurité
```
> 🌐 Ouvrir dans un navigateur : `https://menuaconsulting.com` — Le cadenas doit être vert.

### 7.7 — Renouvellement automatique du certificat (cron)

```bash
# Ouvre le planificateur de tâches cron
crontab -e

# Ajouter cette ligne à la fin du fichier :
# Vérifie le renouvellement chaque jour à 3h du matin
# Si le certificat expire dans moins de 30 jours, il le renouvelle automatiquement
0 3 * * * sudo certbot renew --quiet && sudo cp /etc/letsencrypt/live/menuaconsulting.com/fullchain.pem /home/deploy-menua/menua_consulting/nginx/ssl/fullchain.pem && sudo cp /etc/letsencrypt/live/menuaconsulting.com/privkey.pem /home/deploy-menua/menua_consulting/nginx/ssl/privkey.pem && docker compose -f /home/deploy-menua/menua_consulting/docker-compose.yml restart menua_nginx
```
> ⚠️ Les certificats Let's Encrypt expirent tous les **90 jours**. Ce cron les renouvelle automatiquement.

---

## ─────────────────────────────────────────────────
## PHASE 8 — COMMANDES DE GESTION COURANTE
## ─────────────────────────────────────────────────

### Arrêter tous les conteneurs

```bash
docker compose down
```

### Redémarrer tous les conteneurs

```bash
docker compose restart
```

### Redémarrer uniquement l'application Next.js

```bash
docker compose restart menua_app
```

### Déployer une mise à jour du code

```bash
# 1. Récupère les dernières modifications depuis Git
git pull origin main

# 2. Reconstruit l'image Next.js et redémarre les conteneurs
docker compose up --build -d

# 3. Réapplique le schéma Prisma si le schéma a changé
docker compose exec menua_app npx prisma db push
```

### Voir l'utilisation des ressources (CPU / RAM)

```bash
docker stats
```

### Sauvegarder la base de données SQLite

```bash
# Copie la base de données depuis le volume Docker vers le dossier courant
docker compose exec menua_app sh -c "cp /app/data/prod.db /app/data/prod.db.backup"

# Copie le backup hors du conteneur vers le VPS
docker cp menua_app:/app/data/prod.db.backup ./backup_$(date +%Y%m%d).db

# (Optionnel) Télécharger le backup sur votre machine locale via scp :
# scp deploy-menua@<IP_VPS>:/home/deploy-menua/menua_consulting/backup_*.db ./
```

### Nettoyer les images Docker inutilisées (libère de l'espace disque)

```bash
docker image prune -f
```

---

## ─────────────────────────────────────────────────
## PHASE 9 — RÉSOLUTION DE PROBLÈMES COURANTS
## ─────────────────────────────────────────────────

| Problème | Cause probable | Solution |
|---|---|---|
| Site inaccessible en HTTP | Conteneurs non démarrés | `docker compose ps` → `docker compose up -d` |
| Erreur 502 Bad Gateway | `menua_app` planté | `docker compose logs menua_app` |
| Erreur Prisma au démarrage | `.env` manquant ou `DATABASE_URL` incorrect | Vérifier `cat .env` |
| Certificat SSL invalide | Certbot pas encore lancé | Refaire la Phase 7 |
| Port 80 bloqué | UFW mal configuré | `ufw status` → `ufw allow 80/tcp` |
| Email non reçu | Mauvais SMTP_PASS | Tester avec `docker compose logs menua_app \| grep smtp` |
| Disk full | Images Docker accumulées | `docker system prune -a` |

---

## ─────────────────────────────────────────────────
## RÉCAPITULATIF — ORDRE D'EXÉCUTION COMPLET
## ─────────────────────────────────────────────────

```
Phase 1 → Préparer le VPS (apt update, créer user, UFW)
Phase 2 → Installer Docker + Docker Compose
Phase 3 → Cloner le dépôt Git
Phase 4 → Créer et remplir le fichier .env
Phase 5 → docker compose up --build -d   ← Lance le site en HTTP
Phase 6 → Initialiser la BDD Prisma + créer compte admin
Phase 7 → Générer le certificat SSL + activer HTTPS dans Nginx
Phase 8 → Configurer le cron de renouvellement SSL
```

---

## 📞 CONTACTS ET RESSOURCES

| Ressource | Lien |
|---|---|
| OVHcloud Manager | https://www.ovh.com/manager |
| Documentation Docker | https://docs.docker.com |
| Documentation Next.js | https://nextjs.org/docs |
| Let's Encrypt (Certbot) | https://certbot.eff.org |
| Documentation Prisma | https://www.prisma.io/docs |

---

> **Fichier maintenu par :** Équipe technique Menua Consulting
> **Dernière mise à jour :** Juin 2026
> **Stack version :** Next.js 16.2.9 · Prisma 7.8 · Docker Compose V2 · Node.js 20 Alpine
