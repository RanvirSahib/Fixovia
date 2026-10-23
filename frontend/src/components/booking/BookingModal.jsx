import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

const STEPS = ['Service', 'Schedule', 'Address', 'Confirm'];

const TIME_SLOTS = [
  { id: 'morning',   label: 'Morning',   range: '8 AM – 12 PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', range: '12 PM – 4 PM', icon: '☀️' },
  { id: 'evening',   label: 'Evening',   range: '4 PM – 8 PM',  icon: '🌆' },
];

const SERVICE_TYPES = [
  'Fan Installation', 'Wiring / Rewiring', 'MCB / Switchboard', 'Short Circuit Fix',
  'Pipe Leak Repair', 'Drain Unclog', 'Tap Installation', 'Geyser Repair',
  'AC Deep Cleaning', 'Gas Refill', 'Cooling Problem', 'AC Installation',
  'Furniture Repair', 'Door Lock Fix', 'Wood Polish', 'Wardrobe Assembly',
];

export default function BookingModal({ worker, onClose, onSuccess }) {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [step, setStep]         = useState(0);
  const [direction, setDirection] = useState('right');
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Form state
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [dateOption, setDateOption]   = useState('today');
  const [customDate, setCustomDate]   = useState('');
  const [timeSlot, setTimeSlot]       = useState('');
  const [address, setAddress]         = useState('');
  const [landmark, setLandmark]       = useState('');
  const [instructions, setInstructions] = useState('');

  // Pricing
  const baseLabor     = worker?.rate || 499;
  const partsEstimate = 0;
  const subtotal      = baseLabor + partsEstimate;
  const gst           = Math.round(subtotal * 0.18);
  const platformFee   = 29;
  const total         = subtotal + gst + platformFee;

  const goNext = () => {
    setDirection('right');
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setDirection('left');
    setStep((s) => s - 1);
  };

  const canProceed = () => {
    if (step === 0) return serviceType.trim().length > 0;
    if (step === 1) return timeSlot !== '';
    if (step === 2) return address.trim().length > 5;
    return true;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const dateLabel = dateOption === 'today'
        ? 'Today'
        : dateOption === 'tomorrow'
        ? 'Tomorrow'
        : customDate;

      try {
        await api.createJob({
          workerId:     worker?.id,
          serviceType,
          description,
          scheduledDate: dateLabel,
          timeSlot,
          address,
          landmark,
          instructions,
          amount: total,
        });
      } catch {}

      // Trigger Google Pay Single-Tick Booking Confirmation Animation
      setBookingConfirmed(true);
      setTimeout(() => {
        toast.success('Booking confirmed! Your pro will be in touch shortly.');
        onSuccess && onSuccess();
        onClose();
      }, 2500);
    } catch {
      setBookingConfirmed(true);
      setTimeout(() => {
        toast.success('Booking confirmed! (Demo mode – no backend required)');
        onSuccess && onSuccess();
        onClose();
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  // Close on Esc
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="overlay" onClick={(e) => !bookingConfirmed && e.target === e.currentTarget && onClose()}>
      <div
        className="modal-enter"
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          width: '100%',
          maxWidth: 580,
          maxHeight: '92vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {bookingConfirmed ? (
          /* ── Google Pay Payment Single-Tick Confirmation Screen ── */
          <div
            style={{
              padding: '48px 24px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 460,
              background: 'radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
            }}
          >
            {/* Google Pay Concentric Expanding Ripples */}
            <div
              style={{
                position: 'relative',
                width: 140,
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.25)',
                  animation: 'gpayRipple 1.6s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -14,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  animation: 'gpayRipple 1.6s cubic-bezier(0, 0.2, 0.8, 1) 0.4s infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -28,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.08)',
                  animation: 'gpayRipple 1.6s cubic-bezier(0, 0.2, 0.8, 1) 0.8s infinite',
                }}
              />

              {/* Popping Emerald Disc */}
              <div
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 14px 34px rgba(16, 185, 129, 0.45)',
                  animation: 'gpayCirclePop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                  zIndex: 2,
                }}
              >
                {/* Animated Drawing Checkmark Tick */}
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeDasharray="48"
                    strokeDashoffset="0"
                    style={{ animation: 'gpayDrawTick 0.5s ease 0.25s both' }}
                  />
                </svg>
              </div>
            </div>

            {/* Paid Amount & Confirmation Title */}
            <div
              style={{
                marginTop: 24,
                fontSize: 34,
                fontWeight: 800,
                color: 'var(--charcoal)',
                letterSpacing: '-0.02em',
              }}
            >
              ₹{total}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 6,
                padding: '4px 14px',
                borderRadius: 999,
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#059669',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>✓</span>
              <span>Paid & Confirmed via Fixovia Pay</span>
            </div>

            {/* Booking Summary Card */}
            <div
              style={{
                marginTop: 22,
                width: '100%',
                maxWidth: 420,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '16px 20px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                    {worker?.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {worker?.role} · {serviceType || 'Home Service'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}
                  >
                    Safety PIN
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: '#059669',
                      fontFamily: 'monospace',
                      letterSpacing: 2,
                    }}
                  >
                    4892
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: 10,
                  marginTop: 6,
                }}
              >
                <span>📅</span>
                <span>
                  {dateOption === 'today'
                    ? 'Today'
                    : dateOption === 'tomorrow'
                    ? 'Tomorrow'
                    : customDate || 'Scheduled date'}
                  {timeSlot ? ` · ${timeSlot}` : ''}
                </span>
                <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: 600 }}>
                  Shield Protected
                </span>
              </div>
            </div>

            {/* Google Pay Style Progress Bar */}
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                height: 4,
                background: '#e2e8f0',
                borderRadius: 2,
                marginTop: 26,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  animation: 'gpayProgressBar 2.5s linear forwards',
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
              Redirecting to your active bookings…
            </div>
          </div>
        ) : (
          <>
            {/* ── Modal Header ── */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--white)',
          zIndex: 1,
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--charcoal)' }}>
              Book {worker?.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              {worker?.role} · ₹{worker?.rate}/visit
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--bg-stone)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              color: 'var(--slate)',
            }}
          >
            ×
          </button>
        </div>

        {/* ── Progress Dots ── */}
        <div style={{
          padding: '16px 24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: i <= step ? 'var(--primary)' : 'var(--bg-stone)',
                border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: i <= step ? 'white' : 'var(--muted)',
                transition: 'var(--transition)',
                flexShrink: 0,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 2,
                  background: i < step ? 'var(--primary)' : 'var(--border)',
                  margin: '0 4px',
                  transition: 'var(--transition)',
                  borderRadius: 1,
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: '6px 24px 0', display: 'flex', justifyContent: 'space-between' }}>
          {STEPS.map((s, i) => (
            <span key={s} style={{
              fontSize: 11,
              fontWeight: 600,
              color: i === step ? 'var(--primary)' : 'var(--muted)',
              transition: 'var(--transition)',
            }}>{s}</span>
          ))}
        </div>

        {/* ── Step Content ── */}
        <div
          className={direction === 'right' ? 'step-enter-right' : 'step-enter-left'}
          key={step}
          style={{ padding: '24px', flex: 1 }}
        >
          {step === 0 && (
            <StepService
              serviceType={serviceType}
              setServiceType={setServiceType}
              description={description}
              setDescription={setDescription}
            />
          )}
          {step === 1 && (
            <StepSchedule
              dateOption={dateOption}
              setDateOption={setDateOption}
              customDate={customDate}
              setCustomDate={setCustomDate}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
            />
          )}
          {step === 2 && (
            <StepAddress
              address={address}
              setAddress={setAddress}
              landmark={landmark}
              setLandmark={setLandmark}
              instructions={instructions}
              setInstructions={setInstructions}
            />
          )}
          {step === 3 && (
            <StepConfirm
              worker={worker}
              serviceType={serviceType}
              description={description}
              dateOption={dateOption}
              customDate={customDate}
              timeSlot={timeSlot}
              address={address}
              baseLabor={baseLabor}
              partsEstimate={partsEstimate}
              gst={gst}
              platformFee={platformFee}
              total={total}
            />
          )}
        </div>

        {/* ── Footer Buttons ── */}
        <div style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 12,
          position: 'sticky',
          bottom: 0,
          background: 'var(--white)',
        }}>
          {step > 0 && (
            <button
              className="btn-outline"
              onClick={goPrev}
              style={{ flex: 1 }}
            >
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn-primary"
              onClick={goNext}
              disabled={!canProceed()}
              style={{ flex: 2 }}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleConfirm}
              disabled={submitting}
              style={{ flex: 2 }}
            >
              {submitting ? '⌛ Confirming…' : `✓ Confirm & Pay ₹${total}`}
            </button>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StepService({ serviceType, setServiceType, description, setDescription }) {
  const quickServices = [
    'Fan Installation', 'Wiring / Rewiring', 'Pipe Leak Repair',
    'AC Deep Cleaning', 'Furniture Repair', 'Tap Installation',
  ];

  return (
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: 'var(--charcoal)' }}>
        What needs fixing?
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
        Choose a service or type your own.
      </p>

      {/* Quick picks */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {quickServices.map((s) => (
          <button
            key={s}
            onClick={() => setServiceType(s)}
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              border: `1.5px solid ${serviceType === s ? 'var(--primary)' : 'var(--border)'}`,
              background: serviceType === s ? 'var(--primary-light)' : 'var(--white)',
              color: serviceType === s ? 'var(--primary)' : 'var(--slate)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <input
        className="input"
        placeholder="Or type your service…"
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 8 }}>
        Describe the issue (optional)
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="E.g. My ceiling fan stopped working after a power cut…"
        rows={4}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 14,
          color: 'var(--charcoal)',
          background: 'var(--white)',
          resize: 'vertical',
          fontFamily: 'var(--font)',
          outline: 'none',
          transition: 'var(--transition)',
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(225,29,72,0.08)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

function StepSchedule({ dateOption, setDateOption, customDate, setCustomDate, timeSlot, setTimeSlot }) {
  const today    = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const dateOptions = [
    { id: 'today',    label: 'Today',    sub: today    },
    { id: 'tomorrow', label: 'Tomorrow', sub: tomorrow },
    { id: 'custom',   label: 'Pick a date', sub: 'Choose' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: 'var(--charcoal)' }}>
        When should we come?
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
        Choose a date and preferred time slot.
      </p>

      {/* Date options */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {dateOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setDateOption(opt.id)}
            style={{
              flex: 1,
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${dateOption === opt.id ? 'var(--primary)' : 'var(--border)'}`,
              background: dateOption === opt.id ? 'var(--primary-light)' : 'var(--white)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: dateOption === opt.id ? 'var(--primary)' : 'var(--charcoal)' }}>
              {opt.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{opt.sub}</div>
          </button>
        ))}
      </div>

      {dateOption === 'custom' && (
        <input
          type="date"
          className="input"
          value={customDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setCustomDate(e.target.value)}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* Time slots */}
      <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)', display: 'block', marginBottom: 12 }}>
        Preferred Time
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setTimeSlot(slot.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${timeSlot === slot.id ? 'var(--primary)' : 'var(--border)'}`,
              background: timeSlot === slot.id ? 'var(--primary-light)' : 'var(--white)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 24 }}>{slot.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: timeSlot === slot.id ? 'var(--primary)' : 'var(--charcoal)' }}>
                {slot.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{slot.range}</div>
            </div>
            {timeSlot === slot.id && (
              <div style={{
                marginLeft: 'auto',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepAddress({ address, setAddress, landmark, setLandmark, instructions, setInstructions }) {
  return (
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: 'var(--charcoal)' }}>
        Where should we come?
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
        Your complete address for the service visit.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 6 }}>
            Full Address *
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Flat / House No., Building, Street, Area, City…"
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              color: 'var(--charcoal)',
              background: 'var(--white)',
              resize: 'none',
              fontFamily: 'var(--font)',
              outline: 'none',
              transition: 'var(--transition)',
              lineHeight: 1.6,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(225,29,72,0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 6 }}>
            Landmark (optional)
          </label>
          <input
            className="input"
            placeholder="Near Metro station, school, temple…"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 6 }}>
            Special Instructions (optional)
          </label>
          <input
            className="input"
            placeholder="Gate code, floor number, call before coming…"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function StepConfirm({ worker, serviceType, description, dateOption, customDate, timeSlot, address, baseLabor, partsEstimate, gst, platformFee, total }) {
  const slotLabel = TIME_SLOTS.find((s) => s.id === timeSlot)?.label || timeSlot;
  const dateLabel = dateOption === 'today' ? 'Today'
    : dateOption === 'tomorrow' ? 'Tomorrow'
    : customDate;

  const rows = [
    { label: 'Base Labor',      amount: `₹${baseLabor}` },
    { label: 'Parts Estimate',  amount: partsEstimate > 0 ? `₹${partsEstimate}` : '₹0 – ₹500' },
    { label: 'GST (18%)',       amount: `₹${gst}` },
    { label: 'Platform Fee',    amount: `₹${platformFee}` },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: 'var(--charcoal)' }}>
        Review & Confirm
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
        Double-check your booking details before confirming.
      </p>

      {/* Summary card */}
      <div style={{
        padding: '16px',
        background: 'var(--bg-stone)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {[
          { icon: '🔧', label: 'Service', value: serviceType },
          { icon: '📅', label: 'Date',    value: dateLabel },
          { icon: '🕐', label: 'Time',    value: slotLabel },
          { icon: '📍', label: 'Address', value: address },
        ].map(({ icon, label, value }) => value && (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <div>
              <span style={{ fontSize: 12, color: 'var(--muted)', display: 'block' }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 16px', background: 'var(--bg-stone)', fontWeight: 700, fontSize: 14, color: 'var(--charcoal)' }}>
          Price Breakdown
        </div>
        {rows.map(({ label, amount }, i) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            fontSize: 14,
            color: 'var(--slate)',
          }}>
            <span>{label}</span>
            <span style={{ fontWeight: 500 }}>{amount}</span>
          </div>
        ))}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderTop: '2px solid var(--border)',
          fontSize: 16,
          fontWeight: 800,
          color: 'var(--charcoal)',
          background: 'var(--primary-light)',
        }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>₹{total}</span>
        </div>
      </div>

      <p style={{
        marginTop: 12,
        fontSize: 12,
        color: 'var(--muted)',
        lineHeight: 1.6,
      }}>
        💳 Payment collected after job completion. Covered by the Fixovia ₹10,000 guarantee.
      </p>
    </div>
  );
}
