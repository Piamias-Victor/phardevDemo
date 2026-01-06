"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Shader Material Definition
const ScrollBurnMaterial = shaderMaterial(
  {
    uProgress: 0, 
    uTime: 0,
    uTex: new THREE.Texture(), 
    uColorFire: new THREE.Color(4.0, 1.5, 0.5), 
    uNoiseScale: 2.0,
    uMouse: new THREE.Vector2(0, 0), // Interactive Mouse
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uTime;
    uniform float uNoiseScale;
    uniform vec3 uColorFire;
    uniform sampler2D uTex;
    uniform vec2 uMouse;

    // Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Star Function
    float star(vec2 uv, vec2 center, float size, float timeOffset) {
        float d = length(uv - center);
        // Glowy core
        float m = size / (d + 0.0001); 
        // Twinkle
        float twinkle = 0.5 + 0.5 * sin(uTime * 3.0 + timeOffset);
        m *= twinkle;
        
        // Spike (cross)
        // Simple fast glow is enough for distant stars usually, but user asked for "eclats"
        float rays = max(0.0, 1.0 - abs(uv.x - center.x) * 100.0) * max(0.0, 1.0 - abs(uv.y - center.y) * 100.0);
        
        return m * 0.0005 + rays * 0.5 * twinkle;
    }

    void main() {
      // STRICT FIX: If progress is effectively 0, render nothing.
      if (uProgress <= 0.001) {
          gl_FragColor = vec4(0.0);
          return;
      }

      // Distance from center
      float dist = distance(vUv, vec2(0.5));
      
      // Noise logic
      float n = snoise(vUv * uNoiseScale + vec2(0.0, uTime * 0.2));
      float pattern = dist + n * 0.1;
      
      // Threshold moves from 0 (center) to >1 (edges) as uProgress goes 0->1
      float threshold = uProgress * 1.5; 
      
      vec4 finalColor = vec4(0.0); 
      
      // Inside Burn
      if (pattern < threshold) {
         // --- Parallax Background ---
         // Texture moves slightly opposite to mouse to look "far away" or just "alive"
         vec2 parallaxUv = vUv + (uMouse * 0.03); 
         // Drift removed as requested
         
         vec4 texColor = texture2D(uTex, parallaxUv);
         
         // Darker
         texColor.rgb *= 0.5; 
         
         // --- Procedural Stars ---
         // Add 3-4 bright stars that follow parallax
         vec3 stars = vec3(0.0);
         stars += vec3(0.9, 0.8, 1.0) * star(parallaxUv, vec2(0.3, 0.4), 1.2, 0.0);
         stars += vec3(1.0, 0.9, 0.6) * star(parallaxUv, vec2(0.75, 0.6), 1.5, 2.0);
         stars += vec3(0.8, 0.9, 1.0) * star(parallaxUv, vec2(0.15, 0.8), 1.0, 4.0);
         
         finalColor.rgb = texColor.rgb + stars;
         finalColor.a = 1.0; 
         
         // Fire Edge Logic
         float edgeWidth = 0.05;
         if (pattern > threshold - edgeWidth) {
             float fireIntensity = smoothstep(threshold - edgeWidth, threshold, pattern);
             vec3 fire = uColorFire * fireIntensity * 2.0;
             finalColor.rgb += fire;
         }
      }
      
      gl_FragColor = finalColor;
    }
  `
);

extend({ ScrollBurnMaterial });

interface ScrollBurnMaterialImpl extends THREE.ShaderMaterial {
  uProgress: number;
  uTime: number;
  uMouse: THREE.Vector2;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      scrollBurnMaterial: any;
    }
  }
}

export function ScrollBurn({ active }: { active: boolean }) {
  const materialRef = useRef<ScrollBurnMaterialImpl>(null);
  const texture = useTexture("/assets/night_sky.png"); 
  const { viewport } = useThree();

  useFrame((state) => {
    if (!materialRef.current || !active) return;
    
    // Time
    materialRef.current.uTime = state.clock.elapsedTime;
    
    // Mouse (Normalized -1 to 1)
    materialRef.current.uMouse = state.pointer;
    
    // Scroll Progress
    let progress = 0;
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      const START_OFFSET = 100;
      const BURN_DISTANCE = 2000; 
      
      const effectiveScroll = Math.max(0, scrollY - START_OFFSET);
      progress = Math.min(effectiveScroll / BURN_DISTANCE, 1.0);
    }
    
    materialRef.current.uProgress = progress;
  });

  if (!active) return null;

  return (
    <mesh renderOrder={10000} position={[0, 0, 0.1]}> 
      <planeGeometry args={[viewport.width * 1.2, viewport.height * 1.2]} />
      <scrollBurnMaterial 
        ref={materialRef} 
        uTex={texture}
        transparent 
        depthTest={false}
      />
    </mesh>
  );
}


