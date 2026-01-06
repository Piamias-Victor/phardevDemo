import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

export const FeatheredImageMaterial = shaderMaterial(
  {
    uTex: null,
    uOpacity: 1.0,
    uScrollOpacity: 1.0, // New uniform for scroll-based fade
    uFeather: 0.2, 
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
    uniform sampler2D uTex;
    uniform float uOpacity;
    uniform float uScrollOpacity;
    uniform float uFeather;

    void main() {
      vec4 texColor = texture2D(uTex, vUv);
      
      vec2 dist = min(vUv, 1.0 - vUv);
      float edgeDist = min(dist.x, dist.y);
      
      float alpha = smoothstep(0.0, uFeather, edgeDist);
      
      // Combine entry opacity AND scroll opacity
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha * uOpacity * uScrollOpacity);
    }
  `
);

extend({ FeatheredImageMaterial });
