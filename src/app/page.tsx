"use client";

import { useState, Suspense, useEffect, useLayoutEffect } from "react";
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
  const [canScroll, setCanScroll] = useState(false);

  // Force scroll reset on load to prevent starting in "scrolled" state
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // Lock scroll until animation is ready
  useEffect(() => {
    if (started) {
      // Allow scroll after overlay appears (slightly after 4s)
      const timer = setTimeout(() => {
        setCanScroll(true);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setCanScroll(false);
    }
  }, [started]);

  useEffect(() => {
    if (canScroll) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }
  }, [canScroll]);

  return (
    <main className="relative w-full bg-black">
      {/* Scrollable Spacer - Defines the scroll distance */}
      <div className="h-[250vh] w-full pointer-events-none" />

      {/* HTML Interface Overlay (Introduction Text) - Fixed */}
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none ${started ? 'opacity-0' : 'opacity-100'}`}
      >
        <p 
            className="mt-32 text-white/80 font-light text-xs tracking-[0.3em] uppercase opacity-0 pointer-events-auto"
            style={{ animation: 'fadeIn 2s ease-in-out forwards 1s, pulse 3s infinite 3s' }}
        >
            Clique sur la lueur pour découvrir l'écosystème Phardev
        </p>
      </div>

      {/* Main Content Overlay - Fixed */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {started && <HomeOverlay started={started} />}
      </div>

      {/* 3D Scene - Fixed Background */}
      <div className="fixed inset-0 z-0 h-screen w-screen">
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
      </div>
    </main>
  );
}
