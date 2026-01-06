"use client";

export function TornPaperEdge() {
  return (
    <div className="absolute -top-[50px] left-0 w-full h-[51px] overflow-hidden z-20 pointer-events-none">
      <svg
        className="w-full h-full drop-shadow-md"
        viewBox="0 0 1200 50"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* A complex jagged path to simulate torn paper without filters */}
        <path
          d="M0 50 V10 
             L50 15 L100 5 L150 20 L200 8 L250 18 L300 5 L350 22 L400 10 
             L450 25 L500 8 L550 20 L600 5 L650 18 L700 8 L750 25 L800 10 
             L850 22 L900 5 L950 18 L1000 8 L1050 25 L1100 10 L1150 20 
             L1200 5 V50 H0 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}
