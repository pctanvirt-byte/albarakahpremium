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
        className="opacity-90"
        id="islamic-border-svg"
      >
        <defs>
          <linearGradient id="emerald-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" /> {/* emerald-700 */}
            <stop offset="30%" stopColor="#10b981" /> {/* emerald-500 */}
            <stop offset="50%" stopColor="#F5CB4A" /> {/* gold */}
            <stop offset="70%" stopColor="#10b981" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
          </linearGradient>
        </defs>
        <pattern id="islamic-star-pattern" width="60" height="24" patternUnits="userSpaceOnUse">
          {/* Islamic Star Pattern Unit */}
          <path
            d="M30 0 L36 8 L45 3 L40 12 L49 17 L39 17 L35 24 L30 16 L25 24 L21 17 L11 17 L20 12 L15 3 L24 8 Z"
            fill="url(#emerald-gold-grad)"
            fillRule="evenodd"
            opacity="0.95"
          />
          <circle cx="30" cy="12" r="2" fill="#000000" />
          <path d="M0 12 H60" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
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

        {/* Center monogram: Clean space inside the geometric frame */}
        <g fill="url(#gold-grad)" stroke="none">
          {/* A small elegant gold 8-pointed star accent at the absolute center */}
          <path d="M 50 45 L 51.5 48.5 L 55 50 L 51.5 51.5 L 50 55 L 48.5 51.5 L 45 50 L 48.5 48.5 Z" />
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
