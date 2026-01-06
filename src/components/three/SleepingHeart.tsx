"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

interface Props {
  active: boolean; // active=true means scene STARTED, so we hide/explode the heart
}

// Fragment Shader: Organic Pulsing Ember (White/Energy)
const fragmentShader = `
uniform float uTime;
uniform float uPulse; // Accumulated pulse phase
uniform float uIntensity; // 0.0 (far) to 1.0 (close)
uniform vec3 uColorCold;
uniform vec3 uColorHot;
uniform float uOpacity;

varying vec2 vUv;

// Simple Noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    
    // Heartbeat / Pulse used from accumulated uPulse for smoothness
    float pulse = sin(uPulse) * 0.5 + 0.5; // 0 to 1
    
    // Core size - Very small initially
    float coreRadius = 0.005 + (uIntensity * 0.05); 
    
    // Glow falloff
    // "Petit" -> Higher sharpness
    float sharpness = 20.0 - (uIntensity * 15.0); // 20 (Tiny) -> 5 (Glowy)
    float glow = exp(-dist * sharpness);
    
    // Noise increases with intensity (Agitation)
    float n = noise(uv * 20.0 + uTime);
    glow += n * (0.05 + uIntensity * 0.2); 
    
    // Brightness boosts significantly when close
    float brightness = 0.5 + (0.5 * pulse) + (uIntensity * 4.0);
    
    // Mix Colors
    vec3 color = mix(uColorCold, uColorHot, uIntensity * 0.5 + pulse * 0.5);
    
    // Alpha mask circle
    float alpha = smoothstep(0.5, 0.0, dist);
    
    vec3 finalColor = color * brightness * glow * 10.0; // Boost heavily for Bloom
    
    gl_FragColor = vec4(finalColor, alpha * glow * uOpacity);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

interface Props {
  active: boolean;
  onStart: () => void;
}

export function SleepingHeart({ active, onStart }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();
  
  // Accumulator for smooth pulse acceleration
  const pulsePhase = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uIntensity: { value: 0 },
      uColorCold: { value: new THREE.Color("#444444") }, // Dim Grey
      uColorHot: { value: new THREE.Color("#ffffff") }, // Pure White
      uOpacity: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    if (active && materialRef.current && meshRef.current) {
      // Exit Animation: Scale Up + Fade Out
      gsap.to(materialRef.current.uniforms.uOpacity, {
        value: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(meshRef.current.scale, {
            x: 10, y: 10, // Massive expansion
            duration: 0.8,
            ease: "power2.in"
      });
    }
  }, [active]);

  useFrame((state, delta) => {
    if (!materialRef.current || active) return;

    // Time
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Mouse Distance Logic
    const dx = pointer.x; // -1 to 1
    const dy = pointer.y;
    
    const dist = Math.sqrt(dx * dx + dy * dy); 
    const threshold = 1.2; 
    let intensity = 1.0 - Math.min(dist / threshold, 1.0);
    intensity = Math.pow(intensity, 3.0); 
    
    // Lerp intensity
    materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uIntensity.value,
        intensity,
        0.1
    );
    
    // Smooth Pulse Accumulation
    const currentIntensity = materialRef.current.uniforms.uIntensity.value;
    const currentSpeed = 1.0 + (currentIntensity * 15.0); 
    
    pulsePhase.current += delta * currentSpeed;
    materialRef.current.uniforms.uPulse.value = pulsePhase.current;
  });

  return (
    <group>
        {/* Visual Mesh */}
        <mesh ref={meshRef} position={[0, 0, 1]}> 
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
        
        {/* Hitbox Mesh - Invisible but clickable */}
        {!active && (
            <mesh 
                position={[0, 0, 1.1]} 
                onClick={onStart}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'default'}
            >
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial transparent opacity={0.0} color="red" />
            </mesh>
        )}
    </group>
  );
}
