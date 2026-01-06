---
description: Initialise le projet Phardev avec Next.js, toutes les dépendances (R3F, GSAP, Lenis, Framer Motion) et la structure de dossiers complète. Lance avec /init-project
---

# Workflow: Init Project

**Trigger:** `/init-project`

## Description

Initialise le projet Phardev from scratch avec toute la stack technique et la structure de base.

## Référence

Avant de commencer, visite https://www.shopify.com/editions/winter2026 pour comprendre le niveau de qualité visé.

## Steps

### 1. Créer le projet Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Installer les dépendances

```bash
# 3D
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing

# Animations
npm install gsap @studio-freight/lenis framer-motion

# State
npm install zustand

# Utils
npm install clsx tailwind-merge

# Types
npm install -D @types/three
```

### 3. Créer la structure des dossiers

```
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── three/
│   ├── animations/
│   └── cursor/
├── hooks/
├── stores/
├── lib/
├── styles/
└── types/
```

### 4. Configurer les fichiers de base

**src/lib/utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**src/stores/app-store.ts**

```typescript
import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  isMenuOpen: boolean;
  cursorVariant: "default" | "hover" | "click";
  setIsLoading: (value: boolean) => void;
  setIsMenuOpen: (value: boolean) => void;
  setCursorVariant: (variant: "default" | "hover" | "click") => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  isMenuOpen: false,
  cursorVariant: "default",
  setIsLoading: (value) => set({ isLoading: value }),
  setIsMenuOpen: (value) => set({ isMenuOpen: value }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
}));
```

**src/hooks/useLenis.ts**

```typescript
"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}
```

**src/hooks/useMediaQuery.ts**

```typescript
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
```

### 5. Configurer Tailwind

Ajouter dans `tailwind.config.ts` les couleurs et fonts du design system.

### 6. Créer le layout de base

**src/app/layout.tsx** avec :

- Provider pour Lenis (smooth scroll)
- Grain overlay component
- Custom cursor component
- Classe pour Inter font

### 7. Vérifier

```bash
npm run dev
```

Le projet doit démarrer sans erreur sur http://localhost:3000

## Output

- Projet Next.js fonctionnel
- Structure de dossiers complète
- Hooks de base (useLenis, useMediaQuery)
- Store Zustand configuré
- Prêt pour créer les sections
