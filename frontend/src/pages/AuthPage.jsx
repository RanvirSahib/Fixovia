import { useState, useEffect } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function AuthPage({ onNavigate }) {
  const { login, register, loading, error } = useAuth();
  const toast = useToast();

  const [tab, setTab]             = useState('customer'); // 'customer' | 'partner'
  const [mode, setMode]           = useState('signin');   // 'signin' | 'register'
  const [email, setEmail]         = useState('customer@fixovia.in');
  const [password, setPassword]   = useState('demo123');
  const [name, setName]           = useState('');
  const [showPassword, setShowPw] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [theme, setTheme]         = useState(() => document.documentElement.getAttribute('data-theme') || 'light');

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync demo credentials when tab changes
  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
    const demoKey = selectedTab === 'partner' ? 'worker' : selectedTab;
    const demo = DEMO_ACCOUNTS[demoKey];
    if (demo && mode === 'signin') {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assignedRole = tab === 'partner' ? 'worker' : 'customer';
      if (mode === 'signin') {
        await login(email, password, assignedRole);
      } else {
        await register({ name, email, password, role: assignedRole });
      }
      setIsSuccess(true);
      toast.success(
        mode === 'signin'
          ? `Welcome back! Entering your ${tab === 'partner' ? 'Partner Workspace' : 'Customer Dashboard'} 👋`
          : 'Account created! Welcome to Fixovia 🎉',
      );
      setTimeout(() => {
        onNavigate('dashboard');
      }, 420);
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    }
  };

  const quickLogin = async (targetRole) => {
    const demo = DEMO_ACCOUNTS[targetRole];
    if (!demo) return;
    setTab(targetRole === 'worker' ? 'partner' : targetRole);
    setEmail(demo.email);
    setPassword(demo.password);
    try {
      await login(demo.email, demo.password, targetRole);
      setIsSuccess(true);
      toast.success(`Logged in as ${demo.name} (${targetRole === 'worker' ? 'Partner' : 'Customer'})`);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 420);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic Ambient Mesh Background */}
      <div className="auth-mesh-bg" />

      {/* ── Top Dedicated Navigation Bar (Compact 56px) ── */}
      <header
        style={{
          position: 'relative',
          zIndex: 40,
          background: 'color-mix(in srgb, var(--card) 85%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--line)',
          height: 56,
          flexShrink: 0,
        }}
      >
        <div
          className="wrap auth-header-wrap"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            gap: 12,
          }}
        >
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              flexShrink: 0,
            }}
            title="Return to Fixovia Home"
          >
            <img
              src="/logo.png"
              alt="Fixovia"
              className="auth-logo-img"
              style={{ height: 36, width: 'auto', display: 'block' }}
            />
          </button>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <ThemeToggle theme={theme} onToggle={toggleTheme} size={34} />

            <button
              onClick={() => onNavigate('home')}
              className="btn-outline auth-back-btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              <span className="auth-back-label-desktop">← Back to Website</span>
              <span className="auth-back-label-mobile">← Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Auth Stage (Fitted in Remaining Viewport Height) ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div className={`auth-split-grid ${tab === 'partner' ? 'partner-layout' : 'customer-layout'}`}>
          {/* ══════════════════════════════════════════
              LOGIN CARD COLUMN: Left for Customer, Right for Partner
             ══════════════════════════════════════════ */}
          <div className="auth-form-column">
            <div style={{ width: '100%', maxWidth: 430, margin: '0 auto' }}>
              <div
                className="card auth-card-glow"
                style={{
                  padding: '26px 28px 22px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--card)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: tab === 'partner' ? '1px solid rgba(16, 185, 129, 0.32)' : '1px solid rgba(37, 99, 235, 0.26)',
                  boxShadow: tab === 'partner'
                    ? '0 24px 60px -12px rgba(16, 185, 129, 0.22), 0 0 0 1px rgba(16, 185, 129, 0.15), var(--shadow-xl)'
                    : '0 24px 60px -12px rgba(37, 99, 235, 0.22), 0 0 0 1px rgba(37, 99, 235, 0.15), var(--shadow-xl)',
                  transform: isSuccess
                    ? (tab === 'partner' ? 'translateX(100px)' : 'translateX(-100px)')
                    : 'translateX(0)',
                  opacity: isSuccess ? 0 : 1,
                  transition: 'transform 0.42s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.38s ease, box-shadow 0.45s ease, border-color 0.45s ease',
                }}
              >
              {/* Dynamic Animated Gradient Accent Bar */}
              <div
                className="auth-gradient-bar"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: tab === 'partner'
                    ? 'linear-gradient(90deg, #059669, #0d9488, #06b6d4, #059669)'
                    : 'linear-gradient(90deg, #2563eb, #06b6d4, #0d9488, #2563eb)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientSlide 4s ease infinite',
                }}
              />

              {/* Card Header */}
              <div style={{ marginBottom: 16 }}>

                <h1
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--charcoal)',
                    letterSpacing: '-0.02em',
                    marginBottom: 3,
                    lineHeight: 1.2,
                  }}
                >
                  {mode === 'signin' ? 'Welcome back' : 'Create account'}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.4 }}>
                  {mode === 'signin'
                    ? 'Sign in to access your bookings, live tracking and verified pros.'
                    : 'Join thousands of happy homeowners and certified pros on Fixovia.'}
                </p>
              </div>

              {/* Role Switcher Tabs (Fluid Sliding Pill Segmented Control) */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  background: 'var(--bg-stone-100)',
                  padding: 4,
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 16,
                  border: '1px solid var(--line)',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }}
              >
                {/* Buttery-Smooth Gliding Slider Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    bottom: 4,
                    left: 4,
                    width: 'calc(50% - 4px)',
                    borderRadius: 'var(--radius-full)',
                    transform: tab === 'partner' ? 'translateX(100%)' : 'translateX(0%)',
                    transition: 'transform 0.44s cubic-bezier(0.34, 1.45, 0.64, 1), background 0.35s ease, box-shadow 0.35s ease',
                    background: tab === 'partner'
                      ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)'
                      : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: tab === 'partner'
                      ? '0 6px 20px -2px rgba(5, 150, 105, 0.52), inset 0 1px 1.5px rgba(255, 255, 255, 0.45)'
                      : '0 6px 20px -2px rgba(37, 99, 235, 0.52), inset 0 1px 1.5px rgba(255, 255, 255, 0.45)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  }}
                />

                {[
                  {
                    id: 'customer',
                    label: 'Customer',
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                  },
                  {
                    id: 'partner',
                    label: 'Partner / Pro',
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    ),
                  },
                ].map((t) => {
                  const isActive = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTabChange(t.id)}
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        flex: 1,
                        padding: '9px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        background: 'transparent',
                        color: isActive ? '#ffffff' : 'var(--slate)',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'color 0.25s ease, transform 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--charcoal)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--slate)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.96)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span
                        key={`${t.id}-${isActive}`}
                        className={isActive ? 'animate-tab-icon' : ''}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        {t.icon}
                      </span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Fields with role-transition slide */}
              <form key={tab} className="animate-role-slide" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mode === 'register' && (
                    <div className="animate-fade-in">
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--charcoal)', display: 'block', marginBottom: 4 }}>
                        Full Name
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="e.g. Arjun Mehta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--charcoal)', display: 'block', marginBottom: 4 }}>
                      Email Address
                    </label>
                    <input
                      className="input"
                      type="email"
                      placeholder={tab === 'partner' ? 'worker@fixovia.in' : 'customer@fixovia.in'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus={mode === 'signin'}
                      style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--charcoal)' }}>
                        Password
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => toast.info('Default demo password is demo123 (or use 1-click login below)')}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 11,
                            color: 'var(--primary)',
                            fontWeight: 600,
                          }}
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '10px 42px 10px 14px', fontSize: '0.9rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--slate)',
                          padding: 6,
                          borderRadius: 'var(--radius-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s ease, transform 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = tab === 'partner' ? '#059669' : '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--slate)';
                        }}
                      >
                        {showPassword ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="animate-shake"
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 12,
                        color: '#ef4444',
                        fontWeight: 600,
                      }}
                    >
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Submit Button with Dynamic Role Gradient, Glow & Shimmer */}
                  <button
                    type="submit"
                    className="btn-shine-effect"
                    disabled={loading || isSuccess}
                    style={{
                      width: '100%',
                      padding: '13px',
                      fontSize: '0.96rem',
                      marginTop: 4,
                      borderRadius: 10,
                      fontWeight: 800,
                      letterSpacing: '-0.01em',
                      border: 'none',
                      color: '#ffffff',
                      background: tab === 'partner'
                        ? 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)'
                        : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0d9488 100%)',
                      boxShadow: tab === 'partner'
                        ? '0 8px 24px -4px rgba(5, 150, 105, 0.42)'
                        : '0 8px 24px -4px rgba(37, 99, 235, 0.42)',
                      cursor: loading || isSuccess ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {isSuccess ? (
                      <span className="animate-success-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        ✓ Success! Redirecting…
                      </span>
                    ) : loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span className="animate-spin">⏳</span> Signing in…
                      </span>
                    ) : mode === 'signin' ? (
                      `Sign In as ${tab === 'partner' ? 'Pro Partner' : 'Customer'} →`
                    ) : (
                      'Create Account & Start →'
                    )}
                  </button>
                </div>
              </form>

              {/* Mode Toggle */}
              <div style={{ textAlign: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--line)' }}>
                <span style={{ fontSize: 13, color: 'var(--slate)' }}>
                  {mode === 'signin' ? 'New to Fixovia? ' : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                    color: tab === 'partner' ? '#059669' : 'var(--primary)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {mode === 'signin'
                    ? (tab === 'partner' ? 'Apply as Partner' : 'Create Free Account')
                    : 'Sign In'
                  }
                </button>
              </div>
            </div>

            {/* ── Quick Demo Login (Customer & Partner with Interactive Highlights) ── */}
            <div
              className="card animate-fade-in"
              style={{
                marginTop: 12,
                padding: '12px 14px',
                background: 'var(--card)',
                border: '1px dashed var(--line)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>⚡ Instant One-Click Demo Access</span>
                <span style={{ color: tab === 'partner' ? '#059669' : 'var(--teal)', fontWeight: 700, transition: 'color 0.3s ease' }}>Direct Login</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    handleTabChange('customer');
                    quickLogin('customer');
                  }}
                  disabled={loading || isSuccess}
                  className="hover-lift"
                  style={{
                    padding: '9px 12px',
                    background: tab === 'customer' ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg2)',
                    border: tab === 'customer' ? '1.5px solid #2563eb' : '1.5px solid var(--line)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textAlign: 'left',
                    transition: 'all 0.25s ease',
                    boxShadow: tab === 'customer' ? '0 2px 10px rgba(37, 99, 235, 0.15)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#2563eb18',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#2563eb' }}>Customer Demo</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)', opacity: 0.85 }}>Arjun Mehta</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleTabChange('partner');
                    quickLogin('worker');
                  }}
                  disabled={loading || isSuccess}
                  className="hover-lift"
                  style={{
                    padding: '9px 12px',
                    background: tab === 'partner' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg2)',
                    border: tab === 'partner' ? '1.5px solid #059669' : '1.5px solid var(--line)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textAlign: 'left',
                    transition: 'all 0.25s ease',
                    boxShadow: tab === 'partner' ? '0 2px 10px rgba(5, 150, 105, 0.15)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#16a34a18',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#16a34a' }}>Pro Partner Demo</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)', opacity: 0.85 }}>Raj Kumar (Electrician)</div>
                  </div>
                </button>
              </div>
            </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════
              HERO PHOTO COLUMN: Dynamic Cross-Fading Renders
             ═════════════════════════════════════════════════ */}
          <div
            className="auth-hero-half"
            style={{
              opacity: isSuccess ? 0 : 1,
            }}
          >
            {/* Customer 3D Cartoon: Phone held naturally on their side, looking down at screen */}
            <img
              src="/customer-auth-hero.jpg?v=natural"
              alt="Fixovia Customer Booking Service"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 22%',
                opacity: tab === 'customer' ? 1 : 0,
                transform: tab === 'customer'
                  ? 'scale(1.05) translateY(-22px)'
                  : 'scale(1.08) translateX(28px) translateY(-22px)',
                transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: tab === 'customer' ? 'auto' : 'none',
                display: 'block',
              }}
            />

            {/* Partner 3D Cartoon: Technician and full tool kit 100% visible in 1:1 waist-up portrait */}
            <img
              src="/partner-auth-hero.jpg?v=1to1"
              alt="Fixovia Certified Pro Technician"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                opacity: tab === 'partner' ? 1 : 0,
                transform: tab === 'partner' ? 'scale(1) translateX(0)' : 'scale(1.06) translateX(-28px)',
                transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: tab === 'partner' ? 'auto' : 'none',
                display: 'block',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
