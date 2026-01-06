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
  
  // Detect White Page Entry
  const [isWhitePage, setIsWhitePage] = useState(false);
  
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
    // Switch to black text when entering white page (delayed +200px -> 1700px)
    setIsWhitePage(latest > 1700);
  });

  // Header Animations
  const headerTop = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["35%", "5%"]); 
  const headerLeft = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["50%", "5%"]);
  const headerX = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["-50%", "0%"]);
  const headerY = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["-50%", "0%"]); 
  const headerScale = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], [1, 0.65]);

  // Menu Animations
  const menuTop = useTransform(smoothScroll, [0, SCROLL_THRESHOLD], ["45%", "50%"]); 
  const menuInitialY = "10%"; 
  const menuTargetY = "-50%"; 
  
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
  
  // Color Logic
  const textColor = isWhitePage ? "text-black" : "text-white";
  const lineColor = isWhitePage ? "bg-black" : "bg-white";
  // Hovers: on White page -> hover Black. On Dark page -> hover White.
  // Actually, standard is usually contrast. Let's keep it simple.
  const hoverTextColor = isWhitePage ? "hover:text-amber-600" : "hover:text-white";

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
        className={`text-center pointer-events-auto transition-colors duration-500 max-w-lg mx-auto ${textColor}`}
      >
        <h1 className="text-3xl md:text-5xl font-thin tracking-[0.15em] mb-2 uppercase font-serif drop-shadow-md whitespace-nowrap">
          Phardev
        </h1>
        <div className={`h-0.5 w-full mx-auto mb-3 shadow-lg opacity-80 transition-colors duration-500 ${lineColor}`} />
        <p className="font-medium text-xs md:text-sm tracking-[0.2em] uppercase leading-relaxed drop-shadow-sm">
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
          <div key={index} className={`group flex items-center justify-between ${textColor} ${hoverTextColor} transition-colors duration-300 cursor-pointer`}>
            {/* Label */}
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] relative drop-shadow-sm">
              {item.label}
              <span className={`absolute left-0 -bottom-1 h-[1px] w-0 ${lineColor} transition-all duration-500 group-hover:w-full`} />
            </span>

            {/* Connecting Line - Subtler */}
            <div className="flex-1 mx-4 h-full flex items-center overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity">
               <div className={`w-full h-[1px] ${lineColor} transition-colors duration-300`} />
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
