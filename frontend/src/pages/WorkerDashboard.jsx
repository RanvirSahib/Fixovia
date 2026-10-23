import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

const FALLBACK_PENDING = {
  id: 'JOB-2042',
  service: 'Wiring Repair',
  area: 'Andheri West',
  distance: 2.1,
  rate: 499,
  customerName: 'Arjun M.',
  timeLeft: 60,
};

const FALLBACK_ACTIVE = {
  id: 'JOB-2041',
  service: 'Fan Installation',
  customerName: 'Deepak S.',
  address: 'B-12, Green Residency, Malad West',
  state: 'accepted', // accepted | on_the_way | arrived | in_progress | completed
  pin: '',
  amount: 528,
};

export default function WorkerDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [pendingJob, setPendingJob] = useState(FALLBACK_PENDING);
  const [activeJob, setActiveJob]   = useState(FALLBACK_ACTIVE);
  const [timeLeft, setTimeLeft]     = useState(60);
  const [pinInput, setPinInput]     = useState('');
  const [earnings]                  = useState({ today: 1200, week: 8400, pending: 3200 });

  const timerRef = useRef(null);

  useEffect(() => {
    if (pendingJob) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPendingJob(null);
            toast.warning('Job request expired — auto-declined.');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [pendingJob]);

  const handleAccept = async () => {
    clearInterval(timerRef.current);
    try {
      await api.acceptJob(pendingJob?.id);
    } catch { /* demo */ }
    toast.success('Job accepted! Head to the customer location.');
    setActiveJob({ ...FALLBACK_ACTIVE, state: 'accepted' });
    setPendingJob(null);
  };

  const handleDecline = () => {
    clearInterval(timerRef.current);
    setPendingJob(null);
    toast.info('Job declined.');
  };

  const advanceState = async () => {
    const transitions = {
      accepted:    { next: 'on_the_way',  label: 'Marked as On the Way 🚗' },
      on_the_way:  { next: 'arrived',     label: 'Marked as Arrived ✅'   },
      in_progress: { next: 'completed',   label: 'Job Completed 🎉'         },
      completed:   null,
    };

    if (activeJob.state === 'arrived') {
      // Need PIN validation
      if (pinInput.length !== 4) {
        toast.error('Enter the 4-digit customer PIN first.');
        return;
      }
      try {
        await api.startJob(activeJob.id, pinInput);
      } catch { /* demo */ }
      setActiveJob((j) => ({ ...j, state: 'in_progress' }));
      toast.success('PIN verified! Job started. ⚡');
      setPinInput('');
      return;
    }

    const t = transitions[activeJob.state];
    if (!t) return;
    setActiveJob((j) => ({ ...j, state: t.next }));
    toast.success(t.label);
  };

  const stateButtons = {
    accepted:    { label: "I'm on the Way 🚗", next: true },
    on_the_way:  { label: "I've Arrived ✅",   next: true },
    arrived:     { label: null, requiresPin: true },
    in_progress: { label: 'Mark Complete ✓',  next: true },
    completed:   { label: null },
  };

  return (
    <main className="page-enter" style={{ paddingBottom: 40 }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d6b64 100%)',
        padding: '28px 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Partner Workspace
            </div>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: 'white' }}>
              Hey, {user?.name?.split(' ')[0] || 'Pro'}! 👋
            </h1>
          </div>
          <div style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            fontSize: 16,
            fontWeight: 800,
            color: 'white',
          }}>
            Today: ₹{earnings.today.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* ── Left ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Pending job alert */}
            {pendingJob && (
              <div
                className="card animate-pulse-border"
                style={{ padding: 24, border: '2px solid var(--primary)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'inline-block',
                      animation: 'pulseGlow 1s ease infinite',
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                      New Job Request!
                    </span>
                  </div>
                  {/* Countdown */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: timeLeft <= 10 ? '#ef4444' : 'var(--charcoal)', fontFamily: 'monospace' }}>
                      00:{String(timeLeft).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Auto-declines</div>
                    {/* Progress bar */}
                    <div style={{ width: 80, height: 4, background: 'var(--bg-stone)', borderRadius: 2, marginTop: 4 }}>
                      <div style={{
                        width: `${(timeLeft / 60) * 100}%`,
                        height: '100%',
                        background: timeLeft <= 10 ? '#ef4444' : 'var(--primary)',
                        borderRadius: 2,
                        transition: 'width 1s linear',
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-stone)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--charcoal)', marginBottom: 8 }}>
                    {pendingJob.service}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {[
                      { icon: '📍', val: `${pendingJob.area} · ${pendingJob.distance} km` },
                      { icon: '💰', val: `₹${pendingJob.rate}/visit` },
                      { icon: '👤', val: pendingJob.customerName },
                    ].map(({ icon, val }) => (
                      <span key={val} style={{ fontSize: 13, color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {icon} {val}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn-primary"
                    onClick={handleAccept}
                    style={{ flex: 2, padding: '12px' }}
                  >
                    ✓ Accept Job
                  </button>
                  <button
                    className="btn-outline"
                    onClick={handleDecline}
                    style={{ flex: 1, padding: '12px', color: 'var(--slate)' }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Active job */}
            {activeJob && activeJob.state !== 'completed' && (
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                      Active Job · #{activeJob.id}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--charcoal)', marginBottom: 4 }}>
                      {activeJob.service}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--slate)' }}>Customer: {activeJob.customerName}</p>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>📍 {activeJob.address}</p>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--charcoal)' }}>₹{activeJob.amount}</div>
                </div>

                {/* State progression */}
                <div style={{
                  padding: '12px 16px',
                  background: 'var(--primary-light)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 16,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--primary)',
                }}>
                  Current status: {activeJob.state.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>

                {/* PIN input for "arrived" state */}
                {activeJob.state === 'arrived' && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)', display: 'block', marginBottom: 8 }}>
                      Enter Customer's 4-Digit Safety PIN
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 28,
                        fontWeight: 900,
                        letterSpacing: '12px',
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        outline: 'none',
                        color: 'var(--primary)',
                        transition: 'var(--transition)',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                )}

                {/* Action button */}
                {stateButtons[activeJob.state]?.label && (
                  <button className="btn-primary" onClick={advanceState} style={{ width: '100%', padding: '14px', fontSize: 15 }}>
                    {stateButtons[activeJob.state].label}
                  </button>
                )}
                {activeJob.state === 'arrived' && (
                  <button className="btn-primary" onClick={advanceState} style={{ width: '100%', padding: '14px', fontSize: 15 }}>
                    Start Work →
                  </button>
                )}
              </div>
            )}

            {activeJob?.state === 'completed' && (
              <div className="card animate-scale-in" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: 'var(--charcoal)' }}>
                  Job Completed!
                </h2>
                <p style={{ color: 'var(--slate)', marginBottom: 16 }}>
                  Great work! ₹{activeJob.amount} will be credited to your wallet.
                </p>
                <span className="badge-green">Payment Pending</span>
              </div>
            )}

            {!pendingJob && !activeJob && (
              <div style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'var(--white)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No active jobs</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>New job requests will appear here.</p>
              </div>
            )}
          </div>

          {/* ── Wallet Card ── */}
          <div>
            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #0f766e 0%, #0d6b64 100%)', border: 'none', position: 'sticky', top: 90 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
                Partner Wallet
              </h3>
              {[
                { label: 'Today', amount: earnings.today, sub: 'Earned' },
                { label: 'This Week', amount: earnings.week, sub: 'Total' },
                { label: 'Pending Payout', amount: earnings.pending, sub: 'Processing' },
              ].map((item, i) => (
                <div key={item.label} style={{
                  marginBottom: i < 2 ? 16 : 0,
                  paddingBottom: i < 2 ? 16 : 0,
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.8)',
                    }}>
                      {item.sub}
                    </span>
                  </div>
                </div>
              ))}
              <button style={{
                width: '100%',
                marginTop: 20,
                padding: '12px',
                background: 'white',
                color: 'var(--teal)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}>
                Withdraw to Bank →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media(max-width:768px){ main > div:last-child > div > div { grid-template-columns:1fr!important; } }
      `}</style>
    </main>
  );
}
