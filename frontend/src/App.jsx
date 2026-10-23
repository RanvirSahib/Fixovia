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

/* ─────────────────────────────────────────
   Static fallback data (also used by pages)
   ───────────────────────────────────────── */
export const fallbackWorkers = [
  { id: 1, name: 'Raj Kumar',    role: 'Electrician',   rating: 4.9, reviews: 142, distance: 1.8, rate: 499, available: true,  skills: ['Wiring', 'MCB Repair', 'Fan Install'],    initials: 'RK', color: '#0f766e' },
  { id: 2, name: 'Sanjay Verma', role: 'Plumber',       rating: 4.8, reviews: 98,  distance: 2.3, rate: 450, available: true,  skills: ['Leak Fix', 'Pipe Fitting', 'Drain Unclog'], initials: 'SV', color: '#7c3aed' },
  { id: 3, name: 'Amit Singh',   role: 'Carpenter',     rating: 4.7, reviews: 88,  distance: 3.1, rate: 599, available: false, skills: ['Furniture', 'Door Locks', 'Wood Polish'],   initials: 'AS', color: '#b45309' },
  { id: 4, name: 'Priya Sharma', role: 'AC Technician', rating: 4.9, reviews: 215, distance: 2.5, rate: 399, available: true,  skills: ['AC Cleaning', 'Gas Refill', 'Cooling Fix'],  initials: 'PS', color: '#0369a1' },
  { id: 5, name: 'Vikram Rao',   role: 'Electrician',   rating: 4.6, reviews: 67,  distance: 4.0, rate: 449, available: true,  skills: ['Inverter', 'CCTV', 'Wiring'],               initials: 'VR', color: '#059669' },
  { id: 6, name: 'Meena Gupta',  role: 'Plumber',       rating: 4.8, reviews: 110, distance: 1.5, rate: 420, available: true,  skills: ['Tap Install', 'Geyser', 'Pipe Work'],       initials: 'MG', color: '#e11d48' },
];

export const fallbackServices = [
  { id: 1, name: 'Electrical',   emoji: '⚡', startPrice: 199 },
  { id: 2, name: 'Plumbing',     emoji: '🔧', startPrice: 199 },
  { id: 3, name: 'AC Repair',    emoji: '❄️', startPrice: 499 },
  { id: 4, name: 'Carpentry',    emoji: '🔨', startPrice: 249 },
  { id: 5, name: 'Painting',     emoji: '🎨', startPrice: 999 },
  { id: 6, name: 'Cleaning',     emoji: '🧹', startPrice: 399 },
  { id: 7, name: 'Appliances',   emoji: '📱', startPrice: 299 },
  { id: 8, name: 'Pest Control', emoji: '🪲', startPrice: 599 },
];

/* ─────────────────────────────────────────
   Inner app — reads auth context
   ───────────────────────────────────────── */
function AppInner() {
  const { user, role } = useAuth();

  const getPageFromHash = () => {
    const raw = (window.location.hash || '').replace('#', '').toLowerCase();
    if (raw === 'login' || raw === 'auth' || raw === 'signin' || raw === 'register') return 'auth';
    if (raw === 'dashboard') return 'dashboard';
    if (raw === 'find' || raw === 'pros') return 'find';
    if (raw === 'services') return 'services';
    if (raw === 'how' || raw === 'how-it-works' || raw === 'howitworks') return 'how';
    if (raw === 'safety' || raw === 'safety-pin' || raw === 'safetypin') return 'safety';
    if (raw === 'pricing') return 'pricing';
    if (raw === 'home') return 'home';
    return 'home';
  };

  const [page, setPage]                     = useState(getPageFromHash);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handleHash = () => {
      setPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = useCallback((target, data) => {
    if (target === 'profile' && data) {
      setSelectedWorker(data);
      setPage('profile');
      window.location.hash = 'profile';
    } else if (target === 'dashboard') {
      const activeUser = user || (() => {
        try {
          return JSON.parse(localStorage.getItem('fixovia_user'));
        } catch {
          return null;
        }
      })();
      if (!activeUser) {
        setPage('auth');
        window.location.hash = 'login';
      } else {
        setPage('dashboard');
        window.location.hash = 'dashboard';
      }
    } else if (target === 'auth') {
      setPage('auth');
      window.location.hash = 'login';
    } else if (target === 'find') {
      setPage('find');
      window.location.hash = 'find';
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
    const activeUser = user || (() => {
      try {
        return JSON.parse(localStorage.getItem('fixovia_user'));
      } catch {
        return null;
      }
    })();
    if (!activeUser) return <AuthPage onNavigate={navigate} />;
    const activeRole = activeUser.role;
    if (activeRole === 'worker') return <WorkerDashboard />;
    if (activeRole === 'admin')  return <AdminDashboard />;
    return <CustomerDashboard />;
  };

  const isAuthPage = page === 'auth';
  const noFooterPages = ['auth'];

  const renderPage = () => {
    switch (page) {
      case 'home':      return <Home onNavigate={navigate} />;
      case 'services':  return <ServicesPage onNavigate={navigate} />;
      case 'how':       return <HowItWorksPage onNavigate={navigate} />;
      case 'safety':    return <SafetyPinPage onNavigate={navigate} />;
      case 'pricing':   return <PricingPage onNavigate={navigate} />;
      case 'find':      return <FindWorkers onNavigate={navigate} />;
      case 'profile':   return <WorkerProfile worker={selectedWorker} onNavigate={navigate} />;
      case 'dashboard': return renderDashboard();
      case 'auth':      return <AuthPage onNavigate={navigate} />;
      default:          return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAuthPage && <Navbar currentPage={page} onNavigate={navigate} />}

      <div style={{ flex: 1 }} className="page-transition-wrap" key={page}>
        {renderPage()}
      </div>

      {!noFooterPages.includes(page) && <Footer onNavigate={navigate} />}

      {/* Mobile Scrolling Logo Bar (Phone View) */}
      {!isAuthPage && (
        <aside className="mobile-bottom-nav" aria-label="Fixovia Mobile Brand Bar">
          <button
            onClick={() => {
              navigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Fixovia – Tap to return to top"
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
