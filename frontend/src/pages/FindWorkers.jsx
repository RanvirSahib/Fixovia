import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BookingModal from '../components/booking/BookingModal';
import { api } from '../services/api';
import { mergeWorkersWithPartnerRate } from '../utils/partnerRates';
import '../styles/map.css';

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
  { id: 1, name: 'Raj Kumar',    role: 'Electrician',   rating: 4.9, reviews: 142, baseDistance: 1.4, rate: 499, available: true,  skills: ['Concealed Wiring', 'MCB Repair', 'Fan Overhaul'], initials: 'RK', color: '#0f766e', exp: '8 yrs exp', badge: 'Top Rated', coords: { x: 34, y: 36 } },
  { id: 2, name: 'Sanjay Verma', role: 'Plumber',       rating: 4.8, reviews: 98,  baseDistance: 1.8, rate: 450, available: true,  skills: ['Acoustic Leak Detection', 'Drain Snake', 'Geyser Fit'], initials: 'SV', color: '#7c3aed', exp: '6 yrs exp', badge: 'Master Plumber', coords: { x: 62, y: 32 } },
  { id: 3, name: 'Amit Singh',   role: 'Carpenter',     rating: 4.7, reviews: 88,  baseDistance: 2.5, rate: 599, available: true,  skills: ['Smart Lock Installation', 'Hinge Tuning', 'Modular Bed'], initials: 'AS', color: '#b45309', exp: '10 yrs exp', badge: 'Wood Specialist', coords: { x: 72, y: 64 } },
  { id: 4, name: 'Priya Sharma', role: 'AC Technician', rating: 4.9, reviews: 215, baseDistance: 1.2, rate: 399, available: true,  skills: ['Power Jet Wash', 'R32 Gas Charge', 'PCB Diagnostics'], initials: 'PS', color: '#0369a1', exp: '7 yrs exp', badge: 'Super Pro', coords: { x: 28, y: 68 } },
  { id: 5, name: 'Vikram Rao',   role: 'Electrician',   rating: 4.6, reviews: 67,  baseDistance: 3.1, rate: 449, available: true,  skills: ['Inverter Wiring', 'CCTV Setup', '16A Sockets'], initials: 'VR', color: '#059669', exp: '5 yrs exp', badge: 'Certified', coords: { x: 50, y: 76 } },
  { id: 6, name: 'Meena Gupta',  role: 'Plumber',       rating: 4.8, reviews: 110, baseDistance: 0.9, rate: 420, available: true,  skills: ['Diverter Repair', 'Tank Float Valve', 'Pipe Joint'], initials: 'MG', color: '#e11d48', exp: '9 yrs exp', badge: 'Quick Arrival', coords: { x: 44, y: 22 } },
  { id: 7, name: 'Gurpreet Gill', role: 'Painter',      rating: 4.9, reviews: 82,  baseDistance: 2.1, rate: 799, available: true,  skills: ['Waterproofing', 'Texture Paint', 'Crack Seal'], initials: 'GG', color: '#d97706', exp: '11 yrs exp', badge: 'Wall Artist', coords: { x: 78, y: 44 } },
  { id: 8, name: 'Simran Kaur',  role: 'Cleaner',       rating: 4.8, reviews: 124, baseDistance: 1.6, rate: 399, available: true,  skills: ['Kitchen Deep Clean', 'Bathroom Sanitizing', 'Floor Buff'], initials: 'SK', color: '#db2777', exp: '4 yrs exp', badge: 'Hygiene Pro', coords: { x: 22, y: 48 } },
  { id: 9, name: 'Rohan Mehra',  role: 'Appliance Pro', rating: 4.7, reviews: 93,  baseDistance: 2.8, rate: 349, available: true,  skills: ['Washing Machine', 'Microwave Magnetron', 'Refrigerator'], initials: 'RM', color: '#6366f1', exp: '7 yrs exp', badge: 'Chip Tech', coords: { x: 60, y: 80 } },
  { id: 10, name: 'Harish Chander', role: 'Pest Control', rating: 4.9, reviews: 156, baseDistance: 2.2, rate: 599, available: true, skills: ['Odorless Termite Spray', 'Gel Baiting', 'Mosquito Fog'], initials: 'HC', color: '#16a34a', exp: '9 yrs exp', badge: 'Pest Shield', coords: { x: 38, y: 84 } },
  { id: 11, name: 'Baldev Singh', role: 'Carpenter',    rating: 4.8, reviews: 105, baseDistance: 3.4, rate: 549, available: true,  skills: ['Wooden Flooring', 'Wardrobe Sliding', 'Sofa Polish'], initials: 'BS', color: '#854d0e', exp: '12 yrs exp', badge: 'Master Wood', coords: { x: 82, y: 26 } },
  { id: 12, name: 'Jaspreet Kaur', role: 'AC Technician', rating: 4.8, reviews: 118, baseDistance: 1.9, rate: 420, available: true, skills: ['AC Copper Piping', 'Compressor Check', 'Foam Wash'], initials: 'JK', color: '#0284c7', exp: '6 yrs exp', badge: 'Cooling Expert', coords: { x: 18, y: 30 } },
];

