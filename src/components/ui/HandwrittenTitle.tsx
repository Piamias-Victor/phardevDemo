"use client";

import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import { useState } from "react";

export function HandwrittenTitle() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Scroll-driven underline drawing
  // Maps scroll pixels: start drawing at 1200, finish clearly at 1500 (Faster)
  const underlineProgress = useTransform(scrollY, [1200, 1500], [0, 1]);
  
  // "Pin and Release" Logic
  // 0 -> 1600px: Y = 0 (Fixed in center)
  // 1600 -> 3600px: Y moves up immediately after underline finishes
  const yPosition = useTransform(scrollY, [1600, 3600], [0, -2000]);
  
  // Opacity Fade out as it leaves
  const opacityExit = useTransform(scrollY, [2000, 2500], [1, 0]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show just before/as underline starts drawing
    if (latest > 1000 && !visible) {
      setVisible(true);
    } else if (latest < 1000 && visible) {
      setVisible(false);
    }
  });

  return (
    <motion.div 
      className="fixed inset-0 z-[10] flex flex-col items-center justify-center pointer-events-none"
      style={{ y: yPosition, opacity: opacityExit }}
    >
      <div className="relative flex flex-col items-center pt-20">
        
        {/* Title: Pinyon Script (Classic) */}
        <motion.h2
           className="text-6xl md:text-9xl text-white text-center pb-8 drop-shadow-sm"
           style={{ fontFamily: 'var(--font-pinyon)' }}
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
           transition={{ duration: 0.8, ease: "easeOut" }} 
        >
          Notre Vision
        </motion.h2>

        {/* CLassic Div Underline */}
        <motion.div 
          className="h-[2px] bg-white shadow-sm"
          style={{ 
            width: "300px",
            scaleX: underlineProgress,
            opacity: visible ? 1 : 0
          }}
        />
      </div>
    </motion.div>
  );
}
