import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BookingModal from '../components/booking/BookingModal';

const SERVICES_DATA = [
  {
    id: 'electrical',
    name: 'Electrical Repairs & Wiring',
    icon: '⚡',
    tagline: 'Precision electrical work by licensed master wiremen.',
    color: '#0d56cb',
    lightBg: '#eff6ff',
    badge: 'Popular',
    baseRate: 499,
    eta: '15-25 Mins',
    overview:
      'From tripping circuit breakers and sparking switchboards to complete concealed conduit rewiring, our certified electricians diagnose and resolve dangerous faults safely using calibrated testing equipment.',
    features: [
      'Complete MCB distribution box troubleshooting & replacement',
      'Short-circuit isolation & concealed wire fault detection',
      'Ceiling fan, chandelier, and modern smart light fixture installation',
      'Inverter battery setup, heavy appliance earthing, and surge defense',
      'Heavy appliance 16A power socket installation & load balancing',
    ],
    pricingTiers: [
      { name: 'Inspection & Minor Fix', price: '₹199', detail: 'Diagnosing faults, socket/switch replacement' },
      { name: 'Standard Repair', price: '₹499', detail: 'Fan overhaul, MCB replacement, circuit isolation' },
      { name: 'Heavy Installation', price: '₹899+', detail: 'Inverter setup, complete room rewiring, chandelier' },
    ],
    included: ['Certified master electrician', 'Digital safety testing', 'Cleanup of wire debris', '30-Day rework warranty'],
    excluded: ['Cost of brand new copper wires or MCB units', 'Civil wall plastering beyond wire grooves'],
    review: {
      text: 'Raj arrived in 18 minutes with a digital multimeter, detected a hidden neutral loop behind the kitchen tiles, and resolved it safely.',
      author: 'Sunita Sharma',
      location: 'Model Town, Ludhiana, Punjab',
      rating: 5,
    },
  },
  {
    id: 'plumbing',
    name: 'Plumbing & Water Systems',
    icon: '🔧',
    tagline: 'Zero-drip piping, geysers, leak repair, and drainage solutions.',
    color: '#0b7a82',
    lightBg: '#f0fdfa',
    badge: 'High Demand',
    baseRate: 450,
    eta: '15-30 Mins',
    overview:
      'Water damage happens fast. Our professional plumbers arrive equipped with heavy-duty pipe wrenches, pressure gauges, and drain snakes to cure leaking taps, low shower pressure, blockages, and geyser installations.',
    features: [
      'High-pressure rotary drain declogging (kitchen sinks & main sewers)',
      'Concealed pipe wall acoustic leak detection & joint re-threading',
      'Instant & storage water heater (geyser) installation and descaling',
      'Modern sanitary fixture fitting (wall-hung WCs, diverters, faucets)',
      'Overhead water tank float valve, booster pump, and overflow repair',
    ],
    pricingTiers: [
      { name: 'Inspection & Tap Repair', price: '₹199', detail: 'Washer replacement, tap tightening, minor leak' },
      { name: 'Drainage & Clog Fix', price: '₹450', detail: 'Sink/commode unclogging with motorized snake' },
      { name: 'Geyser & Pipe Overhaul', price: '₹799+', detail: 'Water heater mounting, complete bathroom piping' },
    ],
    included: ['Pressure testing before departure', 'Teflon tape & standard sealing seals', '30-Day leak-free guarantee'],
    excluded: ['Sanitary ware hardware (taps, geysers, basins)', 'Core drilling through structural concrete'],
    review: {
      text: 'Sanjay detected the concealed wall leak that two other plumbers had missed. Fixed the pipe joint without breaking unnecessary tiles.',
      author: 'Vikramaditya Roy',
      location: 'Ranjit Avenue, Amritsar, Punjab',
      rating: 5,
    },
  },
  {
    id: 'ac-repair',
    name: 'AC Servicing & Cooling Care',
    icon: '❄️',
    tagline: 'Deep jet-pump cleaning, refrigerant gas recharge, and PCB diagnostics.',
    color: '#0284c7',
    lightBg: '#f0f9ff',
    badge: 'Seasonal Best',
    baseRate: 399,
    eta: '20-35 Mins',
    overview:
      'Restore ice-cold cooling efficiency and cut down monthly electricity bills. Our HVAC technicians perform foam-shield jet pump wash, indoor blower sanitization, compressor capacitor tests, and pure R32/R410A gas refills.',
    features: [
      'High-pressure jet wash with protective indoor coil drip-jacket',
      'Pure R32 / R410A refrigerant gas leak repair and full top-up',
      'Compressor starting capacitor, fan motor, and PCB repair',
      'Indoor blower mould sanitization and drain line bacterial flush',
      'Split and window AC dismantle, uninstallation, and re-installation',
    ],
    pricingTiers: [
      { name: 'Power Jet Service', price: '₹399', detail: 'Deep indoor coil & outdoor condenser foam jet wash' },
      { name: 'Gas Refill & Leak Fix', price: '₹1,499', detail: 'Nitrogen pressure testing + pure OEM refrigerant' },
      { name: 'Complete Installation', price: '₹1,199', detail: 'Heavy-duty copper bracket mounting and vacuum test' },
    ],
    included: ['Temperature drop digital gauge test', 'Post-service cleanliness cleanup', '60-Day cooling warranty'],
    excluded: ['Outdoor unit crane hire (if above 4th floor without balcony)', 'New copper pipe runs beyond standard length'],
    review: {
      text: 'Priya and her partner washed the AC indoor unit with a neat spill jacket. Temperature dropped from 29°C to 19°C in 8 minutes flat!',
      author: 'Ananya Deshmukh',
      location: 'Model Town, Jalandhar, Punjab',
      rating: 5,
    },
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Furniture Assembly',
    icon: '🔨',
    tagline: 'Master woodcraft, hinge realignment, custom locks, and modular repairs.',
    color: '#b45309',
    lightBg: '#fffbeb',
    badge: 'Precision',
    baseRate: 599,
    eta: '30-45 Mins',
    overview:
      'From sagging modular kitchen cabinets and stuck hydraulic beds to premium smart digital door lock installations, our carpenters bring professional edge tools, routers, and doweling hardware for immaculate joinery.',
    features: [
      'Modular kitchen soft-close hydraulic hinge adjustments & runner replacements',
      'Digital smart lock, deadbolt, and multi-point mortise lock installations',
      'Flat-pack furniture assembly (IKEA, Pepperfry, Urban Ladder)',
      'Door frame planing, sagging door realignment, and weather-seal fitting',
      'Custom wooden shelf mounting, wardrobe repair, and laminate patching',
    ],
    pricingTiers: [
      { name: 'Minor Adjustment', price: '₹249', detail: 'Hinge realignment, latch repair, drawer handle fix' },
      { name: 'Standard Assembly', price: '₹599', detail: 'Bed assembly, 3-door wardrobe hinge overhaul' },
      { name: 'Custom Installation', price: '₹999+', detail: 'Smart lock installation, full kitchen cabinet overhaul' },
    ],
    included: ['Level gauge alignment test', 'Wood shavings clean-up', '30-Day smooth-glide guarantee'],
    excluded: ['Cost of hardwood, plywood, or decorative veneer', 'Hardware fittings (handles, locks, hinges)'],
    review: {
      text: 'Amit assembled our 6-seater solid Sheesham dining set and aligned all 8 kitchen soft-close cabinets in under two hours. Flawless craft.',
      author: 'Rohan Mehra',
      location: 'Sector 70, Mohali (SAS Nagar), Punjab',
      rating: 5,
    },
  },
  {
    id: 'painting',
    name: 'Home Painting & Waterproofing',
    icon: '🎨',
    tagline: 'Dustless wall sanding, premium emulsions, and dampness treatment.',
    color: '#ea580c',
    lightBg: '#fff7ed',
    badge: 'Transformation',
    baseRate: 999,
    eta: 'Scheduled',
    overview:
      'Give your living spaces a vibrant new personality without the mess. Our painters use HEPA vacuum dustless sanders, masking tapes, and low-VOC paints from Asian Paints, Berger, and Dulux with laser color matching.',
    features: [
      'Interior accent wall textures, stencils, and velvet luxury emulsions',
      'Moisture meter dampness diagnostics and polymer waterproofing basecoat',
      'Wall putty application, crack bridging, and seamless primer coat',
      'Doors, windows, and metal railing enamel & PU polish restoration',
      'Zero-mess floor masking, plastic furniture wrap, and end-of-job deep clean',
    ],
    pricingTiers: [
      { name: 'Single Accent Wall', price: '₹999', detail: 'Two coats premium sheen emulsion with color consultation' },
      { name: 'Room Waterproofing', price: '₹1,899+', detail: 'Moisture barrier injection + skim coat' },
      { name: 'Full Home Package', price: 'Custom', detail: 'Comprehensive site assessment & laser measurement' },
    ],
    included: ['Free on-site laser measurement', 'Full furniture & floor masking', '1-Year peel-resistant warranty'],
    excluded: ['Scaffolding for multi-story exterior work', 'Structural crack civil masonry reconstruction'],
    review: {
      text: 'The dustless vacuum sanding was unbelievable. No chalk powder anywhere in our living room, and the teal accent wall looks like a luxury magazine.',
      author: 'Pooja Hegde',
      location: 'Leela Bhawan, Patiala, Punjab',
      rating: 5,
    },
  },
  {
    id: 'cleaning',
    name: 'Deep Cleaning & Sanitization',
    icon: '🧹',
    tagline: 'Industrial steam extraction, degreasing, and stain removal.',
    color: '#059669',
    lightBg: '#f0fdf4',
    badge: 'Hygienic',
    baseRate: 399,
    eta: 'Scheduled',
    overview:
      'Standard brooming only scratches the surface. Fixovia Deep Cleaners employ commercial grade single-disc scrubbing machines, 140°C steam sterilizers, and German microfiber protocols for hospital-grade hygiene.',
    features: [
      'Intensive kitchen chimney, stove, and exhaust duct grease removal',
      'Bathroom descaling (hard water stains on tiles, glass dividers, faucets)',
      'Fabric sofa and mattress injection-extraction deep shampooing',
      'Balcony pressure washing, ceiling fan blades, and switchboard cleaning',
      'Pre-move-in and post-renovation complete house sanitization',
    ],
    pricingTiers: [
      { name: 'Single Bathroom Deep Clean', price: '₹399', detail: 'Acid-free tile scrubbing, tap descaling, mirrors' },
      { name: 'Kitchen Power Degrease', price: '₹899', detail: 'Chimney filters, cabinets inside-out, granite scrub' },
      { name: 'Full Home Deep Clean', price: '₹2,499+', detail: '2 BHK complete sanitization, machines + steam' },
    ],
    included: ['Commercial eco-safe cleaning compounds', 'Rotary scrubbing equipment', '100% satisfaction check'],
    excluded: ['Exterior window facade abseiling', 'Severe paint stain scraping off raw wood floors'],
    review: {
      text: 'Our hard water-stained bathroom glass looks brand new after their steam descaling. Extremely polite team with full PPE uniforms.',
      author: 'Dr. Sameer Khan',
      location: 'Civil Lines, Bathinda, Punjab',
      rating: 5,
    },
  },
];

