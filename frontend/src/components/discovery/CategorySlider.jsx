import { useState, useRef } from 'react';

const CATEGORIES = [
  { id: 1,  emoji: '⚡', name: 'Electrical',  startPrice: 199  },
  { id: 2,  emoji: '🔧', name: 'Plumbing',    startPrice: 199  },
  { id: 3,  emoji: '❄️', name: 'AC Repair',   startPrice: 499  },
  { id: 4,  emoji: '🔨', name: 'Carpentry',   startPrice: 249  },
  { id: 5,  emoji: '🎨', name: 'Painting',    startPrice: 999  },
  { id: 6,  emoji: '🧹', name: 'Cleaning',    startPrice: 399  },
  { id: 7,  emoji: '📱', name: 'Appliances',  startPrice: 299  },
  { id: 8,  emoji: '🪲', name: 'Pest Control',startPrice: 599  },
];

export default function CategorySlider({ onNavigate, selected, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Scroll Arrows ── */}
      <button
        onClick={() => scroll(-1)}
        style={{
          position: 'absolute',
          left: -16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--white)',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '4px',
          paddingTop: '4px',
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {CATEGORIES.map((cat, i) => {
          const isActive = selected === cat.name;
          return (
            <div
              key={cat.id}
              className={`animate-fade-in stagger-${Math.min(i + 1, 6)} hover-lift`}
              onClick={() => onSelect && onSelect(isActive ? null : cat.name)}
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: '20px 24px',
                background: isActive ? 'var(--primary-light)' : 'var(--white)',
                border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                minWidth: 110,
                position: 'relative',
              }}
            >
              {/* Category icon */}
              <div style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: isActive ? 'var(--primary)' : 'var(--bg-stone)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                transition: 'var(--transition)',
              }}>
                {cat.emoji}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isActive ? 'var(--primary)' : 'var(--charcoal)',
                  marginBottom: 3,
                }}>
                  {cat.name}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  fontWeight: 500,
                }}>
                  From ₹{cat.startPrice}
                </div>
              </div>

              {/* Active underline */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: 3,
                  background: 'var(--primary)',
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => scroll(1)}
        style={{
          position: 'absolute',
          right: -16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--white)',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      >
        ›
      </button>
    </div>
  );
}
