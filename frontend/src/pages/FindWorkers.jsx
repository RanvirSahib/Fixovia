import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BookingModal from '../components/booking/BookingModal';
import { api } from '../services/api';

const POPULAR_LOCATIONS = [
  { id: 'ludhiana-model', label: 'Model Town, Ludhiana', area: 'Ludhiana Central', distFactor: 1.0 },
  { id: 'amritsar-ranjit', label: 'Ranjit Avenue, Amritsar', area: 'Amritsar North', distFactor: 1.1 },
  { id: 'jalandhar-model', label: 'Model Town, Jalandhar', area: 'Jalandhar Doaba', distFactor: 1.0 },
  { id: 'mohali-sec70', label: 'Sector 70, Mohali (SAS Nagar)', area: 'Mohali / Tricity', distFactor: 0.9 },
  { id: 'patiala-leela', label: 'Leela Bhawan, Patiala', area: 'Patiala Royal Belt', distFactor: 1.2 },
  { id: 'bathinda-civil', label: 'Civil Lines, Bathinda', area: 'Bathinda Malwa', distFactor: 1.3 },
  { id: 'zirakpur-vip', label: 'VIP Road, Zirakpur (Punjab)', area: 'Greater Mohali', distFactor: 0.8 },
  { id: 'pathankot-mission', label: 'Mission Road, Pathankot', area: 'Pathankot North', distFactor: 1.4 },
];

const BASE_WORKERS = [
  { id: 1, name: 'Raj Kumar',    role: 'Electrician',   rating: 4.9, reviews: 142, baseDistance: 1.4, rate: 499, available: true,  skills: ['Concealed Wiring', 'MCB Repair', 'Fan Overhaul'], initials: 'RK', color: '#0f766e', exp: '8 yrs exp', badge: 'Top Rated' },
  { id: 2, name: 'Sanjay Verma', role: 'Plumber',       rating: 4.8, reviews: 98,  baseDistance: 1.8, rate: 450, available: true,  skills: ['Acoustic Leak Detection', 'Drain Snake', 'Geyser Fit'], initials: 'SV', color: '#7c3aed', exp: '6 yrs exp', badge: 'Master Plumber' },
  { id: 3, name: 'Amit Singh',   role: 'Carpenter',     rating: 4.7, reviews: 88,  baseDistance: 2.5, rate: 599, available: true,  skills: ['Smart Lock Installation', 'Hinge Tuning', 'Modular Bed'], initials: 'AS', color: '#b45309', exp: '10 yrs exp', badge: 'Wood Specialist' },
  { id: 4, name: 'Priya Sharma', role: 'AC Technician', rating: 4.9, reviews: 215, baseDistance: 1.2, rate: 399, available: true,  skills: ['Power Jet Wash', 'R32 Gas Charge', 'PCB Diagnostics'], initials: 'PS', color: '#0369a1', exp: '7 yrs exp', badge: 'Super Pro' },
  { id: 5, name: 'Vikram Rao',   role: 'Electrician',   rating: 4.6, reviews: 67,  baseDistance: 3.1, rate: 449, available: true,  skills: ['Inverter Wiring', 'CCTV Setup', '16A Sockets'], initials: 'VR', color: '#059669', exp: '5 yrs exp', badge: 'Certified' },
  { id: 6, name: 'Meena Gupta',  role: 'Plumber',       rating: 4.8, reviews: 110, baseDistance: 0.9, rate: 420, available: true,  skills: ['Diverter Repair', 'Tank Float Valve', 'Pipe Joint'], initials: 'MG', color: '#e11d48', exp: '9 yrs exp', badge: 'Quick Arrival' },
];

const CATEGORIES = [
  { id: 'All',           label: 'All Services', icon: '🛠️' },
  { id: 'Electrician',   label: 'Electrician',  icon: '⚡' },
  { id: 'Plumber',       label: 'Plumber',      icon: '🔧' },
  { id: 'AC Technician', label: 'AC Care',      icon: '❄️' },
  { id: 'Carpenter',     label: 'Carpenter',    icon: '🔨' },
];

