import { useState, useEffect, useRef } from 'react';

const SERVICES = [
  { value: '', label: 'All Services', icon: '🛠️' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'ac', label: 'AC Repair', icon: '❄️' },
  { value: 'carpentry', label: 'Carpentry', icon: '🔨' },
  { value: 'painting', label: 'Painting', icon: '🎨' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
];

export default function HeroSection({ onNavigate }) {
  const [service, setService] = useState('');
  const [area, setArea] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const serviceRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (serviceRef.current && !serviceRef.current.contains(e.target)) {
        setIsServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeServiceObj = SERVICES.find((s) => s.value === service) || SERVICES[0];

  const handleSearch = () => {
    onNavigate('find');
  };

  const trustChips = [
    { icon: '✅', label: '50K+ Jobs Done' },
    { icon: '⭐', label: '4.9 Rating' },
    { icon: '🛡️', label: '₹10K Cover Guarantee' },
    { icon: '⚡', label: 'Same Day Service' },
  ];

  return (
    <section style={{
      background: 'linear-gradient(145deg, #fff8f5 0%, #fafaf9 50%, #f0fdfa 100%)',
      paddingTop: '80px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute',
        top: -80,
        right: -80,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -60,
        left: -60,
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,118,110,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '15%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Label pill ── */}
        <div className={`animate-fade-in stagger-1`} style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: 'var(--primary-light)',
            border: '1px solid rgba(225,29,72,0.2)',
            borderRadius: 'var(--radius-full)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--primary)',
          }}>
            🛠️ India's Most Trusted Home Repair Platform
          </span>
        </div>

        {/* ── Headline ── */}
        <div className={`animate-fade-in stagger-2`} style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
          }}>
            <span style={{ color: 'var(--primary)' }}>Trusted Pros,</span>
            <br />
            <span style={{ color: 'var(--charcoal)' }}>Right at Your Doorstep.</span>
          </h1>
        </div>

        {/* ── Sub-headline ── */}
        <div className={`animate-fade-in stagger-3`} style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--slate)',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Background-verified electricians, plumbers, AC technicians & carpenters — booked in 60 seconds.
          </p>
        </div>

        {/* ── Floating Search Bar ── */}
        <div className="animate-slide-up stagger-4" style={{
          maxWidth: 700,
          margin: '0 auto 40px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            padding: '6px 6px 6px 6px',
          }}>
            {/* Service Selector */}
            {/* Service Selector (Custom Dropdown) */}
            <div
              ref={serviceRef}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRight: '1px solid var(--border)',
                minWidth: 155,
                flexShrink: 0,
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => setIsServiceOpen((prev) => !prev)}
            >
              <span style={{ fontSize: 14 }}>{activeServiceObj.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Service
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.2 }}>
                  {activeServiceObj.label}
                </span>
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  marginLeft: 'auto',
                  transform: isServiceOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                  color: isServiceOpen ? 'var(--primary)' : 'var(--muted)',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>

              {/* Floating Service Menu */}
              {isServiceOpen && (
                <div
                  className="animate-dropdown-pop"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    minWidth: 190,
                    background: 'var(--card)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1.5px solid var(--line)',
                    borderRadius: 14,
                    boxShadow: '0 18px 40px -8px rgba(13, 86, 203, 0.2), 0 4px 16px rgba(0, 0, 0, 0.06)',
                    padding: 6,
                    zIndex: 60,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {SERVICES.map((item) => {
                      const isSelected = service === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setService(item.value);
                            setIsServiceOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: 'none',
                            background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                            color: isSelected ? 'var(--primary)' : 'var(--charcoal)',
                            fontWeight: isSelected ? 800 : 600,
                            fontSize: 13,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'var(--bg-stone-100)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span style={{ fontSize: 15 }}>{item.icon}</span>
                          <span style={{ flex: 1 }}>{item.label}</span>
                          {isSelected && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Area Input */}
            <input
              type="text"
              placeholder="Your area or locality…"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 14,
                padding: '8px 16px',
                color: 'var(--charcoal)',
                background: 'none',
                fontFamily: 'var(--font)',
              }}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="btn-primary"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '12px 28px',
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* ── Trust Chips ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {trustChips.map((chip, i) => (
            <div
              key={chip.label}
              className={`animate-fade-in stagger-${i + 3}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--charcoal)',
                transition: 'var(--transition)',
                cursor: 'default',
              }}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
