import { useState, useEffect, useRef } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/signin.css';

export const TRADE_OPTIONS = [
  { value: 'Electrician', label: 'Electrician', icon: '⚡', desc: 'Wiring, MCBs, fans, switches' },
  { value: 'Plumber', label: 'Plumber', icon: '🔧', desc: 'Leaks, taps, pipes, geysers' },
  { value: 'AC technician', label: 'AC technician', icon: '❄️', desc: 'Deep cleaning, gas refill, PCB' },
  { value: 'Carpenter', label: 'Carpenter', icon: '🔨', desc: 'Furniture, locks, fittings' },
  { value: 'Painter', label: 'Painter', icon: '🎨', desc: 'Waterproofing, walls & woodwork' },
  { value: 'Cleaner', label: 'Deep Cleaner', icon: '🧹', desc: 'Kitchen & bathroom deep cleaning' },
];

export const TRADE_DEFAULT_RATES = {
  'Electrician': 499,
  'Plumber': 450,
  'AC technician': 399,
  'Carpenter': 599,
  'Painter': 799,
  'Cleaner': 399,
};

export default function AuthPage({ onNavigate }) {
  const { login, register, updateUser } = useAuth();
  const toast = useToast();

  const [role, setRole]           = useState(() => {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    if (hash.includes('partner') || hash.includes('worker') || search.includes('partner') || search.includes('worker')) {
      return 'partner';
    }
    return 'customer';
  });
  const [up, setUp]               = useState(() => (window.location.hash || '').toLowerCase().includes('register') || (window.location.hash || '').toLowerCase().includes('signup'));      // false = signin, true = register
  const [name, setName]           = useState('');
  const [regEmail, setRegEmail]   = useState('');
  const [phone, setPhone]         = useState('');
  const [trade, setTrade]         = useState('');
  const [visitRate, setVisitRate] = useState(() => {
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    if (hash.includes('partner') || hash.includes('worker') || search.includes('partner') || search.includes('worker')) {
      return 499;
    }
    return '';
  });
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const tradeRef                  = useRef(null);
  const [identifier, setIdentifier] = useState('customer@fixovia.in');
  const [rem, setRem]             = useState(true);

  // OTP Verification States
  const [otpStep, setOtpStep]     = useState(false); // false = info entry, true = 4-digit OTP view
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer]   = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError]   = useState('');
  const otpInputRefs              = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Partner KYC Profile Completion States (Aadhaar & PAN upload)
  const [showPartnerKyc, setShowPartnerKyc] = useState(false);
  const [kycAadharFile, setKycAadharFile]   = useState('');
  const [kycAadharNo, setKycAadharNo]       = useState('');
  const [kycPanFile, setKycPanFile]         = useState('');
  const [kycPanNo, setKycPanNo]             = useState('');
  const [kycSubmitted, setKycSubmitted]     = useState(false);
  const [kycErrors, setKycErrors]           = useState({});
  const aadharFileRef                       = useRef(null);
  const panFileRef                          = useRef(null);

  const [errors, setErrors]       = useState({});
  const [shake, setShake]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [okTitle, setOkTitle]     = useState('You’re in!');
  const [okMsg, setOkMsg]         = useState('');

  // Forgot password card state (kept for backup account recovery)
  const [forgot, setForgot]                     = useState(() => (window.location.hash || '').toLowerCase().includes('forgot'));
  const [forgotInput, setForgotInput]           = useState('');
  const [forgotError, setForgotError]           = useState('');
  const [forgotSuccess, setForgotSuccess]       = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  // Enhanced animations for role switching & sign-in interactions
  const [roleAnimDir, setRoleAnimDir]   = useState(null); // 'to-partner' | 'to-customer'
  const [fieldPulse, setFieldPulse]     = useState(false);
  const [btnRipples, setBtnRipples]     = useState([]);

  const redirectTimerRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // OTP Resend Countdown Timer
  useEffect(() => {
    if (otpStep && otpTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [otpStep, otpTimer]);

  useEffect(() => {
    const handleHash = () => {
      const raw = (window.location.hash || '').replace('#', '').toLowerCase();
      if (raw.includes('forgot')) {
        setForgot(true);
        setForgotSuccess(false);
      } else if (raw.includes('register') || raw.includes('signup')) {
        setUp(true);
        setForgot(false);
        setOtpStep(false);
      } else if (raw === 'login' || raw === 'signin' || raw === 'auth') {
        setUp(false);
        setForgot(false);
        setOtpStep(false);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Close custom trade dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tradeRef.current && !tradeRef.current.contains(e.target)) {
        setIsTradeOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsTradeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const clearErr = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
    setOtpError('');
  };

  const handleRoleChange = (selectedRole) => {
    if (selectedRole === role) return;
    const dir = selectedRole === 'partner' ? 'to-partner' : 'to-customer';
    setRoleAnimDir(dir);
    setRole(selectedRole);
    clearAllErrors();
    setOtpStep(false);
    setShowPartnerKyc(false);
    setKycSubmitted(false);
    setFieldPulse(true);
    setTimeout(() => setFieldPulse(false), 550);
    setTimeout(() => setRoleAnimDir(null), 380);

    if (!up) {
      if (selectedRole === 'partner') {
        setIdentifier(DEMO_ACCOUNTS.worker.email);
      } else {
        setIdentifier(DEMO_ACCOUNTS.customer.email);
      }
    } else if (selectedRole === 'partner' && !visitRate) {
      setVisitRate(trade ? (TRADE_DEFAULT_RATES[trade] || 450) : 499);
    }
  };

  const handleDemoClick = (demoKey) => {
    clearAllErrors();
    setUp(false);
    setFieldPulse(true);
    setTimeout(() => setFieldPulse(false), 550);

    let demoEmail = DEMO_ACCOUNTS.customer.email;
    let selectedRole = 'customer';

    if (demoKey === 'partner') {
      selectedRole = 'partner';
      demoEmail = DEMO_ACCOUNTS.worker.email;
      if (role !== 'partner') {
        setRoleAnimDir('to-partner');
        setTimeout(() => setRoleAnimDir(null), 380);
      }
    } else if (demoKey === 'admin') {
      selectedRole = 'customer';
      demoEmail = DEMO_ACCOUNTS.admin.email;
      if (role !== 'customer') {
        setRoleAnimDir('to-customer');
        setTimeout(() => setRoleAnimDir(null), 380);
      }
    } else {
      selectedRole = 'customer';
      demoEmail = DEMO_ACCOUNTS.customer.email;
      if (role !== 'customer') {
        setRoleAnimDir('to-customer');
        setTimeout(() => setRoleAnimDir(null), 380);
      }
    }

    setRole(selectedRole);
    setIdentifier(demoEmail);
    // Move straight to OTP screen with 4827 filled in for instantaneous testing!
    setOtpDigits(['4', '8', '2', '7']);
    setOtpTimer(30);
    setCanResend(false);
    setOtpStep(true);
    toast.info(`Loaded demo account (${demoKey}). Demo OTP 4827 ready!`);
  };

  const handleOpenForgot = (e) => {
    if (e) e.preventDefault();
    setForgot(true);
    setForgotSuccess(false);
    setForgotError('');
    if (identifier && identifier.includes('@')) {
      setForgotInput(identifier);
    }
    try {
      window.location.hash = 'forgot';
    } catch {}
  };

  const handleCloseForgot = () => {
    setForgot(false);
    setForgotSuccess(false);
    setForgotError('');
    try {
      window.location.hash = up ? 'register' : 'login';
    } catch {}
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const val = forgotInput.trim();
    if (!val) {
      setForgotError('Please enter your email or mobile number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = val.replace(/\s|-/g, '').replace(/^\+?91/, '');
    const isPhone = /^\d{10}$/.test(cleanPhone);

    if (!emailRegex.test(val) && !isPhone) {
      setForgotError('Please enter a valid email address or 10-digit mobile number.');
      return;
    }

    setForgotSubmitting(true);
    setForgotError('');

    setTimeout(() => {
      setForgotSubmitting(false);
      setForgotSuccess(true);
      toast.success(`Reset link and verification code sent to ${val}`);
    }, 700);
  };

  const handleButtonClick = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setBtnRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setBtnRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  // Step 1: Send OTP handler
  const handleRequestOtp = (e) => {
    e.preventDefault();
    clearAllErrors();

    const newErrors = {};
    if (up) {
      if (name.trim().length < 2) newErrors.name = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(regEmail.trim())) newErrors.email = true;
      const cleanPhone = phone.replace(/\s|-/g, '').replace(/^\+?91/, '');
      if (!/^\d{10}$/.test(cleanPhone)) newErrors.phone = true;
      if (role === 'partner') {
        if (!trade) newErrors.trade = true;
        if (!visitRate || isNaN(Number(visitRate)) || Number(visitRate) < 99) newErrors.visitRate = true;
      }
    } else {
      const val = identifier.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cleanPhone = val.replace(/\s|-/g, '').replace(/^\+?91/, '');
      const isPhone = /^\d{10}$/.test(cleanPhone);
      if (!emailRegex.test(val) && !isPhone) {
        newErrors.identifier = true;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }

    // Advance to OTP Step 2
    const targetDest = up ? (phone ? `+91 ${phone}` : regEmail) : identifier;
    setOtpStep(true);
    setOtpDigits(['', '', '', '']);
    setOtpTimer(30);
    setCanResend(false);
    toast.success(`Verification code sent to ${targetDest} (Demo OTP: 4827)`);

    setTimeout(() => {
      if (otpInputRefs[0].current) {
        otpInputRefs[0].current.focus();
      }
    }, 150);
  };

  // Step 2: OTP Box input handlers
  const handleOtpDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    const char = cleaned.slice(-1); // grab the latest digit entered

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-advance to next input if digit entered
    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Current is empty, back up to previous and clear it
        otpInputRefs[index - 1].current?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;

    const chars = pasted.split('');
    const newDigits = ['', '', '', ''];
    chars.forEach((c, i) => {
      if (i < 4) newDigits[i] = c;
    });
    setOtpDigits(newDigits);
    setOtpError('');

    const focusIdx = Math.min(chars.length, 3);
    otpInputRefs[focusIdx].current?.focus();
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['4', '8', '2', '7']);
    setOtpError('');
    toast.info('Demo code 4827 filled!');
    otpInputRefs[3].current?.focus();
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtpTimer(30);
    setCanResend(false);
    const targetDest = up ? phone : identifier;
    toast.success(`New OTP sent to ${targetDest} (Demo OTP: 4827)`);
    setOtpDigits(['', '', '', '']);
    otpInputRefs[0].current?.focus();
  };

  // Step 2: Final Verification Submit
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otpDigits.join('');

    if (code.length < 4) {
      setOtpError('Please enter all 4 digits of the verification code.');
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }

    setIsSubmitting(true);
    setOtpError('');

    try {
      const assignedRole = role === 'partner' ? 'worker' : 'customer';
      const targetIdentifier = up ? phone.trim() : identifier.trim();

      if (!up) {
        // Sign-in with OTP
        await login(targetIdentifier, code, assignedRole);
      } else {
        // Register with OTP
        await register({
          name: name.trim() || (role === 'partner' ? 'Pro Partner' : 'Customer User'),
          email: regEmail.trim(),
          phone: phone.trim(),
          role: assignedRole,
          trade: role === 'partner' ? trade : undefined,
          visitRate: role === 'partner' ? (Number(visitRate) || 450) : undefined,
          otpVerified: true,
          kycStatus: role === 'partner' ? 'under_verification' : 'approved',
        });
      }

      // If a Partner is creating an account, present the Complete Profile (Aadhaar & PAN) Card
      if (up && role === 'partner') {
        setIsSubmitting(false);
        setOtpStep(false);
        setShowPartnerKyc(true);
        toast.success('Mobile verified! Please complete your profile with Aadhaar & PAN.');
        return;
      }

      const isAdmin = /^admin@/i.test(targetIdentifier);
      const destination = isAdmin ? 'Admin Control Center' : 'Customer Portal';
      const title = up ? 'Account verified!' : 'You’re in!';
      const msg = `Doorstep safety verified. Opening ${destination}…`;

      setOkTitle(title);
      setOkMsg(msg);
      setIsSubmitting(false);
      setIsSuccess(true);

      redirectTimerRef.current = setTimeout(() => {
        onNavigate('dashboard');
      }, 2200);
    } catch (err) {
      setIsSubmitting(false);
      setOtpError(err.message || 'Invalid verification code. Use demo OTP 4827.');
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  // Partner KYC Document Handlers
  const handleAadhaarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycAadharFile(file.name);
      setKycErrors((prev) => {
        const copy = { ...prev };
        delete copy.aadharFile;
        return copy;
      });
    }
  };

  const handlePanUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycPanFile(file.name);
      setKycErrors((prev) => {
        const copy = { ...prev };
        delete copy.panFile;
        return copy;
      });
    }
  };

  const handleKycDemoFill = () => {
    setKycAadharFile('aadhaar_card_front_back.pdf');
    setKycAadharNo('5421 8921 4410');
    setKycPanFile('pan_card_permanent_acc.jpg');
    setKycPanNo('ABCDE1234F');
    setKycErrors({});
    toast.info('Sample Aadhaar and PAN documents attached!');
  };

  // Auto-redirect to dashboard after KYC submission
  useEffect(() => {
    if (kycSubmitted) {
      const timer = setTimeout(() => {
        onNavigate('dashboard');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [kycSubmitted, onNavigate]);

  const handleKycSubmit = (e) => {
    e.preventDefault();
    const newKycErrors = {};
    if (!kycAadharFile) newKycErrors.aadharFile = true;
    if (!kycPanFile) newKycErrors.panFile = true;

    if (Object.keys(newKycErrors).length > 0) {
      setKycErrors(newKycErrors);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      toast.error('Please attach both Aadhaar Card and PAN Card to proceed.');
      return;
    }

    setIsSubmitting(true);
    // Update local database & context with KYC info
    updateUser({
      kycStatus: 'under_verification',
      aadharUploaded: true,
      panUploaded: true,
      aadharNumber: kycAadharNo || '5421 8921 4410',
      panNumber: kycPanNo || 'ABCDE1234F',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setKycSubmitted(true);
      toast.success('KYC documents submitted for Admin checking.');
    }, 600);
  };

  const currentDisplayTarget = up
    ? (phone ? `+91 ${phone}${regEmail ? ` (${regEmail})` : ''}` : (regEmail || 'your details'))
    : identifier;

  return (
    <div className="auth-signin-page">
      {/* ── Left Side Hero Banner ── */}
      <aside className="side">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>
        <svg className="gear" viewBox="0 0 100 100" aria-hidden="true">
          <path
            fill="#fff"
            d="M43 4h14l2 11a36 36 0 0 1 9 4l9-7 10 10-7 9a36 36 0 0 1 4 9l11 2v14l-11 2a36 36 0 0 1-4 9l7 9-10 10-9-7a36 36 0 0 1-9 4l-2 11H43l-2-11a36 36 0 0 1-9-4l-9 7-10-10 7-9a36 36 0 0 1-4-9L5 57V43l11-2a36 36 0 0 1 4-9l-7-9 10-10 9 7a36 36 0 0 1 9-4zM50 34a16 16 0 1 0 0 32 16 16 0 0 0 0-32z"
          />
        </svg>

        <p className="hand">Welcome back</p>
        <h1>Your home’s repair crew, one tap away.</h1>
        <p className="sub">
          Sign in to track your pro live, share your safety PIN and pay a clear, itemized bill.
        </p>

        <div className="stack" aria-hidden="true">
          <div className="fc c1">
            <i>✓</i>
            <div>
              <b>Pro verified</b>
              <small>4.9 ★ · 7-point check</small>
            </div>
          </div>
          <div className="fc c2">
            <small>Your safety PIN</small>
            <span>4827</span>
          </div>
          <div className="fc c3">
            <div>
              <b>Rahul is on the way</b>
              <small>Electrician · arrives in 18 min</small>
            </div>
            <div className="bar">
              <u></u>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right Side Main Auth Card ── */}
      <main className="main">
        <div className="shell">
          <div className={`card ${shake ? 'shake' : ''}`}>
            {forgot ? (
              /* ── Dedicated Forgot Password / Help Card ── */
              <div className="forgot-card anim-fade">
                <button
                  type="button"
                  className="forgot-back-btn"
                  onClick={handleCloseForgot}
                  aria-label="Back to sign in"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Back to sign in</span>
                </button>

                {!forgotSuccess ? (
                  <>
                    <div className="forgot-header">
                      <div className="forgot-icon-wrap">
                        <span className="forgot-icon">🔐</span>
                      </div>
                      <h2>Need login help?</h2>
                      <p className="lead">
                        Enter your registered mobile number or email. We’ll send you an instant login verification code.
                      </p>
                    </div>

                    <form onSubmit={handleForgotSubmit} noValidate style={{ marginTop: 20 }}>
                      <div className="fld">
                        <label htmlFor="forgotInput">Email or mobile number</label>
                        <div className={`in ${forgotError ? 'bad' : ''}`}>
                          <input
                            id="forgotInput"
                            type="text"
                            autoComplete="username"
                            placeholder="name@example.com or 98765 43210"
                            value={forgotInput}
                            onChange={(e) => {
                              setForgotInput(e.target.value);
                              if (forgotError) setForgotError('');
                            }}
                            autoFocus
                          />
                        </div>
                        {forgotError && <div className="err" style={{ display: 'block' }}>{forgotError}</div>}
                      </div>

                      <button
                        className={`go ${forgotSubmitting ? 'load' : ''}`}
                        type="submit"
                        disabled={forgotSubmitting}
                        onClick={handleButtonClick}
                        style={{ marginTop: 20 }}
                      >
                        {btnRipples.map((r) => (
                          <span
                            key={r.id}
                            className="btn-ripple"
                            style={{ left: r.x, top: r.y }}
                          />
                        ))}
                        <span id="goT">
                          {forgotSubmitting ? 'Sending code…' : 'Send login code'}
                        </span>
                      </button>
                    </form>

                    <div className="forgot-footer-help">
                      <small>
                        Ready to sign in?{' '}
                        <button type="button" className="link-button" onClick={handleCloseForgot}>
                          Sign in with OTP
                        </button>
                      </small>
                    </div>
                  </>
                ) : (
                  <div className="forgot-success-state anim-fade">
                    <div className="forgot-success-badge">✓</div>
                    <h2>Verification code sent!</h2>
                    <p className="lead" style={{ marginTop: 8 }}>
                      We’ve dispatched a login code to <strong style={{ color: 'var(--ink)' }}>{forgotInput}</strong>.
                    </p>

                    <div className="forgot-notice-box">
                      <span style={{ fontSize: '1.2rem' }}>💡</span>
                      <div>
                        Please check your SMS or inbox. You can use demo code <strong>4827</strong> to sign in instantly.
                      </div>
                    </div>

                    <button
                      type="button"
                      className="go"
                      onClick={() => {
                        handleCloseForgot();
                        setOtpStep(true);
                      }}
                      style={{ marginTop: 24 }}
                    >
                      <span>Enter verification code</span>
                    </button>
                  </div>
                )}
              </div>
            ) : showPartnerKyc ? (
              /* ── Step 3: Partner KYC Profile Completion (Aadhaar & PAN) ── */
              <div className="partner-kyc-card anim-fade">
                {!kycSubmitted ? (
                  <>
                    <div className="kyc-header">
                      <div className="kyc-header-icon-wrap">
                        <span>🪪</span>
                      </div>
                      <h2>Complete your profile</h2>
                      <p className="lead">
                        Upload your Government ID proofs for verification by Fixovia Admin.
                      </p>
                    </div>

                    <form onSubmit={handleKycSubmit} noValidate>
                      {/* Document 1: Aadhaar Card */}
                      <div className="kyc-doc-section">
                        <div className="kyc-doc-head">
                          <div className="kyc-doc-title">
                            <span>🇮🇳</span>
                            <span>Aadhaar Card (Front & Back)</span>
                          </div>
                          <span className={`kyc-doc-badge ${kycAadharFile ? 'uploaded' : ''}`}>
                            {kycAadharFile ? '✓ Attached' : 'Required'}
                          </span>
                        </div>

                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          ref={aadharFileRef}
                          style={{ display: 'none' }}
                          onChange={handleAadhaarUpload}
                        />

                        <div
                          className={`kyc-upload-dropzone ${kycAadharFile ? 'has-file' : ''} ${kycErrors.aadharFile ? 'bad' : ''}`}
                          onClick={() => aadharFileRef.current?.click()}
                          role="button"
                          tabIndex={0}
                        >
                          {kycAadharFile ? (
                            <div className="kyc-file-info">
                              <span>📄</span>
                              <span>{kycAadharFile}</span>
                              <small style={{ color: 'var(--slate)', textDecoration: 'underline' }}>Change</small>
                            </div>
                          ) : (
                            <>
                              <span style={{ fontSize: '1.4rem' }}>📁</span>
                              <b style={{ fontSize: '0.88rem', color: 'var(--coral2)' }}>Choose Aadhaar Document</b>
                              <small style={{ color: 'var(--mute)' }}>PDF, JPG, or PNG (Max 5MB)</small>
                            </>
                          )}
                        </div>
                        {kycErrors.aadharFile && (
                          <div className="err" style={{ display: 'block', marginTop: 4 }}>
                            Please upload your Aadhaar card document.
                          </div>
                        )}

                        <div className="fld" style={{ marginTop: 10 }}>
                          <label htmlFor="aadhaarNo" style={{ fontSize: '0.82rem' }}>Aadhaar Number (12 Digits)</label>
                          <div className="in">
                            <input
                              id="aadhaarNo"
                              type="text"
                              inputMode="numeric"
                              maxLength={14}
                              placeholder="5421 8921 4410"
                              value={kycAadharNo}
                              onChange={(e) => setKycAadharNo(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Document 2: PAN Card */}
                      <div className="kyc-doc-section">
                        <div className="kyc-doc-head">
                          <div className="kyc-doc-title">
                            <span>💳</span>
                            <span>PAN Card</span>
                          </div>
                          <span className={`kyc-doc-badge ${kycPanFile ? 'uploaded' : ''}`}>
                            {kycPanFile ? '✓ Attached' : 'Required'}
                          </span>
                        </div>

                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          ref={panFileRef}
                          style={{ display: 'none' }}
                          onChange={handlePanUpload}
                        />

                        <div
                          className={`kyc-upload-dropzone ${kycPanFile ? 'has-file' : ''} ${kycErrors.panFile ? 'bad' : ''}`}
                          onClick={() => panFileRef.current?.click()}
                          role="button"
                          tabIndex={0}
                        >
                          {kycPanFile ? (
                            <div className="kyc-file-info">
                              <span>📄</span>
                              <span>{kycPanFile}</span>
                              <small style={{ color: 'var(--slate)', textDecoration: 'underline' }}>Change</small>
                            </div>
                          ) : (
                            <>
                              <span style={{ fontSize: '1.4rem' }}>📁</span>
                              <b style={{ fontSize: '0.88rem', color: 'var(--coral2)' }}>Choose PAN Document</b>
                              <small style={{ color: 'var(--mute)' }}>PDF, JPG, or PNG (Max 5MB)</small>
                            </>
                          )}
                        </div>
                        {kycErrors.panFile && (
                          <div className="err" style={{ display: 'block', marginTop: 4 }}>
                            Please upload your PAN card document.
                          </div>
                        )}

                        <div className="fld" style={{ marginTop: 10 }}>
                          <label htmlFor="panNo" style={{ fontSize: '0.82rem' }}>PAN Number (10 Digits)</label>
                          <div className="in">
                            <input
                              id="panNo"
                              type="text"
                              maxLength={10}
                              placeholder="ABCDE1234F"
                              style={{ textTransform: 'uppercase' }}
                              value={kycPanNo}
                              onChange={(e) => setKycPanNo(e.target.value.toUpperCase())}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick Auto-Fill Helper Chip */}
                      <div style={{ textAlign: 'center' }}>
                        <div
                          className="kyc-demo-chip"
                          onClick={handleKycDemoFill}
                          role="button"
                          tabIndex={0}
                        >
                          <span>⚡ Auto-fill sample Aadhaar & PAN</span>
                        </div>
                      </div>

                      <button
                        className={`go ${isSubmitting ? 'load' : ''}`}
                        type="submit"
                        disabled={isSubmitting}
                        onClick={handleButtonClick}
                      >
                        {btnRipples.map((r) => (
                          <span
                            key={r.id}
                            className="btn-ripple"
                            style={{ left: r.x, top: r.y }}
                          />
                        ))}
                        <span id="goT">
                          {isSubmitting ? 'Uploading…' : 'Submit for Verification →'}
                        </span>
                      </button>
                    </form>
                  </>
                ) : (
                  /* ── 24-Hour Checking Confirmation State ── */
                  <div className="kyc-checking-state">
                    <div className="kyc-clock-badge">⏳</div>
                    <h2>Your account is under checking</h2>
                    <p className="lead" style={{ maxWidth: 420, margin: '0 auto', color: 'var(--slate)' }}>
                      It will go through the verification process and will work in under 24 hours.
                    </p>

                    <button
                      type="button"
                      className="go"
                      style={{ marginTop: 24 }}
                      onClick={() => onNavigate('dashboard')}
                    >
                      <span>Go to Dashboard →</span>
                    </button>
                    <small style={{ display: 'block', marginTop: 14, color: 'var(--mute)', fontSize: '0.86rem' }}>
                      Redirecting to your dashboard in a moment…
                    </small>
                  </div>
                )}
              </div>
            ) : otpStep ? (
              /* ── Step 2: Sleek 4-Digit OTP Verification Screen ── */
              <div className="otp-screen-wrap">
                <button
                  type="button"
                  className="otp-back-nav"
                  onClick={() => setOtpStep(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Back to details</span>
                </button>

                <div className="otp-target-badge">
                  <span>📱 Code sent to <strong>{currentDisplayTarget}</strong></span>
                  <span className="edit-link" onClick={() => setOtpStep(false)}>Edit</span>
                </div>

                <h2>Enter 4-digit code</h2>
                <p className="lead">
                  Enter the verification OTP sent to your device to {up ? 'create your account' : 'sign in'}.
                </p>

                <form onSubmit={handleVerifyOtp} noValidate>
                  {/* 4 Discrete Boxes */}
                  <div className="otp-boxes">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className={`otp-box ${digit ? 'filled' : ''} ${otpError ? 'bad' : ''}`}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        autoFocus={idx === 0}
                        aria-label={`Digit ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="err" style={{ display: 'block', textAlign: 'center', marginBottom: 14 }}>
                      {otpError}
                    </div>
                  )}

                  {/* Helper row: Demo OTP chip & Resend timer */}
                  <div className="otp-helper-row">
                    <div
                      className="otp-demo-chip"
                      onClick={handleFillDemoOtp}
                      role="button"
                      tabIndex={0}
                      title="Click to auto-fill demo OTP 4827"
                    >
                      <span>🔑 Demo OTP: <strong>4827</strong></span>
                      <small style={{ opacity: 0.8 }}>(Click to fill)</small>
                    </div>

                    <div className="otp-resend-text">
                      {canResend ? (
                        <button
                          type="button"
                          className="otp-resend-btn"
                          onClick={handleResendOtp}
                        >
                          Didn't get code? Resend OTP
                        </button>
                      ) : (
                        <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Verify & Proceed CTA */}
                  <button
                    className={`go ${isSubmitting ? 'load' : ''}`}
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleButtonClick}
                  >
                    {btnRipples.map((r) => (
                      <span
                        key={r.id}
                        className="btn-ripple"
                        style={{ left: r.x, top: r.y }}
                      />
                    ))}
                    <span id="goT">
                      {isSubmitting
                        ? 'Verifying…'
                        : (up
                          ? (role === 'partner' ? 'Verify & Apply →' : 'Verify & Create account →')
                          : 'Verify & Sign in →')}
                    </span>
                  </button>
                </form>

                {/* 1-Click Demo Quick Switcher */}
                <div className="demo" style={{ marginTop: 24 }}>
                  1-click demo accounts
                  <div>
                    <button
                      type="button"
                      data-d="customer"
                      onClick={() => handleDemoClick('customer')}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      data-d="partner"
                      onClick={() => handleDemoClick('partner')}
                    >
                      Partner
                    </button>
                    <button
                      type="button"
                      data-d="admin"
                      onClick={() => handleDemoClick('admin')}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Step 1: Role, Details & Get OTP View ── */
              <>
                {/* Role Switcher Tabs */}
                <div className={`tabs ${role === 'partner' ? 'p2' : ''}`} id="tabs" role="tablist">
                  <span className="pill"></span>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={role === 'customer'}
                    data-r="customer"
                    onClick={() => handleRoleChange('customer')}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={role === 'partner'}
                    data-r="partner"
                    onClick={() => handleRoleChange('partner')}
                  >
                    Partner
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h2 id="ttl" className={roleAnimDir ? `slide-${roleAnimDir}` : ''}>
                  {up
                    ? (role === 'partner' ? 'Become a partner' : 'Create your account')
                    : (role === 'partner' ? 'Partner sign in' : 'Welcome back')}
                </h2>
                <p className={`lead ${roleAnimDir ? `slide-${roleAnimDir}` : ''}`} id="lead">
                  {up
                    ? (role === 'partner' ? 'Join Fixovia and get steady local jobs, with no marketing needed.' : 'Book verified pros in under two minutes.')
                    : (role === 'partner' ? 'Sign in with your mobile number to view jobs & earnings.' : 'Sign in with your phone or email using instant OTP.')}
                </p>

                {/* Form: Step 1 */}
                <form id="f" noValidate onSubmit={handleRequestOtp}>
                  {/* Registration Fields: Full Name, Email & Mobile Number */}
                  <div className={`opt ${up ? 'show' : ''}`} id="oName">
                    <div>
                      <div className="fld">
                        <label htmlFor="name">Full name</label>
                        <div className={`in ${errors.name ? 'bad' : ''}`}>
                          <input
                            id="name"
                            autoComplete="name"
                            placeholder="Aarav Sharma"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              clearErr('name');
                            }}
                          />
                        </div>
                        <div className="err">Please enter your name.</div>
                      </div>
                      <div className="fld">
                        <label htmlFor="regEmail">Email address</label>
                        <div className={`in ${errors.email ? 'bad' : ''}`}>
                          <input
                            id="regEmail"
                            type="email"
                            autoComplete="email"
                            placeholder="aarav@example.com"
                            value={regEmail}
                            onChange={(e) => {
                              setRegEmail(e.target.value);
                              clearErr('email');
                            }}
                          />
                        </div>
                        <div className="err">Enter a valid email address.</div>
                      </div>
                      <div className="fld">
                        <label htmlFor="phone">Mobile number</label>
                        <div className={`in ${errors.phone ? 'bad' : ''}`}>
                          <input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              clearErr('phone');
                            }}
                          />
                        </div>
                        <div className="err">Enter a valid 10-digit mobile number.</div>
                      </div>
                    </div>
                  </div>

                  {/* Partner Trade Selection Popover */}
                  <div className={`opt ${up && role === 'partner' ? 'show' : ''}`} id="oTrade">
                    <div>
                      <div className="fld">
                        <label id="tradeLabel">Your trade</label>
                        <div className="trade-select-wrap" ref={tradeRef}>
                          <button
                            type="button"
                            id="trade"
                            className={`custom-trade-trigger ${isTradeOpen ? 'open' : ''} ${errors.trade ? 'bad' : ''}`}
                            onClick={() => setIsTradeOpen((prev) => !prev)}
                            aria-haspopup="listbox"
                            aria-expanded={isTradeOpen}
                            aria-labelledby="tradeLabel"
                          >
                            <div className="trade-trigger-content">
                              {trade ? (
                                <div className="trade-selected-content">
                                  <span className="trade-pill-icon">
                                    {TRADE_OPTIONS.find((t) => t.value === trade)?.icon || '🛠'}
                                  </span>
                                  <span className="trade-pill-text">{trade}</span>
                                </div>
                              ) : (
                                <span className="trade-placeholder">Choose your trade</span>
                              )}
                            </div>
                            <svg
                              className="trade-chevron"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>

                          {/* Floating Popover Menu */}
                          {isTradeOpen && (
                            <div className="trade-dropdown-menu" role="listbox" aria-labelledby="tradeLabel">
                              <div className="trade-menu-header">Select your primary trade</div>
                              {TRADE_OPTIONS.map((opt) => {
                                const isSelected = trade === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`trade-option-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                      setTrade(opt.value);
                                      clearErr('trade');
                                      setIsTradeOpen(false);
                                      if (!visitRate || Object.values(TRADE_DEFAULT_RATES).includes(Number(visitRate))) {
                                        setVisitRate(TRADE_DEFAULT_RATES[opt.value] || 450);
                                        clearErr('visitRate');
                                      }
                                    }}
                                  >
                                    <div className="trade-option-left">
                                      <div className="trade-option-icon">{opt.icon}</div>
                                      <div className="trade-option-text">
                                        <b>{opt.label}</b>
                                        <small>{opt.desc}</small>
                                      </div>
                                    </div>
                                    {isSelected && <span className="trade-option-check">✓</span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {errors.trade && (
                          <div className="err" style={{ display: 'block', maxHeight: 'none', marginTop: 6 }}>
                            Pick your trade to continue.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partner Fixed Visiting & Inspection Rate */}
                  <div className={`opt ${up && role === 'partner' ? 'show' : ''}`} id="oRate">
                    <div>
                      <div className="fld">
                        <label id="rateLabel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Fixed Visiting & Inspection Charge</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--coral2)', fontWeight: 600 }}>Standard Doorstep Rate</span>
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: 14, color: 'var(--ink)', fontWeight: 700, fontSize: '1rem', pointerEvents: 'none', zIndex: 2 }}>₹</span>
                          <input
                            type="number"
                            id="visitRate"
                            min="99"
                            max="2999"
                            step="10"
                            placeholder="e.g. 450"
                            style={{ paddingLeft: 34, fontWeight: 700 }}
                            value={visitRate}
                            onChange={(e) => {
                              setVisitRate(e.target.value);
                              clearErr('visitRate');
                            }}
                            className={errors.visitRate ? 'bad' : ''}
                          />
                        </div>
                        <small style={{ color: 'var(--mute)', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>
                          Standard doorstep inspection & diagnosis fee charged for your visit.
                        </small>
                        {errors.visitRate && (
                          <div className="err" style={{ display: 'block', maxHeight: 'none', marginTop: 6 }}>
                            Please enter a valid fixed visiting rate (minimum ₹99).
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sign-in Identifier (Mobile number or Email) */}
                  {!up && (
                    <div className="fld">
                      <label htmlFor="identifier">Mobile number or email</label>
                      <div className={`in ${errors.identifier ? 'bad' : ''} ${fieldPulse ? 'field-highlight' : ''}`}>
                        <input
                          id="identifier"
                          type="text"
                          autoComplete="username"
                          placeholder="98765 43210 or name@fixovia.in"
                          value={identifier}
                          onChange={(e) => {
                            setIdentifier(e.target.value);
                            clearErr('identifier');
                          }}
                        />
                      </div>
                      <div className="err">Enter a valid 10-digit mobile number or email address.</div>
                    </div>
                  )}

                  {/* Options row */}
                  {!up && (
                    <div className="row" id="rowIn" style={{ display: 'flex' }}>
                      <label>
                        <input
                          type="checkbox"
                          id="rem"
                          checked={rem}
                          onChange={(e) => setRem(e.target.checked)}
                        />
                        {' '}Keep me signed in
                      </label>
                      <a
                        href="#forgot"
                        id="forgot"
                        onClick={handleOpenForgot}
                      >
                        Need help?
                      </a>
                    </div>
                  )}

                  {/* Submit CTA button to get OTP */}
                  <button
                    className={`go ${isSubmitting ? 'load' : ''}`}
                    id="go"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleButtonClick}
                  >
                    {btnRipples.map((r) => (
                      <span
                        key={r.id}
                        className="btn-ripple"
                        style={{ left: r.x, top: r.y }}
                      />
                    ))}
                    <span id="goT">
                      {up
                        ? (role === 'partner' ? 'Get OTP to apply →' : 'Get OTP to register →')
                        : 'Get OTP →'}
                    </span>
                  </button>
                </form>

                {/* Mode Switcher */}
                <p className="sw" id="sw">
                  {up ? (
                    <>
                      Already have an account?{' '}
                      <a
                        href="#signin"
                        id="tog"
                        onClick={(e) => {
                          e.preventDefault();
                          setUp(false);
                          clearAllErrors();
                        }}
                      >
                        Sign in with OTP
                      </a>
                    </>
                  ) : (
                    <>
                      New to Fixovia?{' '}
                      <a
                        href="#signup"
                        id="tog"
                        onClick={(e) => {
                          e.preventDefault();
                          setUp(true);
                          clearAllErrors();
                        }}
                      >
                        {role === 'partner' ? 'Become a partner' : 'Create an account'}
                      </a>
                    </>
                  )}
                </p>

                {/* 1-Click Demo Accounts */}
                <div className="demo">
                  1-click demo accounts
                  <div>
                    <button
                      type="button"
                      data-d="customer"
                      onClick={() => handleDemoClick('customer')}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      data-d="partner"
                      onClick={() => handleDemoClick('partner')}
                    >
                      Partner
                    </button>
                    <button
                      type="button"
                      data-d="admin"
                      onClick={() => handleDemoClick('admin')}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Success Overlay with Animated Checkmark and Progress Bar */}
            <div className={`ok ${isSuccess ? 'show' : ''}`} id="ok" role="status">
              <svg viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="40" r="36" />
                <path d="M24 41l11 11 21-24" />
              </svg>
              <h2 id="okT">{okTitle}</h2>
              <p id="okP">{okMsg}</p>
              <div className="redir">
                <u></u>
              </div>
              <small>Connecting to Fixovia Dashboard...</small>
              <button
                type="button"
                id="back"
                onClick={() => {
                  if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
                  setIsSuccess(false);
                }}
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="foot">
          © 2026 Fixovia · Delhi-NCR · Mumbai · Bengaluru · Hyderabad · Pune
        </p>
      </main>
    </div>
  );
}