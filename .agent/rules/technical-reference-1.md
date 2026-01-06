---
trigger: always_on
---

# Technical Reference - Part 1

> Lenis + GSAP ScrollTrigger

---

## 1. LENIS — Smooth Scroll

### Installation

```bash
npm install @studio-freight/lenis
```

### Setup de base

```typescript
// hooks/useLenis.ts
"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
```

### Intégration avec GSAP ScrollTrigger

```typescript
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenisGSAP() {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
}
```

### Scroll to element

```typescript
lenis.scrollTo("#section-id", {
  offset: -100,
  duration: 2,
  easing: (t) => 1 - Math.pow(1 - t, 3),
});

lenis.scrollTo(500); // position
lenis.stop();
lenis.start();
```

### Best Practices Lenis

- ✅ Un seul Lenis par app (dans le layout)
- ✅ Intégrer avec GSAP ticker pour synchro parfaite
- ✅ Désactiver sur mobile si performances faibles
- ❌ Ne pas créer plusieurs instances
- ❌ Ne pas oublier le cleanup (destroy)

### Documentation Lenis

- https://github.com/studio-freight/lenis

---

## 2. GSAP + ScrollTrigger

### Installation

```bash
npm install gsap
```

### Setup

```typescript
// lib/gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

### Animation reveal basique

```typescript
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
```

### Stagger animation

```typescript
useEffect(() => {
  const items = containerRef.current?.querySelectorAll("[data-animate]");
  if (!items) return;

  gsap.fromTo(
    items,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    }
  );
}, []);
```

### Parallax

```typescript
useEffect(() => {
  gsap.to(elementRef.current, {
    y: -100,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}, []);
```

### Pin section

```typescript
useEffect(() => {
  ScrollTrigger.create({
    trigger: sectionRef.current,
    start: "top top",
    end: "+=1000",
    pin: true,
    pinSpacing: true,
  });
}, []);
```

### Timeline complexe

```typescript
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
  });

  tl.fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 })
    .fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1 }, "-=0.3")
    .fromTo(imageRef.current, { scale: 0.8 }, { scale: 1 }, "<");

  return () => tl.kill();
}, []);
```

### Best Practices GSAP

- ✅ Toujours cleanup dans useEffect return
- ✅ `scrub: true` pour lier au scroll
- ✅ `toggleActions` pour contrôler play/reverse
- ❌ Ne pas animer width/height (utiliser scale)
- ❌ Ne pas animer left/top (utiliser x/y)

### Documentation GSAP

- https://greensock.com/docs/
- https://greensock.com/scrolltrigger/
