import React from 'react';

// Elegant Islamic Star Geometric Pattern Border SVG
export const IslamicBorder: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full flex justify-center items-center overflow-hidden py-4 ${className}`} id="islamic-border-container">
      <svg
        width="100%"
        height="24"
        viewBox="0 0 1000 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="text-amber-500 opacity-60"
        id="islamic-border-svg"
      >
        <pattern id="islamic-star-pattern" width="60" height="24" patternUnits="userSpaceOnUse">
          {/* Islamic Star Pattern Unit */}
          <path
            d="M30 0 L36 8 L45 3 L40 12 L49 17 L39 17 L35 24 L30 16 L25 24 L21 17 L11 17 L20 12 L15 3 L24 8 Z"
            fill="currentColor"
            fillRule="evenodd"
            opacity="0.85"
          />
          <circle cx="30" cy="12" r="2" fill="#000000" />
          <path d="M0 12 H60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
        </pattern>
        <rect width="1000" height="24" fill="url(#islamic-star-pattern)" />
      </svg>
    </div>
  );
};

// Elegant Arabesque Circular Calligraphy Seal / Logo
export const IslamicLogo: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} id="islamic-logo-seal">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-amber-500 hover:scale-105 transition-transform duration-300 cursor-pointer"
        id="islamic-logo-svg"
      >
        <defs>
          {/* Path for circular text wrapping */}
          <path
            id="logo-text-path"
            d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          />
          {/* Subtle gradient for premium luxury look */}
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5CB4A" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#91711e" />
          </linearGradient>
        </defs>

        {/* Outer Elegant Ring with Star Points */}
        <circle cx="50" cy="50" r="48" stroke="url(#gold-grad)" strokeWidth="1.25" />
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
        
        {/* Intersecting Squares (8-point star / Octagram / Khatim) for Geometric Balance */}
        <rect x="16" y="16" width="68" height="68" stroke="url(#gold-grad)" strokeWidth="1" transform="rotate(0 50 50)" opacity="0.8" />
        <rect x="16" y="16" width="68" height="68" stroke="url(#gold-grad)" strokeWidth="1" transform="rotate(45 50 50)" opacity="0.8" />
        
        {/* Inner solid dark circle for high contrast background */}
        <circle cx="50" cy="50" r="28" fill="#000000" stroke="url(#gold-grad)" strokeWidth="1" />
        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.5" />
        
        {/* Elegant circular wrapping text "AL BARAKAH • PREMIUM" */}
        <text className="font-serif text-[5.5px] uppercase tracking-[0.22em] fill-amber-500 font-semibold" dy="1">
          <textPath href="#logo-text-path" startOffset="0%">
            AL BARAKAH • PREMIUM • AL BARAKAH • PREMIUM •
          </textPath>
        </text>

        {/* Center monogram: Authentic Royal Arabic Calligraphy for "Al Barakah" (البركة) - Completely redesigned to avoid S-like shapes */}
        <g stroke="url(#gold-grad)" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Symmetrical Alif & Lam (majestic tall vertical lines) */}
          <path d="M 36 26 L 36 54" strokeWidth="2.5" />
          <path d="M 42 24 L 42 54" strokeWidth="2.5" />
          
          {/* Main baseline sweep connecting the letters elegantly */}
          <path d="M 31 54 L 63 54" strokeWidth="2.5" />
          
          {/* Left hook for Ba */}
          <path d="M 31 49 L 31 54" strokeWidth="2.5" />
          
          {/* Kaf vertical shaft & elegant top diagonal kashida stroke */}
          <path d="M 48 24 L 48 54" strokeWidth="2.5" />
          <path d="M 48 32 Q 55 28 62 23" strokeWidth="2.25" />
          
          {/* Ta-Marbutah (beautiful circular loop representing the final letter) */}
          <path d="M 54 54 C 54 44, 60 44, 60 54 Z" strokeWidth="2.25" />
          
          {/* Elegant sweeping crescent tail for Ra */}
          <path d="M 60 54 Q 66 54 68 62" strokeWidth="2.5" />
          
          {/* Royal crowning minaret point in the absolute center top */}
          <path d="M 47 18 L 50 12 L 53 18 Z" fill="url(#gold-grad)" stroke="none" />
          
          {/* Authentic diacritical dots (Nuqta) */}
          {/* Ba dot (single dot underneath) */}
          <rect x="34" y="60" width="3.5" height="3.5" fill="url(#gold-grad)" stroke="none" transform="rotate(45 35.75 61.75)" />
          
          {/* Ta-Marbutah double dots (two dots placed elegantly on top of the loop) */}
          <rect x="54" y="38" width="2.5" height="2.5" fill="url(#gold-grad)" stroke="none" transform="rotate(45 55.25 39.25)" />
          <rect x="59" y="38" width="2.5" height="2.5" fill="url(#gold-grad)" stroke="none" transform="rotate(45 60.25 39.25)" />
          
          {/* Calligraphic Tashkeel / Harakat (Fatha and Shadda) for supreme royal look */}
          <path d="M 37 18 L 42 14" strokeWidth="1.5" />
          <path d="M 44 20 C 45 18, 47 18, 47 20 C 47 22, 49 22, 49 20" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
};

// Subtle Golden Pattern Overlays for Hero sections or Card backgrounds
export const IslamicGridOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay" id="islamic-grid-overlay">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#D4AF37" strokeWidth="1" />
            <path d="M0 0 L80 80 M80 0 L0 80" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="40" cy="40" r="12" fill="none" stroke="#D4AF37" strokeWidth="1" />
            <circle cx="40" cy="40" r="3" fill="#D4AF37" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>
    </div>
  );
};
