"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PaperBurnReveal } from "@/components/three/PaperBurnReveal";
import { SlidingImage } from "@/components/three/SlidingImage";
import { CentralFrame } from "@/components/three/CentralFrame";
import { SleepingHeart } from "@/components/three/SleepingHeart";
import { HomeOverlay } from "@/components/layout/HomeOverlay";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="h-screen w-full bg-black relative">
      {/* HTML Interface Overlay (Introduction Text) */}
      <div 
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none ${started ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Button removed - Interaction is now in 3D */}
        
        {/* Instructional Text */}
        <p 
            className="mt-32 text-white/80 font-light text-xs tracking-[0.3em] uppercase opacity-0 pointer-events-auto"
            style={{ animation: 'fadeIn 2s ease-in-out forwards 1s, pulse 3s infinite 3s' }}
        >
            Clique sur la lueur pour découvrir l'écosystème Phardev
        </p>
      </div>

      {/* Main Content Overlay */}
      {started && <HomeOverlay started={started} />}

      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        <color attach="background" args={["#000000"]} /> {/* Pure Black */}
        
        <Suspense fallback={null}>
          <PaperBurnReveal imageUrl="/assets/reveal_bg.png" active={started} />
          
          <SlidingImage 
            url="/assets/statue.png" 
            side="left" 
            delay={3.5} 
            active={started}
          />
          <SlidingImage 
            url="/assets/statue_right.png" 
            side="right" 
            yOffset={-0.8} 
            delay={3.9} 
            active={started}
          />
          
          <CentralFrame active={started} />
          
          {/* The Sleeping Heart (Ember) */}
          <SleepingHeart active={started} onStart={() => setStarted(true)} />
          
          <Environment preset="city" />
        </Suspense>
        
        <EffectComposer>
          <Bloom 
            luminanceThreshold={1.0} 
            mipmapBlur 
            intensity={1.5}
            radius={0.6} 
          />
        </EffectComposer>
      </Canvas>
    </main>
  );
}
