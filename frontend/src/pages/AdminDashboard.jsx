import { useState, useEffect } from 'react';
import { api } from '../services/api';

const FALLBACK_METRICS = {
  totalUsers:    12480,
  activeWorkers: 892,
  pendingKyc:    37,
  revenueToday:  48200,
};

const FALLBACK_PENDING_WORKERS = [
  { id: 'W-201', name: 'Suresh Nair',   skill: 'Electrician', applied: '21 Oct 2026', location: 'Ludhiana' },
  { id: 'W-202', name: 'Kavita Joshi',  skill: 'Plumber',     applied: '21 Oct 2026', location: 'Amritsar' },
  { id: 'W-203', name: 'Ravi Prakash',  skill: 'Carpenter',   applied: '20 Oct 2026', location: 'Jalandhar' },
  { id: 'W-204', name: 'Neha Mishra',   skill: 'Painter',     applied: '20 Oct 2026', location: 'Mohali' },
  { id: 'W-205', name: 'Ajay Tiwari',   skill: 'AC Tech',     applied: '19 Oct 2026', location: 'Patiala' },
];

const FALLBACK_BOOKINGS = [
  { id: 'JOB-2041', service: 'Fan Installation',  customer: 'Arjun M.',  worker: 'Raj Kumar',    status: 'In Progress', amount: 528 },
  { id: 'JOB-2040', service: 'Pipe Leak Repair',  customer: 'Sunita P.', worker: 'Sanjay Verma', status: 'Completed',   amount: 450 },
  { id: 'JOB-2039', service: 'AC Deep Cleaning',  customer: 'Deepak S.', worker: 'Priya Sharma', status: 'Completed',   amount: 699 },
  { id: 'JOB-2038', service: 'Wood Polish',        customer: 'Meena B.',  worker: 'Amit Singh',   status: 'Cancelled',   amount: 599 },
  { id: 'JOB-2037', service: 'Wiring Repair',      customer: 'Rohit K.',  worker: 'Vikram Rao',   status: 'Accepted',    amount: 449 },
];

const STATUS_COLORS = {
  'In Progress': { bg: '#eff6ff', color: '#2563eb' },
  'Completed':   { bg: '#f0fdf4', color: '#16a34a' },
  'Cancelled':   { bg: '#fef2f2', color: '#ef4444' },
  'Accepted':    { bg: '#fff7ed', color: '#ea580c' },
  'Requested':   { bg: '#fdf4ff', color: '#9333ea' },
};

