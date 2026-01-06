import { shaderMaterial } from "@react-three/drei";
import { Color, Texture } from "three";
import { extend } from "@react-three/fiber";

export const PaperBurnMaterial = shaderMaterial(
  {
    uProgress: 0, // 0 to 1
    uTex: new Texture(),
    uColorFire: new Color(5.0, 5.0, 5.0), // Pure White Divine Light (HDR)
    uNoiseScale: 1.2, // Slightly larger noise for majestic look
    uTime: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vNoise;
    varying float vPattern;
    uniform float uTime;
    uniform float uNoiseScale;
    uniform float uProgress;

    // Simplex Noise (Ashima Arts)
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

    void main() {
      vUv = uv;
      
      const float PHI = 1.61803398875;
      
      // Fluid snoise
      float n = snoise(uv * uNoiseScale + vec2(0.0, uTime * 0.1)); 
      vNoise = n;

      vec2 center = vec2(0.5);
      float dist = distance(uv, center);
      
      // Golden Ratio Fluid Pattern
      // We seek a balance between the perfect circle (dist) and organic chaos (noise).
      // Phi determines the "weight" of the nature/chaos.
      // We subtly twist the UV space with Phi to give it flow without explicit spiral lines.
      
      float twist = sin(dist * 10.0 - uTime * 0.2) * 0.05; // Very subtle organic pulse
      
      // Pattern: Distance is primary, but distorted by noise scaled by Phi
      float pattern = dist + n * (0.1 * PHI); 
      vPattern = pattern;
      
      // Map uProgress (0..1) to Threshold
      // Start immediately.
      // Use Phi in the multiplier for "Golden Speed" curve? 
      // just linear mapping for shader, animation handles timing.
      float threshold = uProgress * 1.8 - 0.2; 
      
      // Gentle Curling
      float edgeDist = abs(pattern - threshold);
      float curlRegion = smoothstep(0.15, 0.0, edgeDist); 
      
      // Filament thin curl
      // Use Phi-based smoothness
      float curlStrength = curlRegion * smoothstep(0.0, 0.1 * PHI, uProgress) * smoothstep(1.0, 0.8, uProgress);
      
      vec3 pos = position;
      // Gentle Lift
      pos.z += curlStrength * 0.1 * (sin(dist * 20.0 - uTime * 2.0) + 1.0);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vNoise;
    varying float vPattern;
    uniform sampler2D uTex;
    uniform float uProgress;
    uniform vec3 uColorFire;

    void main() {
      float threshold = uProgress * 1.8 - 0.2;
      
      // Black Background (Unrevealed Area)
      if (vPattern > threshold) {
         gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
         return;
      }
      
      // Divine Edge
      // Finesse: Very thin edge, defined by Golden Ratio properties (clean)
      float edgeWidth = 0.02 * 1.618; // ~0.032
      
      float lightIntensity = smoothstep(threshold - edgeWidth, threshold, vPattern);
      
      // Remove "Thread" streaks. 
      // Instead, use subtle noise to give it "Breath" without lines.
      float breathInfo = smoothstep(0.4, 0.6, vNoise * 0.5 + 0.5); // Soft clouds
      lightIntensity += breathInfo * 0.2 * lightIntensity;
      
      // Sample Texture
      vec4 texColor = texture2D(uTex, vUv);
      vec3 finalColor = texColor.rgb;
      
      // Additive Divine Light
      vec3 lightColor = uColorFire * lightIntensity * 4.0;
      
      finalColor += lightColor;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ PaperBurnMaterial });
