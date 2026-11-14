import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import FindWorkers from './pages/FindWorkers';
import WorkerProfile from './pages/WorkerProfile';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import SafetyPinPage from './pages/SafetyPinPage';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

/* ─────────────────────────────────────────
   Static fallback data (also used by pages)
   ───────────────────────────────────────── */
export const fallbackWorkers = [
  { id: 1, name: 'Raj Kumar', role: 'Electrician', rating: 4.9, reviews: 142, distance: 1.4, rate: 499, available: true, skills: ['Concealed Wiring', 'MCB Repair', 'Fan Overhaul'], initials: 'RK', color: '#0f766e', exp: '8 yrs exp', badge: 'Top Rated', coords: { x: 34, y: 36 } },
  { id: 2, name: 'Sanjay Verma', role: 'Plumber', rating: 4.8, reviews: 98, distance: 1.8, rate: 450, available: true, skills: ['Acoustic Leak Detection', 'Drain Snake', 'Geyser Fit'], initials: 'SV', color: '#7c3aed', exp: '6 yrs exp', badge: 'Master Plumber', coords: { x: 62, y: 32 } },
  { id: 3, name: 'Amit Singh', role: 'Carpenter', rating: 4.7, reviews: 88, distance: 2.5, rate: 599, available: true, skills: ['Smart Lock Installation', 'Hinge Tuning', 'Modular Bed'], initials: 'AS', color: '#b45309', exp: '10 yrs exp', badge: 'Wood Specialist', coords: { x: 72, y: 64 } },
  { id: 4, name: 'Priya Sharma', role: 'AC Technician', rating: 4.9, reviews: 215, distance: 1.2, rate: 399, available: true, skills: ['Power Jet Wash', 'R32 Gas Charge', 'PCB Diagnostics'], initials: 'PS', color: '#0369a1', exp: '7 yrs exp', badge: 'Super Pro', coords: { x: 28, y: 68 } },
  { id: 5, name: 'Vikram Rao', role: 'Electrician', rating: 4.6, reviews: 67, distance: 3.1, rate: 449, available: true, skills: ['Inverter Wiring', 'CCTV Setup', '16A Sockets'], initials: 'VR', color: '#059669', exp: '5 yrs exp', badge: 'Certified', coords: { x: 50, y: 76 } },
  { id: 6, name: 'Meena Gupta', role: 'Plumber', rating: 4.8, reviews: 110, distance: 0.9, rate: 420, available: true, skills: ['Diverter Repair', 'Tank Float Valve', 'Pipe Joint'], initials: 'MG', color: '#e11d48', exp: '9 yrs exp', badge: 'Quick Arrival', coords: { x: 44, y: 22 } },
  { id: 7, name: 'Gurpreet Gill', role: 'Painter', rating: 4.9, reviews: 82, distance: 2.1, rate: 799, available: true, skills: ['Waterproofing', 'Texture Paint', 'Crack Seal'], initials: 'GG', color: '#d97706', exp: '11 yrs exp', badge: 'Wall Artist', coords: { x: 78, y: 44 } },
  { id: 8, name: 'Simran Kaur', role: 'Cleaner', rating: 4.8, reviews: 124, distance: 1.6, rate: 399, available: true, skills: ['Kitchen Deep Clean', 'Bathroom Sanitizing', 'Floor Buff'], initials: 'SK', color: '#db2777', exp: '4 yrs exp', badge: 'Hygiene Pro', coords: { x: 22, y: 48 } },
  { id: 9, name: 'Rohan Mehra', role: 'Appliance Pro', rating: 4.7, reviews: 93, distance: 2.8, rate: 349, available: true, skills: ['Washing Machine', 'Microwave Magnetron', 'Refrigerator'], initials: 'RM', color: '#6366f1', exp: '7 yrs exp', badge: 'Chip Tech', coords: { x: 60, y: 80 } },
  { id: 10, name: 'Harish Chander', role: 'Pest Control', rating: 4.9, reviews: 156, distance: 2.2, rate: 599, available: true, skills: ['Odorless Termite Spray', 'Gel Baiting', 'Mosquito Fog'], initials: 'HC', color: '#16a34a', exp: '9 yrs exp', badge: 'Pest Shield', coords: { x: 38, y: 84 } },
  { id: 11, name: 'Baldev Singh', role: 'Carpenter', rating: 4.8, reviews: 105, distance: 3.4, rate: 549, available: true, skills: ['Wooden Flooring', 'Wardrobe Sliding', 'Sofa Polish'], initials: 'BS', color: '#854d0e', exp: '12 yrs exp', badge: 'Master Wood', coords: { x: 82, y: 26 } },
  { id: 12, name: 'Jaspreet Kaur', role: 'AC Technician', rating: 4.8, reviews: 118, distance: 1.9, rate: 420, available: true, skills: ['AC Copper Piping', 'Compressor Check', 'Foam Wash'], initials: 'JK', color: '#0284c7', exp: '6 yrs exp', badge: 'Cooling Expert', coords: { x: 18, y: 30 } },
];

