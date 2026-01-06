"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import "./shaders/PaperBurnMaterial"; // Register shader definition

interface Props {
  imageUrl?: string;
  active?: boolean;
}

export function PaperBurnReveal({ 
  imageUrl = "/assets/burn-reveal.png",
  active = false
}: Props) {
  const texture = useTexture(imageUrl);
  const materialRef = useRef<THREE.ShaderMaterial & { uProgress: number; uTime: number }>(null); 
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree(); 

  useEffect(() => {
    if (!materialRef.current) return;

    // Reset progress
    materialRef.current.uProgress = 0;

    if (active) {
        const ctx = gsap.context(() => {
          gsap.to(materialRef.current, {
              uProgress: 1,
              duration: 8.09, 
              ease: "power1.inOut", 
          });
        });
        return () => ctx.revert();
    }
  }, [active]);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uTime = state.clock.elapsedTime;
    }
    // Background Parallax
    if (meshRef.current) {
        // Very subtle movement opposite to statues or same? 
        // Background usually moves LESS (or more if it's foreground, but here it is background).
        // Let's make it move slower than statues (0.5 vs 0.2 strength).
        const mouseX = state.pointer.x * 0.2;
        const mouseY = state.pointer.y * 0.2;
        
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseX, 0.05);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseY, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}> 
        {/* Fullscreen Plane geometry - Scaled 2x because it is at z=-5 (Distance doubled) */}
        <planeGeometry args={[viewport.width * 2, viewport.height * 2, 128, 128]} />
        <paperBurnMaterial 
            ref={materialRef}
            uTex={texture}
            uColorFire={new THREE.Color(5.0, 5.0, 5.0)}
            transparent={false}
            side={THREE.DoubleSide}
        />
    </mesh>
  );
}
