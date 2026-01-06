---
trigger: always_on
---

# Animation Playbook

> Chaque animation avec code, timing, easing

---

## EASINGS & DURÉES

```typescript
// lib/animation.ts
export const EASING = {
  out: "power3.out",
  outExpo: "expo.out",
  outBack: "back.out(1.7)",
  none: "none",
  bounce: "bounce.out",
  elastic: "elastic.out(1, 0.5)",
  smooth: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

export const DURATION = {
  instant: 0.2,
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  slower: 1.2,
  cinematic: 2,
};
```

---

## LOADER / INTRO

```typescript
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete,
        });
      },
    });

    tl.to(
      { value: 0 },
      {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function () {
          const val = Math.round(this.targets()[0].value);
          if (counterRef.current) {
            counterRef.current.textContent = String(val).padStart(3, "0");
          }
        },
      }
    );
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div className="mb-8 text-2xl font-light tracking-widest">PHARDEV</div>
      <span ref={counterRef} className="text-7xl font-light tabular-nums">
        000
      </span>
    </div>
  );
}
```

---

## REVEAL AU SCROLL

```typescript
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}

export function Reveal({ children, delay = 0, y = 60 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [delay, y]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

---

## STAGGER LIST

```typescript
export function RevealList({
  children,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  stagger?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll("[data-reveal-item]");
    if (!items) return;

    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [stagger]);

  return <div ref={containerRef}>{children}</div>;
}

// Usage
<RevealList>
  {items.map((item) => (
    <div key={item.id} data-reveal-item>
      {item.name}
    </div>
  ))}
</RevealList>;
```

---

## PARALLAX

```typescript
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // -1 à 1
}

export function Parallax({ children, speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [speed]);

  return <div ref={ref}>{children}</div>;
}
```

---

## COUNTER ANIMÉ

```typescript
export function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: value,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              setDisplayValue(Math.round(this.targets()[0].val));
            },
          }
        );
      },
      once: true,
    });
  }, [value]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}
```

---

## MAGNETIC BUTTON

```typescript
export function MagneticButton({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
```

---

## PAGE TRANSITION

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
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## TIMING REFERENCE

| Animation       | Durée       | Easing            |
| --------------- | ----------- | ----------------- |
| Reveal scroll   | 0.8s        | power3.out        |
| Stagger items   | 0.6s + 0.1s | power2.out        |
| Hover state     | 0.3s        | power2.out        |
| Page transition | 0.4s        | [0.16, 1, 0.3, 1] |
| Loader exit     | 1s          | power4.inOut      |
| Counter         | 2s          | power2.out        |
| Magnetic return | 0.5s        | elastic.out       |
| Parallax        | scrub       | none              |
| 3D mouse follow | lerp 0.05   | -                 |

---

## PREFERS-REDUCED-MOTION

```typescript
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

// Usage
const prefersReducedMotion = usePrefersReducedMotion();

useEffect(() => {
  if (prefersReducedMotion) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(element, { opacity: 0, y: 60 }, { opacity: 1, y: 0 });
}, [prefersReducedMotion]);
```
