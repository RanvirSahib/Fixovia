import { useState, useEffect } from 'react';

export default function HowItWorksPage({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(1);
  const [rolePerspective, setPerspective] = useState('customer'); // 'customer' | 'partner'
  const [simState, setSimState] = useState('idle'); // 'idle' | 'matching' | 'dispatched' | 'pin' | 'done'
  const [simTimer, setSimTimer] = useState(0);

  // Simulation runner
  useEffect(() => {
    let interval;
    if (simState === 'matching') {
      interval = setTimeout(() => setSimState('dispatched'), 1800);
    } else if (simState === 'dispatched') {
      interval = setTimeout(() => setSimState('pin'), 2200);
    } else if (simState === 'pin') {
      interval = setTimeout(() => setSimState('done'), 2000);
    }
    return () => clearTimeout(interval);
  }, [simState]);

  const startSimulation = () => {
    setSimState('matching');
  };

  const resetSimulation = () => {
    setSimState('idle');
  };

  const STEPS = [
    {
      num: 1,
      title: 'Pick Your Trade or Pro',
      subtitle: 'Instant Auto-Match or Handpick a Specialist',
      icon: '📱',
      color: '#0d56cb',
      desc:
        'Tell us what needs fixing in just 3 taps. Either choose "Instant Auto-Dispatch" to receive the nearest available certified pro in under 15 minutes, or browse top-rated local technicians by ratings, reviews, verified badges, and transparent hourly rates.',
      details: [
        'Select from 8 core trades (Electrical, Plumbing, AC, Carpentry, etc.)',
        'Upload optional photo or voice note of the repair issue',
        'Choose immediate emergency dispatch or schedule a convenient time slot',
        'Transparent starting price shown upfront with zero inspection traps',
      ],
    },
    {
      num: 2,
      title: 'Track Live GPS Dispatch',
      subtitle: 'Real-Time Map Route & Verified Technician Profile',
      icon: '🛵',
      color: '#f97316',
      desc:
        'Once matched, see your technician’s exact live GPS location on a real-time map, their expected arrival time down to the minute, their police verification ID, photo, and Fixovia safety credentials.',
      details: [
        'Live turn-by-turn tracking on your dashboard',
        'Verified technician photo, full name, and trade certification',
        'Direct masked phone call or in-app chat for gate security clearance',
        'Zero waiting around all day — average arrival is just 18 minutes',
      ],
    },
    {
      num: 3,
      title: 'Doorstep Safety PIN Verification',
      subtitle: 'The Non-Negotiable Fixovia Security Gate',
      icon: '🔒',
      color: '#0b7a82',
      desc:
        'Your security is paramount. When the technician knocks on your door, you share your unique 4-digit Safety PIN shown on your phone. The technician enters this code into their partner app — work cannot begin and job timers cannot start until this mutual match is confirmed.',
      details: [
        'Stops fake workers, imposters, or rogue unverified substitutes',
        'Locks the agreed price cap in the cloud so no surprise quotes occur',
        'Technician wears official Fixovia photo badge and uniform',
        'Digital work commencement timestamp logged in our 24/7 Safety Command Desk',
      ],
    },
    {
      num: 4,
      title: 'Flawless Repair & 30-Day Guarantee',
      subtitle: 'Itemized Digital Invoice & Post-Work Warranty',
      icon: '🛡️',
      color: '#16a34a',
      desc:
        'The technician performs the repair using calibrated tools, tests functionality in front of you, cleans up the work area, and issues an itemized digital GST bill. Pay conveniently via UPI, Card, or Cash — and relax with our 30-day free rework warranty.',
      details: [
        'Functionality and safety testing completed before pro leaves',
        'Itemized bill showing labor, genuine parts (with MRP tags), and GST',
        'One-click cashless payment via UPI, Credit Card, Netbanking, or Cash',
        '30-Day Free Rework Warranty — if it breaks again, we fix it 100% free',
      ],
    },
  ];

  return (
    <main className="page-enter" style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ── Page Hero ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, var(--bg2) 100%)',
          borderBottom: '1px solid var(--line)',
          padding: '60px 0 50px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="wrap">
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <span className="badge badge-blue animate-slide-down" style={{ marginBottom: 16 }}>
              🔄 The Fixovia Experience
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
              Home Repairs Simplified in <br />
              <span style={{ color: 'var(--coral2)' }}>4 Seamless, Transparent Steps</span>
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--slate)', lineHeight: 1.6, marginBottom: 28 }}>
              No haggling with random roadside workers. No waiting all day for someone who never shows up.
              Here is how Fixovia guarantees certified, safe, and on-time home repairs every single time.
            </p>

            {/* Quick Navigation to Steps */}
            <div
              style={{
                display: 'inline-flex',
                gap: 8,
                background: 'var(--card)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {STEPS.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeStep === s.num ? s.color : 'transparent',
                    color: activeStep === s.num ? '#ffffff' : 'var(--slate)',
                    fontWeight: activeStep === s.num ? 800 : 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Step {s.num}: {s.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Step-by-Step Deep Dive ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gap: 40 }}>
            {STEPS.map((step) => {
              const isSelected = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  id={`step-${step.num}`}
                  className="card hover-lift"
                  style={{
                    padding: '36px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? `2px solid ${step.color}` : '1.5px solid var(--line)',
                    background: 'var(--card)',
                    boxShadow: isSelected ? `0 20px 45px -15px ${step.color}33` : 'var(--shadow-sm)',
                    transition: 'all 0.35s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Step Accent Stripe */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: 6,
                      background: step.color,
                    }}
                  />

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1.2fr 0.8fr',
                      gap: 28,
                      alignItems: 'center',
                    }}
                    className="step-grid-row"
                  >
                    {/* Step Number Circle */}
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: `${step.color}18`,
                        color: step.color,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 32,
                        fontWeight: 900,
                        border: `2px solid ${step.color}44`,
                      }}
                    >
                      {step.num}
                    </div>

                    {/* Step Description & Feature Checklist */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{step.icon}</span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: step.color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {step.subtitle}
                        </span>
                      </div>
                      <h2
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: '1.75rem',
                          fontWeight: 800,
                          color: 'var(--ink)',
                          marginBottom: 12,
                          lineHeight: 1.25,
                        }}
                      >
                        {step.title}
                      </h2>
                      <p style={{ color: 'var(--slate)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 20 }}>
                        {step.desc}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                        {step.details.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                              fontSize: '0.9rem',
                              color: 'var(--slate)',
                            }}
                          >
                            <span style={{ color: step.color, fontWeight: 800, marginTop: 1 }}>✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Visual Graphic for Step */}
                    <div
                      style={{
                        padding: 24,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg2)',
                        border: '1px solid var(--line)',
                        textAlign: 'center',
                      }}
                    >
                      {step.num === 1 && (
                        <div>
                          <div style={{ fontSize: 44, marginBottom: 10 }}>⚡ ➔ 🔧 ➔ ❄️</div>
                          <b style={{ color: 'var(--ink)', fontSize: '0.95rem', display: 'block', marginBottom: 4 }}>
                            1-Click Instant Match
                          </b>
                          <small style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>
                            Algorithms match the closest pro based on rating, distance & spare parts inventory.
                          </small>
                        </div>
                      )}
                      {step.num === 2 && (
                        <div>
                          <div style={{ fontSize: 44, marginBottom: 10 }}>📍 🛵 🏠</div>
                          <b style={{ color: 'var(--ink)', fontSize: '0.95rem', display: 'block', marginBottom: 4 }}>
                            Average Arrival: 18 Mins
                          </b>
                          <small style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>
                            Live turn-by-turn radar updates directly on your smartphone screen.
                          </small>
                        </div>
                      )}
                      {step.num === 3 && (
                        <div>
                          <div
                            style={{
                              fontFamily: "'Fraunces', serif",
                              fontSize: 32,
                              fontWeight: 900,
                              color: 'var(--teal)',
                              letterSpacing: 8,
                              background: 'var(--tealsoft)',
                              padding: '10px 16px',
                              borderRadius: 12,
                              display: 'inline-block',
                              marginBottom: 10,
                            }}
                          >
                            4 9 3 1
                          </div>
                          <b style={{ color: 'var(--ink)', fontSize: '0.95rem', display: 'block', marginBottom: 4 }}>
                            Mutual PIN Verification
                          </b>
                          <small style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>
                            Zero work begins and zero charges start without your on-site sign-off.
                          </small>
                        </div>
                      )}
                      {step.num === 4 && (
                        <div>
                          <div style={{ fontSize: 44, marginBottom: 10 }}>🧾 💳 🛡️</div>
                          <b style={{ color: 'var(--ink)', fontSize: '0.95rem', display: 'block', marginBottom: 4 }}>
                            GST Invoice & 30-Day Guarantee
                          </b>
                          <small style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>
                            Pay exact itemized costs with total peace of mind and warranty coverage.
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Interactive Live Flow Simulator ── */}
      <section style={{ padding: '50px 0', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="badge badge-teal" style={{ marginBottom: 10 }}>
              🧪 Interactive Demo
            </span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              Experience the 4-Step Flow Live
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem', marginTop: 6 }}>
              Click below to test how Fixovia handles an emergency repair request in real-time.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--line)',
              background: 'var(--card)',
              boxShadow: 'var(--shadow)',
            }}
          >
            {/* Simulation Status Display */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <small style={{ color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>
                  Booking Simulator
                </small>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginTop: 2 }}>
                  {simState === 'idle' && 'Ready to Test: Click "Start Simulation" below'}
                  {simState === 'matching' && '⏳ Step 1: Matching closest certified pro in Punjab…'}
                  {simState === 'dispatched' && '🛵 Step 2: Raj Kumar (Electrician) Dispatched — ETA 14 Mins'}
                  {simState === 'pin' && '🔒 Step 3: Doorstep Arrival! Entering Safety PIN (4931)…'}
                  {simState === 'done' && '🎉 Step 4: Repair Complete! ₹499 Paid • 30-Day Warranty Active'}
                </div>
              </div>

              {simState === 'idle' ? (
                <button
                  onClick={startSimulation}
                  className="btn-primary btn-shine-effect"
                  style={{ padding: '10px 20px', fontSize: '0.92rem' }}
                >
                  ▶ Start Simulation
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                >
                  ↺ Reset
                </button>
              )}
            </div>

            {/* Visual Step Progress Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                position: 'relative',
              }}
            >
              {[
                { stage: 'matching', label: '1. Auto-Match', icon: '⚡' },
                { stage: 'dispatched', label: '2. Live Dispatch', icon: '🛵' },
                { stage: 'pin', label: '3. Safety PIN', icon: '🔒' },
                { stage: 'done', label: '4. Warranty', icon: '🛡️' },
              ].map((st, i) => {
                const isActive =
                  (simState === 'matching' && i === 0) ||
                  (simState === 'dispatched' && i <= 1) ||
                  (simState === 'pin' && i <= 2) ||
                  (simState === 'done' && i <= 3);

                return (
                  <div
                    key={st.stage}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--tealsoft)' : 'var(--bg2)',
                      border: isActive ? '1.5px solid var(--teal)' : '1px solid var(--line)',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{st.icon}</div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isActive ? 'var(--teal)' : 'var(--slate)' }}>
                      {st.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dual Perspective: Customer vs. Partner ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              Built for Mutual Transparency
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem' }}>
              See how the Fixovia workflow protects both homeowners and skilled technicians.
            </p>

            {/* Toggle Switch */}
            <div
              style={{
                display: 'inline-flex',
                gap: 4,
                background: 'var(--bg2)',
                padding: 4,
                borderRadius: 'var(--radius-full)',
                marginTop: 20,
                border: '1px solid var(--line)',
              }}
            >
              <button
                onClick={() => setPerspective('customer')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: rolePerspective === 'customer' ? 'var(--primary)' : 'transparent',
                  color: rolePerspective === 'customer' ? '#fff' : 'var(--slate)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                👤 For Homeowners
              </button>
              <button
                onClick={() => setPerspective('partner')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: rolePerspective === 'partner' ? 'var(--teal)' : 'transparent',
                  color: rolePerspective === 'partner' ? '#fff' : 'var(--slate)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🔧 For Pro Technicians
              </button>
            </div>
          </div>

          <div
            className="card animate-fade-in"
            style={{
              padding: '32px 36px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--line)',
              background: 'var(--card)',
            }}
          >
            {rolePerspective === 'customer' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="perspective-grid">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
                    What You Gain as a Customer:
                  </h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    <li><strong>Guaranteed Arrival</strong>: No ghosting or last-minute excuses.</li>
                    <li><strong>Locked Price Caps</strong>: Clear rates before the technician turns a single screw.</li>
                    <li><strong>Safety PIN Verification</strong>: Only authorized, background-vetted pros enter.</li>
                    <li><strong>30-Day Coverage</strong>: Free re-dispatch if the repair fails within a month.</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
                    What You Never Deal With:
                  </h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    <li>❌ Surprise "inspection charges" demanded at the door.</li>
                    <li>❌ Cheap duplicate spare parts passed off as originals.</li>
                    <li>❌ Having to clean up dirty debris, wire clippings, or plaster dust.</li>
                    <li>❌ Arguing over change or unrecorded cash transactions.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="perspective-grid">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal)', marginBottom: 12 }}>
                    What Pros Gain as a Fixovia Partner:
                  </h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    <li><strong>Instant Local Jobs</strong>: High-density dispatches in your exact neighborhood.</li>
                    <li><strong>Same-Day UPI Payouts</strong>: Direct deposits to your bank account daily.</li>
                    <li><strong>100% Tips Kept</strong>: Zero commission cuts from customer tips.</li>
                    <li><strong>Free Professional Toolkit</strong>: Branded uniform, calibrated meters, and gear.</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal)', marginBottom: 12 }}>
                    The Fixovia Pro Guarantee:
                  </h3>
                  <ul style={{ paddingLeft: 18, color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    <li>✓ No arbitrary account suspensions without transparent human review.</li>
                    <li>✓ Guaranteed compensation if customer cancels after pro departs.</li>
                    <li>✓ Full accidental & medical health insurance coverage while on job.</li>
                    <li>✓ Performance bonuses for maintaining high customer ratings.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section style={{ padding: '40px 0 20px' }}>
        <div className="wrap">
          <div className="final" style={{ textAlign: 'center' }}>
            <span className="hand" style={{ fontSize: '2rem' }}>Experience the difference</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 16px' }}>
              Ready for Your First Verified Repair?
            </h2>
            <p style={{ maxWidth: 520, margin: '0 auto 28px', color: '#fff', opacity: 0.9 }}>
              Book in 60 seconds. Our certified technician will be at your doorstep with a Safety PIN verification before you know it.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('find')}
                className="btn p"
                style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 800 }}
              >
                Find Pros Near Me →
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="btn g"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
              >
                Browse All Services
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .step-grid-row {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
          .perspective-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
