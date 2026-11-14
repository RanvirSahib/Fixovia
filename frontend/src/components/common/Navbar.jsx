import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ currentPage, onNavigate, onOpenBooking }) {
  const { user, role, logout } = useAuth();
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY <= 20) {
            setNavHidden(false);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
            // Scrolling down -> hide navbar
            setNavHidden(true);
          } else if (currentScrollY < lastScrollY.current - 12) {
            // Scrolling up -> reveal navbar
            setNavHidden(false);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (targetId) => {
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={navHidden ? 'nav-hidden' : ''}>
      <div className="wrap">
        {/* ── Brand Logo ── */}
        <a
          className="logo"
          href={user ? undefined : "#top"}
          onClick={(e) => {
            e.preventDefault();
            if (user) return;
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={user ? { cursor: 'default' } : {}}
          aria-label="Fixovia – Verified home repair"
        >
          <img
            src="/logo.png"
            alt="Fixovia – On-Demand Home Repairs"
            style={{ height: '46px', width: 'auto', display: 'block' }}
          />
        </a>

        {/* ── Desktop Navigation Links (Guest / Public Only) ── */}
        {!user && (
          <ul>
          <li>
            <button
              onClick={() => onNavigate('services')}
              className={currentPage === 'services' ? 'active' : ''}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.96rem',
                fontWeight: currentPage === 'services' ? 800 : 600,
                color: currentPage === 'services' ? 'var(--coral2)' : 'var(--slate)',
                position: 'relative',
                padding: '4px 0',
              }}
            >
              Services
              {currentPage === 'services' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    background: 'var(--coral2)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('how')}
              className={currentPage === 'how' ? 'active' : ''}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.96rem',
                fontWeight: currentPage === 'how' ? 800 : 600,
                color: currentPage === 'how' ? 'var(--coral2)' : 'var(--slate)',
                position: 'relative',
                padding: '4px 0',
              }}
            >
              How it works
              {currentPage === 'how' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    background: 'var(--coral2)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('safety')}
              className={currentPage === 'safety' ? 'active' : ''}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.96rem',
                fontWeight: currentPage === 'safety' ? 800 : 600,
                color: currentPage === 'safety' ? 'var(--coral2)' : 'var(--slate)',
                position: 'relative',
                padding: '4px 0',
              }}
            >
              Safety PIN
              {currentPage === 'safety' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    background: 'var(--coral2)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('pricing')}
              className={currentPage === 'pricing' ? 'active' : ''}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.96rem',
                fontWeight: currentPage === 'pricing' ? 800 : 600,
                color: currentPage === 'pricing' ? 'var(--coral2)' : 'var(--slate)',
                position: 'relative',
                padding: '4px 0',
              }}
            >
              Pricing
              {currentPage === 'pricing' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    background: 'var(--coral2)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('find')}
              className={currentPage === 'find' ? 'active' : ''}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.96rem',
                fontWeight: currentPage === 'find' ? 800 : 600,
                color: currentPage === 'find' ? 'var(--coral2)' : 'var(--slate)',
                position: 'relative',
                padding: '4px 0',
              }}
            >
              Find Pros
              {currentPage === 'find' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    background: 'var(--coral2)',
                    borderRadius: 999,
                  }}
                />
              )}
            </button>
          </li>
        </ul>
        )}

        {/* ── Right Actions ── */}
        <div className="nr">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentPage !== 'find' && (
                <button
                  className="btn sm o"
                  onClick={() => onNavigate('find')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                  title="Find nearby pros on map"
                >
                  📍 Find Pros
                </button>
              )}
              <button
                className="btn sm p"
                onClick={() => onNavigate('dashboard')}
                title={`Open ${role === 'worker' ? 'Partner Workspace' : role === 'admin' ? 'Admin Panel' : 'Customer Dashboard'}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {role === 'worker' ? '⚡ Workspace' : role === 'admin' ? '🛡️ Admin' : '📋 Dashboard'}
              </button>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'var(--bg2)',
                  border: '1px solid var(--line)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </span>
                <span>{user.name?.split(' ')[0]}</span>
              </div>
              <button
                className="btn sm g"
                onClick={() => { logout(); onNavigate('home'); }}
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn sm g"
                onClick={() => onNavigate('auth')}
                style={{ display: 'inline-flex' }}
              >
                Sign In
              </button>
              <button
                className="btn p"
                onClick={() => {
                  if (!user) {
                    onNavigate('auth');
                  } else if (onOpenBooking) {
                    onOpenBooking();
                  } else {
                    onNavigate('find');
                  }
                }}
              >
                Book a pro
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
