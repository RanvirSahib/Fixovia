import React, { useState } from 'react';

/**
 * Interactive Live Feature Showcase for the Auth Page (replacing static photo images).
 * Displays a live simulated Doorstep Safety PIN, Real-Time Dispatch Radar, and
 * dynamic metrics tailored to Customers vs. Partners.
 */
export default function AuthShowcase({ role = 'customer' }) {
  const isPartner = role === 'partner';

  // Interactive PIN simulation for Customers
  const [demoPin, setDemoPin] = useState('7492');
  const [isPinRegenerating, setIsPinRegenerating] = useState(false);

  // Interactive Dispatch simulation for Partners
  const [jobAccepted, setJobAccepted] = useState(false);

  const handleRegeneratePin = () => {
    setIsPinRegenerating(true);
    setTimeout(() => {
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      setDemoPin(newPin);
      setIsPinRegenerating(false);
    }, 350);
  };

  const handleToggleJob = () => {
    setJobAccepted((prev) => !prev);
  };

  return (
    <div
      className="auth-showcase-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 48px',
        overflow: 'hidden',
        background: isPartner
          ? 'radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.22) 0%, rgba(15, 23, 42, 0.98) 75%)'
          : 'radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.98) 75%)',
        color: '#ffffff',
        transition: 'background 0.65s cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    >
      {/* ── Floating Aurora Mesh Gradient Orbs ── */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: isPartner ? 'auto' : '-10%',
          left: isPartner ? '-10%' : 'auto',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: isPartner ? 'rgba(16, 185, 129, 0.22)' : 'rgba(59, 130, 246, 0.25)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          animation: 'floatSlow 12s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '30%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: isPartner ? 'rgba(14, 165, 233, 0.2)' : 'rgba(20, 184, 166, 0.22)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          animation: 'floatSlow 10s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Grid overlay texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 480, margin: '0 auto', width: '100%' }}>
        {/* ── Top Pill Badge ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isPartner ? '#34d399' : '#60a5fa',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isPartner ? '#10b981' : '#3b82f6',
                boxShadow: `0 0 8px ${isPartner ? '#10b981' : '#3b82f6'}`,
              }}
            />
            {isPartner ? 'Live Partner Dispatch Engine' : 'Live Safety PIN Verification'}
          </span>
        </div>

        {/* ── Dynamic Headline ── */}
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)',
            fontWeight: 800,
            lineHeight: 1.22,
            letterSpacing: '-0.02em',
            marginBottom: 12,
            color: '#f8fafc',
          }}
        >
          {isPartner
            ? 'Instant local dispatches with guaranteed weekly bank payouts.'
            : 'Verified pros at transparent rates, protected by Doorstep PIN.'}
        </h2>
        <p style={{ color: 'rgba(226, 232, 240, 0.8)', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: 28 }}>
          {isPartner
            ? 'Join 5,000+ certified electricians, plumbers, and technicians growing their earnings across India.'
            : 'Never worry about overcharging or unverified workers. Work begins only after PIN authentication.'}
        </p>

        {/* ── INTERACTIVE FEATURE CARD: CUSTOMER VS PARTNER ── */}
        {!isPartner ? (
          /* ── Customer Showcase: Live PIN & Dispatch Simulator ── */
          <div
            className="hover-lift"
            style={{
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1.5px solid rgba(96, 165, 250, 0.25)',
              borderRadius: '20px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
              marginBottom: 24,
            }}
          >
            {/* PIN Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>Doorstep Safety PIN</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Share ONLY when pro arrives</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRegeneratePin}
                disabled={isPinRegenerating}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  color: '#93c5fd',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isPinRegenerating ? 'Generating…' : '🔄 New PIN Demo'}
              </button>
            </div>

            {/* Glowing 4-Digit Display */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18 }}>
              {demoPin.split('').map((digit, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 52,
                    height: 60,
                    borderRadius: 14,
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%)',
                    border: '1.5px solid rgba(96, 165, 250, 0.4)',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 900,
                    fontFamily: "'Fraunces', monospace",
                    color: '#60a5fa',
                    transform: isPinRegenerating ? 'scale(0.92)' : 'scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Simulated Live Dispatch Status */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 12,
                padding: '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#0f766e',
                    color: '#fff',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                  }}
                >
                  RK
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Raj Kumar • Electrician</div>
                  <div style={{ fontSize: 11, color: '#38bdf8' }}>📍 1.2 km away • Arriving in 14 mins</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#22c55e',
                  background: 'rgba(34, 197, 94, 0.15)',
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                ★ 4.9 Verified
              </span>
            </div>
          </div>
        ) : (
          /* ── Partner Showcase: Live Job Radar & Earnings ── */
          <div
            className="hover-lift"
            style={{
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1.5px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '20px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
              marginBottom: 24,
            }}
          >
            {/* Live Job Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#34d399' }}>Live Job Alert • Instant Dispatch</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>₹650 Fixed</span>
            </div>

            {/* Job Details */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 14,
                padding: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
                ⚡ AC Deep Power Cleaning & Filter Wash
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📍 Model Town, Ludhiana (1.4 km)</span>
                <span>•</span>
                <span>🕒 Required Today at 4:30 PM</span>
              </div>
            </div>

            {/* Action Simulator Button */}
            <button
              type="button"
              onClick={handleToggleJob}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 12,
                border: 'none',
                background: jobAccepted
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              }}
            >
              {jobAccepted ? '✓ Job Accepted! GPS Route Locked 🛵' : 'Accept Dispatch (Live Simulation) →'}
            </button>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Today's Earnings</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#34d399' }}>₹3,850</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Partner Status</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>🏆 Platinum Pro</div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3 Trust Highlights ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(isPartner
            ? [
                { icon: '💸', text: '0% Platform Fee on First 100 Jobs' },
                { icon: '📍', text: 'Local 5km Radius Dispatch' },
                { icon: '⚡', text: 'Same-Day Direct Bank Settlement' },
              ]
            : [
                { icon: '🛡️', text: '₹10,000 Damage Insurance' },
                { icon: '⚡', text: '15-Minute Rapid Arrival' },
                { icon: '💰', text: 'Zero Surprise Flat Fees' },
              ]
          ).map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(226, 232, 240, 0.85)',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