const CATEGORIES = [
  { id: 'All',           label: 'All Services', icon: '🛠️' },
  { id: 'Electrician',   label: 'Electrical',   icon: '⚡' },
  { id: 'Plumber',       label: 'Plumbing',     icon: '🔧' },
  { id: 'AC Technician', label: 'AC Repair',    icon: '❄️' },
  { id: 'Carpenter',     label: 'Carpentry',    icon: '🔨' },
  { id: 'Painter',       label: 'Painting',     icon: '🎨' },
  { id: 'Cleaner',       label: 'Cleaning',     icon: '🧹' },
  { id: 'Appliance Pro', label: 'Appliances',   icon: '📱' },
  { id: 'Pest Control',  label: 'Pest Control', icon: '🪲' },
];

const normalizeCategory = (cat) => {
  if (!cat || typeof cat !== 'string' || cat.toLowerCase() === 'all') return 'All';
  const c = cat.toLowerCase();
  if (c.includes('elect')) return 'Electrician';
  if (c.includes('plumb')) return 'Plumber';
  if (c.includes('ac') || c.includes('air') || c.includes('cool')) return 'AC Technician';
  if (c.includes('carpent')) return 'Carpenter';
  if (c.includes('paint')) return 'Painter';
  if (c.includes('clean')) return 'Cleaner';
  if (c.includes('appliance')) return 'Appliance Pro';
  if (c.includes('pest')) return 'Pest Control';
  return cat;
};

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

