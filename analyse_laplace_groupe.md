# Analyse Technique et Stylistique : laplace-groupe.com

Ce document présente une analyse détaillée de l'architecture front-end et du design system du site de référence Laplace Groupe, dans le but de fournir un cahier des charges précis pour une reproduction à l'identique (pixel-perfect).

---

## 1. Typographie et Calligraphie

Le site utilise une approche typographique élégante, associant une police avec empattement (Serif) pour l'autorité et l'élégance, et une police sans empattement (Sans-serif) pour la lisibilité moderne.

### Polices utilisées :
- **Police principale (Titres & Accroches)** : `Playfair Display` (ou équivalent Serif Premium comme *Cormorant Garamond*).
- **Police secondaire (Paragraphes, Menus, Boutons)** : `Inter` ou `Montserrat` (Sans-serif géométrique et lisible).

### Détails par niveau :
- **Titres H1 (Hero sections)**
  - Police : `Playfair Display`
  - Taille : `56px` (Desktop) / `32px` (Mobile)
  - Poids (font-weight) : `700` (Bold)
  - Interlignage (line-height) : `1.15`
  - Espacement (letter-spacing) : `-0.02em`
  - Casse : Normale (Sentence case)

- **Titres H2 (Titres de sections)**
  - Police : `Playfair Display`
  - Taille : `40px` (Desktop) / `28px` (Mobile)
  - Poids : `600` (Semi-bold)
  - Interlignage : `1.2`
  - Espacement : `-0.01em`
  - Casse : Normale

- **Titres H3 (Titres de cartes / sous-titres)**
  - Police : `Inter`
  - Taille : `20px`
  - Poids : `600` (Semi-bold)
  - Interlignage : `1.4`
  - Espacement : `0em`

- **Paragraphes (Body text)**
  - Police : `Inter`
  - Taille : `16px` (1rem)
  - Poids : `400` (Regular)
  - Interlignage : `1.6` (Aéré pour une lecture optimale)
  - Couleur : Gris anthracite texturé

- **Boutons & Liens (CTA)**
  - Police : `Inter`
  - Taille : `14px`
  - Poids : `600` (Semi-bold)
  - Interlignage : `1`
  - Espacement : `0.05em` (tracking léger)
  - Casse : Majuscule (Uppercase)

- **Menus de Navigation**
  - Police : `Inter`
  - Taille : `15px`
  - Poids : `500` (Medium)
  - Hover : Soulignement fin ou changement de couleur.

---

## 2. Palette de Couleurs

L'identité visuelle respire le premium, la gestion de patrimoine institutionnelle, avec un contraste marqué entre un fond profond et des accents dorés.

- **Primaire (Bleu Nuit Profond)** : `#0B1B3D`
  - *Utilisation* : Fonds du header, footer, sections "Hero", titres majeurs, arrière-plans institutionnels.
- **Secondaire (Or / Cuivre Premium)** : `#C89B5E` ou `#D4AF37`
  - *Utilisation* : Call-to-actions (boutons principaux), lignes de séparation, icônes, textes de surbrillance, hover states.
- **Tertiaire (Gris Perle / Sable)** : `#F4F5F7` ou `#FAF9F6`
  - *Utilisation* : Fonds de sections alternées, fonds de cartes pour créer un léger contraste avec le blanc pur.
- **Texte Principal (Dark Charcoal)** : `#1E2A3A`
  - *Utilisation* : Paragraphes sur fond clair, pour une lisibilité adoucie par rapport au noir pur `#000000`.
- **Texte Clair (Blanc)** : `#FFFFFF`
  - *Utilisation* : Texte sur fond Primaire.
- **Bordures / Lignes subtiles** : `#E5E7EB` (rgba(255,255,255,0.1) sur fond foncé).

---

## 3. Disposition et Mise en Page (Layout)

- **Conteneur Principal** : `max-width: 1280px` (ou 1440px sur écrans ultra-larges), centré avec `margin: 0 auto`.
- **Grille** : Utilisation d'une grille CSS Flexbox/Grid type 12 colonnes (gap de `24px` ou `32px`).
- **En-tête (Header)** :
  - Position : `fixed` en haut de page (`z-index: 100`).
  - Padding : `py-4 px-8`.
  - Effet : Transition de transparent à fond solide `#0B1B3D` au scroll (avec un léger `backdrop-filter: blur(8px)`).
