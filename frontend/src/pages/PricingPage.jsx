import { useState } from 'react';
import BookingModal from '../components/booking/BookingModal';

const RATE_CARD = [
  {
    category: '⚡ Electrical Work',
    base: '₹199',
    avgJob: '₹499',
    major: '₹899+',
    warranty: '30 Days',
    items: [
      { name: 'Switchboard / Socket Replacement', price: '₹199' },
      { name: 'Ceiling Fan Installation & Regulator Fix', price: '₹299' },
      { name: 'MCB Tripping Fault Diagnostic & Isolation', price: '₹499' },
      { name: 'Heavy Inverter & Battery Wiring Setup', price: '₹899' },
      { name: 'Complete Room Conduit Rewiring (per room)', price: '₹1,299' },
    ],
  },
  {
    category: '🔧 Plumbing & Sanity',
    base: '₹199',
    avgJob: '₹450',
    major: '₹799+',
    warranty: '30 Days',
    items: [
      { name: 'Tap Spout / Mixer Valve Repair', price: '₹199' },
      { name: 'Sink / Washbasin Trap Clog Clearing', price: '₹349' },
      { name: 'Motorized Drain Snake Main Sewer Declog', price: '₹599' },
      { name: 'Storage Geyser / Water Heater Installation', price: '₹699' },
      { name: 'Concealed Wall Pipeline Pressure Testing', price: '₹899' },
    ],
  },
  {
    category: '❄️ AC Servicing & Cooling',
    base: '₹299',
    avgJob: '₹399',
    major: '₹1,499+',
    warranty: '60 Days',
    items: [
      { name: 'High-Pressure Power Jet Service (Indoor + Outdoor)', price: '₹399' },
      { name: 'Window AC Foam Sanitization Wash', price: '₹349' },
      { name: 'Capacitor / Relay Replacement (Parts extra)', price: '₹449' },
      { name: 'Complete Split AC Installation with Vacuum Test', price: '₹1,199' },
      { name: 'Refrigerant Gas Leak Detection & 100% Recharge', price: '₹1,499' },
    ],
  },
  {
    category: '🔨 Carpentry & Woodcraft',
    base: '₹249',
    avgJob: '₹599',
    major: '₹999+',
    warranty: '30 Days',
    items: [
      { name: 'Door Lock / Mortise Handle Replacement', price: '₹299' },
      { name: 'Sagging Door Planing & Alignment', price: '₹349' },
      { name: 'Hydraulic Bed or 3-Door Wardrobe Assembly', price: '₹599' },
      { name: 'Modular Kitchen Soft-Close Hinge Overhaul', price: '₹649' },
      { name: 'Digital Smart Lock Precision Mortising', price: '₹999' },
    ],
  },
];