const SORT_OPTIONS = [
  {
    value: 'nearest',
    label: 'Nearest First',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
        <circle cx="12" cy="10" r="3" fill="#ef4444" />
      </svg>
    ),
    badge: 'Quickest ETA',
  },
  {
    value: 'top_rated',
    label: 'Top Rated',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    badge: '4.8+ Rating',
  },
  {
    value: 'lowest',
    label: 'Lowest Price',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    badge: 'From ₹199',
  },
];

export default function FindWorkers({ onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();

  const [workers, setWorkers]         = useState(BASE_WORKERS);
  const [loading, setLoading]         = useState(false);
  const [query, setQuery]             = useState('');
  const [category, setCategory]       = useState('All');
  const [sortBy, setSortBy]           = useState('nearest');
  const [maxBudget, setMaxBudget]     = useState(1500);
  const [availableOnly, setAvailable] = useState(false);
  const [bookingWorker, setBookingWorker] = useState(null);

  // Location state
  const [selectedLocation, setSelectedLocation] = useState('Model Town, Ludhiana');
  const [isTypingLocation, setIsTypingLocation] = useState(false);
  const [locationInput, setLocationInput]       = useState('Model Town, Ludhiana');
  const [isDetecting, setIsDetecting]           = useState(false);

  // Modern Sort Dropdown State
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeSortObj = SORT_OPTIONS.find((s) => s.value === sortBy) || SORT_OPTIONS[0];

  useEffect(() => {
    // If backend workers are available, fetch them
    api.workers().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setWorkers(data);
      }
    }).catch(() => {/* fallback to BASE_WORKERS */});
  }, []);

  // Update distance when location changes
  const activeLocObj = POPULAR_LOCATIONS.find((l) => l.label === selectedLocation) || POPULAR_LOCATIONS[0];

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc.label);
    setLocationInput(loc.label);
    setIsTypingLocation(false);
    toast.success(`Location updated to ${loc.label}. Recalculating nearby pros 📍`);
  };

  const handleCustomLocationSubmit = (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    setSelectedLocation(locationInput.trim());
    setIsTypingLocation(false);
    toast.success(`Browsing verified pros in "${locationInput.trim()}" 📍`);
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          const detected = 'Live GPS Location (Within 2.5 km)';
          setSelectedLocation(detected);
          setLocationInput(detected);
          toast.success('GPS location locked! Showing closest technicians 🎯');
        },
        () => {
          setIsDetecting(false);
          setSelectedLocation('Model Town, Ludhiana');
          setLocationInput('Model Town, Ludhiana');
          toast.info('Location defaulted to Model Town, Ludhiana (Punjab)');
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetecting(false);
      toast.info('Geolocation not supported in browser, set manually.');
    }
  };

  // Safe Booking Interceptor: Requires Login
  const handleInitiateBooking = (worker) => {
    if (!user) {
      toast.warning('Please sign in or create an account to book this pro and generate your Doorstep Safety PIN 🔒');
      // Redirect to login page
      onNavigate('auth');
      return;
    }
    setBookingWorker(worker);
  };

  // Filtered workers list
  const filtered = workers
    .map((w) => {
      // Calculate realistic dynamic distance based on selected location
      const calculatedDistance = +(w.baseDistance * activeLocObj.distFactor).toFixed(1);
      return { ...w, distance: calculatedDistance };
    })
    .filter((w) => {
      if (availableOnly && !w.available) return false;
      if (category !== 'All' && !w.role.toLowerCase().includes(category.toLowerCase())) return false;
      if (w.rate > maxBudget) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.role.toLowerCase().includes(q) ||
          (w.skills || []).some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest')   return a.distance - b.distance;
      if (sortBy === 'top_rated') return b.rating - a.rating;
      if (sortBy === 'lowest')    return a.rate - b.rate;
      return 0;
    });

  return (
    <main className="page-enter" style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      {/* ── Dashboard-Style Header Bar ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, var(--bg2) 100%)',
          borderBottom: '1px solid var(--line)',
          padding: '36px 0 28px',
        }}
      >
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              {/* Breadcrumb / Mode pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="badge badge-teal" style={{ fontSize: 11 }}>
                  📍 {selectedLocation}
                </span>
                {user && (
                  <span className="badge badge-blue" style={{ fontSize: 11 }}>
                    ✓ Signed in as {user.name?.split(' ')[0]}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                  fontWeight: 900,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  marginBottom: 6,
                }}
              >
                Find Verified Pros Near You
              </h1>
              <p style={{ color: 'var(--slate)', fontSize: '0.98rem' }}>
                Explore certified specialists available for dispatch in <strong>{selectedLocation}</strong>.
              </p>
            </div>

            {/* Quick Stats Pill Matching Dashboard */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: 'var(--card)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <small style={{ color: 'var(--mute)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                  Nearby Pros
                </small>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)' }}>
                  {filtered.length} Available
                </div>
              </div>
              <div style={{ width: 1, background: 'var(--line)' }} />
              <div>
                <small style={{ color: 'var(--mute)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                  Avg Arrival
                </small>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal)' }}>
                  15-20 Mins
                </div>
              </div>
            </div>
          </div>

          {/* ── Interactive Location Bar (Type or Search) ── */}
          <div
            className="card"
            style={{
              marginTop: 22,
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--line)',
              background: 'var(--card)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📍</span> Select or Type Your Service Location:
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetecting}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--primary)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {isDetecting ? '⏳ Detecting GPS…' : '🎯 Detect My Current Location'}
              </button>
            </div>

            {/* Custom Type / Search Bar */}
            <form onSubmit={handleCustomLocationSubmit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Type any Punjab city, locality or area (e.g. Model Town Ludhiana, Ranjit Avenue Amritsar, Mohali, Patiala)…"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 38px',
                    fontSize: '0.92rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 14,
                    color: 'var(--muted)',
                  }}
                >
                  🔍
                </span>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                Set Location
              </button>
            </form>

            {/* Quick Popular Locality Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <small style={{ color: 'var(--mute)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginRight: 4 }}>
                Popular Hubs:
              </small>
              {POPULAR_LOCATIONS.map((loc) => {
                const isCurrent = selectedLocation === loc.label;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--line)',
                      background: isCurrent ? 'var(--primary-light)' : 'var(--bg2)',
                      color: isCurrent ? 'var(--primary)' : 'var(--slate)',
                      fontSize: 12,
                      fontWeight: isCurrent ? 800 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    📍 {loc.area}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area (Dashboard-Aligned Split Layout) ── */}
      <section style={{ paddingTop: 28 }}>
        <div className="wrap">
          {/* ── Dashboard-Style Category Filter Tabs ── */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 10,
              marginBottom: 24,
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--line)',
                    background: isSelected ? 'var(--card)' : 'var(--bg2)',
                    color: isSelected ? 'var(--primary)' : 'var(--slate)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ── Search & Filter Controls ── */}
          <div
            className="search-filter-box"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 14,
              marginBottom: 20,
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--card)',
              border: '1px solid var(--line)',
            }}
          >
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: 240, maxWidth: 400, position: 'relative' }}>
              <input
                type="text"
                className="input"
                placeholder="Search electrician, plumber, AC..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: '8px 12px 8px 34px', fontSize: '0.88rem' }}
              />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--muted)' }}>
                🔍
              </span>
            </div>

            {/* Quick Budget & Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 600 }}>Max Price:</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--coral2)' }}>₹{maxBudget}</span>
                <input
                  type="range"
                  min={300}
                  max={2000}
                  step={50}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(+e.target.value)}
                  style={{ width: 100, accentColor: 'var(--coral2)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }} ref={sortRef}>
                <span style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 600 }}>Sort:</span>
                
                {/* Modern Pill Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: isSortOpen ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--charcoal)',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: isSortOpen
                      ? '0 0 0 3px rgba(37, 99, 235, 0.16), var(--shadow-sm)'
                      : 'var(--shadow-xs)',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSortOpen) e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSortOpen) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {activeSortObj.icon}
                  </span>
                  <span>{activeSortObj.label}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      color: isSortOpen ? 'var(--primary)' : 'var(--muted)',
                      marginLeft: 2,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Floating Modern Glassmorphic Dropdown Menu */}
                {isSortOpen && (
                  <div
                    role="listbox"
                    className="animate-dropdown-pop"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: 210,
                      background: 'var(--card)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1.5px solid var(--line)',
                      borderRadius: 14,
                      boxShadow: '0 20px 45px -8px rgba(13, 86, 203, 0.22), 0 4px 18px rgba(0, 0, 0, 0.08)',
                      padding: 6,
                      zIndex: 60,
                      transformOrigin: 'top right',
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 10px 4px',
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--muted)',
                        borderBottom: '1px solid var(--line)',
                        marginBottom: 4,
                      }}
                    >
                      Sort Technicians
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                              toast.info(`Sorted by ${opt.label}`, { duration: 1200 });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 9,
                              border: 'none',
                              background: isSelected ? 'rgba(37, 99, 235, 0.09)' : 'transparent',
                              color: isSelected ? 'var(--primary)' : 'var(--charcoal)',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: 13,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.18s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background = 'var(--bg-stone-100)';
                                e.currentTarget.style.transform = 'translateX(2px)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateX(0)';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: '50%',
                                  background: isSelected ? '#2563eb18' : 'var(--bg2)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {opt.icon}
                              </span>
                              <div>
                                <div style={{ lineHeight: 1.2 }}>{opt.label}</div>
                                <div style={{ fontSize: 10, color: 'var(--slate)', opacity: 0.75, fontWeight: 500 }}>
                                  {opt.badge}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ flexShrink: 0 }}
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Pros Grid in Dashboard Card Style ── */}
          {filtered.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--line)',
                background: 'var(--card)',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
                No verified pros match your criteria in {selectedLocation}
              </h3>
              <p style={{ color: 'var(--slate)', fontSize: '0.94rem', marginBottom: 20 }}>
                Try adjusting your price filter or select a nearby location hub.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setCategory('All');
                  setMaxBudget(1500);
                  setQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                gap: 20,
              }}
            >
              {filtered.map((worker) => (
                <div
                  key={worker.id}
                  className="card hover-lift animate-fade-in"
                  style={{
                    padding: '22px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--line)',
                    background: 'var(--card)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  <div>
                    {/* Top Row: Avatar + Details */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                      {/* Avatar with Online Pulse */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            background: worker.color,
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: 19,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 12px ${worker.color}44`,
                          }}
                        >
                          {worker.initials}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#22c55e',
                            border: '2px solid var(--card)',
                          }}
                        />
                      </div>

                      {/* Name, Role & Badges */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                            {worker.name}
                          </span>
                          <span className="badge-teal" style={{ fontSize: 10, padding: '2px 6px' }}>
                            ✓ Verified
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 600, marginTop: 2 }}>
                          {worker.role} • <span style={{ color: 'var(--mute)' }}>{worker.exp}</span>
                        </div>

                        {/* Rating + Distance */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>{worker.rating}</span>
                            <span style={{ fontSize: 11, color: 'var(--muted)' }}>({worker.reviews})</span>
                          </div>
                          <div
                            style={{
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--bg2)',
                              fontSize: 11,
                              fontWeight: 700,
                              color: 'var(--teal)',
                            }}
                          >
                            📍 {worker.distance} km away
                          </div>
                        </div>
                      </div>

                      {/* Starting Rate */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)' }}>
                          ₹{worker.rate}
                        </div>
                        <small style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>
                          Fixed Visit
                        </small>
                      </div>
                    </div>

                    {/* Skill Chips */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                      {(worker.skills || []).map((sk, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg2)',
                            color: 'var(--slate)',
                            fontWeight: 600,
                            border: '1px solid var(--line)',
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: View Profile & Book Now */}
                  <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
                    <button
                      onClick={() => onNavigate('profile', worker)}
                      className="btn-outline"
                      style={{ flex: 1, padding: '9px 12px', fontSize: '0.86rem' }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleInitiateBooking(worker)}
                      className="btn-primary btn-shine-effect"
                      style={{
                        flex: 1.2,
                        padding: '9px 14px',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                      }}
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal (Only accessible if logged in) */}
      {bookingWorker && user && (
        <BookingModal
          worker={bookingWorker}
          onClose={() => setBookingWorker(null)}
          onSuccess={() => {
            setBookingWorker(null);
            onNavigate('dashboard');
          }}
        />
      )}
    </main>
  );
}