- **Sections** :
  - Padding vertical : Généreux (`py-24` soit environ `96px` à `120px` sur desktop, `64px` sur mobile).
  - Fonds alternés : Alternance de `#FFFFFF` et `#F4F5F7` pour marquer le rythme de lecture.
- **Cartes (Cards)** :
  - Padding : `32px` (`p-8`).
  - Arrondis : `border-radius: 8px` (Léger arrondi, très institutionnel, pas trop rond).
  - Ombres : `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05)` (Ombre très diffuse et douce).

---

## 4. Images et Médias

- **Formats** : Privilège accordé au `WebP` pour les performances, fallback en `JPG` haute résolution.
- **Ratios** : Utilisation stricte de ratios harmonieux (16:9 pour les paysages/vidéos, 3:4 pour les portraits, 1:1 pour les encarts).
- **Traitement d'image** :
  - Images de fond en `object-cover`.
  - *Overlay* : Gradient linéaire noir ou bleu nuit (`rgba(11, 27, 61, 0.6)`) appliqué sur les images Hero pour garantir le contraste du texte blanc.
- **Icônes** : Utilisation de SVG vectoriels au trait (Stroke width `1.5px` ou `2px`), très minimalistes, colorés en Or (`#C89B5E`).

---

## 5. Animations et Interactions

L'interface se veut fluide mais sans excès, l'animation servant l'élégance.

- **Transitions CSS Globales** : `transition: all 0.3s ease-in-out;` sur la plupart des éléments interactifs.
- **Boutons (Hover)** :
  - Fond qui passe du transparent à l'Or plein, ou translation de l'icône flèche `transform: translateX(4px)`.
- **Apparition au Scroll (Reveal)** :
  - Effet : `fade-up` (opacité de 0 à 1, translation Y de `20px` vers `0`).
  - Durée : `0.8s` ou `1s`, avec une fonction de lissage type `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
  - Délai : Staggering (décalage de `100ms` entre chaque carte d'une même grille).
- **Parallaxe** : Léger défilement asynchrone des images de fond (`background-attachment: fixed` ou via JS) dans les sections pleines largeurs.
- **Menus déroulants** : Apparition fluide (fade-in) au hover ou au clic, sans effet de saut.

---

## 6. Responsive Design

Approche *Mobile-First* avec des points de rupture classiques.

- **Breakpoints** :
  - Tablette (`md`) : `768px`
  - Ordinateur (`lg`) : `1024px`
  - Grand écran (`xl`) : `1280px`
- **Comportement Mobile (< 1024px)** :
  - Le header se transforme : disparition des liens, apparition du bouton "Hamburger" (`Menu`).
  - Le menu s'ouvre en "Full Screen" (100vh) avec un fond bleu nuit.
  - Les grilles de 3 ou 4 colonnes passent en 1 seule colonne (`flex-direction: column`).
  - Réduction des paddings de sections (`py-12` au lieu de `py-24`).

---

## 7. Éléments Graphiques Récurrents

- **Lignes de démarcation** : Des lignes fines horizontales ou verticales (`1px solid #C89B5E`) séparent les blocs de texte ou les éléments d'une liste pour structurer l'information de manière architecturale.
- **Asymétrie contrôlée** : Textes alignés à gauche associés à des images occupant 60% de la largeur droite, créant un dynamisme visuel.
- **Espaces négatifs (Whitespace)** : Très présents. Le design "respire" grâce à de grandes marges vides entre les sections.

---

## 8. Accessibilité et UX

- **Contraste** : Ratio élevé, notamment pour les textes blancs sur fonds sombres, assurant la conformité WCAG AA.
- **États Focus** : Présents sur les liens et champs de formulaires (outline subtil).
- **Polices minimales** : Aucune police lisible en dessous de `14px` (sauf mentions légales).

---

## 9. Technologies (Estimation)

- Structure DOM propre indiquant un framework moderne (probablement React/Next.js ou Vue/Nuxt.js, ou un CMS headless).
- Utilisation probable de librairies d'animation comme **GSAP** (GreenSock) ou **Framer Motion** (pour les effets de scroll très fluides).
- Architecture CSS modulaire (Tailwind CSS ou SCSS).
