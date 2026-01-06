---
trigger: always_on
---

# Design System - Part 2

> Layout, Composants UI, Effets visuels, Responsive

---

## LAYOUT & GRILLES

### Container

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (min-width: 768px) {
  .container {
    padding: 0 3rem;
  }
}

@media (min-width: 1280px) {
  .container {
    padding: 0 6rem;
  }
}
```

### Grid system

```tsx
// 12 colonnes
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 md:col-span-6 lg:col-span-4">
    Card
  </div>
</div>

// Grid auto-fit
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>

// Asymétrique
<div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
  <div className="lg:col-span-2">Text</div>
  <div className="lg:col-span-3">Visual</div>
</div>
```

### Max-widths texte

```tsx
<p className="max-w-prose">...</p>       // ~65 chars
<h2 className="max-w-3xl mx-auto">...</h2>
<div className="max-w-2xl">...</div>
```

---

## COMPOSANTS UI

### Button

```typescript
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",

          {
            primary: "bg-foreground text-background hover:bg-foreground/90",
            secondary: "bg-muted text-foreground hover:bg-muted/80",
            ghost: "hover:bg-muted",
            outline: "border border-border hover:bg-muted",
          }[variant],

          {
            sm: "h-9 px-4 text-sm rounded-lg",
            md: "h-11 px-6 text-base rounded-xl",
            lg: "h-14 px-8 text-lg rounded-xl",
          }[size],

          className
        )}
        {...props}
      />
    );
  }
);
```

### GlassCard

```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 md:p-8",
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",
        "shadow-xl shadow-black/5",
        hover &&
          "transition-all duration-300 hover:bg-white/10 hover:border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Input

```typescript
export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-12 px-4",
        "bg-muted border border-border rounded-xl",
        "text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-foreground/20",
        "transition-all",
        className
      )}
      {...props}
    />
  );
}
```

---

## EFFETS VISUELS

### Gradients

```css
/* Radial pour backgrounds */
.gradient-radial {
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(212, 168, 83, 0.15) 0%,
    transparent 50%
  );
}

/* Glow effect */
.glow {
  box-shadow: 0 0 20px rgba(212, 168, 83, 0.3), 0 0 40px rgba(212, 168, 83, 0.2),
    0 0 60px rgba(212, 168, 83, 0.1);
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

## MICRO-INTERACTIONS

### Hover states

```css
.hover-scale {
  transition: transform 0.3s ease-out;
}
.hover-scale:hover {
  transform: scale(1.02);
}

.hover-lift {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(212, 168, 83, 0.3);
}
```

### Transitions

```css
.transition-base {
  transition: all 0.3s ease-out;
}

.transition-smooth {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.transition-spring {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Focus states

```css
.focus-ring:focus-visible {
  outline: 2px solid var(--foreground);
  outline-offset: 2px;
}
```

---

## RESPONSIVE

### Breakpoints

```typescript
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
```

### Mobile-first

```tsx
<div className="
  p-4 md:p-6 lg:p-8
">

<h1 className="
  text-3xl md:text-5xl lg:text-hero
">
```

### Hide/Show

```tsx
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

---

## CHECKLIST DESIGN

### Avant de valider un composant

- [ ] Fonctionne en light ET dark mode
- [ ] Responsive (mobile → desktop)
- [ ] Hover state défini
- [ ] Focus state accessible
- [ ] Spacing cohérent
- [ ] Typographie dans l'échelle
- [ ] Transitions smooth (0.3s min)

### Avant de valider une page

- [ ] Hiérarchie visuelle claire
- [ ] Rythme vertical cohérent
- [ ] CTA visible et accessible
- [ ] Grain overlay présent
- [ ] Custom cursor fonctionnel
