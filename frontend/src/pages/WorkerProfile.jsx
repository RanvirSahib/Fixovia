import { useState } from 'react';
import BookingModal from '../components/booking/BookingModal';

export default function WorkerProfile({ worker, onNavigate }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [chatMessageSent, setChatMessageSent] = useState(false);

  const w = {
    id: worker?.id || 2,
    name: worker?.name || 'Sanjay Verma',
    role: worker?.role || 'Plumber',
    rating: worker?.rating || 4.8,
    reviews: worker?.reviews || 98,
    distance: worker?.distance || worker?.baseDistance || 1.8,
    rate: worker?.rate || 450,
    available: worker?.available !== undefined ? worker.available : true,
    skills: worker?.skills && worker.skills.length > 0
      ? worker.skills
      : ['Acoustic Leak Detection', 'Drain Snake', 'Geyser Fit', 'Concealed Pipe Sealing', 'Tap & Valve Repair'],
    initials: worker?.initials || (worker?.name ? worker.name.split(' ').map(n => n[0]).join('') : 'SV'),
    color: worker?.color || '#7c3aed',
    exp: worker?.exp || '6 yrs exp',
    badge: worker?.badge || 'Master Plumber',
  };

  // Trade-specific bios and toolkits
  const getBio = () => {
    const roleLower = w.role.toLowerCase();
    if (roleLower.includes('plumb')) {
      return `${w.name} is a master-certified plumbing technician with ${w.exp} of dedicated field experience across residential societies, apartments, and commercial facilities. He specializes in non-invasive acoustic leak detection, motorized drain snake unclogging, high-pressure geyser installation, and concealed pipeline fitting with zero unnecessary damage to wall tiles.`;
    }
    if (roleLower.includes('elect')) {
      return `${w.name} is a licensed professional electrician with ${w.exp} of hands-on experience handling high-voltage distribution, concealed house wiring, MCB trip diagnostics, and inverter setups. Known for meticulous safety compliance and clean wire dressing.`;
    }
    if (roleLower.includes('ac') || roleLower.includes('cool')) {
      return `${w.name} is a certified HVAC technician with ${w.exp} in residential and commercial cooling systems. Expert in power jet foam washing, R32 / R410A gas refills, copper piping brazing, and inverter PCB troubleshooting.`;
    }
    if (roleLower.includes('carpent')) {
      return `${w.name} is a seasoned wood specialist with ${w.exp} in precision lock fittings, modular furniture assembly, wardrobe sliding track repairs, and antique wood restoration.`;
    }
    return `${w.name} is a top-rated Fixovia verified ${w.role} with ${w.exp} of verified doorstep repair experience, maintaining a 98%+ customer satisfaction record with verified on-time arrival.`;
  };

  const getTools = () => {
    const roleLower = w.role.toLowerCase();
    if (roleLower.includes('plumb')) {
      return ['Rotary Electric Drain Auger', 'Ultrasonic Pipe Leak Sensor', 'Digital Water Pressure Gauge', 'PPR Pipe Fusion Welder', 'Heavy-Duty Basin Wrench', 'Brass Compression Fittings Kit'];
    }
    if (roleLower.includes('elect')) {
      return ['True-RMS Digital Multimeter', '1000V VDE Insulated Hand Tools', 'Non-Contact Voltage Detector', 'Conduit Wire Puller', 'Infrared Thermal Leak Tester', 'Circuit Breaker Tracer'];
    }
    if (roleLower.includes('ac') || roleLower.includes('cool')) {
      return ['High-Pressure Jet Washer Kit', 'Digital Two-Way Manifold Gauge', 'Dual-Stage Rotary Vacuum Pump', 'Electronic Halogen Leak Detector', 'Gas Charging Cylinder & Scales', 'Fin Comb Straightener'];
    }
    return ['Complete Professional Toolkit', 'Digital Measurement Tools', 'Protective Floor Drop Cloths', 'Calibrated Diagnostic Sensors'];
  };

  const getReviews = () => {
    const roleLower = w.role.toLowerCase();
    if (roleLower.includes('plumb')) {
      return [
        { id: 1, user: 'Pooja Narang', area: 'Sector 21', date: '2 days ago', rating: 5, comment: `${w.name} arrived within 20 minutes! He detected a hidden bathroom pipe leak behind the wall using an acoustic sensor without breaking any tiles. Highly recommended.` },
        { id: 2, user: 'Vikram Chawla', area: 'Model Town', date: '1 week ago', rating: 5, comment: `Fixed a stubborn kitchen drain clog that two previous local plumbers couldn't resolve. Brought a motorized drain snake machine and cleared it completely in 25 mins.` },
        { id: 3, user: 'Sunita Aggarwal', area: 'Civil Lines', date: '2 weeks ago', rating: 5, comment: `Installed our instant 25L geyser and new angle valves. Extremely neat piping work, no leaks whatsoever, and verified the 4-digit safety PIN before starting.` },
        { id: 4, user: 'Manish Joshi', area: 'DLF Phase 4', date: 'Last month', rating: 4, comment: `Very polite technician, explained the exact price upfront. Replaced the ball valve and tap cartridges cleanly.` },
      ];
    }
    return [
      { id: 1, user: 'Anita R.', area: 'Sector 21', date: '3 days ago', rating: 5, comment: `${w.name} did a fantastic job. Arrived promptly with all tools, diagnosed the issue within 10 minutes, and left the workspace clean.` },
      { id: 2, user: 'Deepak M.', area: 'Model Town', date: '1 week ago', rating: 5, comment: `Excellent service! Transparent rates, genuine spare parts with warranty, and didn't overcharge. Verified pro!` },
      { id: 3, user: 'Sunita P.', area: 'Civil Lines', date: '2 weeks ago', rating: 5, comment: `Super professional and courteous. Entered the safety PIN on arrival and finished the repair thoroughly.` },
    ];
  };

  const reviewsList = getReviews();
  const toolsList = getTools();

  return (
    <main className="page-enter" style={{ paddingBottom: 64, background: '#f8fafc', minHeight: '100vh' }}>
      {/* ── Top Breadcrumbs / Back Navigation ── */}
      <div className="container" style={{ paddingTop: 20 }}>
        <button
          onClick={() => onNavigate('find', { category: w.role })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffffff',
            border: '1px solid var(--line)',
            borderRadius: 999,
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--slate)',
            padding: '8px 18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--coral2)';
            e.currentTarget.style.borderColor = 'var(--coral2)';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--slate)';
            e.currentTarget.style.borderColor = 'var(--line)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          ← Back to {w.role} Pros
        </button>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN: DETAILED TECHNICIAN DOSSIER
             ═══════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 1. Header Profile Showcase Card */}
            <div className="card" style={{ padding: '28px 24px', background: '#ffffff', borderRadius: 24, border: '1px solid var(--line)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
              <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    background: w.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: 32,
                    boxShadow: `0 8px 24px ${w.color}40`,
                    flexShrink: 0,
                  }}>
                    {w.initials}
                  </div>
                  {w.available && (
                    <span
                      title="Online and available for immediate booking"
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#22c55e',
                        border: '3px solid #ffffff',
                        boxShadow: '0 0 0 2px #bbf7d0',
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>
                      {w.name}
                    </h1>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      ✓ Fixovia Verified Pro
                    </span>
                    {w.badge && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}>
                        {w.badge}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '1rem', color: 'var(--slate)', fontWeight: 600, margin: '4px 0 14px' }}>
                    {w.role} · <span style={{ color: 'var(--coral2)' }}>{w.exp}</span>
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                      <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>★</span>
                      <span>{w.rating}</span>
                      <span style={{ color: 'var(--mute)', fontWeight: 500, fontSize: '0.88rem' }}>({w.reviews} verified reviews)</span>
                    </div>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--slate)', fontWeight: 600 }}>
                      <span style={{ color: '#ef4444' }}>📍</span>
                      <span>{w.distance} km from your doorstep</span>
                    </div>

                    <div style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      background: w.available ? '#f0fdf4' : '#fef2f2',
                      color: w.available ? '#15803d' : '#b91c1c',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: `1px solid ${w.available ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      {w.available ? '● Available for Immediate Dispatch' : '● Currently on a Job'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Verification Highlights Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
                marginTop: 22,
                paddingTop: 18,
                borderTop: '1px solid var(--line)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mute)', fontWeight: 600 }}>Govt Aadhaar ID</div>
                    <b style={{ fontSize: '0.84rem', color: 'var(--ok)' }}>UIDAI Verified ✓</b>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>👮</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mute)', fontWeight: 600 }}>Police Record</div>
                    <b style={{ fontSize: '0.84rem', color: 'var(--ok)' }}>Clean Clearance ✓</b>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mute)', fontWeight: 600 }}>On-Time Arrival</div>
                    <b style={{ fontSize: '0.84rem', color: 'var(--ink)' }}>98.4% Punctual</b>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>🔐</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mute)', fontWeight: 600 }}>Doorstep Start</div>
                    <b style={{ fontSize: '0.84rem', color: 'var(--coral2)' }}>4-Digit PIN Lock</b>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Professional Bio & About the Technician */}
            <div className="card" style={{ padding: 24, background: '#ffffff', borderRadius: 20, border: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👨‍🔧</span> About {w.name}
              </h2>
              <p style={{ fontSize: '0.94rem', color: 'var(--slate)', lineHeight: 1.65, margin: 0 }}>
                {getBio()}
              </p>
            </div>

            {/* 3. Skills & Core Specializations */}
            <div className="card" style={{ padding: 24, background: '#ffffff', borderRadius: 20, border: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: '0 0 14px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span> Specialized Skills & Competencies
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {w.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '8px 16px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: 999,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ color: 'var(--coral2)' }}>•</span> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Transparent Rate Card & Service Pricing */}
            <div className="card" style={{ padding: 24, background: '#ffffff', borderRadius: 20, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏷️</span> Standard Rate Card & Price Guarantee
                </h2>
                <span style={{ fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                  Upfront Transparent Rates
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate)', margin: '0 0 16px' }}>
                Fixovia operates on strict no-hidden-charge pricing. The visit fee is adjusted directly towards labor if repair is approved.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { title: `Doorstep Inspection & Diagnosis (${w.role})`, price: `₹${w.rate}`, note: 'Credited against total labor if you proceed with repair' },
                  { title: 'Minor Repair & Component Servicing', price: 'From ₹199', note: 'E.g., Washer replacement, tap cartridge, switch, minor leaks' },
                  { title: 'Standard Repair / Pipe Joint / Unclog', price: 'From ₹399', note: 'Motorized snake auger, geyser servicing, valve replacements' },
                  { title: 'Major Installation & Concealed Fitting', price: 'From ₹699', note: 'Full appliance/geyser installation, concealed pipeline repair' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <div>
                      <b style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>{item.title}</b>
                      <div style={{ fontSize: '0.78rem', color: 'var(--mute)', marginTop: 2 }}>{item.note}</div>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--coral2)', whiteSpace: 'nowrap', marginLeft: 16 }}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Tool Kit & Diagnostic Equipment */}
            <div className="card" style={{ padding: 24, background: '#ffffff', borderRadius: 20, border: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: '0 0 12px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🧰</span> Professional Equipment Brought on Visit
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate)', margin: '0 0 14px' }}>
                {w.name} arrives fully equipped with commercial-grade certified tools, eliminating unnecessary trips to local hardware stores.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {toolsList.map((tool, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--coral2)', fontWeight: 800, fontSize: '0.9rem' }}>✓</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)' }}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Customer Reviews & Ratings */}
            <div className="card" style={{ padding: 24, background: '#ffffff', borderRadius: 20, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⭐</span> Customer Reviews & Feedback
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem', fontWeight: 700 }}>
                  <span style={{ color: '#f59e0b' }}>★ {w.rating}</span>
                  <span style={{ color: 'var(--mute)' }}>({w.reviews} reviews)</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviewsList.map((review, i) => (
                  <div key={review.id} style={{ paddingBottom: i < reviewsList.length - 1 ? 16 : 0, borderBottom: i < reviewsList.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 14,
                          color: '#3730a3',
                        }}>
                          {review.user[0]}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <b style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>{review.user}</b>
                            <span style={{ fontSize: '0.72rem', background: '#f0fdf4', color: '#166534', padding: '1px 7px', borderRadius: 999, fontWeight: 700 }}>
                              Verified Visit ✓
                            </span>
                          </div>
                          <small style={{ color: 'var(--mute)', fontSize: '0.78rem' }}>{review.area} · {review.date}</small>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 2, color: '#f59e0b', fontSize: '0.9rem' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--slate)', lineHeight: 1.55, margin: '6px 0 0', paddingLeft: 48 }}>
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN: STICKY BOOKING CARD & TRUST BADGES
             ═══════════════════════════════════════════════════════ */}
          <div>
            <div className="card" style={{ padding: 24, position: 'sticky', top: 90, background: '#ffffff', borderRadius: 24, border: '1px solid var(--line)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--mute)', fontWeight: 600, marginBottom: 4 }}>
                  Transparent Visit & Inspection Rate
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-1px' }}>
                  ₹{w.rate}
                  <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--mute)' }}> / visit</span>
                </div>
                <div style={{ fontSize: 13, color: '#166534', background: '#f0fdf4', padding: '4px 10px', borderRadius: 999, display: 'inline-block', marginTop: 8, fontWeight: 700 }}>
                  Adjustable into final repair invoice
                </div>
              </div>

              <button
                className="btn-primary btn-shine-effect"
                onClick={() => setBookingOpen(true)}
                disabled={!w.available}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  marginBottom: 10,
                  borderRadius: 14,
                  cursor: w.available ? 'pointer' : 'not-allowed',
                }}
              >
                {w.available ? `Book Appointment with ${w.name.split(' ')[0]} →` : '⏳ Currently on a Job'}
              </button>

              <button
                className="btn-outline"
                onClick={() => setChatMessageSent(true)}
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem', borderRadius: 14, fontWeight: 700 }}
              >
                {chatMessageSent ? '✓ Inquiry Sent to Pro!' : '💬 Send Message / Inquiry'}
              </button>

              <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '20px 0' }} />

              {/* Technician Telemetry Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '⭐', label: 'Customer Rating', value: `${w.rating} (${w.reviews} reviews)` },
                  { icon: '📍', label: 'Distance from you', value: `${w.distance} km away` },
                  { icon: '⏱️', label: 'Typical Arrival', value: '15 – 30 mins' },
                  { icon: '💼', label: 'Jobs Completed', value: `${w.reviews + 48}+ doorstep jobs` },
                  { icon: '🛡️', label: 'Doorstep PIN Security', value: 'Mandatory 4-Digit OTP' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                    <span style={{ color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Fixovia Guarantee Banner */}
              <div style={{
                marginTop: 22,
                padding: '14px',
                background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                borderRadius: 14,
                border: '1px solid #bfdbfe',
                fontSize: '0.85rem',
                color: '#1e40af',
                lineHeight: 1.45,
                textAlign: 'left',
              }}>
                <b style={{ display: 'block', marginBottom: 4, color: '#1d4ed8' }}>🛡️ Fixovia ₹10,000 Safety Promise</b>
                Zero-liability guarantee. Work begins only after you share your 4-digit PIN upon arrival. Covered by 30-day rework warranty.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){ main > div:last-child > div { grid-template-columns:1fr!important; } }`}</style>

      {bookingOpen && (
        <BookingModal
          worker={w}
          onClose={() => setBookingOpen(false)}
          onSuccess={() => setBookingOpen(false)}
        />
      )}
    </main>
  );
}
