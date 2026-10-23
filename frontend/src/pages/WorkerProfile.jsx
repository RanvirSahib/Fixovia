import { useState } from 'react';
import BookingModal from '../components/booking/BookingModal';

export default function WorkerProfile({ worker, onNavigate }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const w = worker || {
    id: 1, name: 'Raj Kumar', role: 'Electrician', rating: 4.9, reviews: 142,
    distance: 1.8, rate: 499, available: true,
    skills: ['Wiring', 'MCB Repair', 'Fan Install', 'Inverter', 'CCTV', 'Switchboard'],
    initials: 'RK', color: '#0f766e',
  };

  const reviewsList = [
    { id: 1, user: 'Anita R.', date: 'Oct 2026', rating: 5, comment: 'Raj fixed our AC wiring in under an hour. Very professional, clean work.' },
    { id: 2, user: 'Deepak M.', date: 'Sep 2026', rating: 5, comment: 'Excellent service! He explained everything clearly and didn\'t overcharge.' },
    { id: 3, user: 'Sunita P.', date: 'Sep 2026', rating: 4, comment: 'Good work overall. Arrived a bit late but communicated well.' },
  ];

  return (
    <main className="page-enter" style={{ paddingBottom: 48 }}>
      {/* ── Back Button ── */}
      <div className="container" style={{ paddingTop: 24 }}>
        <button
          onClick={() => onNavigate('find')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--slate)',
            padding: '8px 0',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--charcoal)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--slate)'}
        >
          ← Back to Search
        </button>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* ── Left Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Header Card */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: w.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 28,
                  flexShrink: 0,
                }}>
                  {w.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--charcoal)' }}>{w.name}</h1>
                    <span className="badge-teal">✓ Fixovia Verified</span>
                  </div>
                  <p style={{ fontSize: 16, color: 'var(--slate)', fontWeight: 500, marginBottom: 12 }}>{w.role}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 600 }}>
                      <span style={{ color: '#f59e0b' }}>★</span>
                      <span>{w.rating}</span>
                      <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({w.reviews} reviews)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--slate)' }}>
                      📍 {w.distance} km away
                    </div>
                    <div style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: w.available ? '#f0fdf4' : '#fef2f2',
                      color: w.available ? '#16a34a' : '#ef4444',
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      {w.available ? '● Available Now' : '● Currently Busy'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--charcoal)' }}>Skills & Expertise</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {w.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '7px 16px',
                      background: 'var(--bg-stone)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--charcoal)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--charcoal)' }}>Verifications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '🪪', label: 'Government ID Verified' },
                  { icon: '🏠', label: 'Address Verified' },
                  { icon: '👮', label: 'Police Clearance Certificate' },
                  { icon: '🎓', label: 'Skill Assessment Passed' },
                  { icon: '📞', label: 'Phone Verified' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--teal-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>{item.label}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--teal)', fontWeight: 700, fontSize: 13 }}>✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--charcoal)' }}>
                Customer Reviews
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviewsList.map((review, i) => (
                  <div key={review.id} style={{ paddingBottom: i < reviewsList.length - 1 ? 16 : 0, borderBottom: i < reviewsList.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'var(--bg-stone-100)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 14,
                          color: 'var(--slate)',
                        }}>
                          {review.user[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)' }}>{review.user}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{review.date}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < review.rating ? '#f59e0b' : '#e5e7eb', fontSize: 14 }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column (Sticky Booking Card) ── */}
          <div>
            <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-1px' }}>
                  ₹{w.rate}
                  <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--muted)' }}>/visit</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  Final price after inspection
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => setBookingOpen(true)}
                disabled={!w.available}
                style={{ width: '100%', padding: '14px', fontSize: 16, marginBottom: 10 }}
              >
                {w.available ? '📅 Book Now' : '⏳ Currently Busy'}
              </button>
              <button
                className="btn-outline"
                style={{ width: '100%', padding: '12px', fontSize: 15 }}
              >
                💬 Send Message
              </button>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '⭐', label: 'Rating', value: `${w.rating} (${w.reviews} reviews)` },
                  { icon: '📍', label: 'Distance', value: `${w.distance} km from you` },
                  { icon: '⏱️', label: 'Response', value: 'Usually within 5 min' },
                  { icon: '💼', label: 'Jobs Done', value: `${w.reviews + 50}+` },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.icon} {item.label}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 20,
                padding: '12px',
                background: 'var(--teal-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                color: 'var(--teal)',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                🛡️ Covered by ₹10,000 Fixovia Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ main > div:last-child > div { grid-template-columns:1fr!important; } }`}</style>

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
