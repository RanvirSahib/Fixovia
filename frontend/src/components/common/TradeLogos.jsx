import React from 'react';

/**
 * Modern, bespoke vector logos for Fixovia on-demand trades
 */

export const ElectricalLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#fef3c7" fillOpacity="0.5" />
    <path
      d="M17.5 3.5L7 16.5H16L14.5 28.5L25 15.5H16L17.5 3.5Z"
      fill="url(#elec_g)"
      stroke="#b45309"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path d="M15.5 7.5L9.5 15H15L14 23.5L22.5 15.5H16.5L17.5 7.5H15.5Z" fill="#ffffff" fillOpacity="0.45" />
    <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
    <defs>
      <linearGradient id="elec_g" x1="16" y1="3.5" x2="16" y2="28.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>
  </svg>
);

export const PlumbingLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pipe section */}
    <path
      d="M5 14H13C14.1 14 15 14.9 15 16V24C15 25.1 14.1 26 13 26H5"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="3" y="12" width="3.5" height="6" rx="1" fill="#0284c7" />
    {/* Modern Faucet Head */}
    <path d="M15 18H20.5C22 18 23 19 23 20.5V23H18.5V21.5C18.5 20.7 17.8 20 17 20H15" fill="#0369a1" />
    {/* Tap Handle */}
    <rect x="17.5" y="6" width="3" height="5" rx="1" fill="#0284c7" />
    <rect x="14" y="5" width="10" height="3" rx="1.5" fill="#0369a1" />
    {/* Sparkling Droplet */}
    <path
      d="M21 24.5C21 24.5 23.8 27.5 23.8 29C23.8 30.5 22.5 31.5 21 31.5C19.5 31.5 18.2 30.5 18.2 29C18.2 27.5 21 24.5 21 24.5Z"
      fill="url(#plumb_drop)"
    />
    {/* Curved Pipe Glint */}
    <path d="M6 14.5H12C12.8 14.5 13.5 15.2 13.5 16V22" stroke="#7dd3fc" strokeWidth="1" strokeLinecap="round" />
    <defs>
      <linearGradient id="plumb_drop" x1="21" y1="24.5" x2="21" y2="31.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#0284c7" />
      </linearGradient>
    </defs>
  </svg>
);

export const ACRepairLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* AC Body */}
    <rect x="4" y="6" width="24" height="13" rx="3.5" fill="url(#ac_body_g)" stroke="#0284c7" strokeWidth="1.5" />
    <rect x="7" y="14" width="18" height="2.5" rx="1.2" fill="#bfdbfe" />
    <circle cx="24" cy="9.5" r="1.3" fill="#10b981" />
    {/* Flow waves */}
    <path d="M7 22C9 20.8 11 22 13 20.8" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 22C21 20.8 23 22 25 20.8" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
    {/* Frost Snowflake */}
    <g transform="translate(16, 24)">
      <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-4.7" y1="-2.7" x2="4.7" y2="2.7" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-4.7" y1="2.7" x2="4.7" y2="-2.7" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="1.3" fill="#38bdf8" />
    </g>
    <defs>
      <linearGradient id="ac_body_g" x1="4" y1="6" x2="28" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#e0f2fe" />
      </linearGradient>
    </defs>
  </svg>
);

export const CarpentryLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Try Square / Architect Angle */}
    <path d="M6 7V26H25V20.5H12V7H6Z" fill="#ffedd5" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="12" y1="11" x2="9" y2="11" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="12" y1="15" x2="8" y2="15" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16" y1="20.5" x2="16" y2="23.5" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="20" y1="20.5" x2="20" y2="24.5" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
    {/* Crossed Claw Hammer */}
    <g transform="rotate(38 18 16)">
      {/* Wood Handle */}
      <rect x="16.5" y="7" width="3" height="19" rx="1.5" fill="url(#wood_h_g)" stroke="#78350f" strokeWidth="0.8" />
      {/* Hammer Head */}
      <path d="M12 4.5H24C24 4.5 25.5 5.5 25 7C24.5 8.5 23 8.5 23 8.5H13C13 8.5 11 8 11 6.5C11 5 12 4.5 12 4.5Z" fill="#64748b" />
      <path d="M11 5.5C9 6 7.5 7.5 7 9.5C8.5 9 10 8.5 11 8.5V5.5Z" fill="#475569" />
      <rect x="23" y="4.5" width="2" height="4" rx="0.5" fill="#334155" />
    </g>
    <defs>
      <linearGradient id="wood_h_g" x1="16.5" y1="7" x2="19.5" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#9a3412" />
      </linearGradient>
    </defs>
  </svg>
);

