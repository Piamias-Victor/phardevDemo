---
trigger: always_on
---

# Phardev - Project Context

## 🎯 Référence Visuelle PRINCIPALE

**https://www.shopify.com/editions/winter2026**

C'est notre benchmark. Chaque section, animation, transition doit viser ce niveau de qualité.

Analyse ce site et inspire-toi de :

- L'intro/loader animé
- Les transitions entre sections
- Les effets 3D intégrés au scroll
- La typographie bold + légère
- Le rythme des animations
- L'utilisation du noir et des couleurs vives sur les éléments 3D
- Les micro-interactions au hover

## Autres inspirations

| Site                  | Ce qu'on retient                   |
| --------------------- | ---------------------------------- |
| https://stripe.com    | Clarté, grilles, gradients subtils |
| https://linear.app    | Dark mode, animations fluides      |
| https://vercel.com    | Typographie, minimalisme           |
| https://www.apple.com | Espace blanc, élégance             |

---

## L'Entreprise

**Nom:** Phardev
**Secteur:** Solutions digitales pour pharmacies
**Promesse:** Simplicité & Efficacité
**Différenciateur:** Solutions clé-en-main, pas de complexité technique pour le pharmacien
**Feeling visé:** Modernité, Innovation, Confiance, Premium

---

## Objectif du Site

1. **Impressionner visuellement** — "Wow, ils sont sérieux"
2. **Montrer la sophistication technique** — Sans être technique dans le discours
3. **Rester accessible** — Pharmaciens = audience non-tech
4. **Générer des leads** — Formulaire de contact simple

---

## Structure des Pages

### Landing Page (5 sections)

**1. Hero**

- Headline percutant (style Apple, très grand, léger)
- Sous-titre court
- CTA principal
- Élément 3D interactif (réagit au mouse/scroll)
- Intro animée au chargement

**2. Features**

- 3-4 features max
- Cards avec glassmorphism
- Icônes ou mini-3D par feature
- Reveal au scroll staggeré

**3. Stats**

- 3 chiffres clés avec compteur animé
- Parallax sur le background
- Grandes typos

**4. Testimonials**

- 2-3 témoignages
- Slider ou scroll horizontal
- Photos + noms + pharmacies

**5. CTA Final**

- Headline de closing
- Bouton contact proéminent
- Peut inclure élément 3D

### Page About

- Histoire de Phardev
- Valeurs
- Équipe (optionnel)

### Page Contact

- Formulaire simple (nom, email, message)
- Pas de fonctionnalité réelle (mockup)

### Page Projets

- Grid de projets/réalisations
- Cards avec hover effect élaboré

---

## Design Tokens

### Couleurs

```css
/* Light Mode */
--background: #ffffff;
--foreground: #000000;
--muted: #f5f5f5;
--muted-foreground: #737373;
--border: #e5e5e5;

/* Dark Mode */
--background: #000000;
--foreground: #ffffff;
--muted: #171717;
--muted-foreground: #a3a3a3;
--border: #262626;

/* Accent (pour 3D et éléments de couleur) */
--accent-primary: #d4a853; /* Or Amber */
--accent-secondary: #c9952c;
```

### Typographie

```css
--font-family: "Inter", sans-serif;

/* Scale */
--text-hero: 96px; /* Hero headline */
--text-h1: 64px;
--text-h2: 48px;
--text-h3: 32px;
--text-h4: 24px;
--text-body: 16px;
--text-small: 14px;

/* Weights */
--font-light: 300; /* Titres */
--font-regular: 400; /* Body */
--font-medium: 500; /* Emphasis */
```

### Spacing (base 8px)

```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-6: 48px;
--space-8: 64px;
--space-12: 96px;
--space-16: 128px;
--space-24: 192px;
```

---

## Spécifications Animations

### Scroll

- Lenis smooth scroll sur tout le site
- Durée: 1.2s, easing: cubic-bezier(0.16, 1, 0.3, 1)

### Reveal

- Tous les éléments apparaissent au scroll
- Y offset: 60px, opacity: 0 → 1
- Durée: 0.8s - 1s
- Stagger pour les listes: 0.1s

### Parallax

- Minimum 2 couches de profondeur
- Subtle: 0.1 - 0.3 de vitesse relative

### Hover

- Transitions: 0.3s ease-out
- Scale subtle: 1.02 - 1.05
- Cursor blob qui grossit sur les éléments cliquables

### Page Transitions

- Fade + légère translation Y
- Durée: 0.5s

---

## Éléments 3D

### Style visé

- Formes abstraites, organiques
- Couleurs: Or/Amber (#D4A853) sur fond noir
- Ou formes noires sur fond blanc avec reflets colorés

### Comportement

- Réagit au scroll (rotation, position)
- Réagit à la souris (suit légèrement le curseur)
- Auto-rotation lente au repos
- Float effect subtil

### Performance

- Simplifier/désactiver sur mobile
- LOD (Level of Detail) si nécessaire
- Max 50k triangles par scène

---

## Contenu Placeholder

### Headlines

- Hero: "Digitalisez votre pharmacie"
- Features: "Tout ce dont vous avez besoin"
- Stats: "Résultats prouvés"
- CTA: "Prêt à transformer votre pharmacie ?"

### Features (exemples)

1. Gestion des stocks intelligente
2. Click & Collect intégré
3. Analyse des ventes en temps réel
4. Support dédié 24/7

### Stats (exemples)

- "150+ pharmacies équipées"
- "98% satisfaction client"
- "+40% efficacité moyenne"

---

## Contraintes Techniques

- Mobile: Version dégradée acceptable (pas de 3D complexe)
- SEO: Non critique pour l'instant
- Multilingue: Non (français uniquement)
- Analytics: Simple (Plausible ou GA4)
- Forms: Mockup seulement, pas de backend
