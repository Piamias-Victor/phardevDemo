"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "@/stores/app-store";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const cursorVariant = useAppStore((s) => s.cursorVariant);

  useEffect(() => {
    const dot = dotRef.current;
    const blob = blobRef.current;
    if (!dot || !blob) return;

    // Center the cursor initially (optional, or off-screen)
    gsap.set([dot, blob], { xPercent: -50, yPercent: -50, opacity: 0 }); 
    // Show cursor on first move
    const onFirstMove = () => {
        gsap.to([dot, blob], { opacity: 1, duration: 0.5 });
        window.removeEventListener("mousemove", onFirstMove);
    }
    window.addEventListener("mousemove", onFirstMove);

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
      gsap.to(blob, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    if (cursorVariant === "hover") {
      gsap.to(blob, { scale: 1.5, duration: 0.3 });
    } else {
      gsap.to(blob, { scale: 1, duration: 0.3 });
    }
  }, [cursorVariant]);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-foreground mix-blend-difference"
      />
      <div
        ref={blobRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full bg-accent/30 blur-sm"
      />
    </>
  );
}
