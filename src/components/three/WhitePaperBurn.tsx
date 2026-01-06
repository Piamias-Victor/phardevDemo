"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useScroll, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

// --- Shader Definition ---
const WhitePaperBurnMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uResolution: new THREE.Vector2(0, 0),
    uPaperTex: new THREE.Texture(), 
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
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform sampler2D uPaperTex;
    varying vec2 vUv;

    // Simplex Noise Function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
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

    void main() {
      // 1. Strict visibility check to prevent artifacts on first page
      if (uProgress <= 0.001) {
         discard;
      }

      vec2 uv = vUv;
      
      // Dynamic noise that moves up slightly with time
      float noiseVal = snoise(uv * 6.0 + vec2(0.0, uTime * 0.15));
      
      // Secondary intricate noise for edges
      float smallNoise = snoise(uv * 20.0 + vec2(0.0, uTime * 0.3)) * 0.15;
      
      float n = (noiseVal + 1.0) * 0.5 + smallNoise;
      
      // Calculate burn threshold
      // Scale to ensure full coverage (starts fully transparent, ends fully white)
      float burnFront = uProgress * 3.0 - 1.0; 
      
      // Combine Y gradient with noise for the edge
      // Use uv.y directly so 0 (bottom) is lowest value -> burns first
      float edgeShape = uv.y * 1.5 + n * 0.25;
      
      float threshold = burnFront;
      
      vec4 outColor = vec4(0.0);
      
      // Colors (HDR for Bloom)
      // SAMPLE TEXTURE
      vec3 paperTextureColor = texture2D(uPaperTex, uv).rgb;
      // Warm up the texture slightly
      paperTextureColor = mix(paperTextureColor, vec3(1.0, 0.95, 0.9), 0.1);

      vec3 fireColor = vec3(4.0, 1.5, 0.4); // Bright Luminous Gold/Orange
      vec3 charColor = vec3(0.1, 0.05, 0.0); // Black/Charcoal
      
      // 1. Paper Body
      float paperMask = smoothstep(threshold, threshold - 0.01, edgeShape);
      
      // 2. Fire Edge (Thin line)
      float fireEdgeStart = threshold;
      float fireEdgeEnd = threshold + 0.08; // Thinner line
      float fireMask = smoothstep(fireEdgeEnd, fireEdgeStart, edgeShape) - paperMask;
      
      // 3. Charcoal Edge (Thin line before fire)
      // Not strictly needed if mixing, let's keep it simple and clean
      
      // Mix Colors
      if (paperMask > 0.5) {
          outColor = vec4(paperTextureColor, 1.0);
      } else {
          // Calculate fire intensity for a glowing edge
          float fireIntensity = smoothstep(fireEdgeEnd, fireEdgeStart, edgeShape);
          
          if (fireIntensity > 0.01) {
              // Add some noise to fire intensity
              float flicker = 0.8 + 0.2 * sin(uTime * 20.0 + uv.x * 10.0);
              vec3 finalFire = fireColor * flicker;
              
              // Fade out to charcoal at the very tip
              float tipFactor = smoothstep(fireEdgeStart, fireEdgeEnd, edgeShape);
              finalFire = mix(finalFire, charColor, pow(tipFactor, 3.0));
              
              outColor = vec4(finalFire, fireIntensity); 
          } else {
              outColor = vec4(0.0);
          }
      }

      gl_FragColor = outColor;
    }
  `
);

extend({ WhitePaperBurnMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      whitePaperBurnMaterial: any;
    }
  }
}

interface ScrollBurnProps {
  active: boolean;
}

export function WhitePaperBurn({ active }: ScrollBurnProps) {
  const materialRef = useRef<any>(null);
  const { viewport } = useThree();
  const paperTexture = useTexture("/assets/old_paper.png");

  useFrame((state) => {
    if (!materialRef.current || !active) return;
    
    // Update Time
    materialRef.current.uTime = state.clock.elapsedTime;
    
    // Calculate Scroll Progress
    const scrollY = window.scrollY;
    
    // Start very early (500px) so the fire has time to rise before text changes
    const startScroll = 500; 
    const endScroll = 2600;
    
    const progress = Math.max(0, Math.min(1, (scrollY - startScroll) / (endScroll - startScroll)));
    
    materialRef.current.uProgress = progress;
  });

  if (!active) return null;

  return (
    <mesh position={[0, 0, 1]} renderOrder={20000}>
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5]} />
      <whitePaperBurnMaterial 
        ref={materialRef} 
        transparent 
        uResolution={[viewport.width, viewport.height]}
        uPaperTex={paperTexture}
      />
    </mesh>
  );
}