export const fallbackServices = [
  { id: 1, name: 'Electrical', emoji: '⚡', startPrice: 199 },
  { id: 2, name: 'Plumbing', emoji: '🔧', startPrice: 199 },
  { id: 3, name: 'AC Repair', emoji: '❄️', startPrice: 499 },
  { id: 4, name: 'Carpentry', emoji: '🔨', startPrice: 249 },
  { id: 5, name: 'Painting', emoji: '🎨', startPrice: 999 },
  { id: 6, name: 'Cleaning', emoji: '🧹', startPrice: 399 },
  { id: 7, name: 'Appliances', emoji: '📱', startPrice: 299 },
  { id: 8, name: 'Pest Control', emoji: '🪲', startPrice: 599 },
];

/* ─────────────────────────────────────────
   Inner app — reads auth context
   ───────────────────────────────────────── */
function AppInner() {
  const { user, role } = useAuth();

  const getTradeFromHash = () => {
    const hash = window.location.hash || '';
    const match = hash.match(/[\?&]trade=([^&]+)/i);
    if (match) return decodeURIComponent(match[1]);
    const idMatch = hash.match(/[\?&]id=([^&]+)/i);
    if (idMatch) {
      const wid = parseInt(idMatch[1], 10);
      const w = fallbackWorkers.find(item => item.id === wid);
      if (w) return w.role;
    }
    return 'All';
  };

  const getWorkerFromHash = () => {
    const hash = window.location.hash || '';
    const match = hash.match(/[\?&]id=([^&]+)/i);
    const workerId = match ? parseInt(match[1], 10) : null;
    if (workerId) {
      return fallbackWorkers.find(w => w.id === workerId) || null;
    }
    return null;
  };

  const getPageFromHash = () => {
    const raw = (window.location.hash || '').replace('#', '').toLowerCase();
    if (
      raw.startsWith('login') ||
      raw.startsWith('auth') ||
      raw.startsWith('signin') ||
      raw.startsWith('register') ||
      raw.startsWith('signup') ||
      raw.startsWith('forgot')
    ) return 'auth';
    if (raw.startsWith('profile')) return 'find'; // Single card shown on the same search screen
    if (
      raw.startsWith('dashboard') ||
      raw.startsWith('customer') ||
      raw.startsWith('partner') ||
      raw.startsWith('admin')
    ) return 'dashboard';
    if (raw.startsWith('worker-dashboard') || raw === 'worker') return 'dashboard';
    if (raw.startsWith('find') || raw.startsWith('pros')) return 'find';
    if (raw.startsWith('services')) return 'services';
    if (raw.startsWith('how')) return 'how';
    if (raw.startsWith('safety')) return 'safety';
    if (raw.startsWith('pricing')) return 'pricing';
    if (raw.startsWith('home')) return 'home';
    return 'home';
  };

  const [page, setPage] = useState(getPageFromHash);
  const [selectedWorker, setSelectedWorker] = useState(() => getWorkerFromHash() || fallbackWorkers[1]);
  const [findCategory, setFindCategory] = useState(getTradeFromHash);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handleHash = () => {
      const newPage = getPageFromHash();
      setPage(newPage);
      setFindCategory(getTradeFromHash());
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = useCallback((target, data) => {
    if (target === 'profile' && data) {
      setSelectedWorker(data);
      const cat = data?.role || 'All';
      setFindCategory(cat);
      setPage('find');
      window.location.hash = `find?trade=${encodeURIComponent(cat)}&profile=${data.id}`;
    } else if (target === 'profile') {
      setPage('find');
      if (selectedWorker) {
        window.location.hash = `find?trade=${encodeURIComponent(selectedWorker.role || 'All')}&profile=${selectedWorker.id}`;
      } else {
        window.location.hash = 'find';
      }
    } else if (target === 'dashboard' || target === 'customer' || target === 'partner' || target === 'admin') {
      setPage('dashboard');
      window.location.hash = target;
    } else if (target === 'auth') {
      setPage('auth');
      window.location.hash = 'login';
    } else if (target === 'find') {
      const cat = data?.category || 'All';
      setFindCategory(cat);
      setPage('find');
      window.location.hash = cat !== 'All' ? `find?trade=${encodeURIComponent(cat)}` : 'find';
    } else if (target === 'services') {
      setPage('services');
      window.location.hash = 'services';
    } else if (target === 'how') {
      setPage('how');
      window.location.hash = 'how-it-works';
    } else if (target === 'safety') {
      setPage('safety');
      window.location.hash = 'safety-pin';
    } else if (target === 'pricing') {
      setPage('pricing');
      window.location.hash = 'pricing';
    } else if (target === 'home') {
      setPage('home');
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    } else {
      setPage(target);
      window.location.hash = target;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  // Reactive redirect: If user is authenticated and hash is #dashboard or page is auth, land on dashboard
  useEffect(() => {
    if (user && page === 'auth' && window.location.hash === '#dashboard') {
      setPage('dashboard');
    }
  }, [user, page]);

  /* Dashboard routing by role */
  const renderDashboard = () => {
    return <DashboardPage onNavigate={navigate} />;
  };

  const isStandalonePage = page === 'auth' || page === 'dashboard';
  const noFooterPages = ['auth', 'dashboard'];

  const renderPage = () => {
    switch (page) {
      case 'home':      return <Home onNavigate={navigate} />;
      case 'services':  return <ServicesPage onNavigate={navigate} />;
      case 'how':       return <HowItWorksPage onNavigate={navigate} />;
      case 'safety':    return <SafetyPinPage onNavigate={navigate} />;
      case 'pricing':   return <PricingPage onNavigate={navigate} />;
      case 'find':      return <FindWorkers onNavigate={navigate} initialCategory={findCategory} />;
      case 'profile':   return <WorkerProfile worker={selectedWorker} onNavigate={navigate} />;
      case 'dashboard': return renderDashboard();
      case 'auth':      return <AuthPage onNavigate={navigate} />;
      default:          return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isStandalonePage && <Navbar currentPage={page} onNavigate={navigate} />}

      <div style={{ flex: 1 }} className="page-transition-wrap" key={page}>
        {renderPage()}
      </div>

      {!isStandalonePage && !noFooterPages.includes(page) && <Footer onNavigate={navigate} />}

      {/* Mobile Scrolling Logo Bar (Phone View) */}
      {!isStandalonePage && (
        <aside className="mobile-bottom-nav" aria-label="Fixovia Mobile Brand Bar">
          <button
            onClick={() => {
              if (user) return;
              navigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={user ? { cursor: 'default' } : {}}
            title={user ? "Fixovia" : "Fixovia – Tap to return to top"}
            aria-label="Fixovia Home"
          >
            <img
              src="/logo.png"
              alt="Fixovia – On-Demand Home Repairs"
              style={{ height: 32, width: 'auto', display: 'block' }}
            />
          </button>
        </aside>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Root App — wraps providers
   ───────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  );
}