export default function AdminDashboard() {
  const [metrics, setMetrics]         = useState(FALLBACK_METRICS);
  const [pendingWorkers, setPending]  = useState(FALLBACK_PENDING_WORKERS);
  const [bookings]                    = useState(FALLBACK_BOOKINGS);
  const [processing, setProcessing]   = useState(null);

  useEffect(() => {
    Promise.all([api.adminDashboard(), api.pendingWorkers()])
      .then(([dash, workers]) => {
        if (dash) setMetrics(dash);
        if (workers) setPending(workers);
      })
      .catch(() => {/* use fallback */});
  }, []);

  const handleVerify = async (id) => {
    setProcessing(id);
    try {
      await api.verifyWorker(id);
    } catch { /* demo */ }
    setPending((prev) => prev.filter((w) => w.id !== id));
    setMetrics((m) => ({ ...m, pendingKyc: Math.max(0, m.pendingKyc - 1), activeWorkers: m.activeWorkers + 1 }));
    setProcessing(null);
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await api.rejectWorker(id);
    } catch { /* demo */ }
    setPending((prev) => prev.filter((w) => w.id !== id));
    setMetrics((m) => ({ ...m, pendingKyc: Math.max(0, m.pendingKyc - 1) }));
    setProcessing(null);
  };

  const metricCards = [
    { icon: '👥', label: 'Total Users',      value: metrics.totalUsers.toLocaleString('en-IN'),   color: '#2563eb', bg: '#eff6ff' },
    { icon: '👷', label: 'Active Workers',   value: metrics.activeWorkers.toLocaleString('en-IN'), color: '#16a34a', bg: '#f0fdf4' },
    { icon: '⏳', label: 'Pending KYC',      value: metrics.pendingKyc,                             color: '#d97706', bg: '#fffbeb' },
    { icon: '💰', label: 'Revenue Today',    value: `₹${(metrics.revenueToday / 1000).toFixed(1)}K`, color: '#e11d48', bg: '#fff1f2' },
  ];

  return (
    <main className="page-enter" style={{ paddingBottom: 48 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--charcoal) 0%, #292524 100%)',
        padding: '28px 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Admin Panel
            </div>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: 'white' }}>
              Fixovia Dashboard
            </h1>
          </div>
          <span style={{
            padding: '6px 14px',
            background: 'rgba(225,29,72,0.2)',
            border: '1px solid rgba(225,29,72,0.4)',
            borderRadius: 'var(--radius-full)',
            fontSize: 13,
            fontWeight: 700,
            color: '#fda4af',
          }}>
            🔴 Live
          </span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        {/* ── Metrics Row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {metricCards.map((card, i) => (
            <div
              key={card.label}
              className={`card animate-fade-in stagger-${i + 1} hover-lift`}
              style={{ padding: '20px 24px', cursor: 'default' }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-sm)',
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 12,
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: card.color, lineHeight: 1.1, marginBottom: 4 }}>
                {card.value}
              </div>
              <div style={{ fontSize: 14, color: 'var(--slate)', fontWeight: 500 }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* ── Pending Verifications ── */}
          <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--charcoal)' }}>
                Pending KYC Verifications
              </h2>
              <span className="badge-coral">{pendingWorkers.length}</span>
            </div>

            {pendingWorkers.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                ✅ All workers verified
              </div>
            ) : (
              <div>
                {pendingWorkers.map((worker, i) => (
                  <div
                    key={worker.id}
                    style={{
                      padding: '14px 20px',
                      borderBottom: i < pendingWorkers.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-stone)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--bg-stone-100)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--slate)',
                      flexShrink: 0,
                    }}>
                      {worker.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 2 }}>
                        {worker.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {worker.skill} · {worker.location} · {worker.applied}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => handleVerify(worker.id)}
                        disabled={processing === worker.id}
                        style={{
                          padding: '6px 12px',
                          background: '#f0fdf4',
                          color: '#16a34a',
                          border: '1px solid #86efac',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdf4'}
                      >
                        {processing === worker.id ? '…' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(worker.id)}
                        disabled={processing === worker.id}
                        style={{
                          padding: '6px 12px',
                          background: '#fef2f2',
                          color: '#ef4444',
                          border: '1px solid #fca5a5',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Recent Bookings ── */}
          <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--charcoal)' }}>
                Recent Bookings
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-stone)', borderBottom: '1px solid var(--border)' }}>
                    {['ID', 'Service', 'Customer', 'Worker', 'Status', 'Amount'].map((h) => (
                      <th key={h} style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontWeight: 700,
                        color: 'var(--slate)',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => {
                    const sc = STATUS_COLORS[b.status] || { bg: '#f3f4f6', color: '#374151' };
                    return (
                      <tr
                        key={b.id}
                        style={{
                          borderBottom: i < bookings.length - 1 ? '1px solid var(--border)' : 'none',
                          transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-stone)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 12px', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {b.id}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--charcoal)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {b.service}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                          {b.customer}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--slate)', whiteSpace: 'nowrap' }}>
                          {b.worker}
                        </td>
                        <td style={{ padding: '12px 12px' }}>
                          <span style={{
                            padding: '3px 9px',
                            borderRadius: 'var(--radius-full)',
                            background: sc.bg,
                            color: sc.color,
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 12px', fontWeight: 700, color: 'var(--charcoal)', whiteSpace: 'nowrap' }}>
                          ₹{b.amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){ main > div:last-child > div:last-child { grid-template-columns:1fr!important; } }`}</style>
    </main>
  );
}
