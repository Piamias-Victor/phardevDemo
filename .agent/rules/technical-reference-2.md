---
trigger: always_on
---

# Technical Reference - Part 2

> Theatre.js — Animations Cinématiques

---

## THEATRE.JS

### Installation

```bash
npm install @theatre/core @theatre/studio @theatre/r3f
```

### Setup

```typescript
// lib/theatre.ts
import { getProject, types } from "@theatre/core";

export const project = getProject("Phardev");
export const mainSheet = project.sheet("Main");
```

### Activer le studio (dev only)

```typescript
// app/layout.tsx
"use client";
import { useEffect } from "react";

export function TheatreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@theatre/studio").then((studio) => {
        studio.default.initialize();
      });
    }
  }, []);

  return <>{children}</>;
}
```

### Animation basique

```typescript
import { useEffect, useRef } from "react";
import { mainSheet } from "@/lib/theatre";
import { types } from "@theatre/core";

export function AnimatedBox() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = mainSheet.object("Box", {
      position: types.compound({
        x: types.number(0, { range: [-500, 500] }),
        y: types.number(0, { range: [-500, 500] }),
      }),
      opacity: types.number(1, { range: [0, 1] }),
      scale: types.number(1, { range: [0, 2] }),
    });

    const unsubscribe = obj.onValuesChange((values) => {
      if (boxRef.current) {
        boxRef.current.style.transform = `translate(${values.position.x}px, ${values.position.y}px) scale(${values.scale})`;
        boxRef.current.style.opacity = String(values.opacity);
      }
    });

    return () => unsubscribe();
  }, []);

  return <div ref={boxRef} className="w-32 h-32 bg-white" />;
}
```

### Theatre + React Three Fiber

```typescript
import { editable as e, SheetProvider } from "@theatre/r3f";
import { mainSheet } from "@/lib/theatre";

export function Scene() {
  return (
    <Canvas>
      <SheetProvider sheet={mainSheet}>
        <e.mesh theatreKey="Hero Sphere">
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="gold" />
        </e.mesh>

        <e.pointLight theatreKey="Main Light" intensity={1} />
      </SheetProvider>
    </Canvas>
  );
}
```

### Playback control

```typescript
// Jouer la timeline
mainSheet.sequence.play();

// Jouer avec options
mainSheet.sequence.play({
  iterationCount: 1,
  range: [0, 2],
  rate: 1,
  direction: "normal",
});

// Pause
mainSheet.sequence.pause();

// Aller à une position
mainSheet.sequence.position = 1.5;
```

### Scroll-driven animation

```typescript
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { mainSheet } from "@/lib/theatre";

export function ScrollLinkedAnimation() {
  const scroll = useScroll();

  useFrame(() => {
    const sequenceLength = mainSheet.sequence.length;
    mainSheet.sequence.position = scroll.offset * sequenceLength;
  });

  return null;
}
```

### Export state pour production

```typescript
// 1. Animer dans le studio en dev
// 2. Exporter le state JSON depuis le studio
// 3. Importer en prod

import projectState from "./project-state.json";

const project = getProject("Phardev", { state: projectState });
```

### Best Practices Theatre.js

- ✅ Studio uniquement en dev (bundle size)
- ✅ Exporter les animations en JSON pour prod
- ✅ Utiliser `@theatre/r3f` pour les scènes 3D
- ✅ Nommer clairement les objects/sheets
- ❌ Ne pas laisser le studio en prod
- ❌ Éviter les animations > 5s

### Documentation Theatre.js

- https://www.theatrejs.com/docs/
- https://www.theatrejs.com/docs/r3f
