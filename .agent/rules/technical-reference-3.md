---
trigger: always_on
---

# Technical Reference - Part 3

> React Three Fiber (R3F) + drei + postprocessing

---

## REACT THREE FIBER

### Installation

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

### Setup basique

```typescript
// components/three/Scene.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";

interface SceneProps {
  children: React.ReactNode;
}

export function Scene({ children }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        {children}
        <Environment preset="city" />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

### Composant 3D avec mouse follow

```typescript
"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export function HeroSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Auto rotation
    meshRef.current.rotation.y += delta * 0.2;

    // Mouse follow avec lerp
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mousePosition.current.y * 0.3,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      mousePosition.current.x * 0.3,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#D4A853"
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}
```

### Scroll-linked 3D

```typescript
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function ScrollLinkedObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y = scroll.offset * Math.PI * 2;
    meshRef.current.position.y = scroll.offset * -5;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial color="gold" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}
```

### Post-processing

```typescript
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
}
```

### Conditional rendering mobile

```typescript
"use client";
import { useIsMobile } from "@/hooks/useMediaQuery";

export function Hero3D() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className="hero-fallback-image" />;
  }

  return (
    <Canvas>
      <HeroSphere />
      <PostProcessing />
    </Canvas>
  );
}
```

### Performance tips

```typescript
// Limiter le DPR
<Canvas dpr={[1, 1.5]}>

// Désactiver antialiasing
<Canvas gl={{ antialias: false }}>

// Instancing pour objets multiples
import { Instances, Instance } from '@react-three/drei'

<Instances>
  <sphereGeometry args={[0.5, 16, 16]} />
  <meshStandardMaterial />
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

### Best Practices R3F

- ✅ Toujours Suspense avec fallback
- ✅ DPR adaptatif selon device
- ✅ Cleanup des ressources (dispose)
- ✅ useFrame pour animations
- ❌ Ne pas créer de géométries dans useFrame
- ❌ Pas plus de 100k triangles sans LOD

### Documentation R3F

- https://docs.pmnd.rs/react-three-fiber
- https://github.com/pmndrs/drei
- https://threejs.org/docs/
