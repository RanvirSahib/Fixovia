import { useState } from 'react';

export default function SafetyPinPage({ onNavigate }) {
  const [pinDigits, setPinDigits] = useState(['4', '9', '3', '1']);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value.slice(-1);
    setPinDigits(newDigits);
    setIsVerified(false);
    setIsError(false);
  };

  const handleVerifySimulator = () => {
    setVerifying(true);
    setIsError(false);
    setTimeout(() => {
      setVerifying(false);
      const fullPin = pinDigits.join('');
      if (fullPin.length === 4) {
        setIsVerified(true);
      } else {
        setIsError(true);
      }
    }, 600);
  };

  const handleReset = () => {
    setPinDigits(['4', '9', '3', '1']);
    setIsVerified(false);
    setIsError(false);
  };

  return (
    <main className="page-enter" style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ── Page Hero ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, var(--tealsoft) 100%)',
          borderBottom: '1px solid var(--line)',
          padding: '60px 0 50px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="wrap">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span
              className="badge badge-teal animate-slide-down"
              style={{ padding: '6px 14px', fontSize: '0.85rem', marginBottom: 16 }}
            >
              🔒 Fixovia Security Protocol
            </span>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)',
                fontWeight: 900,
                color: 'var(--ink)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: 16,
              }}
            >
              The Safety PIN Guarantee. <br />
              <span style={{ color: 'var(--teal)' }}>Zero Strangers. Total Control.</span>
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--slate)', lineHeight: 1.6, marginBottom: 28 }}>
              Letting a technician into your private home requires uncompromised trust. Fixovia’s
              proprietary <strong>Doorstep Safety PIN</strong> ensures no work starts, no fees accrue, and no
              unauthorized individual can step inside without your explicit consent.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                flexWrap: 'wrap',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: 'var(--ink)',
              }}
            >
              <div>🛡️ 100% Police Verified Technicians</div>
              <div>•</div>
              <div>📱 4-Digit In-App Verification</div>
              <div>•</div>
              <div>⚡ Locked Upfront Rates</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive PIN Verification Simulator ── */}
      <section style={{ padding: '50px 0 60px' }}>
        <div className="wrap" style={{ maxWidth: 840 }}>
          <div
            className="card animate-scale-in"
            style={{
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--teal)',
              background: 'var(--card)',
              boxShadow: '0 24px 60px -15px rgba(11, 122, 130, 0.25)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--tealsoft)',
                color: 'var(--teal)',
                fontWeight: 800,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              <span>⚡ Interactive Doorstep Security Simulator</span>
            </div>

            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.9rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 8 }}>
              Test How the PIN Verification Works
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '0.96rem', maxWidth: 560, margin: '0 auto 28px' }}>
              When a pro reaches your doorstep, they ask for your PIN. Type any 4-digit code below and hit verify to experience the real-time cloud handshake.
            </p>

            {/* 4 PIN Digit Inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  style={{
                    width: 64,
                    height: 76,
                    borderRadius: 16,
                    border: isVerified ? '2.5px solid var(--teal)' : '2px solid var(--line)',
                    background: isVerified ? 'var(--tealsoft)' : 'var(--bg2)',
                    color: isVerified ? 'var(--teal)' : 'var(--ink)',
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    outline: 'none',
                    fontFamily: "'Fraunces', serif",
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: isVerified ? '0 8px 20px -4px rgba(11, 122, 130, 0.35)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <button
                onClick={handleVerifySimulator}
                disabled={verifying}
                className="btn-primary btn-shine-effect hover-lift"
                style={{
                  padding: '12px 28px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--teal)',
                  boxShadow: '0 10px 24px -8px var(--teal)',
                }}
              >
                {verifying ? 'Verifying with Cloud Desk…' : '✓ Verify Doorstep PIN'}
              </button>
              <button
                onClick={handleReset}
                className="btn-outline"
                style={{ padding: '12px 20px', fontSize: '0.92rem' }}
              >
                Reset
              </button>
            </div>

            {/* Verification Result Notification */}
            {isVerified && (
              <div
                className="animate-success-pop"
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--tealsoft)',
                  border: '1.5px solid var(--teal)',
                  maxWidth: 580,
                  margin: '0 auto',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🔓</span>
                  <b style={{ color: 'var(--teal)', fontSize: '1.05rem' }}>
                    Doorstep Authentication Successful!
                  </b>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                  Technician <strong>Raj Kumar (Fixovia ID #FIX-8492)</strong> verified and logged in Punjab central register. Job timer commenced at upfront agreed rate of <strong>₹499</strong>. Escrow protection active.
                </div>
              </div>
            )}

            {isError && (
              <div
                className="animate-shake"
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fef2f2',
                  border: '1px solid #ef4444',
                  color: '#dc2626',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  maxWidth: 400,
                  margin: '0 auto',
                }}
              >
                ⚠️ Please enter all 4 digits to simulate verification.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Why the Safety PIN Exists: Solving Real Urban Problems ── */}
      <section style={{ padding: '60px 0', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 46px' }}>
            <span className="badge badge-coral" style={{ marginBottom: 12 }}>
              Why It Matters
            </span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              Solving the 3 Dark Realities of Home Repairs
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem', marginTop: 8 }}>
              Traditional service aggregators and local contractors fail where safety matters most. Here is how Fixovia eliminates every loophole.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '🚫',
                title: 'The "Unverified Substitute" Trap',
                problem:
                  'Traditional apps show you a verified face, but send an unvetted teenage apprentice or unregistered acquaintance to your door.',
                fixoviaFix:
                  'Fixovia technicians carry photo QR badges and cannot open the service checklist without your phone’s unique PIN.',
              },
              {
                icon: '💸',
                title: 'The Doorstep Extortion Trap',
                problem:
                  'Workers arrive, examine a simple fuse, and claim the entire building line is burned down, demanding ₹4,000 cash on the spot.',
                fixoviaFix:
                  'All rates are capped in the system. The technician’s billing app only permits standardized repairs with pre-approved price bands.',
              },
              {
                icon: '🏃',
                title: 'The "Ghost & Disappear" Trap',
                problem:
                  'If the repair leaks 2 hours later, the roadside technician blocks your number and refuses to return or take responsibility.',
                fixoviaFix:
                  'Every job is registered in our permanent audit log with a 30-day rework warranty. We dispatch a supervisor free of charge.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="card hover-lift"
                style={{
                  padding: '28px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{card.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 10 }}>
                  {card.title}
                </h3>
                <div style={{ marginBottom: 16 }}>
                  <b style={{ color: '#ef4444', fontSize: '0.82rem', textTransform: 'uppercase' }}>The Industry Danger:</b>
                  <p style={{ color: 'var(--slate)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: 4 }}>
                    {card.problem}
                  </p>
                </div>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--tealsoft)',
                    border: '1px solid var(--teal)33',
                  }}
                >
                  <b style={{ color: 'var(--teal)', fontSize: '0.82rem', textTransform: 'uppercase' }}>The Fixovia Solution:</b>
                  <p style={{ color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: 4 }}>
                    {card.fixoviaFix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Tier Background Verification Hierarchy ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="wrap" style={{ maxWidth: 840 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="badge badge-teal" style={{ marginBottom: 12 }}>
              Vetting Standards
            </span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              Only 1 in 8 Applicants Earn a Fixovia Badge
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem', marginTop: 6 }}>
              Our 3-tier filtration process screens out amateur handymen before they ever receive a dispatch.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {[
              {
                tier: 'Tier 1: Identity & Legal Clearance',
                desc: 'Government Aadhaar e-KYC biometric check, permanent residential address physical verification, and court criminal record database check.',
                passRate: '88% Pass Rate',
              },
              {
                tier: 'Tier 2: Practical Trade Skill Audit',
                desc: 'Every technician must perform hands-on fault-finding in our state training workshops (conduit wiring, high-pressure plumbing, R32 vacuum recovery).',
                passRate: '34% Pass Rate',
              },
              {
                tier: 'Tier 3: Customer Protocol & Safety Training',
                desc: 'Mandatory 40-hour module on respectful customer communication, uniform etiquette, floor protection, and digital Safety PIN compliance.',
                passRate: '12% Final Acceptance',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '24px 28px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 260 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
                    {t.tier}
                  </h3>
                  <p style={{ color: 'var(--slate)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                    {t.desc}
                  </p>
                </div>
                <span
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: idx === 2 ? 'var(--tealsoft)' : 'var(--bg2)',
                    color: idx === 2 ? 'var(--teal)' : 'var(--slate)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    border: '1px solid var(--line)',
                  }}
                >
                  {t.passRate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 24/7 Safety Desk & Emergency SOS ── */}
      <section style={{ padding: '40px 0 20px' }}>
        <div className="wrap">
          <div
            style={{
              background: 'linear-gradient(135deg, #1b2745 0%, #0d56cb 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '44px 36px',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 24,
              boxShadow: '0 20px 50px -15px rgba(27, 39, 69, 0.4)',
            }}
          >
            <div style={{ maxWidth: 540 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fed7aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                24/7 Live Incident Desk
              </span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.9rem', fontWeight: 800, margin: '8px 0 12px' }}>
                Questions or Concerns During a Service?
              </h2>
              <p style={{ opacity: 0.9, fontSize: '0.96rem', lineHeight: 1.6 }}>
                Every live booking includes a 1-tap "Safety Command Call" directly connecting you to our senior duty supervisor for instant intervention.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => onNavigate('find')}
                className="btn p"
                style={{ padding: '12px 24px', fontWeight: 800, fontSize: '0.95rem' }}
              >
                Book a Verified Pro →
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="btn g"
                style={{ padding: '12px 20px', fontSize: '0.92rem' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
