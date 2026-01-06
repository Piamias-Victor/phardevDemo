"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import "./shaders/FeatheredImageMaterial"; // Register shader

interface Props {
  url: string;
  side?: "left" | "right";
  yOffset?: number;
  delay?: number;
  active?: boolean;
}

export function SlidingImage({ url, side = "left", yOffset = 0, delay = 3.5, active = false }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  // Extend ShaderMaterial type for our uniforms
  const materialRef = useRef<THREE.ShaderMaterial & { uOpacity: number }>(null);
  const texture = useTexture(url);
  const { viewport } = useThree();
  
  // Aspect Ratio
  const aspect = (texture.image?.width || 1) / (texture.image?.height || 1);
  
  // Responsive positioning
  const baseHeight = Math.min(viewport.width * 0.4, 4); 
  const baseWidth = baseHeight * aspect;
  
  // Target position
  // Left: Push further left (0.32). Right: Push right (0.30)
  const xMult = side === "left" ? 0.32 : 0.30;
  const targetX = (side === "left" ? -1 : 1) * viewport.width * xMult; 
  
  useEffect(() => {
    if (!groupRef.current) return;

    // Initial State (Group)
    const startScale = 1.5; 
    
    // Start X
    const startX = (side === "left" ? -1 : 1) * viewport.width * 0.45;
    
    gsap.set(groupRef.current.position, { 
      x: startX, 
      y: -viewport.height * 0.4, 
      z: 0 
    });
    
    gsap.set(groupRef.current.scale, { x: startScale, y: startScale });
    
    if (materialRef.current) {
        materialRef.current.uOpacity = 0;
    }

    const ctx = gsap.context(() => {
        if (!active) return;

        // Master Timeline
        const tl = gsap.timeline({ delay: delay }); 
        
        // --- Entry ---
        tl.to(groupRef.current!.position, {
            x: targetX,
            y: yOffset, 
            z: 0, 
            duration: 2.5,
            ease: "power3.out"
        }, 0);
        
        tl.to(groupRef.current!.scale, {
            x: 1,
            y: 1,
            duration: 2.5,
            ease: "power3.out"
        }, 0);
        
        // Fade In (Shader Uniform)
        if (materialRef.current) {
            tl.to(materialRef.current, {
                uOpacity: 1,
                duration: 1.5,
                ease: "power2.out"
            }, 0);
        }
    });

    return () => ctx.revert();
  }, [baseHeight, targetX, viewport.height, viewport.width, side, yOffset, delay, active]);

  // Position Parallax (Inner Mesh)
  useFrame((state) => {
    if (!meshRef.current) return;
    const mouseX = state.pointer.x; // -1 to 1
    const mouseY = state.pointer.y; // -1 to 1
    
    // Move slightly opposite to mouse, or with mouse? "Bouge avec ma souris" usually means reacting to it.
    // Subtle floaty feel: slightly follow mouse.
    const parallaxStrength = 0.5; 
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseX * parallaxStrength, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseY * parallaxStrength, 0.05);
  });

  return (
    <group ref={groupRef} renderOrder={9999}>
        <mesh ref={meshRef}>
           <planeGeometry args={[baseWidth, baseHeight]} />
           <featheredImageMaterial 
              ref={materialRef}
              uTex={texture} 
              uOpacity={0}
              uFeather={0.15} // Soft edges
              transparent={true}
              depthTest={false} 
              depthWrite={false}
           />
        </mesh>
    </group>
  );
}