/* ── Interactive Vector Cartographic Map Component ── */
function NearbyWorkersMap({
  workers,
  selectedLocation,
  activeWorkerId,
  maxDistance = 10,
  setMaxDistance,
  onSelectWorker,
  onBookWorker,
  onDetectLocation,
  isDetecting,
}) {
  const [hoveredWorkerId, setHoveredWorkerId] = useState(null);
  const radarRadius = Math.min(460, Math.max(90, 60 + maxDistance * 16));

  return (
    <div className="nearby-map-container">
      {/* Map Header Bar */}
      <div className="map-header-overlay">
        <div className="map-header-title">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d56cb14, #2563eb25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🗺️
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Nearby Pros Live Map</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#16a34a',
                  background: '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: 12,
                  border: '1px solid #bbf7d0',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.25)',
                  }}
                />
                Live GPS Active
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate)', marginTop: 2 }}>
              Showing {workers.length} verified technician{workers.length === 1 ? '' : 's'} on radar around <b>{selectedLocation.split(',')[0]}</b> (within {maxDistance} km)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Distance Range Filter Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f1f5f9', padding: '3px 6px', borderRadius: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', paddingLeft: 6, paddingRight: 2 }}>
              Radius:
            </span>
            {[2, 5, 10, 15, 25].map((dist) => {
              const isSelected = maxDistance === dist;
              return (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setMaxDistance && setMaxDistance(dist)}
                  style={{
                    padding: '3px 9px',
                    borderRadius: 14,
                    border: 'none',
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--charcoal)',
                    fontSize: 11,
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  title={`Filter workers within ${dist} km`}
                >
                  {dist === 25 ? '25+ km' : `${dist} km`}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onDetectLocation}
            className="btn-outline"
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isDetecting ? '⏳ Locating GPS…' : '📍 Re-center'}
          </button>
        </div>
      </div>

      {/* Cartographic Canvas */}
      <div className="map-canvas-area">
        {/* SVG City Map Vector Background (Roads, Blocks, Parks, River) */}
        <svg className="map-svg-grid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* Base Ground Tone */}
          <rect width="1000" height="600" fill="#f8fafc" />

          {/* Green parks & civic sectors */}
          <rect x="50" y="40" width="180" height="130" rx="14" fill="#e8f5e9" opacity="0.9" />
          <rect x="740" y="380" width="210" height="160" rx="16" fill="#e8f5e9" opacity="0.85" />
          <rect x="790" y="60" width="160" height="110" rx="12" fill="#e8f5e9" opacity="0.8" />
          <rect x="90" y="420" width="170" height="130" rx="14" fill="#e8f5e9" opacity="0.8" />

          {/* Urban blocks & colonies */}
          <rect x="290" y="70" width="150" height="120" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.2" />
          <rect x="520" y="60" width="210" height="120" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.2" />
          <rect x="70" y="230" width="170" height="140" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.2" />
          <rect x="620" y="240" width="180" height="120" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.2" />
          <rect x="340" y="410" width="190" height="130" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.2" />

          {/* River / Canal stream */}
          <path
            d="M-20,180 C240,210 320,380 500,420 C680,460 760,260 1020,310"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M-20,180 C240,210 320,380 500,420 C680,460 760,260 1020,310"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Primary Arterial Roads */}
          <line x1="0" y1="210" x2="1000" y2="210" stroke="#ffffff" strokeWidth="20" />
          <line x1="0" y1="210" x2="1000" y2="210" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="10 8" />

          <line x1="480" y1="0" x2="480" y2="600" stroke="#ffffff" strokeWidth="22" />
          <line x1="480" y1="0" x2="480" y2="600" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="12 8" />

          <line x1="0" y1="380" x2="1000" y2="380" stroke="#ffffff" strokeWidth="16" />
          <line x1="0" y1="380" x2="1000" y2="380" stroke="#e2e8f0" strokeWidth="1.2" />

          <line x1="260" y1="0" x2="260" y2="600" stroke="#ffffff" strokeWidth="16" />
          <line x1="770" y1="0" x2="770" y2="600" stroke="#ffffff" strokeWidth="16" />

          {/* Secondary streets */}
          <line x1="260" y1="120" x2="770" y2="120" stroke="#ffffff" strokeWidth="10" />
          <line x1="260" y1="480" x2="770" y2="480" stroke="#ffffff" strokeWidth="10" />
          <line x1="380" y1="210" x2="380" y2="380" stroke="#ffffff" strokeWidth="10" />
          <line x1="620" y1="210" x2="620" y2="380" stroke="#ffffff" strokeWidth="10" />

          {/* Sector Labels */}
          <text x="70" y="80" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1">CIVIL SECTOR 1</text>
          <text x="310" y="110" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1">CENTRAL HUB</text>
          <text x="810" y="90" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1">MODEL TOWN</text>
          <text x="760" y="420" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1">GREEN BELT</text>
          <text x="360" y="440" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1">TECH PARK</text>

          {/* Dynamic Radar Distance Range Coverage Perimeter */}
          <circle
            cx="480"
            cy="300"
            r={radarRadius}
            fill="rgba(13, 86, 203, 0.04)"
            stroke="#0d56cb"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            style={{ transition: 'r 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          <circle
            cx="480"
            cy="300"
            r={radarRadius}
            fill="none"
            stroke="rgba(37, 99, 235, 0.16)"
            strokeWidth="6"
            style={{ transition: 'r 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* Center: User Location Pin with Pulsing Radar Ring */}
        <div className="map-user-pin" style={{ left: '48%', top: '50%' }}>
          <div className="map-user-pulse" />
          <div className="map-user-dot" />
          <div className="map-user-label">
            📍 You are here · {selectedLocation.split(',')[0]} (≤ {maxDistance} km)
          </div>
        </div>

        {/* Nearby Worker Pins */}
        {workers.map((w) => {
          const isSelected = activeWorkerId === w.id;
          const isHovered = hoveredWorkerId === w.id;
          const showPopup = isSelected || isHovered;
          const posX = w.coords?.x ?? 50;
          const posY = w.coords?.y ?? 50;

          return (
            <div
              key={w.id}
              className={`map-worker-pin ${isSelected ? 'active' : ''}`}
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
              }}
              onMouseEnter={() => setHoveredWorkerId(w.id)}
              onMouseLeave={() => setHoveredWorkerId(null)}
              onClick={() => onSelectWorker(w)}
            >
              {/* Bubble Pin */}
              <div
                className="map-pin-bubble"
                style={{
                  background: w.color || '#0d56cb',
                  boxShadow: isSelected ? `0 0 0 4px #ffffff, 0 8px 24px ${w.color || '#0d56cb'}99` : undefined,
                  transform: isSelected ? 'scale(1.15)' : undefined,
                }}
              >
                <span>{w.initials}</span>
              </div>

              {/* Distance Pill */}
              <div className="map-pin-dist">
                {w.distance} km
              </div>

              {/* Interactive Popup on Hover or Selection */}
              {showPopup && (
                <div
                  className="map-pin-popup"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: w.color,
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {w.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {w.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate)', fontWeight: 600 }}>
                        {w.role} · <span style={{ color: '#f59e0b' }}>★ {w.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, background: '#f8fafc', padding: '6px 10px', borderRadius: 8, fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--slate)' }}>Visit charge:</span>
                    <b style={{ color: 'var(--ink)' }}>₹{w.rate}</b>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => onSelectWorker(w)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        background: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: 'var(--charcoal)',
                      }}
                    >
                      Show in List ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookWorker(w)}
                      style={{
                        flex: 1.2,
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--coral2)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FindWorkers({ onNavigate, initialCategory }) {
  const { user } = useAuth();
  const toast = useToast();

  const [workers, setWorkers]         = useState(() => mergeWorkersWithPartnerRate(BASE_WORKERS));
  const [loading, setLoading]         = useState(false);
  const [query, setQuery]             = useState('');
  const [category, setCategory]       = useState(() => normalizeCategory(initialCategory));
  const [activeWorkerId, setActiveWorkerId] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy]           = useState('nearest');
  const [maxBudget, setMaxBudget]     = useState(1500);
  const [availableOnly, setAvailable] = useState(false);
  const [bookingWorker, setBookingWorker] = useState(null);
  const [profileWorker, setProfileWorker] = useState(null);

  // Sync partner custom visiting rates in real-time
  useEffect(() => {
    const handlePartnerRateSync = () => {
      setWorkers(mergeWorkersWithPartnerRate(BASE_WORKERS));
    };
    window.addEventListener('fixovia_partner_rate_updated', handlePartnerRateSync);
    window.addEventListener('storage', handlePartnerRateSync);
    return () => {
      window.removeEventListener('fixovia_partner_rate_updated', handlePartnerRateSync);
      window.removeEventListener('storage', handlePartnerRateSync);
    };
  }, []);

  // Sync profileWorker with hash query param if provided
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/[\?&](?:profile|id)=([^&]+)/i);
      if (match) {
        const wid = parseInt(match[1], 10);
        const liveList = mergeWorkersWithPartnerRate(BASE_WORKERS);
        const targetW = liveList.find((w) => w.id === wid);
        if (targetW) {
          setProfileWorker(targetW);
        }
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // Sync category with initialCategory prop
  useEffect(() => {
    if (initialCategory) {
      setCategory(normalizeCategory(initialCategory));
    }
  }, [initialCategory]);

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
        // preserve coordinates for existing or fallback coords
        const merged = data.map((item, idx) => ({
          ...item,
          coords: item.coords || BASE_WORKERS[idx % BASE_WORKERS.length]?.coords || { x: 30 + (idx * 15) % 60, y: 30 + (idx * 12) % 55 },
        }));
        setWorkers(merged);
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

  const handleSelectWorkerFromMap = (w) => {
    setActiveWorkerId(w.id);
    const cardEl = document.getElementById(`worker-card-${w.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    toast.info(`Selected ${w.name} (${w.role}) · 📍 ${w.distance} km away`, { duration: 1500 });
  };

  const activeProfileWorker = profileWorker ? (workers.find((w) => w.id === profileWorker.id) || profileWorker) : null;
  const activeBookingWorker = bookingWorker ? (workers.find((w) => w.id === bookingWorker.id) || bookingWorker) : null;

  // Filtered workers list
  const filtered = workers
    .map((w) => {
      // Calculate realistic dynamic distance based on selected location
      const calculatedDistance = +(w.baseDistance * activeLocObj.distFactor).toFixed(1);
      return { ...w, distance: calculatedDistance };
    })
    .filter((w) => {
      if (availableOnly && !w.available) return false;
      if (category !== 'All') {
        const norm = normalizeCategory(category).toLowerCase();
        const role = (w.role || '').toLowerCase();
        const skills = (w.skills || []).map((s) => s.toLowerCase());
        const roleMatches =
          role.includes(norm) ||
          (norm.includes('elect') && (role.includes('elect') || skills.some((s) => s.includes('wir') || s.includes('mcb')))) ||
          (norm.includes('plumb') && (role.includes('plumb') || skills.some((s) => s.includes('leak') || s.includes('pipe') || s.includes('tap')))) ||
          ((norm.includes('ac') || norm.includes('technician') || norm.includes('cool')) && (role.includes('ac') || skills.some((s) => s.includes('ac') || s.includes('gas')))) ||
          (norm.includes('carpent') && (role.includes('carpent') || skills.some((s) => s.includes('wood') || s.includes('lock') || s.includes('hinge')))) ||
          (norm.includes('paint') && (role.includes('paint') || skills.some((s) => s.includes('paint') || s.includes('waterproof')))) ||
          (norm.includes('clean') && (role.includes('clean') || skills.some((s) => s.includes('clean') || s.includes('sanitiz')))) ||
          (norm.includes('appliance') && (role.includes('appliance') || skills.some((s) => s.includes('machine') || s.includes('fridge') || s.includes('microwave')))) ||
          (norm.includes('pest') && (role.includes('pest') || skills.some((s) => s.includes('termite') || s.includes('spray') || s.includes('bug'))));
        if (!roleMatches) return false;
      }
      if (w.distance > maxDistance) return false;
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
          {/* ── Nearby Workers Interactive Radar Map ── */}
          <NearbyWorkersMap
            workers={filtered}
            selectedLocation={selectedLocation}
            activeWorkerId={activeWorkerId}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            onSelectWorker={handleSelectWorkerFromMap}
            onBookWorker={handleInitiateBooking}
            onDetectLocation={handleDetectLocation}
            isDetecting={isDetecting}
          />

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
              {/* Distance Radius Range Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 600 }}>Distance Radius:</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--teal)' }}>
                  {maxDistance >= 25 ? '25+ km' : `Within ${maxDistance} km`}
                </span>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(+e.target.value)}
                  style={{ width: 100, accentColor: 'var(--teal)', cursor: 'pointer' }}
                  title="Adjust search radius for nearby technicians"
                />
              </div>

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
                  setMaxDistance(10);
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
                  id={`worker-card-${worker.id}`}
                  className={`card hover-lift animate-fade-in ${activeWorkerId === worker.id ? 'worker-card-highlight' : ''}`}
                  style={{
                    padding: '22px',
                    borderRadius: 'var(--radius-lg)',
                    border: activeWorkerId === worker.id ? '2px solid var(--primary)' : '1.5px solid var(--line)',
                    background: 'var(--card)',
                    boxShadow: activeWorkerId === worker.id ? '0 12px 30px rgba(13, 86, 203, 0.16)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.25s ease',
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
                      onClick={() => setProfileWorker(worker)}
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

      {/* ── Single Worker Profile Card Modal (On Same Screen) ── */}
      {profileWorker && typeof document !== 'undefined' && createPortal(
        <div
          className="worker-profile-card-modal-backdrop"
          onClick={() => setProfileWorker(null)}
        >
          <div
            className="worker-profile-single-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="worker-profile-single-card-header">
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      background: profileWorker.color || '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: 26,
                      boxShadow: `0 6px 18px ${profileWorker.color || '#7c3aed'}40`,
                      flexShrink: 0,
                    }}
                  >
                    {profileWorker.initials || (profileWorker.name ? profileWorker.name.split(' ').map(n=>n[0]).join('') : 'SV')}
                  </div>
                  {profileWorker.available && (
                    <span
                      title="Available for immediate booking"
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#22c55e',
                        border: '2.5px solid #ffffff',
                      }}
                    />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                      {profileWorker.name}
                    </h2>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 999,
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      ✓ Verified Pro
                    </span>
                    {profileWorker.badge && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        {profileWorker.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.92rem', color: 'var(--slate)', fontWeight: 600, marginTop: 4 }}>
                    {profileWorker.role} · <span style={{ color: 'var(--coral2)' }}>{profileWorker.exp}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 8 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)' }}>
                      <span style={{ color: '#f59e0b' }}>★</span>
                      <span>{profileWorker.rating}</span>
                      <span style={{ color: 'var(--mute)', fontWeight: 500, fontSize: '0.8rem' }}>({profileWorker.reviews} reviews)</span>
                    </div>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.86rem', color: 'var(--slate)', fontWeight: 600 }}>
                      <span style={{ color: '#ef4444' }}>📍</span>
                      <span>{profileWorker.distance} km away</span>
                    </div>

                    <div
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: profileWorker.available ? '#f0fdf4' : '#fef2f2',
                        color: profileWorker.available ? '#15803d' : '#b91c1c',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: `1px solid ${profileWorker.available ? '#bbf7d0' : '#fecaca'}`,
                      }}
                    >
                      {profileWorker.available ? '● Available for Immediate Dispatch' : '● Currently Busy'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="worker-profile-close-btn"
                onClick={() => setProfileWorker(null)}
                title="Close Profile"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="worker-profile-single-card-body">
              {/* About & Bio */}
              <div className="worker-profile-section-box">
                <div className="worker-profile-section-title">
                  <span>👨‍🔧</span> About {profileWorker.name}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate)', lineHeight: 1.6 }}>
                  {profileWorker.role?.toLowerCase().includes('plumb')
                    ? `${profileWorker.name} is a master-certified plumbing technician with ${profileWorker.exp} of dedicated field experience across residential societies, apartments, and villas. He specializes in non-invasive acoustic leak detection, motorized drain snake unclogging, high-pressure geyser installation, and concealed pipe fitting with zero unnecessary damage to wall tiles.`
                    : profileWorker.role?.toLowerCase().includes('elect')
                    ? `${profileWorker.name} is a licensed professional electrician with ${profileWorker.exp} of hands-on experience handling high-voltage distribution, concealed house wiring, MCB trip diagnostics, and inverter setups. Known for meticulous safety compliance and clean wire dressing.`
                    : profileWorker.role?.toLowerCase().includes('ac')
                    ? `${profileWorker.name} is a certified HVAC cooling technician with ${profileWorker.exp} in residential and commercial cooling systems. Expert in power jet foam washing, R32 / R410A gas refills, copper piping brazing, and inverter PCB troubleshooting.`
                    : `${profileWorker.name} is a top-rated Fixovia verified ${profileWorker.role} with ${profileWorker.exp} of verified doorstep repair experience, maintaining an outstanding 98%+ customer satisfaction record with verified on-time arrival.`}
                </p>
              </div>

              {/* Specialized Skills */}
              <div className="worker-profile-section-box">
                <div className="worker-profile-section-title">
                  <span>⚡</span> Core Skills & Specializations
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(profileWorker.skills || ['Diagnosis & Repair', 'Component Replacement', 'Safety Inspection']).map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 14px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 999,
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: 'var(--ink)',
                      }}
                    >
                      • {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Credentials */}
              <div className="worker-profile-section-box">
                <div className="worker-profile-section-title">
                  <span>🛡️</span> Government ID & Background Verifications
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)' }}>Aadhaar UIDAI</div>
                      <small style={{ color: 'var(--mute)' }}>Government Identity Verified</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)' }}>Police Verification</div>
                      <small style={{ color: 'var(--mute)' }}>Clean Background Record</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)' }}>Skill Assessment</div>
                      <small style={{ color: 'var(--mute)' }}>Grade A+ Certified Pro</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <span style={{ color: 'var(--coral2)', fontWeight: 800 }}>🔐</span>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--ink)' }}>Doorstep OTP Guard</div>
                      <small style={{ color: 'var(--mute)' }}>Work starts after PIN match</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Card & Transparent Pricing */}
              <div className="worker-profile-section-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                  <div className="worker-profile-section-title" style={{ margin: 0 }}>
                    <span>🏷️</span> Standard Rate Card
                  </div>
                  <small style={{ color: '#1d4ed8', fontWeight: 700, background: '#eff6ff', padding: '2px 8px', borderRadius: 999 }}>
                    No Hidden Charges
                  </small>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <b style={{ fontSize: '0.88rem' }}>Doorstep Inspection & Diagnosis</b>
                      <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>Credited toward final bill if repair is accepted</div>
                    </div>
                    <b style={{ color: 'var(--coral2)', fontSize: '0.94rem' }}>₹{profileWorker.rate}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <b style={{ fontSize: '0.88rem' }}>Minor Repair & Washer/Part Tuning</b>
                      <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>E.g. tap cartridge, minor leak, switch fix</div>
                    </div>
                    <b style={{ color: 'var(--coral2)', fontSize: '0.94rem' }}>From ₹199</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div>
                      <b style={{ fontSize: '0.88rem' }}>Standard Repair / Unclog / Assembly</b>
                      <div style={{ fontSize: '0.78rem', color: 'var(--mute)' }}>Drain snake, pipe joint replacement, valve fit</div>
                    </div>
                    <b style={{ color: 'var(--coral2)', fontSize: '0.94rem' }}>From ₹399</b>
                  </div>
                </div>
              </div>

              {/* Professional Tools Carried */}
              <div className="worker-profile-section-box">
                <div className="worker-profile-section-title">
                  <span>🧰</span> Professional Equipment Brought on Visit
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(profileWorker.role?.toLowerCase().includes('plumb')
                    ? ['Rotary Electric Drain Auger', 'Ultrasonic Pipe Leak Sensor', 'Digital Pressure Gauge', 'PPR Pipe Welder', 'Basin Wrench', 'Compression Fittings Kit']
                    : profileWorker.role?.toLowerCase().includes('elect')
                    ? ['True-RMS Digital Multimeter', '1000V Insulated VDE Tools', 'Non-Contact Voltage Detector', 'Conduit Wire Puller', 'Infrared Thermal Tester']
                    : profileWorker.role?.toLowerCase().includes('ac')
                    ? ['High-Pressure Jet Washer', 'Digital Manifold Gauge', 'Dual-Stage Vacuum Pump', 'R32 Gas Scales', 'Fin Straightener']
                    : ['Precision Calibrated Tools', 'Protective Floor Drop Cloths', 'Certified Power Equipment']
                  ).map((tool, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--line)',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--slate)',
                      }}
                    >
                      ✓ {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Customer Testimonials */}
              <div className="worker-profile-section-box">
                <div className="worker-profile-section-title">
                  <span>⭐</span> Recent Customer Reviews
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { user: 'Pooja Narang', area: 'Sector 21', rating: 5, comment: `Arrived on time and diagnosed our issue quickly without any fuss. Verified pro!` },
                    { user: 'Vikram Chawla', area: 'Model Town', rating: 5, comment: `Brought professional equipment, very clean workmanship, and no hidden fees.` },
                  ].map((rev, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', background: '#ffffff', borderRadius: 10, border: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <b style={{ fontSize: '0.86rem', color: 'var(--ink)' }}>{rev.user} · <span style={{ color: 'var(--mute)', fontWeight: 400 }}>{rev.area}</span></b>
                        <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★★★★★</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--slate)', lineHeight: 1.4 }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Card Footer */}
            <div className="worker-profile-single-card-footer">
              <div>
                <small style={{ color: 'var(--mute)', fontWeight: 600, display: 'block' }}>Fixed Inspection & Visit</small>
                <b style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>₹{profileWorker.rate}</b>
                <span style={{ fontSize: '0.78rem', color: '#16a34a', marginLeft: 8, fontWeight: 700 }}>Adjustable into labor</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setProfileWorker(null)}
                  style={{ padding: '9px 18px', fontSize: '0.9rem', borderRadius: 999 }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary btn-shine-effect"
                  onClick={() => {
                    const targetWorker = activeProfileWorker || profileWorker;
                    setProfileWorker(null);
                    handleInitiateBooking(targetWorker);
                  }}
                  style={{ padding: '9px 22px', fontSize: '0.92rem', fontWeight: 800, borderRadius: 999 }}
                >
                  Book Appointment with {(activeProfileWorker || profileWorker).name.split(' ')[0]} →
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Booking Modal (Only accessible if logged in) */}
      {activeBookingWorker && user && (
        <BookingModal
          worker={activeBookingWorker}
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
