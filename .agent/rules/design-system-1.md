---
trigger: always_on
---

# Design System - Part 1

> Couleurs, Typographie, Spacing

---

## PHILOSOPHIE DESIGN

| Principe       | Application                            |
| -------------- | -------------------------------------- |
| **Espace**     | Beaucoup de blanc, contenu respire     |
| **Contraste**  | Noir pur / Blanc pur                   |
| **Mouvement**  | Tout bouge avec intention              |
| **Hiérarchie** | Tailles très contrastées (96px → 16px) |
| **Premium**    | Détails soignés, micro-interactions    |

### Inspirations

- **Shopify Editions** : Animations cinématiques, 3D, transitions
- **Stripe** : Grilles propres, gradients subtils
- **Linear** : Dark mode, animations fluides
- **Apple** : Typographie légère, espace blanc

---

## COULEURS

### Light Mode

```css
:root {
  --background: #ffffff;
  --background-muted: #fafafa;
  --background-subtle: #f5f5f5;

  --foreground: #000000;
  --foreground-muted: #737373;
  --foreground-subtle: #a3a3a3;

  --border: #e5e5e5;
  --border-muted: #f0f0f0;

  --accent: #d4a853;
  --accent-foreground: #000000;
}
```

### Dark Mode

```css
.dark {
  --background: #000000;
  --background-muted: #0a0a0a;
  --background-subtle: #171717;

  --foreground: #ffffff;
  --foreground-muted: #a3a3a3;
  --foreground-subtle: #737373;

  --border: #262626;
  --border-muted: #1a1a1a;
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--background-muted)",
          foreground: "var(--foreground-muted)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
      },
    },
  },
};
```

### Usage

```tsx
<div className="bg-background" />
<div className="bg-muted" />
<p className="text-foreground" />
<p className="text-muted-foreground" />
<div className="border border-border" />
```

---

## TYPOGRAPHIE

### Font : Inter

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");

:root {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Échelle typographique

```css
:root {
  /* Hero */
  --text-hero: clamp(3rem, 8vw, 6rem); /* 48px → 96px */

  /* Headings */
  --text-h1: clamp(2.5rem, 5vw, 4rem); /* 40px → 64px */
  --text-h2: clamp(2rem, 4vw, 3rem); /* 32px → 48px */
  --text-h3: clamp(1.5rem, 3vw, 2rem); /* 24px → 32px */
  --text-h4: clamp(1.25rem, 2vw, 1.5rem); /* 20px → 24px */

  /* Body */
  --text-body-lg: 1.125rem; /* 18px */
  --text-body: 1rem; /* 16px */
  --text-body-sm: 0.875rem; /* 14px */

  /* Small */
  --text-caption: 0.75rem; /* 12px */
  --text-overline: 0.6875rem; /* 11px */
}
```

### Weights

```css
:root {
  --font-light: 300; /* Titres hero */
  --font-regular: 400; /* Body text */
  --font-medium: 500; /* Buttons */
  --font-semibold: 600; /* Strong emphasis */
}
```

### Line heights

```css
:root {
  --leading-tight: 1.1; /* Hero */
  --leading-snug: 1.25; /* Headings */
  --leading-normal: 1.5; /* Body */
  --leading-relaxed: 1.75; /* Long text */
}
```

### Style Apple

```tsx
// Hero style
<h1 className="text-hero font-light leading-tight tracking-tight">
  Digitalisez votre pharmacie
</h1>

// Section heading
<h2 className="text-h2 font-light leading-snug">
  Tout ce dont vous avez besoin
</h2>

// Overline
<span className="text-overline font-medium uppercase tracking-widest text-muted-foreground">
  Fonctionnalités
</span>

// Body
<p className="text-body leading-normal text-muted-foreground">
  Description text here
</p>
```

### Layout Apple typique

```tsx
<section className="py-32">
  <div className="max-w-4xl mx-auto text-center">
    <span className="text-overline tracking-widest text-muted-foreground mb-4 block">
      Nouveau
    </span>
    <h2 className="text-h1 font-light tracking-tight mb-6">
      Une nouvelle façon de gérer
      <br />
      votre pharmacie.
    </h2>
    <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
      Découvrez comment Phardev simplifie votre quotidien.
    </p>
  </div>
</section>
```

---

## SPACING

### Système base 8

```css
:root {
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-24: 6rem; /* 96px */
  --space-32: 8rem; /* 128px */
  --space-40: 10rem; /* 160px */
  --space-48: 12rem; /* 192px */
}
```

### Usage par contexte

| Contexte                   | Spacing                 |
| -------------------------- | ----------------------- |
| Entre éléments inline      | `space-2` (8px)         |
| Entre éléments d'un groupe | `space-4` (16px)        |
| Entre groupes              | `space-8` (32px)        |
| Padding de section         | `space-24` à `space-32` |
| Entre sections             | `space-32` à `space-48` |

```tsx
// Section padding
<section className="py-24 md:py-32 lg:py-40">

// Gap entre cards
<div className="grid gap-6 md:gap-8">

// Stack de texte
<div className="space-y-4">
  <h3>Title</h3>
  <p>Description</p>
</div>
```
