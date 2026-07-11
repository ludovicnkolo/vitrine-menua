# Résolution d'Incidents - Accès Réseau & Affichage Mobile

## 1. Blocage HMR (Hot Module Replacement) sur le réseau local
**Symptôme :** Erreur `Blocked cross-origin request to Next.js dev resource` lors de l'accès au site depuis un appareil mobile sur le réseau local, empêchant le chargement du Javascript (ex: menus mobiles inactifs).
**Tentative infructueuse :** Lier le serveur à une IP spécifique (`next dev --hostname 10.10.1.68`) produisant une erreur `EADDRNOTAVAIL` car l'IP n'appartenait pas à la machine.
**Solution :**
- Démarrer le serveur normalement (qui écoute sur `0.0.0.0` pour le réseau local).
- Ajouter l'adresse IP réseau réelle de la machine (`10.223.2.62`) dans le tableau `allowedDevOrigins` du fichier `next.config.ts`.

## 2. Chevauchement et disparition d'images sur Mobile
**Symptôme :** Le texte de présentation couvrait les titres à cause d'une marge négative mal gérée, et certaines images (cachées avec `hidden lg:block`) disparaissaient complètement sur mobile.
**Solution :** 
- Ajout d'une balise `<img className="block lg:hidden relative z-20">` spécialement pour le mobile.
- Ajustement de l'index d'empilement du texte avec `relative z-30 lg:z-10` pour qu'il s'affiche proprement par-dessus l'image sur les petits écrans.

## 3. Ordre d'affichage Texte/Image sur Mobile
**Symptôme :** Dans certaines sections (comme "Accréditations"), l'image s'affichait en dessous du texte sur mobile, ce qui n'était pas naturel pour l'expérience utilisateur.
**Solution :**
- Remplacement de la classe `flex-col` par `flex-col-reverse` sur le conteneur parent. Cela permet d'inverser l'ordre des éléments sur mobile (l'image passe au-dessus) tout en conservant l'affichage côte à côte sur ordinateur (`lg:flex-row`).
