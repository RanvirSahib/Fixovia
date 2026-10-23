import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentPage, onNavigate, onOpenBooking }) {
  const { user, role, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
    <nav>
      <div className="wrap">
        {/* ── Brand Logo ── */}
        <a
          className="logo"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Fixovia – Verified home repair"
        >
          <img
            src="/logo.png"
            alt="Fixovia – On-Demand Home Repairs"
            style={{ height: '46px', width: 'auto', display: 'block' }}
          />
        </a>

        {/* ── Desktop Navigation Links ── */}
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

        {/* ── Right Actions ── */}
        <div className="nr">
          <ThemeToggle theme={theme} onToggle={toggleTheme} size={40} />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn sm p"
                onClick={() => onNavigate('dashboard')}
                title={`Open ${role === 'worker' ? 'Partner Workspace' : role === 'admin' ? 'Admin Panel' : 'My Bookings'}`}
              >
                {role === 'worker' ? '⚡ Workspace' : role === 'admin' ? '🛡️ Admin' : '📋 Bookings'} ({user.name?.split(' ')[0]})
              </button>
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
