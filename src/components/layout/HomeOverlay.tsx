"use client";

// Placeholder to ensure I see the file first.
// I will apply the change via replace_file_content in the NEXT turn after reading.
// For now, I just wait for the thought process validation.
// Actually, I can write the logic assuming standard Drei behavior.
// But I need to remove `HomeOverlay` from `page.tsx` HTML part and put it in Canvas.

// Let's refactor HomeOverlay to be R3F compatible.
import { useEffect, useState } from "react";

// ... imports

interface Props {
  started: boolean;
  // width/height unused for screen-space layout
  width?: number;
  height?: number;
}

export function HomeOverlay({ started }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (started) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 6500); 
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

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div 
        className={`flex flex-col justify-between py-12 px-8 w-[90vw] md:w-[22vw] h-[60vh] md:h-[42vh] mb-8 md:mb-16 transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100 translate-y-0 blur-0 scale-100' : 'opacity-0 translate-y-12 blur-sm scale-95'}`}
      >
        {/* Header Section */}
        <div className="text-center pointer-events-auto">
          <h1 className="text-4xl md:text-5xl font-thin tracking-widest text-white mb-4 uppercase font-serif drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
            Phardev
          </h1>
          {/* Separator */}
          <div className="h-0.5 w-24 bg-white mx-auto mb-6 shadow-lg opacity-80" />
          
          <p className="text-white font-medium text-xs md:text-sm tracking-[0.2em] uppercase leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            La Renaissance <br/> Digitale
          </p>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col gap-5 mt-8 pointer-events-auto">
          {menuItems.map((item, index) => (
            <div key={index} className="group flex items-center justify-between text-white hover:text-white transition-colors duration-300 cursor-pointer">
              {/* Left: Label */}
              <span className="text-xs md:text-xs font-bold uppercase tracking-[0.15em] relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {item.label}
                 <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-500 group-hover:w-full box-shadow-glow" />
              </span>

              {/* Middle: Custom Dotted Line */}
              <div className="flex-1 mx-3 h-full flex items-center relative overflow-hidden">
                 <div 
                    className="w-full h-[4px] bg-[radial-gradient(circle,white_1.5px,transparent_1.5px)] bg-[length:12px_4px] bg-repeat-x opacity-60 translate-x-[-100%] transition-transform duration-700 ease-out group-hover:translate-x-0" 
                 />
              </div>

              {/* Right: Roman Numeral */}
              <span className="text-xs md:text-xs font-serif tracking-widest min-w-[20px] text-right text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {item.roman}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
