"use client";

// I will apply the change via replace_file_content in the NEXT turn after reading.
// For now, I just wait for the thought process validation.
// Actually, I can write the logic assuming standard Drei behavior.
// But I need to remove `HomeOverlay` from `page.tsx` HTML part and put it in Canvas.

// Let's refactor HomeOverlay to be R3F compatible.
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";

// ... imports

interface Props {
  started: boolean;
  // width/height unused for screen-space layout
  width?: number;
  height?: number;
}

export function HomeOverlay({ started }: Props) {
  const [visible, setVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // 1. Add Physics/Smoothing
  // "Heavy" spring for that premium, delayed feel
  const smoothScroll = useSpring(scrollY, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });

  // Scroll threshold (in pixels) for the transition
  const SCROLL_THRESHOLD = 400;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > SCROLL_THRESHOLD * 0.8);
  });

  // Header Animations
  // Initial: Higher position (35%)
  // Target: Top-Left (5%)
  const headerTop = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["35%", "5%"]); 
  const headerLeft = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["50%", "5%"]);
  // Initial X/Y: -50% -50% (Centered relative to itself)
  const headerX = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["-50%", "0%"]);
  const headerY = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["-50%", "0%"]); // -50% to sit slightly above center initially vs menu
  const headerScale = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], [1, 0.65]);

  // Menu Animations
  // Initial: Below header
  // Target: Left Sidebar area
  // Menu Animations
  // Initial: Below header (Reduced gap)
  // Target: Left Sidebar area
  const menuTop = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["45%", "50%"]); 
  // User asked for "gauche comme système de navigation". Usually that means left vertical center.
  
  // Let's position it initially below the header
  const menuInitialY = "10%"; // Closer to header (was 60%)
  const menuTargetY = "-50%"; // Centered vertically on the side
  
  const menuLeft = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["50%", "5%"]);
  const menuX = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["-50%", "0%"]);
  const menuY = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], [menuInitialY, menuTargetY]);
  
  
  // Opacity fade for the smooth transition entry
  const contentOpacity = visible ? 1 : 0;

  useEffect(() => {
    if (started) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 4000); 
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [started]);

  const menuItems = [
    { label: "Notre Vision", roman: "I" },
    { label: "Nos Valeurs", roman: "II" },
    { label: "Nos Projets", roman: "III" },
    { label: "Nos Expériences", roman: "IV" },
  ];

  // Dynamic Styles based on scroll state
  // Hover effects always white as requested
  const hoverTextColor = "hover:text-white";
  const underlineColor = "bg-white";
  const lineHoverColor = "group-hover:bg-white group-hover:opacity-100";

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      
      {/* HEADER: Phardev Logo */}
      <motion.div
        style={{
          position: "absolute",
          top: headerTop,
          left: headerLeft,
          x: headerX,
          y: headerY,
          scale: headerScale,
          transformOrigin: "top left",
          opacity: contentOpacity,
        }}
        className="text-center pointer-events-auto transition-opacity duration-1000 max-w-lg mx-auto"
      >
        <h1 className="text-3xl md:text-5xl font-thin tracking-[0.15em] text-white mb-2 uppercase font-serif drop-shadow-[0_4px_10px_rgba(0,0,0,1)] whitespace-nowrap">
          Phardev
        </h1>
        <div className="h-0.5 w-full bg-white mx-auto mb-3 shadow-lg opacity-80" />
        <p className="text-white font-medium text-xs md:text-sm tracking-[0.2em] uppercase leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
          La Renaissance <br /> Digitale
        </p>
      </motion.div>

      {/* MENU: Navigation Items */}
      <motion.div
        style={{
            position: "absolute",
            top: menuTop,
            left: menuLeft,
            x: menuX,
            y: menuY,
            opacity: contentOpacity,
        }}
        className="flex flex-col gap-6 w-[250px] md:w-[300px] pointer-events-auto transition-opacity duration-1000"
      >
        {menuItems.map((item, index) => (
          <div key={index} className={`group flex items-center justify-between text-white ${hoverTextColor} transition-colors duration-300 cursor-pointer`}>
            {/* Label */}
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {item.label}
              <span className={`absolute left-0 -bottom-1 h-[1px] w-0 ${underlineColor} transition-all duration-500 group-hover:w-full`} />
            </span>

            {/* Connecting Line - Subtler */}
            <div className="flex-1 mx-4 h-full flex items-center overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity">
               <div className={`w-full h-[1px] bg-white/50 transition-colors duration-300 ${lineHoverColor}`} />
            </div>

            {/* Roman Numeral */}
            <span className="text-xs font-serif tracking-widest text-right opacity-70 group-hover:opacity-100">
              {item.roman}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
