export default function WorkerCard({ worker, onBook, onViewProfile, staggerIndex = 1 }) {
  const {
    name = 'Worker',
    role = 'Technician',
    rating = 4.8,
    reviews = 0,
    distance = 2.0,
    rate = 499,
    available = true,
    skills = [],
    initials = 'W',
    color = '#0f766e',
  } = worker || {};

  const displaySkills = skills.slice(0, 3);

  return (
    <div
      className={`card hover-lift animate-fade-in stagger-${Math.min(staggerIndex, 6)}`}
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      {/* ── Top Row: Avatar + Info ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: '0.5px',
          }}>
            {initials}
          </div>
          {/* Availability dot */}
          <div style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: available ? '#22c55e' : '#f87171',
            border: '2px solid white',
          }} />
        </div>

        {/* Name + Role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--charcoal)' }}>
              {name}
            </span>
            <span className="badge-teal" style={{ fontSize: 11 }}>
              ✓ Verified
            </span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--slate)', marginTop: 2, fontWeight: 500 }}>
            {role}
          </div>

          {/* Rating + Distance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>{rating}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>({reviews})</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 8px',
              background: 'var(--bg-stone)',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              color: 'var(--slate)',
              fontWeight: 500,
            }}>
              📍 {distance} km
            </div>
          </div>
        </div>

        {/* Rate */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--charcoal)' }}>
            ₹{rate}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>/visit</div>
          <div style={{
            marginTop: 6,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: available ? '#f0fdf4' : '#fef2f2',
            color: available ? '#16a34a' : '#ef4444',
            fontSize: 11,
            fontWeight: 600,
          }}>
            {available ? '● Available' : '● Busy'}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

      {/* ── Skills ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {displaySkills.map((skill) => (
          <span
            key={skill}
            style={{
              padding: '3px 10px',
              background: 'var(--bg-stone)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--slate)',
            }}
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span style={{
            padding: '3px 10px',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--primary)',
          }}>
            +{skills.length - 3} more
          </span>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          className="btn-outline"
          onClick={() => onViewProfile && onViewProfile(worker)}
          style={{ flex: 1, padding: '10px', fontSize: 13 }}
        >
          View Profile
        </button>
        <button
          className="btn-primary"
          onClick={() => onBook && onBook(worker)}
          disabled={!available}
          style={{ flex: 1, padding: '10px', fontSize: 13 }}
        >
          {available ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
