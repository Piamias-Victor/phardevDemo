---
trigger: always_on
---

# Technical Reference - Part 4

> Framer Motion + Custom Cursor + Grain Overlay + Glassmorphism

---

## FRAMER MOTION

### Installation

```bash
npm install framer-motion
```

### Animation de base

```typescript
import { motion } from "framer-motion";

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

### Animation au scroll

```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

### Stagger children

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function StaggerList({ items }: { items: string[] }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.li key={item} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Page transitions

```typescript
// app/template.tsx
"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Hover animations

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Documentation Framer Motion

- https://www.framer.com/motion/

---

## CUSTOM CURSOR

### Cursor blob

```typescript
// components/cursor/CustomCursor.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAppStore } from "@/stores/app-store";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const cursorVariant = useAppStore((s) => s.cursorVariant);

  useEffect(() => {
    const dot = dotRef.current;
    const blob = blobRef.current;
    if (!dot || !blob) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
      gsap.to(blob, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    if (cursorVariant === "hover") {
      gsap.to(blob, { scale: 1.5, duration: 0.3 });
    } else {
      gsap.to(blob, { scale: 1, duration: 0.3 });
    }
  }, [cursorVariant]);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground mix-blend-difference"
      />
      <div
        ref={blobRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/30 blur-sm"
      />
    </>
  );
}
```

### Hook cursor hover

```typescript
// hooks/useCursorHover.ts
import { useAppStore } from '@/stores/app-store'

export function useCursorHover() {
  const setCursorVariant = useAppStore((s) => s.setCursorVariant)

  return {
    onMouseEnter: () => setCursorVariant('hover'),
    onMouseLeave: () => setCursorVariant('default'),
  }
}

// Usage
const cursorProps = useCursorHover()
<button {...cursorProps}>Hover me</button>
```

---

## GRAIN OVERLAY

### Version CSS

```css
.grain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

### Version Canvas animée

```typescript
"use client";
import { useEffect, useRef } from "react";

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const noise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 15;
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(noise);
    };

    resize();
    noise();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
```

---

## GLASSMORPHISM

### Composant GlassCard

```typescript
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        "bg-white/5 backdrop-blur-xl",
        "border border-white/10",
        "shadow-xl shadow-black/5",
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Variables CSS

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: 24px;
}

.dark {
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.05);
}
```
