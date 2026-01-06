---
trigger: always_on
---

# Clean Code Principles - Part 1

> Principes fondamentaux et structure des composants

---

## PRINCIPES FONDAMENTAUX

### 1. Single Responsibility (SRP)

Chaque fichier/fonction/composant fait UNE seule chose.

```typescript
// ❌ MAUVAIS - fait trop de choses
function UserCard({ user }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/users/${user.id}`);
    const data = await response.json();
    setIsLoading(false);
  };

  return (
    <div onClick={handleClick}>
      <img src={user.avatar} />
      <h3>{user.name}</h3>
      {isLoading && <Spinner />}
    </div>
  );
}

// ✅ BON - séparation des responsabilités
// hooks/useUser.ts
function useUser(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    const data = await userService.getById(userId);
    setUser(data);
    setIsLoading(false);
  };

  return { user, isLoading, fetchUser };
}

// components/UserCard.tsx
function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div onClick={onClick}>
      <Avatar src={user.avatar} />
      <UserName name={user.name} />
    </div>
  );
}
```

### 2. DRY (Don't Repeat Yourself)

```typescript
// ❌ MAUVAIS - code dupliqué
function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h1>Hero Title</h1>
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2>Features</h2>
    </motion.div>
  )
}

// ✅ BON - abstraction réutilisable
const revealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

function RevealOnScroll({ children, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={revealVariants}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

// Usage
<RevealOnScroll><HeroContent /></RevealOnScroll>
<RevealOnScroll delay={0.2}><FeaturesContent /></RevealOnScroll>
```

### 3. KISS (Keep It Simple)

```typescript
// ❌ MAUVAIS - over-engineering
class AnimationController {
  private timeline: GSAPTimeline;
  private observers: Observer[] = [];

  constructor(private element: HTMLElement) {
    this.timeline = gsap.timeline();
    this.setupObservers();
  }

  private setupObservers() {
    // 50 lignes de code...
  }
}

// ✅ BON - simple et direct
function useRevealAnimation(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
}
```

---

## STRUCTURE DES COMPOSANTS

### Ordre des éléments

```typescript
// 1. Imports (externes, puis internes, puis types)
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

import type { FeatureCardProps } from "./types";

// 2. Constants (en dehors du composant)
const ANIMATION_DURATION = 0.8;

// 3. Types/Interfaces
interface Props extends FeatureCardProps {
  className?: string;
}

// 4. Component
export function FeatureCard({ title, description, className }: Props) {
  // 4a. Hooks
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 4b. Derived state / memos
  const formattedTitle = useMemo(() => title.toUpperCase(), [title]);

  // 4c. Callbacks
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // 4d. Effects
  useEffect(() => {
    // side effects
  }, []);

  // 4e. Early returns
  if (!title) return null;

  // 4f. Render
  return (
    <div ref={ref} className={cn("feature-card", className)}>
      <h3>{formattedTitle}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### Taille des fichiers

| Type                   | Max lignes | Si dépassé                    |
| ---------------------- | ---------- | ----------------------------- |
| Composant UI simple    | 50         | OK                            |
| Composant avec logique | 100        | Extraire en hooks             |
| Page/Section           | 150        | Découper en sous-composants   |
| Hook                   | 80         | Découper en hooks plus petits |
| Utility                | 30         | Découper en fonctions         |

---

## NOMMAGE

### Fichiers

```
components/
├── ui/
│   ├── Button.tsx          # PascalCase
│   ├── GlassCard.tsx
│   └── index.ts
hooks/
├── useScroll.ts            # camelCase avec "use"
lib/
├── utils.ts                # camelCase
types/
├── index.ts
```

### Variables et fonctions

```typescript
// ✅ BON
const isLoading = true;
const hasError = false;
const userList = [];
const handleClick = () => {};
const formatDate = (date: Date) => {};

// ❌ MAUVAIS
const loading = true; // Pas de "is"
const data = []; // Trop générique
const x = null; // Incompréhensible
const doStuff = () => {}; // Trop vague
```

### Constantes

```typescript
const ANIMATION_DURATION = 0.8;
const MAX_RETRY_COUNT = 3;

const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
} as const;
```
