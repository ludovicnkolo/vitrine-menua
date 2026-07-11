# Audit et Documentation du CRM MENUA CONSULTING

Ce document détaille l'implémentation du système CRM selon le cahier des charges, couvrant l'architecture Backend et Frontend (Admin), les logiques de workflows, et la sécurisation des rôles.

## 1. Architecture Globale

Le système a été implémenté au sein du monorepo existant (`apps/backend` et `apps/admin`), séparant clairement les responsabilités opérationnelles et les interfaces.

### Backend (Node.js / Express / Prisma)
- **Base de données relationnelle (SQLite/Prisma)** : Le schéma a été implémenté dans `apps/backend/prisma/schema.prisma`.
- **Modèles de données** :
  - `User` : Gestion des acteurs (Administrateur, Superviseur, Collaborateur, Prestataire, Lecture seule).
  - `Dossier` : Représente une demande client, avec des statuts allant de `NEW` à `CLOSED`.
  - `Task` : Segmente le travail d'un dossier en missions internes ou externes.
  - `Document` : Traçabilité des fichiers déposés (liés à un Dossier ou une Tâche).
  - `Comment` : Communication interne et comptes-rendus.
  - `AuditLog` : Table dédiée à la journalisation automatique de toutes les actions (connexion, vue, modification, etc.) pour garantir la sécurité et la traçabilité.

### Frontend Admin (React / Vite / Tailwind-like CSS natif)
- **Design Institutionnel et Sobre** : Utilisation d'une palette de couleurs stricte (Bleu Nuit `--primary: #1A365D`, Beige/Or `--secondary: #D4AF37`) reflétant le positionnement haut de gamme de MENUA CONSULTING.
- **Routage et Sécurisation** : Implémentation d'une `Sidebar` dynamique (React Router) dont l'affichage s'adapte au rôle de l'utilisateur connecté (`['ADMIN', 'SUPERVISOR'].includes(user.role)`).
- **Tableau de Bord** : Vue d'ensemble avec KPIs (Dossiers à qualifier, En cours, Urgences) et liste des demandes récentes avec code couleur de priorité (🔴 Urgent, 🟢 Normal, ⚪ Faible).

## 2. Traçabilité et Sécurité (Audit)

Le système de journalisation automatique a été implémenté via un middleware et un service dédié dans le backend :
```javascript
const logAudit = async (userId, action, targetId, targetType, details) => {
  await prisma.auditLog.create({
    data: { userId, action, targetId, targetType, details: JSON.stringify(details) }
  });
};
```
*Toute action (modification de statut, dépôt de document) est inscrite de manière indélébile.*

### Murailles de Chine (Cloisonnement)
La logique de segmentation stricte est préparée à deux niveaux :
1. **API** : Les requêtes backend vérifieront le `role` du JWT. Un Prestataire ne recevra que les données associées à son `taskId`.
2. **UI** : L'interface masque les sections "Utilisateurs" et "Configuration" aux collaborateurs et prestataires.

## 3. Workflow Opérationnel

Le cycle de vie du dossier est géré via la table `Dossier` (attribut `status`) et `Task` :
1. **RÉCEPTION** : Création du Dossier (Statut `NEW`).
2. **QUALIFICATION / ATTRIBUTION** : Le Superviseur passe le statut à `TO_ASSIGN` et crée une `Task` pour un Collaborateur.
3. **TRAITEMENT / EXÉCUTION** : Le collaborateur ou prestataire met à jour la `Task` et dépose des `Document`.
4. **CONTRÔLE / VALIDATION** : Retour à l'Admin, statut `VALIDATED` ou `CORRECTION_REQUESTED`.

## 4. Recommandations et Prochaines Étapes
- Mettre en place un service de stockage S3 / Blob pour les documents.
- Intégrer Nodemailer pour capturer les flux entrants (emails publics vers la plateforme).
- Affiner les Guards React (HOC de protection de routes) pour interdire tout accès direct via URL aux pages non autorisées.
