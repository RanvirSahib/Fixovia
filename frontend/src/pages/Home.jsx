import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SceneSvg from '../components/discovery/SceneSvg';
import BookingModal from '../components/booking/BookingModal';

export default function Home({ onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();
  const [bookingTrade, setBookingTrade] = useState(null);
  
  // Interactive Safety PIN Demo state
  const [pinVerified, setPinVerified] = useState(false);

  // Interactive Pricing Calculator state
  const [labor, setLabor] = useState(499);
  const [parts, setParts] = useState(300);

  const subtotal = labor + parts;
  const gst = Math.round(subtotal * 0.18);
  const protectionFee = 29;
  const total = subtotal + gst + protectionFee;

  const formatRs = (num) => '₹' + num.toLocaleString('en-IN');

  const openBookingForTrade = (tradeName, baseRate) => {
    if (!user) {
      toast.info('Please sign in or create an account to book a verified pro 🔒');
      onNavigate('auth');
      return;
    }
    setBookingTrade({
      id: tradeName.toLowerCase().replace(/\s+/g, '-'),
      name: `Fixovia Verified ${tradeName} Specialist`,
      role: tradeName,
      rate: baseRate,
      skills: [tradeName, 'Inspection', 'Doorstep Repair', 'Warranty Guarantee'],
      initials: tradeName.substring(0, 2).toUpperCase(),
      color: '#0d56cb',
    });
  };

  // ── Scroll Reveal Intersection Observer (Loads only when user scrolls into view) ──
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.rev').forEach(el => el.classList.add('show'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Unobserve so once revealed on this visit, it stays loaded!
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.rev');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-enter">
      {/* ── 1. Hero Section ── */}
      <header className="hero" id="top">
        <div className="wrap">
          <div>
            <p className="hand in">Fixed today. Trusted always.</p>
            <h1 className="in">
              <span>Repairs done right,</span>
              <span>by someone you</span>
              <span>can verify.</span>
            </h1>
            <p className="lead in">
              Fixovia sends background-checked electricians, plumbers, AC technicians and carpenters to your door, with upfront prices and a safety PIN that proves who walked in.
            </p>
            <div className="cta in">
              <button
                className="btn p"
                onClick={() => openBookingForTrade('Electrical', 199)}
              >
                Book a pro now
              </button>
              <a className="btn g" href="#how">
                See how it works
              </a>
            </div>
            <div className="chips in">
              <b>Starts at ₹199</b>
              <b>Matched in 60 seconds</b>
              <b>₹10,000 damage cover</b>
            </div>
          </div>

          <div className="in hero-scene-col">
            <SceneSvg />
          </div>
        </div>
      </header>

      {/* ── 2. Animated Marquee Ribbon ── */}
      <div className="mq" aria-hidden="true">
        <div>
          <span>Electrical <em>⚡</em></span>
          <span>Plumbing <em>🔧</em></span>
          <span>AC repair <em>❄️</em></span>
          <span>Carpentry <em>🔨</em></span>
          <span>Electrical <em>⚡</em></span>
          <span>Plumbing <em>🔧</em></span>
          <span>AC repair <em>❄️</em></span>
          <span>Carpentry <em>🔨</em></span>
          <span>Electrical <em>⚡</em></span>
          <span>Plumbing <em>🔧</em></span>
          <span>AC repair <em>❄️</em></span>
          <span>Carpentry <em>🔨</em></span>
        </div>
      </div>

      {/* ── 3. Four Trades (Services) ── */}
      <section id="services">
        <div className="wrap">
          <div className="head rev">
            <p className="hand">Four trades, done properly</p>
            <h2>The repairs you can’t put off</h2>
            <p>Fixed rates for common jobs, so you know the cost before anyone picks up a tool.</p>
          </div>

          <div className="grid4">
            {/* Electrical */}
            <article className="svc rev">
              <svg viewBox="0 0 300 150" aria-hidden="true">
                <rect width="300" height="150" fill="#fef3c7"/>
                <rect x="95" y="25" width="110" height="100" rx="14" fill="#fff" stroke="#f97316" strokeWidth="3"/>
                <circle cx="125" cy="62" r="9" fill="#e7e5e4"/>
                <circle cx="175" cy="62" r="9" fill="#e7e5e4"/>
                <rect x="118" y="92" width="64" height="14" rx="7" fill="#f97316"/>
                <g className="spark">
                  <path d="M240 30l-16 32h13l-7 30 26-38h-15l9-24z" fill="#f97316"/>
                </g>
              </svg>
              <div>
                <h3>Electrical</h3>
                <p>Switchboards, MCB tripping, fans, short circuits and inverter wiring.</p>
                <span className="price">₹199 inspection</span>
                <span className="w">30-day rework warranty</span>
                <button
                  className="btn sm p"
                  style={{ marginTop: 14 }}
                  onClick={() => openBookingForTrade('Electrician', 199)}
                >
                  Book Electrician ➔
                </button>
              </div>
            </article>

            {/* Plumbing */}
            <article className="svc rev">
              <svg viewBox="0 0 300 150" aria-hidden="true">
                <rect width="300" height="150" fill="#e0f2fe"/>
                <path d="M0 60h150v26h-26v38" stroke="#14b0b8" strokeWidth="16" fill="none" strokeLinejoin="round"/>
                <circle className="drip" cx="137" cy="100" r="7" fill="#38bdf8"/>
                <circle className="drip" style={{ animationDelay: '0.9s' }} cx="137" cy="100" r="5" fill="#38bdf8"/>
                <rect x="190" y="95" width="80" height="14" rx="7" fill="#57534e" transform="rotate(-30 230 102)"/>
              </svg>
              <div>
                <h3>Plumbing</h3>
                <p>Tap leaks, blocked drains, pipe fittings, geysers and sanitary repairs.</p>
                <span className="price">₹199 inspection</span>
                <span className="w">30-day rework warranty</span>
                <button
                  className="btn sm p"
                  style={{ marginTop: 14 }}
                  onClick={() => openBookingForTrade('Plumber', 199)}
                >
                  Book Plumber ➔
                </button>
              </div>
            </article>

            {/* AC repair */}
            <article className="svc rev">
              <svg viewBox="0 0 300 150" aria-hidden="true">
                <rect width="300" height="150" fill="#cfe3ff"/>
                <rect x="40" y="38" width="220" height="56" rx="16" fill="#fff" stroke="#14b0b8" strokeWidth="3"/>
                <rect x="60" y="76" width="180" height="8" rx="4" fill="#9ec5ff"/>
                <g className="spin" style={{ animationDuration: '14s' }}>
                  <path d="M150 112v28M136 118l28 16M164 118l-28 16" stroke="#14b0b8" strokeWidth="4" strokeLinecap="round"/>
                </g>
              </svg>
              <div>
                <h3>AC repair</h3>
                <p>Jet-pump foam cleaning, gas recharge, compressor and cooling checks.</p>
                <span className="price">₹499 diagnostic</span>
                <span className="w">60-day cooling warranty</span>
                <button
                  className="btn sm p"
                  style={{ marginTop: 14 }}
                  onClick={() => openBookingForTrade('AC Technician', 499)}
                >
                  Book AC Tech ➔
                </button>
              </div>
            </article>

            {/* Carpentry */}
            <article className="svc rev">
              <svg viewBox="0 0 300 150" aria-hidden="true">
                <rect width="300" height="150" fill="#ffedd5"/>
                <rect x="95" y="20" width="110" height="120" rx="8" fill="#0d56cb"/>
                <rect x="108" y="34" width="84" height="92" rx="4" fill="#f97316"/>
                <circle cx="182" cy="82" r="6" fill="#f97316"/>
                <g className="swing">
                  <rect x="230" y="30" width="12" height="60" rx="5" fill="#57534e"/>
                  <rect x="220" y="24" width="34" height="14" rx="5" fill="#f97316"/>
                </g>
              </svg>
              <div>
                <h3>Carpentry</h3>
                <p>Door locks, hinges, furniture assembly, wardrobe alignment and polish.</p>
                <span className="price">₹249 visit</span>
                <span className="w">30-day rework warranty</span>
                <button
                  className="btn sm p"
                  style={{ marginTop: 14 }}
                  onClick={() => openBookingForTrade('Carpenter', 249)}
                >
                  Book Carpenter ➔
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works ── */}
      <section className="steps" id="how">
        <div className="wrap">
          <div className="head rev">
            <p className="hand">From tap to fixed</p>
            <h2>Four steps, no phone tag</h2>
          </div>
          <div className="stlist">
            <div className="st rev">
              <h3>Tell us the problem</h3>
              <p>Pick a service, describe the issue, choose a slot and share your address.</p>
            </div>
            <div className="st rev">
              <h3>Choose your pro</h3>
              <p>Browse rated technicians yourself, or tap Instant Auto-Match for the best nearby one.</p>
            </div>
            <div className="st rev">
              <h3>Share your PIN</h3>
              <p>Your pro arrives, you give them the 4-digit PIN, and only then does work begin.</p>
            </div>
            <div className="st rev">
              <h3>Pay and rate</h3>
              <p>Check the work, pay the itemized bill, rate your pro and download the GST receipt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Safety PIN Section ── */}
      <section className="otp" id="safety">
        <div className="wrap">
          <div className="phone rev rev-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--line)' }}>
              <img src="/fixovia-app-icon.png" alt="Fixovia App" style={{ width: '36px', height: '36px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(13,86,203,0.3)' }} />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2 }}>Fixovia Customer App</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: 600 }}>Active Order #FX-4827 • Verified</div>
              </div>
            </div>
            <small>Your safety PIN</small>
            <div className={`pin ${pinVerified ? 'on' : ''}`} id="pin">
              <b>4</b>
              <b>8</b>
              <b>2</b>
              <b>7</b>
            </div>
            <div className="ok" id="ok">
              {pinVerified ? 'PIN verified. Work can begin. ✓' : ''}
            </div>
            <button
              className="btn p"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => setPinVerified(prev => !prev)}
            >
              {pinVerified ? 'Reset Demo' : 'Pro has arrived'}
            </button>
          </div>

          <div className="rev rev-right">
            <p className="hand">Know who’s at the door</p>
            <h2>No PIN, no work</h2>
            <ul>
              <li>A unique 4-digit PIN appears only on your app when a pro accepts.</li>
              <li>The technician must enter it at your doorstep before the job can start.</li>
              <li>Every pro passes a 7-point check: government ID, criminal screening and a practical skills test.</li>
            </ul>
            <button
              className="btn g"
              onClick={() => openBookingForTrade('Electrical', 199)}
            >
              Book a verified pro
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. Pricing Calculator ── */}
      <section className="pr" id="pricing">
        <div className="wrap">
          <div className="rev rev-left">
            <p className="hand">See the bill before you book</p>
            <h2>Pricing with nothing tucked away</h2>
            <p style={{ color: 'var(--slate)', marginTop: '14px', lineHeight: 1.6 }}>
              Labor, parts, 18% GST and a flat ₹29 protection fee. Move the sliders to see your total.
            </p>
          </div>

          <div className="bill rev rev-right">
            <label>
              Base labor <b>{formatRs(labor)}</b>
            </label>
            <input
              type="range"
              min="199"
              max="2000"
              step="50"
              value={labor}
              onChange={(e) => setLabor(Number(e.target.value))}
              aria-label="Base labor"
            />

            <label>
              Parts estimate <b>{formatRs(parts)}</b>
            </label>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={parts}
              onChange={(e) => setParts(Number(e.target.value))}
              aria-label="Parts estimate"
            />

            <div className="row">
              <span>Subtotal</span>
              <span>{formatRs(subtotal)}</span>
            </div>
            <div className="row">
              <span>GST (18%)</span>
              <span>{formatRs(gst)}</span>
            </div>
            <div className="row">
              <span>Fixovia protection fee</span>
              <span>₹29</span>
            </div>
            <div className="row t">
              <span>Total</span>
              <span>{formatRs(total)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. The Fixovia Cover ── */}
      <section>
        <div className="wrap">
          <div className="head rev">
            <p className="hand">The Fixovia Cover</p>
            <h2>If something goes wrong, we’re on the hook</h2>
          </div>
          <div className="tr">
            <div className="tc rev">
              <div className="big">₹10,000</div>
              <h3>Damage protection</h3>
              <p>Every booking is covered against accidental damage during the job.</p>
            </div>
            <div className="tc rev">
              <div className="big">60 days</div>
              <h3>Rework warranty</h3>
              <p>30 days on electrical, plumbing and carpentry, 60 days on AC cooling repairs.</p>
            </div>
            <div className="tc rev">
              <div className="big">60 sec</div>
              <h3>Instant dispatch</h3>
              <p>Auto-Match sends the highest-rated nearby pro, and you track them live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Customer Testimonials ── */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head rev">
            <p className="hand">Kind words</p>
            <h2>Homes that got fixed</h2>
          </div>
          <div className="rv">
            <figure className="q rev">
              <p>“The PIN made my mother feel safe. The plumber was polite and the leak was gone in an hour.”</p>
              <span>Neha, Gurugram</span>
            </figure>
            <figure className="q rev">
              <p>“The price on the app was the price I paid. No haggling at the door.”</p>
              <span>Arjun, Bengaluru</span>
            </figure>
            <figure className="q rev">
              <p>“My AC was blowing warm air at 10 pm. A technician was there before midnight.”</p>
              <span>Farah, Hyderabad</span>
            </figure>
          </div>
        </div>
      </section>

      {/* ── 9. Final Call to Action ── */}
      <section style={{ paddingTop: '30px' }} id="book">
        <div className="wrap">
          <div className="final rev rev-scale">
            <p className="hand">Something broken?</p>
            <h2>Get a verified pro today</h2>
            <p>Book in under two minutes. Pay only after you’ve checked the work.</p>
            <button
              className="btn"
              onClick={() => openBookingForTrade('Electrical', 199)}
            >
              Book a pro now
            </button>
          </div>
        </div>
      </section>

      {/* ── Booking Modal (when triggered) ── */}
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
    </main>
  );
}
