import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const JOB_STATES = ['Requested', 'Accepted', 'On the Way', 'Arrived', 'In Progress', 'Completed'];

const FALLBACK_ACTIVE = {
  id: 'JOB-2041',
  service: 'Fan Installation',
  worker: 'Raj Kumar',
  workerRole: 'Electrician',
  state: 2, // 0-indexed: "On the Way"
  safetyPin: '7392',
  amount: 528,
  scheduledTime: 'Today, 3:00 PM – 7:00 PM',
};

const FALLBACK_HISTORY = [
  { id: 'JOB-1985', service: 'Pipe Leak Repair', worker: 'Sanjay Verma', date: '18 Oct 2026', amount: 479, rating: 5 },
  { id: 'JOB-1840', service: 'AC Deep Cleaning', worker: 'Priya Sharma', date: '5 Oct 2026',  amount: 699, rating: 5 },
  { id: 'JOB-1722', service: 'MCB Switchboard Repair', worker: 'Raj Kumar', date: '22 Sep 2026', amount: 528, rating: 4 },
];

function StarRating({ value = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < value ? '#f59e0b' : '#e5e7eb', fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('active');
  const [job, setJob] = useState(FALLBACK_ACTIVE);
  const [history, setHistory] = useState(FALLBACK_HISTORY);

  useEffect(() => {
    api.customerJobs().then((data) => {
      if (data?.active)  setJob(data.active);
      if (data?.history) setHistory(data.history);
    }).catch(() => {/* use fallback */});
  }, []);

  return (
    <main className="page-enter" style={{ paddingBottom: 40 }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #fff8f5 0%, #fafaf9 100%)',
        padding: '32px 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            My Bookings
          </h1>
          <p style={{ color: 'var(--slate)' }}>Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        {/* ── Tabs ── */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'var(--bg-stone-100)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          width: 'fit-content',
          marginBottom: 28,
        }}>
          {['active', 'history'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: tab === t ? 'var(--white)' : 'transparent',
                color: tab === t ? 'var(--charcoal)' : 'var(--slate)',
                fontWeight: tab === t ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {t === 'active' ? '🔵 Active' : '📋 History'}
            </button>
          ))}
        </div>

        {tab === 'active' && (
          <div className="animate-fade-in">
            {job ? (
              <div style={{ maxWidth: 680 }}>
                <div className="card" style={{ padding: 28 }}>
                  {/* Job Title */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                        Booking #{job.id}
                      </div>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--charcoal)', marginBottom: 4 }}>
                        {job.service}
                      </h2>
                      <p style={{ fontSize: 14, color: 'var(--slate)' }}>
                        with <strong>{job.worker}</strong> · {job.workerRole}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--charcoal)' }}>₹{job.amount}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{job.scheduledTime}</div>
                    </div>
                  </div>

                  {/* Progress Stepper */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      {JOB_STATES.map((state, i) => {
                        const isActive   = i === job.state;
                        const isDone     = i < job.state;
                        const isFuture   = i > job.state;
                        return (
                          <div key={state} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {/* Connector line */}
                            {i > 0 && (
                              <div style={{
                                position: 'absolute',
                                top: 14,
                                right: '50%',
                                left: '-50%',
                                height: 2,
                                background: isDone || isActive ? 'var(--primary)' : 'var(--border)',
                                zIndex: 0,
                                transition: 'var(--transition)',
                              }} />
                            )}
                            {/* Circle */}
                            <div
                              className={isActive ? 'animate-pulse-border' : ''}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                background: isDone ? 'var(--primary)' : isActive ? 'var(--primary)' : 'var(--white)',
                                border: `2px solid ${isDone || isActive ? 'var(--primary)' : 'var(--border)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 700,
                                color: isDone || isActive ? 'white' : 'var(--muted)',
                                zIndex: 1,
                                position: 'relative',
                                transition: 'var(--transition)',
                                flexShrink: 0,
                              }}
                            >
                              {isDone ? '✓' : i + 1}
                            </div>
                            <div style={{
                              fontSize: 10,
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? 'var(--primary)' : isDone ? 'var(--charcoal)' : 'var(--muted)',
                              marginTop: 6,
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}>
                              {state}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Safety PIN */}
                  {job.state >= 1 && (
                    <div style={{
                      padding: '16px 20px',
                      background: 'var(--primary-light)',
                      border: '1.5px solid rgba(225,29,72,0.2)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          🔑 Safety PIN — Share with your Pro only
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--slate)' }}>
                          Worker will scan or type this to start the job
                        </div>
                      </div>
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: 36,
                        fontWeight: 900,
                        letterSpacing: '8px',
                        color: 'var(--primary)',
                      }}>
                        {job.safetyPin}
                      </div>
                    </div>
                  )}

                  {/* Cancel button */}
                  {job.state === 0 && (
                    <button
                      className="btn-outline"
                      style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border)',
                maxWidth: 480,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No active bookings</h3>
                <p style={{ color: 'var(--slate)', marginBottom: 20 }}>
                  You don't have any ongoing jobs right now.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="animate-fade-in" style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {history.map((item) => (
                <div key={item.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                        {item.id} · {item.date}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 4 }}>
                        {item.service}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 8 }}>
                        by {item.worker}
                      </div>
                      <StarRating value={item.rating} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--charcoal)' }}>₹{item.amount}</div>
                      <span className="badge-green" style={{ marginTop: 6 }}>Completed</span>
                    </div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>
                      📄 View Receipt
                    </button>
                    <button className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
                      ⭐ Rate & Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