export const PaintingLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fresh paint swatch */}
    <path d="M6 7C11 5.5 22 5.5 26 7L24 13C19 11.5 11 12 6 13L6 7Z" fill="url(#paint_swash_g)" opacity="0.4" />
    {/* Roller Cylinder */}
    <rect x="7" y="6" width="18" height="7.5" rx="3.75" fill="url(#roller_g)" stroke="#be123c" strokeWidth="1.2" />
    <path d="M10 8H22" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
    {/* Frame */}
    <path
      d="M25 9.8H27C27.6 9.8 28 10.3 28 10.9V17C28 17.6 27.6 18 27 18H18V20.5"
      stroke="#64748b"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Handle */}
    <rect x="16.5" y="20.5" width="3" height="9.5" rx="1.5" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
    {/* Paint Drops */}
    <circle cx="9" cy="18" r="1.5" fill="#f43f5e" />
    <circle cx="12.5" cy="21" r="1.2" fill="#ea580c" />
    <defs>
      <linearGradient id="roller_g" x1="7" y1="6" x2="25" y2="13.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb7185" />
        <stop offset="1" stopColor="#e11d48" />
      </linearGradient>
      <linearGradient id="paint_swash_g" x1="6" y1="6" x2="26" y2="13" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fed7aa" />
        <stop offset="1" stopColor="#fecdd3" />
      </linearGradient>
    </defs>
  </svg>
);

export const CleaningLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Broom Handle */}
    <path d="M24 4L16 16" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
    {/* Bristle Clamp */}
    <path d="M14.5 14L17.5 16.5L15 19.5L12 17L14.5 14Z" fill="#b45309" />
    {/* Broom Straw Bristles */}
    <path
      d="M12 17L6 25C5.5 25.8 6 27 7 27.5L14 26C15 25.8 15.5 25 15.8 24.2L15 19.5L12 17Z"
      fill="url(#broom_g)"
      stroke="#d97706"
      strokeWidth="1"
    />
    <line x1="8" y1="26" x2="12" y2="20" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
    <line x1="11" y1="26" x2="14" y2="21" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
    {/* Radiance Sparkles */}
    <path d="M24 16C24 16 25 18 27 18C25 18 24 20 24 20C24 20 23 18 21 18C23 18 24 16 24 16Z" fill="#10b981" />
    <path d="M19 8C19 8 19.6 9.4 21 9.4C19.6 9.4 19 10.8 19 10.8C19 10.8 18.4 9.4 17 9.4C18.4 9.4 19 8 19 8Z" fill="#34d399" />
    {/* Clean Bubble */}
    <circle cx="25" cy="10" r="2.2" fill="#6ee7b7" fillOpacity="0.75" />
    <defs>
      <linearGradient id="broom_g" x1="6" y1="17" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

export const AppliancesLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Washer Body */}
    <rect x="5" y="4" width="22" height="24" rx="4" fill="url(#appl_body_g)" stroke="#6366f1" strokeWidth="1.5" />
    {/* Top Panel */}
    <line x1="5" y1="10" x2="27" y2="10" stroke="#c7d2fe" strokeWidth="1.2" />
    <circle cx="9" cy="7" r="1.5" fill="#4f46e5" />
    <circle cx="13" cy="7" r="1" fill="#10b981" />
    <rect x="17" y="6" width="7" height="2" rx="1" fill="#818cf8" />
    {/* Glass Drum */}
    <circle cx="16" cy="19" r="6.5" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
    <circle cx="16" cy="19" r="4.5" fill="#4338ca" />
    <path d="M14 16.5C15.5 15.5 17.5 16.5 18.5 18" stroke="#a5b4fc" strokeWidth="1.2" strokeLinecap="round" />
    {/* Corner Service Cog */}
    <g transform="translate(24, 4) scale(0.65)">
      <circle cx="0" cy="0" r="4.2" fill="#818cf8" stroke="#312e81" strokeWidth="1.2" />
      <circle cx="0" cy="0" r="1.8" fill="#ffffff" />
    </g>
    <defs>
      <linearGradient id="appl_body_g" x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#f5f3ff" />
      </linearGradient>
    </defs>
  </svg>
);

export const PestControlLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Security Shield */}
    <path
      d="M16 3L6 7V15C6 21.5 10.3 27.5 16 29C21.7 27.5 26 21.5 26 15V7L16 3Z"
      fill="url(#pest_shield_g)"
      stroke="#0d9488"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Insect Silhouette */}
    <ellipse cx="16" cy="16" rx="3.5" ry="4.5" fill="#134e4a" />
    <circle cx="16" cy="10" r="2.2" fill="#134e4a" />
    {/* Antennae */}
    <path d="M14.5 8.5C13.5 7 12 6.5 11 6.5" stroke="#134e4a" strokeWidth="1" strokeLinecap="round" />
    <path d="M17.5 8.5C18.5 7 20 6.5 21 6.5" stroke="#134e4a" strokeWidth="1" strokeLinecap="round" />
    {/* Legs */}
    <path d="M12.5 14L9 13M12.5 17L8.5 18M12.5 19L9.5 22" stroke="#134e4a" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M19.5 14L23 13M19.5 17L23.5 18M19.5 19L22.5 22" stroke="#134e4a" strokeWidth="1.2" strokeLinecap="round" />
    {/* Green Protection Verification Stamp */}
    <circle cx="21" cy="21" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
    <path d="M19 21L20.5 22.5L23.5 19.5" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="pest_shield_g" x1="6" y1="3" x2="26" y2="29" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f0fdfa" />
        <stop offset="1" stopColor="#ccfbf1" />
      </linearGradient>
    </defs>
  </svg>
);

