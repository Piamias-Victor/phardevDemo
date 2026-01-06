import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

interface Props {
  active?: boolean;
}

export function CentralFrame({ active = false }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const width = viewport.width * 0.25;
  const height = viewport.height * 0.5;
  const thickness = 0.02; 
  
  // Flashy Material (Less bright)
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "white",
    emissive: "white",
    emissiveIntensity: 0.5,
    toneMapped: false,
    transparent: true,
    opacity: 0
  }), []);

  useEffect(() => {
    if (!groupRef.current) return;
    
    // Reset
    material.opacity = 0;
    
    if (active) {
        gsap.to(material, {
            opacity: 1,
            duration: 2,
            delay: 4.5,
            ease: "power2.out"
        });
    }
  }, [active, material]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const mouseX = state.pointer.x * 0.3; 
    const mouseY = state.pointer.y * 0.3;
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseY, 0.05);
  });

  // Helper to create box bars
  return (
    <group ref={groupRef} position={[0, 0, -0.5]}> 
      {/* Content Overlay - Attached to Frame */}
      {/* Top */}
      <mesh position={[0, height / 2, 0]} material={material}>
        <boxGeometry args={[width + thickness, thickness, thickness]} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height / 2, 0]} material={material}>
        <boxGeometry args={[width + thickness, thickness, thickness]} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2, 0, 0]} material={material}>
        <boxGeometry args={[thickness, height, thickness]} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2, 0, 0]} material={material}>
        <boxGeometry args={[thickness, height, thickness]} />
      </mesh>
      
      {/* --- Double Accents --- */}
      <group position={[-width / 2 - 0.1, height / 2 + 0.1, 0]}>
         <mesh position={[0.1, 0, 0]} material={material}> 
            <boxGeometry args={[0.2, thickness, thickness]} />
         </mesh>
         <mesh position={[0, -0.1, 0]} material={material}> 
            <boxGeometry args={[thickness, 0.2 + thickness, thickness]} />
         </mesh>
      </group>
      
      <group position={[width / 2 + 0.1, -height / 2 - 0.1, 0]}>
         <mesh position={[-0.1, 0, 0]} material={material}> 
            <boxGeometry args={[0.2, thickness, thickness]} />
         </mesh>
         <mesh position={[0, 0.1, 0]} material={material}> 
            <boxGeometry args={[thickness, 0.2 + thickness, thickness]} />
         </mesh>
      </group>
    </group>
  );
}