export default function ServicesPage({ onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('electrical');
  const [bookingTrade, setBookingTrade] = useState(null);
  const [faqOpen, setFaqOpen] = useState(0);

  const selectedService = SERVICES_DATA.find((s) => s.id === activeTab) || SERVICES_DATA[0];

  const handleBookNow = (trade) => {
    if (!user) {
      toast.info(`Please sign in or create an account to book ${trade?.name || 'this service'} 🔒`);
      onNavigate('auth');
      return;
    }
    setBookingTrade({
      id: trade.id,
      name: `Fixovia Verified ${trade.name} Specialist`,
      role: trade.name.split(' ')[0],
      rate: trade.baseRate,
      skills: trade.features.slice(0, 3),
      initials: trade.name.substring(0, 2).toUpperCase(),
      color: trade.color,
    });
  };

  return (
    <main className="page-enter" style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ── Page Hero ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 90%, transparent) 0%, var(--bg2) 100%)',
          borderBottom: '1px solid var(--line)',
          padding: '60px 0 45px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="wrap">
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <span
              className="badge badge-teal animate-slide-down"
              style={{ padding: '6px 14px', fontSize: '0.85rem', marginBottom: 16 }}
            >
              🛠️ Fixovia Doorstep Services
            </span>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
                fontWeight: 900,
                color: 'var(--ink)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: 16,
              }}
            >
              Certified Repairs Done Right. <br />
              <span style={{ color: 'var(--coral2)' }}>Guaranteed at Your Door.</span>
            </h1>
            <p
              style={{
                fontSize: '1.12rem',
                color: 'var(--slate)',
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Every trade is staffed by background-verified, skill-tested professionals equipped with
              calibrated tools, upfront price caps, and our mandatory <strong>Safety PIN verification</strong>.
            </p>

            {/* Quick Trust Highlights */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                flexWrap: 'wrap',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--teal)' }}>✓</span> 15-Minute Priority Dispatch
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--teal)' }}>✓</span> 30-Day Free Rework Warranty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--teal)' }}>✓</span> 100% Police Verified Technicians
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Category Selector & Deep-Dive Showcase ── */}
      <section style={{ padding: '50px 0' }}>
        <div className="wrap">
          {/* Horizontal Interactive Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              paddingBottom: 16,
              marginBottom: 40,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {SERVICES_DATA.map((srv) => {
              const isSelected = srv.id === activeTab;
              return (
                <button
                  key={srv.id}
                  onClick={() => setActiveTab(srv.id)}
                  className="hover-lift"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? `2px solid ${srv.color}` : '1.5px solid var(--line)',
                    background: isSelected ? srv.color : 'var(--card)',
                    color: isSelected ? '#ffffff' : 'var(--ink)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? `0 8px 20px -6px ${srv.color}66` : 'var(--shadow-sm)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{srv.icon}</span>
                  {srv.name.split(' ')[0]}
                  {srv.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 6px',
                        borderRadius: 999,
                        background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg2)',
                        color: isSelected ? '#fff' : 'var(--slate)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {srv.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Service Deep-Dive Card */}
          <div
            key={selectedService.id}
            className="card animate-fade-in"
            style={{
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--line)',
              background: 'var(--card)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: 40,
                alignItems: 'start',
              }}
              className="service-deep-grid"
            >
              {/* Left Column: Comprehensive Details & Features */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: selectedService.lightBg,
                      color: selectedService.color,
                      fontSize: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${selectedService.color}33`,
                    }}
                  >
                    {selectedService.icon}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: '1.85rem',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.2,
                        marginBottom: 4,
                      }}
                    >
                      {selectedService.name}
                    </h2>
                    <p style={{ color: 'var(--coral2)', fontWeight: 700, fontSize: '0.96rem' }}>
                      {selectedService.tagline}
                    </p>
                  </div>
                </div>

                <p style={{ color: 'var(--slate)', fontSize: '1.02rem', lineHeight: 1.65, margin: '20px 0 28px' }}>
                  {selectedService.overview}
                </p>

                {/* What's Covered Checklist */}
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--ink)',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>📋</span> What We Specialize In
                </h3>
                <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
                  {selectedService.features.map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: '0.95rem',
                        color: 'var(--slate)',
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'var(--tealsoft)',
                          color: 'var(--teal)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Scope: Included vs Excluded */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    padding: 20,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg2)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div>
                    <b style={{ color: 'var(--teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Included Standard
                    </b>
                    <ul style={{ paddingLeft: 18, marginTop: 8, fontSize: '0.88rem', color: 'var(--slate)', lineHeight: 1.6 }}>
                      {selectedService.included.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <b style={{ color: 'var(--slate)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Not Included (Available as Add-on)
                    </b>
                    <ul style={{ paddingLeft: 18, marginTop: 8, fontSize: '0.88rem', color: 'var(--mute)', lineHeight: 1.6 }}>
                      {selectedService.excluded.map((exc, i) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing Schedule, Review & Booking CTA */}
              <div>
                <div
                  style={{
                    background: 'var(--card)',
                    border: '1.5px solid var(--line)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 26px',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <small style={{ color: 'var(--mute)', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>
                        Fixed Starting Rate
                      </small>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--ink)' }}>
                        ₹{selectedService.baseRate}
                        <span style={{ fontSize: '0.9rem', color: 'var(--slate)', fontWeight: 500 }}> / visit</span>
                      </div>
                    </div>
                    <span className="badge badge-teal" style={{ fontSize: 11 }}>
                      ⚡ {selectedService.eta} ETA
                    </span>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px dashed var(--line)', margin: '14px 0' }} />

                  {/* Pricing Tiers Table */}
                  <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                    {selectedService.pricingTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg2)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)' }}>{tier.name}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--mute)' }}>{tier.detail}</div>
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--coral2)', fontSize: '0.95rem' }}>{tier.price}</div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Booking Button */}
                  <button
                    onClick={() => handleBookNow(selectedService)}
                    className="btn-primary btn-shine-effect hover-lift"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-sm)',
                      background: selectedService.color,
                      boxShadow: `0 12px 24px -8px ${selectedService.color}88`,
                    }}
                  >
                    Book {selectedService.name.split(' ')[0]} Specialist →
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <small style={{ fontSize: 11, color: 'var(--slate)' }}>
                      🔒 Safety PIN required before technician begins work.
                    </small>
                  </div>
                </div>

                {/* Customer Review Card */}
                <div
                  style={{
                    padding: 20,
                    borderRadius: 'var(--radius-md)',
                    background: selectedService.lightBg,
                    border: `1px solid ${selectedService.color}22`,
                  }}
                >
                  <div style={{ color: 'var(--sun)', fontSize: '0.95rem', marginBottom: 6 }}>★★★★★</div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--ink)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 }}>
                    "{selectedService.review.text}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <b style={{ color: selectedService.color }}>{selectedService.review.author}</b>
                    <span style={{ color: 'var(--slate)' }}>{selectedService.review.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── All 8 Trades Quick Discovery Matrix ── */}
      <section style={{ padding: '40px 0 60px', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <span className="badge badge-coral" style={{ marginBottom: 12 }}>
              Explore All Categories
            </span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: 'var(--ink)' }}>
              8 Trades, One High Standard
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: '1rem', marginTop: 8 }}>
              Click any trade to instantly view available pros or launch direct auto-match.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {SERVICES_DATA.map((trade) => (
              <div
                key={trade.id}
                className="card hover-lift"
                style={{
                  padding: 24,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 32 }}>{trade.icon}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: trade.color,
                        background: trade.lightBg,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      From ₹{trade.baseRate}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
                    {trade.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--slate)', lineHeight: 1.5, marginBottom: 16 }}>
                    {trade.tagline}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setActiveTab(trade.id);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="btn-outline"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.84rem' }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleBookNow(trade)}
                    className="btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.84rem', background: trade.color }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="wrap" style={{ maxWidth: 740 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 800, color: 'var(--ink)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--slate)' }}>
              Everything you need to know about booking doorstep repair professionals with Fixovia.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              {
                q: 'How fast will a professional arrive at my home?',
                a: 'Our priority dispatch network matches you with the closest verified technician within 90 seconds. Average doorstep arrival across Punjab (Ludhiana, Amritsar, Jalandhar, Patiala, Mohali, Bathinda) is between 15 to 30 minutes.',
              },
              {
                q: 'What is the Doorstep Safety PIN and why is it mandatory?',
                a: 'The Safety PIN is a 4-digit code generated exclusively on your phone upon booking. The technician cannot start their job timer or access your full bill until you verify this PIN with them in person. It guarantees zero unverified workers enter your home.',
              },
              {
                q: 'What happens if the repair stops working after the pro leaves?',
                a: 'Every Fixovia service is backed by our 30-Day Free Rework Guarantee. If the exact same issue reoccurs within 30 days, we dispatch a senior supervisor technician to fix it free of charge.',
              },
              {
                q: 'Are spare parts included in the labor rate?',
                a: 'Labor rates cover professional diagnosis, repair time, testing, and clean-up. If replacement parts (e.g., capacitors, copper pipes, MCBs, brass valves) are required, the technician will present genuine brand-packaged parts with MRP tags and an itemized digital receipt.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="card"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--ink)',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 18, color: 'var(--primary)', transform: faqOpen === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                    +
                  </span>
                </button>
                {faqOpen === i && (
                  <div
                    className="animate-slide-down"
                    style={{
                      padding: '0 20px 18px',
                      color: 'var(--slate)',
                      fontSize: '0.94rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--line)',
                      paddingTop: 14,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
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

      {/* CSS adjustments */}
      <style>{`
        @media (max-width: 860px) {
          .service-deep-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
