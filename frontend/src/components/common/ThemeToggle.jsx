import React from 'react';

/**
 * Premium Theme Toggle Button with animated SVG sun/moon vector icons,
 * subtle glow halos, and smooth spring micro-interactions.
 */
export default function ThemeToggle({ theme, onToggle, id = 'theme', size = 42 }) {
  const isDark = theme === 'dark';

  return (
    <button
      id={id}
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="theme-toggle-btn"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        border: '1.5px solid var(--line)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: isDark
          ? '0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          : '0 2px 8px rgba(15, 23, 42, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow aura on hover */}
      <span
        className="theme-toggle-aura"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          opacity: 0,
          background: isDark
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Animated Icon Container */}
      <div
        style={{
          position: 'relative',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isDark ? 'rotate(40deg)' : 'rotate(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {isDark ? (
          /* Radiant Sun Icon when in Dark Mode (click to switch to Light) */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: '#facc15',
              filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.6))',
              transition: 'all 0.3s ease',
            }}
          >
            <circle cx="12" cy="12" r="4.5" fill="#facc15" fillOpacity="0.25" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          /* Sleek Curved Crescent Moon with Star Accent when in Light Mode */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: '#d97706',
              filter: 'drop-shadow(0 0 4px rgba(217, 119, 6, 0.35))',
              transition: 'all 0.3s ease',
            }}
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="#f59e0b"
              fillOpacity="0.25"
            />
            {/* Tiny aesthetic twinkle star */}
            <circle cx="19" cy="5" r="1" fill="#f59e0b" stroke="none" />
            <circle cx="15" cy="2" r="0.75" fill="#f59e0b" stroke="none" />
          </svg>
        )}
      </div>
    </button>
  );
}
