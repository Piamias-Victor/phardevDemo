import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export function MouseLight() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Create a simple glow texture data URI for simplicity if valid, 
  // or use a shader. Let's use a simple radial gradient shader on a plane.
  
  useFrame((state) => {
    if (!groupRef.current) return;
    // Mouse X/Y are -1 to 1.
    // Convert to world coordinates at Z=0.
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    
    // Smooth follow
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x, 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y, 0.2);
  });

  return (
    <group ref={groupRef} position={[0, 0, 1]}>
      {/* 3D Light Source */}
      <pointLight 
        intensity={2} 
        distance={5} 
        decay={2} 
        color="#ffaa00" // Warm glow
      />
      
      {/* Visual Halo Mesh */}
      <mesh renderOrder={9999} visible>
        <planeGeometry args={[0.5, 0.5]} />
        <shaderMaterial
            transparent
            depthTest={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
                uColor: { value: new THREE.Color("#ffaa00") }
            }}
            vertexShader={`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `}
            fragmentShader={`
                varying vec2 vUv;
                uniform vec3 uColor;
                void main() {
                    vec2 center = vec2(0.5);
                    float dist = distance(vUv, center);
                    float alpha = smoothstep(0.5, 0.0, dist); // Radial gradient
                    
                    // Boost center brightness
                    alpha = pow(alpha, 2.0);
                    
                    gl_FragColor = vec4(uColor, alpha * 0.5);
                }
            `}
        />
      </mesh>
    </group>
  );
}