export default function PricingPage({ onNavigate }) {
  const [selectedTrade, setSelectedTrade] = useState('Electrical');
  const [laborHours, setLaborHours] = useState(1);
  const [partsCost, setPartsCost] = useState(250);
  const [bookingTrade, setBookingTrade] = useState(null);

  // Dynamic rates based on trade
  const tradeBaseRates = {
    Electrical: 499,
    Plumbing: 450,
    'AC Repair': 399,
    Carpentry: 599,
  };

  const baseRate = tradeBaseRates[selectedTrade] || 499;
  const calculatedLabor = baseRate + (laborHours - 1) * 200;
  const subtotal = calculatedLabor + partsCost;
  const gst = Math.round(subtotal * 0.18);
  const protectionFee = 29;
  const grandTotal = subtotal + gst + protectionFee;

  const handleBookEstimate = () => {
    setBookingTrade({
      id: selectedTrade.toLowerCase().replace(' ', '-'),
      name: `Fixovia Verified ${selectedTrade} Specialist`,
      role: selectedTrade,
      rate: baseRate,
      skills: [selectedTrade, 'Doorstep Repair', 'Warranty Guarantee'],
      initials: selectedTrade.substring(0, 2).toUpperCase(),
      color: '#0d56cb',
    });
  };

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
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span
              className="badge badge-coral animate-slide-down"
              style={{ padding: '6px 14px', fontSize: '0.85rem', marginBottom: 16 }}
            >
              💎 100% Upfront Rate Cards
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
              Zero Hidden Charges. <br />
              <span style={{ color: 'var(--coral2)' }}>No Doorstep Quote Traps.</span>
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--slate)', lineHeight: 1.6, marginBottom: 28 }}>
              Tired of technicians who quote ₹100 on the phone and demand ₹2,500 at your door?
              Fixovia locks standardized pricing caps in the cloud before anyone steps inside.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: 'var(--ink)',
              }}
            >
              <div>✓ Fixed Starting Rates</div>
              <div>•</div>
              <div>✓ Genuine Parts at Retail MRP</div>
              <div>•</div>
              <div>✓ Itemized GST Digital Invoice</div>
              <div>•</div>
              <div>✓ 30-Day Free Rework Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Live Bill Estimator ── */}
      <section style={{ padding: '50px 0 60px' }}>
        <div className="wrap" style={{ maxWidth: 940 }}>
          <div
            className="card animate-scale-in"
            style={{
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--line)',
              background: 'var(--card)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span className="badge badge-teal" style={{ marginBottom: 8 }}>
                🧮 Interactive Rate Calculator
              </span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.9rem', fontWeight: 800, color: 'var(--ink)' }}>
                Calculate Your Estimated Repair Cost
              </h2>
              <p style={{ color: 'var(--slate)', fontSize: '0.95rem' }}>
                Adjust the sliders below to see our transparent breakdown in real-time.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: 36,
                alignItems: 'start',
              }}
              className="calculator-split-grid"
            >
              {/* Controls Column */}
              <div>
                {/* Trade Selector */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)', display: 'block', marginBottom: 8 }}>
                    Select Service Category
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['Electrical', 'Plumbing', 'AC Repair', 'Carpentry'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTrade(t)}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          border: selectedTrade === t ? '2px solid var(--primary)' : '1px solid var(--line)',
                          background: selectedTrade === t ? 'var(--primary-light)' : 'var(--bg2)',
                          color: selectedTrade === t ? 'var(--primary)' : 'var(--ink)',
                          fontWeight: selectedTrade === t ? 800 : 600,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {t === 'Electrical' && '⚡ '}
                        {t === 'Plumbing' && '🔧 '}
                        {t === 'AC Repair' && '❄️ '}
                        {t === 'Carpentry' && '🔨 '}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Labor Hours / Scope Slider */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>
                      Estimated Work Duration
                    </label>
                    <b style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
                      {laborHours} {laborHours === 1 ? 'Hour' : 'Hours'}
                    </b>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    step={1}
                    value={laborHours}
                    onChange={(e) => setLaborHours(+e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                    <span>1 Hr (Standard fix)</span>
                    <span>2 Hrs</span>
                    <span>3 Hrs</span>
                    <span>4 Hrs (Complex overhaul)</span>
                  </div>
                </div>

                {/* Replacement Parts Cost Slider */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>
                      Estimated Replacement Parts (if needed)
                    </label>
                    <b style={{ color: 'var(--coral2)', fontSize: '0.95rem' }}>₹{partsCost}</b>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={partsCost}
                    onChange={(e) => setPartsCost(+e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--coral2)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                    <span>₹0 (No parts)</span>
                    <span>₹1,000</span>
                    <span>₹2,000 (Major hardware)</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg2)',
                    fontSize: 12,
                    color: 'var(--slate)',
                    lineHeight: 1.5,
                  }}
                >
                  💡 <strong>Tip:</strong> If you already have your own replacement spare parts purchased from a market, you pay <strong>₹0 parts cost</strong>. Our technicians gladly install customer-provided genuine spares!
                </div>
              </div>

              {/* Real-time Invoice Breakdown Card */}
              <div
                style={{
                  background: 'var(--bg2)',
                  border: '1.5px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <b style={{ fontSize: '1rem', color: 'var(--ink)' }}>Itemized Bill Preview</b>
                  <span className="badge badge-teal" style={{ fontSize: 10 }}>Live Estimate</span>
                </div>

                <div style={{ display: 'grid', gap: 10, fontSize: '0.92rem', color: 'var(--slate)', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Standard Labor ({selectedTrade}):</span>
                    <b style={{ color: 'var(--ink)' }}>₹{calculatedLabor}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Parts & Hardware (at MRP):</span>
                    <b style={{ color: 'var(--ink)' }}>₹{partsCost}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (18% Govt Compliant):</span>
                    <b style={{ color: 'var(--ink)' }}>₹{gst}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Safety PIN & Warranty Shield:</span>
                    <b style={{ color: 'var(--teal)' }}>₹{protectionFee}</b>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '2px dashed var(--line)', margin: '14px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>Total Payable:</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--coral2)' }}>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </div>
                    <small style={{ color: 'var(--slate)', fontSize: 11 }}>All taxes & 30-day warranty included</small>
                  </div>
                </div>

                <button
                  onClick={handleBookEstimate}
                  className="btn-primary btn-shine-effect hover-lift"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800 }}
                >
                  Book This {selectedTrade} Specialist →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Rate Cards Table ── */}
      <section style={{ padding: '60px 0', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <span className="badge badge-blue" style={{ marginBottom: 10 }}>
              Standard Rate Cards
            </span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              Transparent Rates Across All 4 Core Trades
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem', marginTop: 6 }}>
              All visits are tracked digitally. Inspection fee is 100% waived when you proceed with the repair.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
            {RATE_CARD.map((card, i) => (
              <div
                key={i}
                className="card hover-lift"
                style={{
                  padding: '26px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)' }}>
                    {card.category}
                  </h3>
                  <span className="badge badge-teal" style={{ fontSize: 10 }}>
                    {card.warranty}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--slate)' }}>Standard Starting Rate:</span>
                  <b style={{ color: 'var(--primary)' }}>{card.avgJob}</b>
                </div>

                {/* Specific Common Items */}
                <div style={{ padding: '14px 0', display: 'grid', gap: 8 }}>
                  {card.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.84rem',
                        color: 'var(--slate)',
                      }}
                    >
                      <span style={{ maxWidth: '75%' }}>{item.name}</span>
                      <b style={{ color: 'var(--ink)' }}>{item.price}</b>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const tradeName = card.category.replace(/[^a-zA-Z ]/g, '').trim();
                    setBookingTrade({
                      id: tradeName.toLowerCase().replace(' ', '-'),
                      name: `Fixovia Verified ${tradeName} Specialist`,
                      role: tradeName,
                      rate: 499,
                      skills: [tradeName, 'Inspection', 'Doorstep Repair'],
                      initials: tradeName.substring(0, 2).toUpperCase(),
                      color: '#0d56cb',
                    });
                  }}
                  className="btn-outline"
                  style={{ width: '100%', padding: '8px', fontSize: '0.86rem', marginTop: 10 }}
                >
                  Book {card.category.split(' ')[1]} Pro
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table: Fixovia vs Others ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              How Fixovia Compares
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem', marginTop: 6 }}>
              Real transparency is our foundational promise to urban homeowners.
            </p>
          </div>

          <div
            className="card"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--line)',
              overflowX: 'auto',
              background: 'var(--card)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--ink)', fontSize: '0.95rem' }}>Feature</th>
                  <th style={{ padding: '16px 20px', color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                    Fixovia
                  </th>
                  <th style={{ padding: '16px 20px', color: 'var(--slate)', fontSize: '0.92rem' }}>
                    Local Electricians / Plumbers
                  </th>
                  <th style={{ padding: '16px 20px', color: 'var(--slate)', fontSize: '0.92rem' }}>
                    Other Apps
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem', color: 'var(--slate)' }}>
                {[
                  ['Upfront Standard Rate Cards', '✓ 100% Capped', '❌ Varies arbitrarily', '⚠️ Hidden surge pricing'],
                  ['Doorstep Safety PIN Verification', '✓ Mandatory on all jobs', '❌ None', '❌ None'],
                  ['30-Day Free Rework Warranty', '✓ Yes, zero hassle', '❌ Blocks your phone', '⚠️ 7 Days only'],
                  ['100% Police Verified Background', '✓ Complete e-KYC & Court check', '❌ Unknown strangers', '⚠️ Basic phone check'],
                  ['Itemized GST Invoice', '✓ Digital receipt with warranty ID', '❌ Cash in hand only', '⚠️ Complex hidden fees'],
                ].map(([feat, fix, local, other], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ink)' }}>{feat}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--primary)' }}>{fix}</td>
                    <td style={{ padding: '14px 20px' }}>{local}</td>
                    <td style={{ padding: '14px 20px' }}>{other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingTrade && (
        <BookingModal
          worker={bookingTrade}
          onClose={() => setBookingTrade(null)}
          onSuccess={() => {
            setBookingTrade(null);
            onNavigate('dashboard');
          }}
        />
      )}

      <style>{`
        @media (max-width: 860px) {
          .calculator-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
