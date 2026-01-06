"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

interface Props {
  active: boolean; // true = scene started (explode/hide), false = intro mode (interactive)
  onComplete?: () => void;
}

export function GoldenDustParticles({ active }: Props) {
  const count = 1500; // Number of particles
  const meshRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();

  // Generate initial random positions and "Ring" target positions
  const { positions, ringTargets, velocities, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const rnd = new Float32Array(count); // Random offset for floating

    const radius = 0.3; // Ring radius (smaller for button)

    for (let i = 0; i < count; i++) {
        // Random Position (Spread out)
        pos[i * 3] = (Math.random() - 0.5) * 15;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

        // Velocity Init
        vel[i * 3] = 0;
        vel[i * 3 + 1] = 0;
        vel[i * 3 + 2] = 0;
        
        // Random float frequency/phase
        rnd[i] = Math.random();

        // Ring Target
        // We want them to form a circle around (0,0)
        // Some randomness in radius to give thickness
        const theta = Math.random() * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * 0.2; // Thickness
        
        ring[i * 3] = Math.cos(theta) * r;
        ring[i * 3 + 1] = Math.sin(theta) * r;
        ring[i * 3 + 2] = 0;
    }

    return { 
        positions: pos, 
        ringTargets: ring, 
        velocities: vel,
        randoms: rnd 
    };
  }, []);

  // Use a dummy object for internal state management if needed, but we do attributes directly
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Access attributes
    const geometry = meshRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    
    // Mouse Interaction
    // We want to detect if mouse is near center
    const mouseX = pointer.x * viewport.width / 2;
    const mouseY = pointer.y * viewport.height / 2;
    
    const distToCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const isHoveringCenter = distToCenter < 2.0; // Threshold to start forming ring
    
    for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        let px = positionAttr.array[ix];
        let py = positionAttr.array[iy];
        let pz = positionAttr.array[iz];

        // --- BEHAVIOR ---
        
        // 1. Mouse Attraction (Gravity)
        // Particles form a trail or swarm around mouse
        const dx = mouseX - px;
        const dy = mouseY - py;
        // z target varies randomly slightly
        const dz = 0 - pz; 
        
        let tx = mouseX;
        let ty = mouseY;
        let tz = 0;

        // Force accumulator
        let fx = 0;
        let fy = 0;
        let fz = 0;

        // Add Noise / Wandering
        const time = state.clock.elapsedTime;
        const noiseX = Math.sin(time * 2 + randoms[i] * 10) * 0.05;
        const noiseY = Math.cos(time * 1.5 + randoms[i] * 10) * 0.05;
        
        if (active) {
            // EXPLOSION MODE
            // Move outwards fast
            const angle = Math.atan2(py, px);
            const explosionForce = 15.0 * delta;
            
            px += Math.cos(angle) * explosionForce;
            py += Math.sin(angle) * explosionForce;
            
            // Fade out handled by material opacity in gsap, but we can disperse them here
            
        } else if (isHoveringCenter) {
            // FORMATION MODE (Ring)
            // Attract to specific ring target coordinate
            const rtx = ringTargets[ix];
            const rty = ringTargets[iy];
            const rtz = ringTargets[iz];
            
            // Stronger lerp to target
            px += (rtx - px) * 5 * delta;
            py += (rty - py) * 5 * delta;
            pz += (rtz - pz) * 5 * delta;
            
            // Add slight jitter/energy
            px += noiseX * 0.5;
            py += noiseY * 0.5;
            
        } else {
            // ROAMING / MOUSE FOLLOW MODE
            // Loosely follow mouse with drag
            // Distance falloff: further particles move slower? No, swarm.
            
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Velocity based approach for fluidity
            const speed = 2.0; // attraction speed
            
            // Simple ease towards mouse + random
            px += (dx * speed * delta) + noiseX;
            py += (dy * speed * delta) + noiseY;
            pz += (dz * speed * delta);
            
            // Limit dispersion
        }

        positionAttr.array[ix] = px;
        positionAttr.array[iy] = py;
        positionAttr.array[iz] = pz;
    }
    
    positionAttr.needsUpdate = true;
  });

  // Material Animation for Exit
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  useEffect(() => {
    if (active && materialRef.current) {
        gsap.to(materialRef.current, {
            opacity: 0,
            size: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    }
  }, [active]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Golden Dust Material */}
      <pointsMaterial
        ref={materialRef}
        size={0.08}
        color="#D4A853"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
