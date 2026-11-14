import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredPartnerRate, getStoredPartnerInfo } from '../utils/partnerRates';
import {
  ElectricalLogo,
  PlumbingLogo,
  ACRepairLogo,
  CarpentryLogo,
  PaintingLogo,
  CleaningLogo,
  AppliancesLogo,
  PestControlLogo,
} from '../components/common/TradeLogos';
import '../styles/dashboards.css';

const fmtINR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const fmtNum = (n) => Math.round(n).toLocaleString('en-IN');

export default function DashboardPage({ onNavigate, initialRole }) {
  const { user, updateUser, logout } = useAuth();

  // Determine initial view: prop -> hash -> user role -> fallback 'customer'
  const getInitialView = () => {
    const raw = (window.location.hash || '').replace('#', '').toLowerCase();
    if (raw.startsWith('partner') || raw.startsWith('worker')) return 'partner';
    if (raw.startsWith('admin')) return 'admin';
    if (raw.startsWith('customer')) return 'customer';
    if (initialRole === 'worker' || initialRole === 'partner') return 'partner';
    if (initialRole === 'admin') return 'admin';
    if (user?.role === 'worker') return 'partner';
    if (user?.role === 'admin') return 'admin';
    return 'customer';
  };

  const getInitialNav = (view) => {
    const raw = (window.location.hash || '').replace('#', '').toLowerCase();
    if (view === 'admin') {
      if (raw.includes('profile')) return 'a-profile';
      if (raw.includes('kyc')) return 'a-kyc';
      if (raw.includes('activity')) return 'a-activity';
      return 'a-metrics';
    }
    if (view === 'partner' || view === 'worker') {
      if (raw.includes('profile')) return 'p-profile';
      if (raw.includes('wallet')) return 'p-wallet';
      if (raw.includes('ledger')) return 'p-ledger';
      return 'p-dispatch';
    }
    if (raw.includes('profile')) return 'c-profile';
    if (raw.includes('book')) return 'c-book';
    if (raw.includes('hist')) return 'c-hist';
    return 'c-active';
  };

  const [curView, setCurView] = useState(getInitialView);
  const [activeNav, setActiveNav] = useState(() => getInitialNav(getInitialView()));
  const [dashNavHidden, setDashNavHidden] = useState(false);
  const lastDashScrollY = useRef(0);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY <= 20) {
            setDashNavHidden(false);
          } else if (currentScrollY > lastDashScrollY.current && currentScrollY > 40) {
            setDashNavHidden(true);
          } else if (currentScrollY < lastDashScrollY.current - 12) {
            setDashNavHidden(false);
          }
          lastDashScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  // Switch role view
  const switchView = (v) => {
    setCurView(v);
    const defaultNav = v === 'customer' ? 'c-active' : v === 'partner' ? 'p-dispatch' : 'a-metrics';
    setActiveNav(defaultNav);
    const defaultHash = v === 'customer' ? 'customer/overview' : v === 'partner' ? 'partner/dispatch' : 'admin/metrics';
    try {
      window.location.hash = defaultHash;
    } catch { }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavTabClick = (tabId) => {
    setActiveNav(tabId);
    const pathMap = {
      'c-active': 'customer/overview',
      'c-book': 'customer/book',
      'c-hist': 'customer/history',
      'c-profile': 'customer/profile',
      'p-dispatch': 'partner/dispatch',
      'p-wallet': 'partner/wallet',
      'p-ledger': 'partner/ledger',
      'p-profile': 'partner/profile',
      'a-metrics': 'admin/metrics',
      'a-kyc': 'admin/kyc',
      'a-activity': 'admin/activity',
      'a-profile': 'admin/profile',
    };
    if (pathMap[tabId]) {
      try {
        window.location.hash = pathMap[tabId];
      } catch { }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHashChange = () => {
      const v = getInitialView();
      setCurView(v);
      setActiveNav(getInitialNav(v));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Nav metadata
  const NAV_CONFIG = useMemo(() => ({
    customer: [
      { id: 'c-active', label: 'Overview', icon: '🏠' },
      { id: 'c-book', label: 'Book', icon: '🛠' },
      { id: 'c-hist', label: 'History', icon: '🧾' },
      { id: 'c-profile', label: 'Profile', icon: '👤' },
    ],
    partner: [
      { id: 'p-dispatch', label: 'Dispatch', icon: '📡' },
      { id: 'p-wallet', label: 'Wallet', icon: '💰' },
      { id: 'p-ledger', label: 'Ledger', icon: '📒' },
      { id: 'p-profile', label: 'Profile', icon: '👤' },
    ],
    admin: [
      { id: 'a-metrics', label: 'Metrics', icon: '📊' },
      { id: 'a-kyc', label: 'KYC', icon: '🛡' },
      { id: 'a-activity', label: 'Activity', icon: '⚡' },
      { id: 'a-profile', label: 'Profile', icon: '👤' },
    ],
  }), []);

  // User badge info
  const meBadge = useMemo(() => {
    if (curView === 'partner') {
      return {
        initials: user?.role === 'worker' ? (user.name?.split(' ').map(n => n[0]).join('') || 'RS') : 'RS',
        name: user?.role === 'worker' ? (user.name || 'Raj Singh') : 'Raj Singh',
        roleLabel: 'Electrician partner',
      };
    }
    if (curView === 'admin') {
      return {
        initials: user?.role === 'admin' ? (user.name?.split(' ').map(n => n[0]).join('') || 'AD') : 'AD',
        name: user?.role === 'admin' ? (user.name || 'Ops Admin') : 'Ops Admin',
        roleLabel: 'Administrator',
      };
    }
    return {
      initials: user?.role === 'customer' ? (user.name?.split(' ').map(n => n[0]).join('') || 'AS') : 'AS',
      name: user?.role === 'customer' ? (user.name || 'Aarav Sharma') : 'Aarav Sharma',
      roleLabel: 'Customer',
    };
  }, [curView, user]);

  const scrollToSection = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    if (logout) {
      await logout();
    } else {
      localStorage.removeItem('fixovia_user');
      localStorage.removeItem('fixovia_access_token');
    }
    triggerToast('Signed out successfully');
    setTimeout(() => {
      onNavigate('auth');
    }, 400);
  };

  // ═══════════════════════════════════════════════════════════════
  // CUSTOMER STATE & LOGIC
  // ═══════════════════════════════════════════════════════════════
  const [hasActiveBooking, setHasActiveBooking] = useState(() => {
    return localStorage.getItem('fixovia_has_active_booking') === 'true';
  });
  const [activeBooking, setActiveBooking] = useState(() => {
    try {
      const saved = localStorage.getItem('fixovia_active_booking');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      trade: 'Plumber',
      service: 'Pipe leak repair',
      time: 'Today, 4 PM – 6 PM',
      location: 'Model Town, Ludhiana, Punjab',
      baseLabor: 450,
      partsEstimate: 0,
      tax: 81,
      platformFee: 29,
      total: 560,
      worker: {
        id: 2,
        name: 'Sanjay Verma',
        role: 'Plumber',
        rating: 4.8,
        reviews: 98,
        initials: 'SV',
        color: '#7c3aed',
      },
      stage: 1,
      pin: '4827',
    };
  });
  const [custStage, setCustStage] = useState(() => {
    try {
      const saved = localStorage.getItem('fixovia_active_booking');
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p.stage === 'number') return p.stage;
      }
    } catch {}
    return 1; // 0=Requested, 1=Accepted, 2=On the way, 3=Arrived, 4=In progress, 5=Completed, -1=Cancelled
  });
  const [custRating, setCustRating] = useState(0);

  // Sync active booking across tabs or when a new booking is created
  useEffect(() => {
    const syncActiveBooking = () => {
      const hasBooking = localStorage.getItem('fixovia_has_active_booking') === 'true';
      setHasActiveBooking(hasBooking);
      try {
        const saved = localStorage.getItem('fixovia_active_booking');
        if (saved) {
          const parsed = JSON.parse(saved);
          setActiveBooking(parsed);
          if (typeof parsed.stage === 'number') {
            setCustStage(parsed.stage);
          }
        }
      } catch (e) {
        console.error('Error syncing active booking', e);
      }
    };

    syncActiveBooking();
    window.addEventListener('storage', syncActiveBooking);
    window.addEventListener('fixovia_booking_created', syncActiveBooking);
    return () => {
      window.removeEventListener('storage', syncActiveBooking);
      window.removeEventListener('fixovia_booking_created', syncActiveBooking);
    };
  }, []);

  const assignedPro = useMemo(() => {
    return activeBooking?.worker || {
      name: 'Sanjay Verma',
      role: activeBooking?.trade || 'Plumber',
      rating: 4.8,
      reviews: 98,
      initials: 'SV',
      color: '#7c3aed',
    };
  }, [activeBooking]);

  const proFirstName = assignedPro.name ? assignedPro.name.split(' ')[0] : 'your pro';

  const CUST_STAGES = ['Requested', 'Accepted', 'On the way', 'Arrived', 'In progress', 'Completed'];

  const handleSimulateBooking = () => {
    const defaultBooking = {
      id: 'fix-job-' + Date.now(),
      trade: 'Plumber',
      service: 'Acoustic Leak Detection',
      time: 'Today, 4 PM – 6 PM',
      location: 'Model Town, Ludhiana, Punjab',
      baseLabor: 450,
      partsEstimate: 0,
      tax: 81,
      platformFee: 29,
      total: 560,
      worker: {
        id: 2,
        name: 'Sanjay Verma',
        role: 'Plumber',
        rating: 4.8,
        reviews: 98,
        initials: 'SV',
        color: '#7c3aed',
      },
      stage: 1,
      pin: '4827',
    };
    setActiveBooking(defaultBooking);
    setHasActiveBooking(true);
    localStorage.setItem('fixovia_has_active_booking', 'true');
    localStorage.setItem('fixovia_active_booking', JSON.stringify(defaultBooking));
    setCustStage(1);
    setCustRating(0);
    triggerToast('Active booking created');
  };

  const handleBookService = (tradeName, priceStr) => {
    const baseVal = parseInt((priceStr || '199').replace(/[^0-9]/g, ''), 10) || 199;
    const parts = 0;
    const sub = baseVal + parts;
    const tax = Math.round(sub * 0.18);
    const total = sub + tax + 29;
    const newBooking = {
      id: 'fix-job-' + Date.now(),
      trade: tradeName,
      service: `${tradeName} inspection & repair`,
      time: 'Today, 4 PM – 6 PM',
      location: 'Model Town, Ludhiana, Punjab',
      baseLabor: baseVal,
      partsEstimate: parts,
      tax: tax,
      platformFee: 29,
      total: total,
      worker: {
        name: `Verified ${tradeName} Specialist`,
        role: tradeName,
        rating: 4.9,
        reviews: 110,
        initials: tradeName.substring(0, 2).toUpperCase(),
        color: '#0d56cb',
      },
      stage: 1,
      pin: '4827',
    };
    setActiveBooking(newBooking);
    setHasActiveBooking(true);
    localStorage.setItem('fixovia_has_active_booking', 'true');
    localStorage.setItem('fixovia_active_booking', JSON.stringify(newBooking));
    setCustStage(1);
    setCustRating(0);
    handleNavTabClick('c-active');
    triggerToast(`Booking requested for ${tradeName}`);
  };

  const handleCustNextStep = () => {
    if (custStage === 5) {
      setHasActiveBooking(false);
      localStorage.setItem('fixovia_has_active_booking', 'false');
      localStorage.removeItem('fixovia_active_booking');
      setCustStage(0);
      setCustRating(0);
      triggerToast('Job complete. Back to overview.');
    } else {
      const next = custStage + 1;
      setCustStage(next);
      try {
        const saved = localStorage.getItem('fixovia_active_booking');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.stage = next;
          localStorage.setItem('fixovia_active_booking', JSON.stringify(parsed));
        }
      } catch {}
      if (next === 1) triggerToast(`${proFirstName} accepted your booking`);
      if (next === 2) triggerToast(`${proFirstName} is on the way`);
      if (next === 3) triggerToast(`${proFirstName} has arrived at your door`);
      if (next === 4) triggerToast('Doorstep PIN verified · Work in progress');
      if (next === 5) triggerToast('Service completed! 30-day warranty active');
    }
  };

  const handleCustCancel = () => {
    setHasActiveBooking(false);
    localStorage.setItem('fixovia_has_active_booking', 'false');
    localStorage.removeItem('fixovia_active_booking');
    setCustStage(-1);
    triggerToast('Booking cancelled. No active bookings.');
  };

  const isCustAccepted = custStage >= 1;
  const isCustCancelled = custStage < 0;

  // ── Profile Page States ──
  const [custProfile, setCustProfile] = useState(() => ({
    name: user?.role === 'customer' ? (user.name || 'Arjun Mehta') : 'Arjun Mehta',
    phone: '+91 98765 43210',
    email: user?.role === 'customer' ? (user.email || 'arjun.mehta@gmail.com') : 'arjun.mehta@gmail.com',
    flat: 'Flat 402, Tower B',
    street: 'DLF Phase 4, Galleria Road',
    landmark: 'Opposite Supermart 1',
    pincode: '122002',
    city: 'Gurugram, Haryana',
    pinEnabled: true,
    smsPin: true,
    maskPhone: true,
  }));

  const [partnerProfile, setPartnerProfile] = useState(() => {
    const info = getStoredPartnerInfo();
    return {
      name: user?.role === 'worker' ? (user.name || info.name || 'Raj Kumar') : (info.name || 'Raj Kumar'),
      phone: user?.role === 'worker' ? (user.phone || '+91 98101 23456') : '+91 98101 23456',
      email: user?.role === 'worker' ? (user.email || 'worker@fixovia.in') : 'worker@fixovia.in',
      primaryTrade: user?.trade || info.trade || 'Electrical',
      secondaryTrade: 'AC Repair & Servicing',
      expYears: '8+ years',
      radius: '10 km',
      hub: 'Sector 21, Gurugram',
      visitRate: info.rate || user?.visitRate || 499,
      bankName: 'State Bank of India',
      acNo: '•••• •••• 4821',
      ifsc: 'SBIN0001429',
      upi: 'rajsingh@okhdfcbank',
      autoSettlement: true,
    };
  });

  const [livePartnerRate, setLivePartnerRate] = useState(() => getStoredPartnerRate(199));

  useEffect(() => {
    const handleSync = () => {
      setLivePartnerRate(getStoredPartnerRate(199));
    };
    window.addEventListener('fixovia_partner_rate_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('fixovia_partner_rate_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handlePartnerRateChange = (val) => {
    setPartnerProfile((prev) => ({ ...prev, visitRate: val }));
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      try {
        localStorage.setItem('fixovia_partner_visiting_rate', String(num));
        localStorage.setItem('fixovia_partner_trade', partnerProfile.primaryTrade);
        localStorage.setItem('fixovia_partner_name', partnerProfile.name);
        window.dispatchEvent(new CustomEvent('fixovia_partner_rate_updated', {
          detail: { rate: num, trade: partnerProfile.primaryTrade, name: partnerProfile.name }
        }));
      } catch (e) {
        console.error('Failed to sync partner rate', e);
      }
    }
  };

  const handlePartnerTradeChange = (tradeVal) => {
    setPartnerProfile((prev) => ({ ...prev, primaryTrade: tradeVal }));
    try {
      localStorage.setItem('fixovia_partner_trade', tradeVal);
      window.dispatchEvent(new CustomEvent('fixovia_partner_rate_updated', {
        detail: { rate: Number(partnerProfile.visitRate) || 499, trade: tradeVal, name: partnerProfile.name }
      }));
    } catch {}
  };

  const handleSavePartnerProfile = () => {
    const rateNum = Number(partnerProfile.visitRate) || 499;
    updateUser({
      name: partnerProfile.name,
      trade: partnerProfile.primaryTrade,
      visitRate: rateNum,
    });
    try {
      localStorage.setItem('fixovia_partner_visiting_rate', String(rateNum));
      localStorage.setItem('fixovia_partner_trade', partnerProfile.primaryTrade);
      localStorage.setItem('fixovia_partner_name', partnerProfile.name);
      window.dispatchEvent(new CustomEvent('fixovia_partner_rate_updated', {
        detail: { rate: rateNum, trade: partnerProfile.primaryTrade, name: partnerProfile.name }
      }));
    } catch {}
    triggerToast('Technician profile & visiting price updated successfully');
  };

  const [adminProfile, setAdminProfile] = useState(() => ({
    name: user?.role === 'admin' ? (user.name || 'Vikram Malhotra') : 'Vikram Malhotra',
    email: user?.role === 'admin' ? (user.email || 'admin@fixovia.com') : 'admin@fixovia.com',
    hotline: '+91 98110 00123',
    hubJurisdiction: 'All 8 National Service Hubs (Delhi NCR, BLR, BOM, PNQ, HYD, MAA, CCU, AMD)',
    twoFactor: true,
    autoThreshold: '25000',
    sessionTimeout: '12 Hours',
  }));

  // ═══════════════════════════════════════════════════════════════
  // PARTNER STATE & LOGIC
  // ═══════════════════════════════════════════════════════════════
  const [isOnline, setIsOnline] = useState(true);
  const [walletToday, setWalletToday] = useState(2150);
  const [walletWeek, setWalletWeek] = useState(11480);
  const [walletPending, setWalletPending] = useState(1260);

  const [partnerJob, setPartnerJob] = useState(null); // null = idle radar, { pay: 449 } = incoming/active
  const [partnerStep, setPartnerStep] = useState(0); // 0=Accepted, 1=On the way, 2=Arrived, 3=In progress, 4=Completed
  const [partnerTimerLeft, setPartnerTimerLeft] = useState(60);
  const [pinInput, setPinInput] = useState('');
  const [partsInput, setPartsInput] = useState('');
  const [pinShake, setPinShake] = useState(false);

  const [partnerLedger, setPartnerLedger] = useState([
    { id: 1, icon: '⚡', title: 'Switchboard repair', time: 'Today, 11:20 AM', amount: '+₹650' },
    { id: 2, icon: '❄️', title: 'AC gas refill', time: 'Today, 9:05 AM', amount: '+₹1,500' },
    { id: 3, icon: '🔧', title: 'Drain unclogging', time: 'Yesterday', amount: '+₹520' },
  ]);

  const PARTNER_STAGES = ['Accepted', 'On the way', 'Arrived', 'In progress', 'Completed'];
  const countdownIntervalRef = useRef(null);

  // Incoming job trigger
  const triggerIncomingJob = () => {
    if (!isOnline) return;
    clearInterval(countdownIntervalRef.current);
    setPartnerJob({ pay: 449 });
    setPartnerStep(0);
    setPartnerTimerLeft(60);

    const startTime = Date.now();
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const left = Math.max(0, 60 - elapsed);
      setPartnerTimerLeft(left);
      if (left <= 0) {
        clearInterval(countdownIntervalRef.current);
        setPartnerJob(null);
        triggerToast('Request expired');
      }
    }, 100);
  };

  const acceptJob = () => {
    clearInterval(countdownIntervalRef.current);
    setPartnerStep(0);
    triggerToast('Job accepted! Navigate to customer');
  };

  const declineJob = () => {
    clearInterval(countdownIntervalRef.current);
    setPartnerJob(null);
    triggerToast('Job declined. Waiting for the next one…');
  };

  const handlePartnerStepAdvance = () => {
    if (partnerStep === 2) {
      // Validate PIN
      if (pinInput.trim() !== '4827') {
        setPinShake(true);
        setTimeout(() => setPinShake(false), 450);
        triggerToast('Wrong PIN. Ask the customer again.');
        return;
      }
      triggerToast('PIN verified! Job started');
    }
    if (partnerStep === 3) {
      // Add parts cost & update wallet
      const p = parseInt(partsInput, 10) || 0;
      const totalPay = (partnerJob?.pay || 449) + p;
      setWalletToday((prev) => prev + totalPay);
      setWalletWeek((prev) => prev + totalPay);
      setWalletPending((prev) => prev + totalPay);

      setPartnerLedger((prev) => [
        {
          id: Date.now(),
          icon: '⚡',
          title: 'Fan installation',
          time: 'Just now',
          amount: '+' + fmtINR(totalPay),
        },
        ...prev,
      ]);
      triggerToast(`Job completed! ${fmtINR(totalPay)} added to wallet`);
    }
    if (partnerStep === 4) {
      // Back to dispatch
      setPartnerJob(null);
      setPartnerStep(0);
      setPinInput('');
      setPartsInput('');
      return;
    }
    setPartnerStep((prev) => prev + 1);
  };

  // ═══════════════════════════════════════════════════════════════
  // ADMIN STATE & LOGIC
  // ═══════════════════════════════════════════════════════════════
  const isPartnerUnderVerification = (curView === 'partner' || user?.role === 'worker') && user?.kycStatus === 'under_verification';

  const [kycQueue, setKycQueue] = useState(() => {
    const base = [
      { id: 'k0', name: 'Vikram Yadav', trade: 'Electrician', city: 'Punjab (Ludhiana)', aadharNo: '5421 8921 4410', panNo: 'ABCDE1234F' },
      { id: 'k1', name: 'Sandeep Patil', trade: 'Plumber', city: 'Punjab (Amritsar)', aadharNo: '9841 2210 3388', panNo: 'PQRSS5678K' },
      { id: 'k2', name: 'Imran Sheikh', trade: 'AC technician', city: 'Punjab (Jalandhar)', aadharNo: '3321 4411 9901', panNo: 'ZXCVB9012M' },
    ];
    if (user?.role === 'worker' && user?.kycStatus === 'under_verification') {
      base.unshift({
        id: user.id || 'curr-partner',
        name: user.name || 'Partner Pro',
        trade: user.trade || 'Electrician',
        city: 'Punjab (Ludhiana)',
        aadharNo: user.aadharNumber || '5421 8921 4410',
        panNo: user.panNumber || 'ABCDE1234F',
        isCurrentUser: true,
      });
    }
    return base;
  });

  const [adminFeed, setAdminFeed] = useState([
    'Booking #2841 completed in Ludhiana',
    'Priya rated her plumber 5 stars in Amritsar',
    'New partner applied for KYC verification in Jalandhar',
  ]);

  const handleKycAction = (id, name, approve) => {
    setKycQueue((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`${name} ${approve ? 'approved and now active' : 'rejected'}`);
    setAdminFeed((prev) => [
      `${name} was ${approve ? 'approved as a verified partner' : 'rejected after KYC review'}`,
      ...prev.slice(0, 4),
    ]);
    if (approve && (id === user?.id || id === 'curr-partner')) {
      updateUser?.({ kycStatus: 'approved' });
    }
  };

  return (
    <div className="fixovia-dashboard-layout">
      {/* ── Top Horizontal Navigation Bar ── */}
      <header className={`dash-navbar ${dashNavHidden ? 'nav-hidden' : ''}`}>
        <div className="nav-container">
          {/* Brand Logo */}
          <div className="nav-brand">
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                // When logged in, clicking the logo does not redirect
              }}
              style={{ cursor: 'default' }}
              aria-label="Fixovia"
            >
              <img src="/logo.png" alt="Fixovia" />
            </a>
          </div>

          {/* Dynamic Horizontal Role Nav Tabs */}
          <nav id="nav" className="dash-nav-links" aria-label="Dashboard Navigation">
            {NAV_CONFIG[curView]?.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-tab-btn ${activeNav === item.id ? 'on' : ''}`}
                onClick={() => handleNavTabClick(item.id)}
              >
                <span className="tab-icon">{item.icon}</span>
                <span className="tab-text">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Controls: 3-Role Preview Switcher, Theme Toggle, User Profile */}
          <div className="nav-actions">
            {/* 3-Role Preview Switcher */}
            <div className="pv" id="pv" role="tablist">
              <span
                className="pill"
                style={{
                  transform: `translateX(${curView === 'customer' ? '0%' : curView === 'partner' ? '100%' : '200%'
                    })`,
                }}
              />
              <button
                type="button"
                className={curView === 'customer' ? 'on' : ''}
                onClick={() => switchView('customer')}
              >
                Customer
              </button>
              <button
                type="button"
                className={curView === 'partner' ? 'on' : ''}
                onClick={() => switchView('partner')}
              >
                Partner
              </button>
              <button
                type="button"
                className={curView === 'admin' ? 'on' : ''}
                onClick={() => switchView('admin')}
              >
                Admin
              </button>
            </div>

            {/* User Profile Pill Link & Separate Sign-out */}
            <div className="me-nav-group">
              <button
                type="button"
                className={`me-profile-link ${(activeNav === 'c-profile' || activeNav === 'p-profile' || activeNav === 'a-profile') ? 'active' : ''}`}
                onClick={() => handleNavTabClick(curView === 'partner' ? 'p-profile' : curView === 'admin' ? 'a-profile' : 'c-profile')}
                title="View your dedicated profile page"
              >
                <div className="av">{meBadge.initials}</div>
                <div className="me-info">
                  <b id="meN">{meBadge.name}</b>
                  <small id="meR">{meBadge.roleLabel}</small>
                </div>
                <span className="profile-pill-arrow">→</span>
              </button>
              <button
                type="button"
                className="btn-signout-separate"
                onClick={handleSignOut}
                title="Sign out of account"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <main className="main">
        <div className="demo-notice-tag">
          Preview switcher for demo only. In the real app, each role gets its dedicated portal.
        </div>

        {/* ═══════════════════════════════════════════════════════════
            1. CUSTOMER DASHBOARD VIEW (SEPARATE SUB-PAGES)
           ═══════════════════════════════════════════════════════════ */}
        {curView === 'customer' && (
          <section className="view on" id="v-customer">
            {/* SUB-PAGE 1: OVERVIEW / ACTIVE BOOKING */}
            {activeNav === 'c-active' && (
              <div className="subpage-view" id="c-active">
                <div className="hd">
                  <p className="hand">
                    {hasActiveBooking ? 'Your active repair, live tracking' : 'Your repairs, at a glance'}
                  </p>
                  <h1>
                    Namaste, {meBadge.name.split(' ')[0]} 👋
                  </h1>
                </div>

                {!hasActiveBooking ? (
                  /* ── No Active Booking State ── */
                  <div className="no-active-booking-container">
                    <div className="card no-booking-hero-card">
                      <div className="no-booking-icon-badge">
                        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="4" width="20" height="24" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
                          <path d="M11 11H21" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M11 16H21" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M11 21H17" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" />
                          <circle cx="23" cy="23" r="5" fill="#f97316" />
                          <path d="M21.5 23L22.5 24L24.5 22" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '14px 0 8px', color: 'var(--ink)' }}>
                        No active booking
                      </h2>
                      <p style={{ color: 'var(--slate)', maxWidth: 480, margin: '0 auto 22px', fontSize: '0.98rem', lineHeight: 1.5 }}>
                        You don’t have any active home repair or service requests scheduled right now. Book a verified professional to get doorstep service in under 60 minutes.
                      </p>
                      <div className="acts" style={{ justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn p"
                          style={{ padding: '12px 28px', fontSize: '0.98rem' }}
                          onClick={() => handleNavTabClick('c-book')}
                        >
                          Book a new service →
                        </button>
                      </div>
                    </div>

                    {/* Popular Services Quick-Select */}
                    <div style={{ marginTop: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h3 style={{ margin: 0, fontSize: '1.18rem' }}>Popular services near you</h3>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--coral2)', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                          onClick={() => handleNavTabClick('c-book')}
                        >
                          View all 8 services →
                        </button>
                      </div>
                      <div className="grid g4">
                        {[
                          { logo: <ElectricalLogo size={28} />, bg: '#fffbeb', border: '#fde68a', title: 'Electrical', price: 'From ₹199', desc: 'Wiring, fans, MCB' },
                          { logo: <PlumbingLogo size={28} />, bg: '#f0f9ff', border: '#bae6fd', title: 'Plumbing', price: 'From ₹199', desc: 'Leaks, taps, geysers' },
                          { logo: <ACRepairLogo size={28} />, bg: '#eff6ff', border: '#bfdbfe', title: 'AC repair', price: 'From ₹499', desc: 'Deep cleaning, gas refill' },
                          { logo: <CarpentryLogo size={28} />, bg: '#fff7ed', border: '#fed7aa', title: 'Carpentry', price: 'From ₹249', desc: 'Locks, hinges, furniture' },
                        ].map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="qb"
                            style={{ textAlign: 'left', padding: '18px' }}
                            onClick={() => onNavigate('find', { category: s.title })}
                          >
                            <div className="qb-icon-badge" style={{ background: s.bg, border: `1.5px solid ${s.border}`, width: 46, height: 46, borderRadius: 14 }}>
                              {s.logo}
                            </div>
                            <b style={{ fontSize: '1.05rem', marginTop: 8 }}>{s.title}</b>
                            <span style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>{s.desc}</span>
                            <small style={{ marginTop: 8, fontWeight: 700, color: 'var(--coral2)', fontSize: '0.88rem' }}>{s.price}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Active Booking View ── */
                  <div className="grid g2">
                    <div className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div>
                          <h3>{activeBooking.trade} · {activeBooking.service}</h3>
                          <small style={{ color: 'var(--mute)' }}>{activeBooking.time} · {activeBooking.location}</small>
                        </div>
                        <span
                          className={`chip ${custStage === 5 ? 'g' : isCustCancelled ? '' : custStage > 0 ? 't' : ''
                            }`}
                          id="cst"
                        >
                          {isCustCancelled ? 'Cancelled' : CUST_STAGES[custStage]}
                        </span>
                      </div>

                      {/* 6-Step Stepper */}
                      {!isCustCancelled && (
                        <div className="stp" id="cstp">
                          <span
                            className="fill"
                            style={{
                              width: `calc(${custStage / (CUST_STAGES.length - 1)} * (100% - 28px))`,
                            }}
                          />
                          {CUST_STAGES.map((label, idx) => {
                            const isDone = idx < custStage || (custStage === 5 && idx === 5);
                            const isCurrent = idx === custStage;
                            return (
                              <div
                                key={idx}
                                className={isDone ? 'd' : isCurrent ? 'c' : ''}
                              >
                                <b>{isDone ? '✓' : idx + 1}</b>
                                {label}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Assigned Pro Card */}
                      <div className={`pro ${isCustAccepted ? '' : 'wait'}`} id="cpro">
                        <div
                          className="av"
                          style={{
                            background: assignedPro.color || '#7c3aed',
                            color: '#ffffff',
                            fontWeight: 800,
                          }}
                        >
                          {assignedPro.initials || proFirstName.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <b id="cpn">
                            {isCustCancelled
                              ? 'Booking cancelled'
                              : isCustAccepted
                                ? `${assignedPro.name} · ${assignedPro.rating || 4.8} ★`
                                : 'Finding the best pro nearby…'}
                          </b>
                          <div style={{ color: 'var(--slate)', fontSize: '0.88rem' }} id="cps">
                            {isCustCancelled
                              ? 'No charge was made. You can book again anytime.'
                              : isCustAccepted
                                ? `${assignedPro.reviews || 98}+ jobs · Background verified · ${activeBooking.trade || 'Pro'}`
                                : `Auto-match picks the highest-rated ${(activeBooking.trade || 'pro').toLowerCase()} within 60 seconds.`}
                          </div>
                        </div>
                      </div>

                      {/* Rating Card (Completed Job) */}
                      {custStage === 5 && (
                        <div id="crate" style={{ marginTop: 14 }}>
                          <b>How was {proFirstName}’s work?</b>
                          <div className="stars" id="stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                className={s <= custRating ? 'on' : ''}
                                onClick={() => {
                                  setCustRating(s);
                                  triggerToast(`Thanks for rating ${proFirstName} ${s} stars`);
                                }}
                                aria-label={`${s} star`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="acts">
                        <button
                          type="button"
                          className="btn p"
                          id="cnext"
                          onClick={handleCustNextStep}
                        >
                          {custStage === 5 ? 'Done · Back to overview' : 'Simulate next step'}
                        </button>

                        {custStage !== 5 && (
                          <button
                            type="button"
                            className="btn o"
                            id="ccancel"
                            onClick={handleCustCancel}
                          >
                            Cancel booking
                          </button>
                        )}

                        {custStage === 5 && (
                          <button
                            type="button"
                            className="btn o"
                            id="crec"
                            onClick={() => triggerToast('GST receipt downloaded')}
                          >
                            Download GST receipt
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Safety PIN & Price Summary */}
                    <div className="grid" style={{ alignContent: 'start' }}>
                      <div className="card">
                        <h3>Doorstep safety PIN</h3>
                        <p style={{ color: 'var(--slate)', fontSize: '0.9rem' }} id="pinMsg">
                          {custStage === 5
                            ? 'Job done. This PIN has been used.'
                            : isCustAccepted
                              ? `Give this PIN to ${proFirstName} when they arrive. Work starts only after they enter it.`
                              : 'Your PIN unlocks once a pro accepts. Share it only when they arrive.'}
                        </p>
                        <div className={`pin ${isCustAccepted && custStage < 5 ? 'on' : ''}`} id="cpin">
                          {(activeBooking?.pin || '4827').split('').map((d, i) => (
                            <b key={i}>{isCustAccepted && custStage < 5 ? d : '•'}</b>
                          ))}
                        </div>
                      </div>

                      <div className="card bill" id="bill">
                        <h3>Price summary</h3>
                        <div className="r"><span>Base labor</span><span>₹{activeBooking.baseLabor}</span></div>
                        <div className="r"><span>Parts estimate</span><span>₹{activeBooking.partsEstimate}</span></div>
                        <div className="r"><span>GST (18%)</span><span>₹{activeBooking.tax}</span></div>
                        <div className="r"><span>Platform fee</span><span>₹{activeBooking.platformFee}</span></div>
                        <div className="r t"><span>Total</span><span>₹{activeBooking.total}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {hasActiveBooking && (
                  /* Quick Link to Book Subpage */
                  <div className="card" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Need another repair done?</h3>
                      <p style={{ color: 'var(--slate)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        Choose electrical, plumbing, AC repair, carpentry and more.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn b"
                      onClick={() => handleNavTabClick('c-book')}
                    >
                      Book a new service →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUB-PAGE 2: BOOK SERVICES */}
            {activeNav === 'c-book' && (
              <div className="subpage-view" id="c-book">
                <div className="hd">
                  <p className="hand">On-demand doorstep repair</p>
                  <h1>Book a Service</h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Select a trade to request a verified pro in under 60 seconds.</p>
                </div>

                <div className="grid g4" id="qb">
                  {[
                    {
                      logo: <ElectricalLogo size={30} />,
                      badgeBg: '#fffbeb',
                      badgeBorder: '#fde68a',
                      title: 'Electrical',
                      price: `From ₹${livePartnerRate}`,
                      desc: 'Wiring, switches, fans, MCB',
                    },
                    {
                      logo: <PlumbingLogo size={30} />,
                      badgeBg: '#f0f9ff',
                      badgeBorder: '#bae6fd',
                      title: 'Plumbing',
                      price: 'From ₹199',
                      desc: 'Taps, pipes, geysers, leaks',
                    },
                    {
                      logo: <ACRepairLogo size={30} />,
                      badgeBg: '#eff6ff',
                      badgeBorder: '#bfdbfe',
                      title: 'AC repair',
                      price: 'From ₹499',
                      desc: 'Deep cleaning, gas refill, repair',
                    },
                    {
                      logo: <CarpentryLogo size={30} />,
                      badgeBg: '#fff7ed',
                      badgeBorder: '#fed7aa',
                      title: 'Carpentry',
                      price: 'From ₹249',
                      desc: 'Furniture, locks, fittings',
                    },
                  ].map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="qb"
                      style={{ textAlign: 'left', padding: '22px' }}
                      onClick={() => onNavigate('find', { category: c.title })}
                    >
                      <div
                        className="qb-icon-badge"
                        style={{ background: c.badgeBg, border: `1.5px solid ${c.badgeBorder}` }}
                      >
                        {c.logo}
                      </div>
                      <b style={{ fontSize: '1.15rem', marginTop: 10 }}>{c.title}</b>
                      <span style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>{c.desc}</span>
                      <small style={{ marginTop: 10, fontWeight: 700, color: 'var(--coral2)', fontSize: '0.92rem' }}>
                        {c.price}
                      </small>
                    </button>
                  ))}
                </div>

                <div className="grid g4" style={{ marginTop: 18 }}>
                  {[
                    {
                      logo: <PaintingLogo size={30} />,
                      badgeBg: '#fff1f2',
                      badgeBorder: '#fecdd3',
                      title: 'Painting',
                      price: 'From ₹999',
                      desc: 'Waterproofing & interior touchups',
                    },
                    {
                      logo: <CleaningLogo size={30} />,
                      badgeBg: '#f0fdf4',
                      badgeBorder: '#bbf7d0',
                      title: 'Cleaning',
                      price: 'From ₹399',
                      desc: 'Kitchen & bathroom deep cleaning',
                    },
                    {
                      logo: <AppliancesLogo size={30} />,
                      badgeBg: '#f5f3ff',
                      badgeBorder: '#ddd6fe',
                      title: 'Appliances',
                      price: 'From ₹299',
                      desc: 'Washing machine, microwave fix',
                    },
                    {
                      logo: <PestControlLogo size={30} />,
                      badgeBg: '#f0fdfa',
                      badgeBorder: '#99f6e4',
                      title: 'Pest Control',
                      price: 'From ₹599',
                      desc: 'Cockroach, termite inspection',
                    },
                  ].map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="qb"
                      style={{ textAlign: 'left', padding: '22px' }}
                      onClick={() => onNavigate('find', { category: c.title })}
                    >
                      <div
                        className="qb-icon-badge"
                        style={{ background: c.badgeBg, border: `1.5px solid ${c.badgeBorder}` }}
                      >
                        {c.logo}
                      </div>
                      <b style={{ fontSize: '1.15rem', marginTop: 10 }}>{c.title}</b>
                      <span style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>{c.desc}</span>
                      <small style={{ marginTop: 10, fontWeight: 700, color: 'var(--coral2)', fontSize: '0.92rem' }}>
                        {c.price}
                      </small>
                    </button>
                  ))}
                </div>

                {/* Fixovia Service Guarantee Banner */}
                <div className="card" style={{ marginTop: 24, background: 'linear-gradient(135deg, #f0f7ff, #ffffff)', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>🛡️</div>
                    <div>
                      <h3 style={{ margin: 0, color: '#0d56cb' }}>Fixovia Service Guarantee</h3>
                      <p style={{ color: 'var(--slate)', margin: '4px 0 0', fontSize: '0.92rem' }}>
                        Every booking includes upfront transparent rates, verified background-checked technicians, and safe doorstep OTP start verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 3: BOOKING HISTORY */}
            {activeNav === 'c-hist' && (
              <div className="subpage-view" id="c-hist">
                <div className="hd">
                  <p className="hand">Past repairs & statements</p>
                  <h1>Booking History</h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Review completed jobs, ratings, and download tax invoices.</p>
                </div>

                <div className="card list" id="hist">
                  {[
                    { icon: '⚡', title: 'Fan installation', desc: '12 Oct · ₹648', stars: 5, inv: 'INV-2026-1042' },
                    { icon: '🔧', title: 'Tap leakage fix', desc: '28 Sep · ₹420', stars: 4, inv: 'INV-2026-0988' },
                    { icon: '❄️', title: 'AC deep cleaning', desc: '14 Aug · ₹1,180', stars: 5, inv: 'INV-2026-0812' },
                    { icon: '🔨', title: 'Door lock replacement', desc: '02 Jul · ₹550', stars: 5, inv: 'INV-2026-0701' },
                  ].map((h, i) => (
                    <div key={i} className="it" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div className="ic">{h.icon}</div>
                        <div>
                          <b>{h.title}</b>
                          <br />
                          <small>{h.desc}</small>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span className="st">{'★'.repeat(h.stars)}{'☆'.repeat(5 - h.stars)}</span>
                        <button
                          type="button"
                          className="btn o"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          onClick={() => triggerToast(`Invoice ${h.inv} downloaded`)}
                        >
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PAGE 4: CUSTOMER PROFILE */}
            {activeNav === 'c-profile' && (
              <div className="subpage-view profile-container" id="c-profile">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                  <div className="profile-header-left">
                    <div className="profile-avatar-lg">
                      {custProfile.name.split(' ').map(n => n[0]).join('') || 'AM'}
                    </div>
                    <div className="profile-header-meta">
                      <h2>{custProfile.name}</h2>
                      <p>Doorstep Verified Fixovia Customer · Member since Aug 2024</p>
                      <div className="profile-badges-row">
                        <span className="profile-badge-pill">🛡️ Mobile & Email Verified</span>
                        <span className="profile-badge-pill blue">📍 {custProfile.city}</span>
                        <span className="profile-badge-pill amber">⭐ 5.0 Star Customer</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn b"
                    onClick={() => triggerToast('Customer profile updated successfully')}
                  >
                    Save Changes
                  </button>
                </div>

                {/* Profile Section Grid */}
                <div className="profile-section-grid">
                  {/* Card 1: Personal Details */}
                  <div className="profile-card">
                    <h3>👤 Personal Details</h3>
                    <p className="profile-card-desc">Your verified contact details for service visits and billing receipts.</p>
                    <div className="profile-form">
                      <div className="profile-field">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={custProfile.name}
                          onChange={(e) => setCustProfile({ ...custProfile, name: e.target.value })}
                        />
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Phone Number</label>
                          <input
                            type="text"
                            value={custProfile.phone}
                            onChange={(e) => setCustProfile({ ...custProfile, phone: e.target.value })}
                          />
                        </div>
                        <div className="profile-field">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={custProfile.email}
                            onChange={(e) => setCustProfile({ ...custProfile, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Saved Doorstep Address */}
                  <div className="profile-card">
                    <h3>📍 Primary Doorstep Address</h3>
                    <p className="profile-card-desc">The default address used when dispatching nearby verified technicians.</p>
                    <div className="profile-form">
                      <div className="profile-field">
                        <label>Flat / House / Tower</label>
                        <input
                          type="text"
                          value={custProfile.flat}
                          onChange={(e) => setCustProfile({ ...custProfile, flat: e.target.value })}
                        />
                      </div>
                      <div className="profile-field">
                        <label>Society / Street / Area</label>
                        <input
                          type="text"
                          value={custProfile.street}
                          onChange={(e) => setCustProfile({ ...custProfile, street: e.target.value })}
                        />
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Landmark</label>
                          <input
                            type="text"
                            value={custProfile.landmark}
                            onChange={(e) => setCustProfile({ ...custProfile, landmark: e.target.value })}
                          />
                        </div>
                        <div className="profile-field">
                          <label>City & Pincode</label>
                          <input
                            type="text"
                            value={`${custProfile.city} - ${custProfile.pincode}`}
                            onChange={(e) => setCustProfile({ ...custProfile, city: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Doorstep Safety & PIN Settings */}
                  <div className="profile-card">
                    <h3>🔐 Doorstep Safety & PIN Controls</h3>
                    <p className="profile-card-desc">Configure security protocols before work commences at your residence.</p>
                    <div>
                      <div className="profile-toggle-row">
                        <div className="profile-toggle-info">
                          <b>Mandatory Doorstep OTP PIN</b>
                          <small>Technician must enter your 4-digit PIN before starting any repair job.</small>
                        </div>
                        <label className="profile-switch">
                          <input
                            type="checkbox"
                            checked={custProfile.pinEnabled}
                            onChange={(e) => setCustProfile({ ...custProfile, pinEnabled: e.target.checked })}
                          />
                          <span className="profile-slider"></span>
                        </label>
                      </div>

                      <div className="profile-toggle-row">
                        <div className="profile-toggle-info">
                          <b>SMS & WhatsApp PIN Dispatch</b>
                          <small>Receive the PIN immediately via SMS as soon as a technician accepts your booking.</small>
                        </div>
                        <label className="profile-switch">
                          <input
                            type="checkbox"
                            checked={custProfile.smsPin}
                            onChange={(e) => setCustProfile({ ...custProfile, smsPin: e.target.checked })}
                          />
                          <span className="profile-slider"></span>
                        </label>
                      </div>

                      <div className="profile-toggle-row">
                        <div className="profile-toggle-info">
                          <b>Phone Number Masking</b>
                          <small>Calls between you and the technician are routed via a secure virtual proxy number.</small>
                        </div>
                        <label className="profile-switch">
                          <input
                            type="checkbox"
                            checked={custProfile.maskPhone}
                            onChange={(e) => setCustProfile({ ...custProfile, maskPhone: e.target.checked })}
                          />
                          <span className="profile-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Repair Metrics & Warranty */}
                  <div className="profile-card">
                    <h3>📊 Service History & Guarantees</h3>
                    <p className="profile-card-desc">Your Fixovia customer journey and protected warranties.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
                        <small style={{ color: 'var(--mute)', fontWeight: 600 }}>Total Completed Jobs</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--coral2)', marginTop: 4 }}>14 repairs</div>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 12, border: '1px solid #bbf7d0' }}>
                        <small style={{ color: '#166534', fontWeight: 600 }}>Estimated Savings</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d', marginTop: 4 }}>₹4,250</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', padding: '12px 14px', borderRadius: 12, border: '1px solid #bfdbfe' }}>
                      <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                      <small style={{ color: '#1e40af', lineHeight: 1.4 }}>
                        All your bookings carry <strong>Fixovia 30-Day Doorstep Guarantee</strong> with zero-cost re-inspection.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="profile-actions-bar">
                  <button
                    type="button"
                    className="btn o"
                    onClick={() => handleNavTabClick('c-active')}
                  >
                    Back to Overview
                  </button>
                  <button
                    type="button"
                    className="btn b"
                    onClick={() => triggerToast('Customer profile updated successfully')}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            2. PARTNER / PRO DASHBOARD VIEW (SEPARATE SUB-PAGES)
           ═══════════════════════════════════════════════════════════ */}
        {curView === 'partner' && (
          <section className="view on" id="v-partner">
            {/* Account Under Verification Status Banner */}
            {isPartnerUnderVerification && (
              <div className="partner-kyc-status-banner">
                <div className="kyc-banner-icon-col">
                  <span className="kyc-clock-pulse">⏳</span>
                </div>
                <div className="kyc-banner-content">
                  <div className="kyc-banner-title">
                    <span>Your account is under verification process</span>
                    <span className="kyc-pill-chip">Under Checking · 24h Approval</span>
                  </div>
                  <p className="kyc-banner-desc">
                    Your Aadhaar Card and PAN Card have been submitted and are being reviewed by the Fixovia Admin team. You can freely explore features, rate cards, and tools in your workspace, but you <strong>cannot accept customer bookings</strong> until verification is approved.
                  </p>
                </div>
              </div>
            )}

            {/* SUB-PAGE 1: JOB DISPATCH */}
            {activeNav === 'p-dispatch' && (
              <div className="subpage-view" id="p-dispatch">
                <div className="hd" style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'end' }}>
                  <div>
                    <p className="hand">Ready for the next job?</p>
                    <h1>
                      Job Dispatch ·{' '}
                      <span id="onT">
                        {isPartnerUnderVerification ? 'Verification Pending' : isOnline ? 'Online' : 'Offline'}
                      </span>
                    </h1>
                  </div>
                  <label className="sw" title={isPartnerUnderVerification ? "Account under verification process. Bookings will unlock upon Admin approval." : ""}>
                    <input
                      type="checkbox"
                      id="onl"
                      checked={isPartnerUnderVerification ? false : isOnline}
                      disabled={isPartnerUnderVerification}
                      onChange={(e) => {
                        if (isPartnerUnderVerification) {
                          triggerToast('⚠️ Account under verification. You can accept bookings once approved by Admin (under 24h).');
                          return;
                        }
                        const val = e.target.checked;
                        setIsOnline(val);
                        if (!val) {
                          setPartnerJob(null);
                          clearInterval(countdownIntervalRef.current);
                        }
                        triggerToast(val ? 'You’re online' : 'You’re offline');
                      }}
                    />
                    <span></span>
                    {isPartnerUnderVerification ? 'Under Verification ⏳' : 'Available'}
                  </label>
                </div>

                <div className="card" id="disp">
                  {isPartnerUnderVerification ? (
                    // Locked State When Under Verification
                    <div className="kyc-dispatch-locked-card">
                      <div className="locked-icon">🔒</div>
                      <h3>Booking Dispatch Paused</h3>
                      <p>
                        Your Aadhaar and PAN documents have been submitted and are being verified by the Fixovia Admin team. The verification will be completed in <strong>under 24 hours</strong>. You can explore your wallet, daily ledger, and profile features below.
                      </p>
                      <div className="acts" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn o"
                          onClick={() => handleNavTabClick('p-wallet')}
                        >
                          Explore Partner Wallet →
                        </button>
                        <button
                          type="button"
                          className="btn o"
                          onClick={() => handleNavTabClick('p-ledger')}
                        >
                          Explore Payment Ledger →
                        </button>
                      </div>
                    </div>
                  ) : !partnerJob ? (
                    // Radar Idle State
                    <div className="radar">
                      <div className="rd">{isOnline ? '📡' : '😴'}</div>
                      <b>{isOnline ? 'Looking for jobs near you…' : 'You’re offline'}</b>
                      <span>
                        {isOnline
                          ? 'New requests appear here with a 60-second timer.'
                          : 'Switch on Available to receive jobs.'}
                      </span>
                      {isOnline && (
                        <div className="acts">
                          <button
                            type="button"
                            className="btn b"
                            id="sim"
                            onClick={triggerIncomingJob}
                          >
                            Simulate incoming job
                          </button>
                        </div>
                      )}
                    </div>
                  ) : partnerStep === 0 && partnerTimerLeft > 0 && partnerJob.pay === 449 && !partnerJob.accepted ? (
                    // Incoming Request with 60s countdown
                    <div className="job ring">
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                        <div>
                          <span className="chip">New request</span>
                          <h3 style={{ marginTop: 8 }}>Fan installation + MCB check</h3>
                          <small style={{ color: 'var(--mute)' }}>Sector 21, Gurugram · 2.4 km away · Today 4–6 PM</small>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <small>You earn</small>
                          <div style={{ font: '800 1.6rem Fraunces, serif', color: 'var(--ok)' }}>₹449+</div>
                        </div>
                      </div>
                      <div className="cd">
                        <u id="cdb" style={{ width: `${(partnerTimerLeft / 60) * 100}%` }} />
                      </div>
                      <small id="cdt">Respond in {Math.ceil(partnerTimerLeft)}s</small>
                      <div className="acts">
                        <button
                          type="button"
                          className="btn p"
                          id="acc"
                          onClick={() => {
                            setPartnerJob((prev) => ({ ...prev, accepted: true }));
                            acceptJob();
                          }}
                        >
                          Accept job
                        </button>
                        <button
                          type="button"
                          className="btn o"
                          id="dec"
                          onClick={declineJob}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    // In-Progress Partner Workflow
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                        <div>
                          <h3>Fan installation + MCB check</h3>
                          <small style={{ color: 'var(--mute)' }}>Customer: Aarav · Sector 21, Gurugram</small>
                        </div>
                        <span className="chip t">{PARTNER_STAGES[partnerStep]}</span>
                      </div>

                      {/* 5-Step Stepper */}
                      <div className="stp" id="pst">
                        <span
                          className="fill"
                          style={{
                            width: `calc(${partnerStep / (PARTNER_STAGES.length - 1)} * (100% - 28px))`,
                          }}
                        />
                        {PARTNER_STAGES.map((label, idx) => {
                          const isDone = idx < partnerStep || (partnerStep === 4 && idx === 4);
                          const isCurrent = idx === partnerStep;
                          return (
                            <div key={idx} className={isDone ? 'd' : isCurrent ? 'c' : ''}>
                              <b>{isDone ? '✓' : idx + 1}</b>
                              {label}
                            </div>
                          );
                        })}
                      </div>

                      {partnerStep === 0 && (
                        <div className="acts">
                          <button
                            type="button"
                            className="btn b"
                            onClick={handlePartnerStepAdvance}
                          >
                            Tap: On the way
                          </button>
                        </div>
                      )}

                      {partnerStep === 1 && (
                        <div className="acts">
                          <button
                            type="button"
                            className="btn b"
                            onClick={handlePartnerStepAdvance}
                          >
                            Tap: I’ve arrived
                          </button>
                        </div>
                      )}

                      {partnerStep === 2 && (
                        <div>
                          <p style={{ color: 'var(--slate)' }}>Ask the customer for their 4-digit safety PIN.</p>
                          <input
                            className={`inp ${pinShake ? 'shake' : ''}`}
                            id="pinI"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="Enter PIN"
                            aria-label="Safety PIN"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                          />
                          <small style={{ color: 'var(--mute)', display: 'block', marginTop: 4 }}>
                            Demo PIN: 4827
                          </small>
                          <div className="acts">
                            <button
                              type="button"
                              className="btn p"
                              onClick={handlePartnerStepAdvance}
                            >
                              Verify and start job
                            </button>
                          </div>
                        </div>
                      )}

                      {partnerStep === 3 && (
                        <div>
                          <p style={{ color: 'var(--slate)' }}>Work in progress. Add any parts cost when you finish.</p>
                          <input
                            className="inp"
                            id="parts"
                            inputMode="numeric"
                            placeholder="Parts cost in ₹ (optional)"
                            aria-label="Parts cost"
                            value={partsInput}
                            onChange={(e) => setPartsInput(e.target.value)}
                          />
                          <div className="acts">
                            <button
                              type="button"
                              className="btn p"
                              onClick={handlePartnerStepAdvance}
                            >
                              Complete job
                            </button>
                          </div>
                        </div>
                      )}

                      {partnerStep === 4 && (
                        <div style={{ textAlign: 'center', padding: 10 }}>
                          <div style={{ fontSize: '2.4rem' }}>🎉</div>
                          <h3>Job complete</h3>
                          <p style={{ color: 'var(--slate)' }}>
                            {fmtINR(partnerJob?.pay || 449)} was credited to your wallet.
                          </p>
                          <div className="acts" style={{ justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="btn b"
                              onClick={handlePartnerStepAdvance}
                            >
                              Back to dispatch
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-PAGE 2: WALLET & BALANCES */}
            {activeNav === 'p-wallet' && (
              <div className="subpage-view" id="p-wallet">
                <div className="hd">
                  <p className="hand">Earnings & Daily Settlements</p>
                  <h1>Partner Wallet</h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Track your earnings, bank settlement schedule, and instant withdrawals.</p>
                </div>

                <div className="grid g3">
                  <div className="card stat lift">
                    <small>Today’s earnings</small>
                    <div className="n">{fmtINR(walletToday)}</div>
                  </div>
                  <div className="card stat lift">
                    <small>This week</small>
                    <div className="n">{fmtINR(walletWeek)}</div>
                  </div>
                  <div className="card stat lift">
                    <small>Pending payout</small>
                    <div className="n">{fmtINR(walletPending)}</div>
                  </div>
                </div>

                {/* Direct Bank Settlement Card */}
                <div className="card" style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Linked Bank Account</h3>
                      <p style={{ color: 'var(--slate)', fontSize: '0.92rem', margin: '6px 0 2px' }}>
                        Primary Account: <b>State Bank of India (•••• 4821)</b> · IFSC: <code>SBIN0001429</code>
                      </p>
                      <small style={{ color: 'var(--mute)' }}>
                        Daily auto-settlement sweeps at 9:00 PM via IMPS / UPI directly into your bank.
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn p"
                      onClick={() => {
                        setWalletToday(0);
                        setWalletPending(0);
                        triggerToast('Instant cashout of ₹3,200 transferred to SBI A/C •••• 4821');
                      }}
                    >
                      Withdraw Instant Funds
                    </button>
                  </div>
                </div>

                {/* Weekly Summary Breakdown */}
                <div className="card bill" style={{ marginTop: 18 }}>
                  <h3>Weekly Summary Breakdown</h3>
                  <div className="r"><span>Gross service revenue</span><span>₹9,434</span></div>
                  <div className="r"><span>Platform service fee (10%)</span><span>-₹944</span></div>
                  <div className="r"><span>Direct tips (100% pro share)</span><span>+₹1,200</span></div>
                  <div className="r t"><span>Net Transfer to Bank</span><span>₹9,690</span></div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 3: WALLET LEDGER */}
            {activeNav === 'p-ledger' && (
              <div className="subpage-view" id="p-ledger">
                <div className="hd">
                  <p className="hand">Itemized payment records</p>
                  <h1>Wallet Ledger</h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Complete transaction and payout history for your technician account.</p>
                </div>

                <div className="card list" id="led">
                  {partnerLedger.map((l) => (
                    <div key={l.id} className="it">
                      <div className="ic">{l.icon}</div>
                      <div>
                        <b>{l.title}</b>
                        <br />
                        <small>{l.time}</small>
                      </div>
                      <b style={{ color: 'var(--ok)' }}>{l.amount}</b>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PAGE 4: PARTNER PROFILE */}
            {activeNav === 'p-profile' && (
              <div className="subpage-view profile-container" id="p-profile">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                  <div className="profile-header-left">
                    <div className="profile-avatar-lg" style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}>
                      {partnerProfile.name.split(' ').map(n => n[0]).join('') || 'RS'}
                    </div>
                    <div className="profile-header-meta">
                      <h2>{partnerProfile.name}</h2>
                      <p>Verified Pro Partner · ID: <strong>FXV-PRO-8492</strong> · Sector 21 Hub</p>
                      <div className="profile-badges-row">
                        <span className="profile-badge-pill">✓ Govt KYC Verified</span>
                        <span className="profile-badge-pill blue">⚡ {partnerProfile.primaryTrade}</span>
                        <span className="profile-badge-pill amber">⭐ 4.92 Rating (348 jobs)</span>
                        <span className="profile-badge-pill" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontWeight: 700 }}>
                          💰 ₹{partnerProfile.visitRate || 499} Fixed Visit
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn b"
                    onClick={handleSavePartnerProfile}
                  >
                    Save Changes
                  </button>
                </div>

                {/* Profile Section Grid */}
                <div className="profile-section-grid">
                  {/* Card 1: Professional & Trade Info */}
                  <div className="profile-card">
                    <h3>🛠️ Trade Specialization & Coverage</h3>
                    <p className="profile-card-desc">Your operational trades, fixed visiting price, and doorstep dispatch radius.</p>
                    <div className="profile-form">
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Primary Trade</label>
                          <input
                            type="text"
                            value={partnerProfile.primaryTrade}
                            onChange={(e) => handlePartnerTradeChange(e.target.value)}
                          />
                        </div>
                        <div className="profile-field">
                          <label>Secondary Trade</label>
                          <input
                            type="text"
                            value={partnerProfile.secondaryTrade}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, secondaryTrade: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Field Experience</label>
                          <input
                            type="text"
                            value={partnerProfile.expYears}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, expYears: e.target.value })}
                          />
                        </div>
                        <div className="profile-field">
                          <label>Service Radius</label>
                          <select
                            value={partnerProfile.radius}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, radius: e.target.value })}
                          >
                            <option value="5 km">5 km radius</option>
                            <option value="10 km">10 km radius</option>
                            <option value="15 km">15 km radius</option>
                            <option value="25 km">25 km radius</option>
                          </select>
                        </div>
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Fixed Visiting & Inspection Price</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--coral2)', fontWeight: 700 }}>Doorstep Rate</span>
                          </label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', left: 14, color: 'var(--ink)', fontWeight: 700, fontSize: '0.95rem' }}>₹</span>
                            <input
                              type="number"
                              min="99"
                              max="2999"
                              step="10"
                              style={{ paddingLeft: 30, fontWeight: 700 }}
                              value={partnerProfile.visitRate}
                              onChange={(e) => handlePartnerRateChange(e.target.value)}
                              onBlur={(e) => handlePartnerRateChange(e.target.value)}
                            />
                          </div>
                          <small style={{ color: 'var(--mute)', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>
                            Your fixed doorstep diagnosis rate presented to customers when booking your visit.
                          </small>
                        </div>
                        <div className="profile-field">
                          <label>Assigned Regional Hub</label>
                          <input
                            type="text"
                            value={partnerProfile.hub}
                            disabled
                          />
                          <small style={{ color: 'var(--mute)', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>
                            Designated territory service center for material staging.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Government KYC Verification */}
                  <div className="profile-card">
                    <h3>🛡️ Identity & Compliance Verification</h3>
                    <p className="profile-card-desc">Mandatory national identity proofs and background vetting.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid var(--line)' }}>
                        <div>
                          <b style={{ fontSize: '0.92rem' }}>Aadhaar Identity Card</b>
                          <br />
                          <small style={{ color: 'var(--mute)' }}>UIDAI No: •••• •••• 9104</small>
                        </div>
                        <span className="profile-badge-pill">✓ Verified by Admin</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid var(--line)' }}>
                        <div>
                          <b style={{ fontSize: '0.92rem' }}>Permanent Account Number (PAN)</b>
                          <br />
                          <small style={{ color: 'var(--mute)' }}>PAN: ABCDE1234F</small>
                        </div>
                        <span className="profile-badge-pill">✓ Tax Compliant</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid var(--line)' }}>
                        <div>
                          <b style={{ fontSize: '0.92rem' }}>Police Clearance Verification</b>
                          <br />
                          <small style={{ color: 'var(--mute)' }}>Gurugram Police Dept · Clean Record</small>
                        </div>
                        <span className="profile-badge-pill">✓ Passed Background</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Payout Bank & UPI Details */}
                  <div className="profile-card">
                    <h3>🏦 Payout Bank & Settlement Account</h3>
                    <p className="profile-card-desc">Where your earnings and customer tips are deposited.</p>
                    <div className="profile-form">
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Bank Name</label>
                          <input
                            type="text"
                            value={partnerProfile.bankName}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, bankName: e.target.value })}
                          />
                        </div>
                        <div className="profile-field">
                          <label>Account Number</label>
                          <input
                            type="text"
                            value={partnerProfile.acNo}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, acNo: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>IFSC Code</label>
                          <input
                            type="text"
                            value={partnerProfile.ifsc}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, ifsc: e.target.value })}
                          />
                        </div>
                        <div className="profile-field">
                          <label>Linked UPI ID</label>
                          <input
                            type="text"
                            value={partnerProfile.upi}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, upi: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="profile-toggle-row">
                        <div className="profile-toggle-info">
                          <b>Daily 9:00 PM Auto-Settlement</b>
                          <small>Automatically sweep available wallet balance to bank account every evening via IMPS.</small>
                        </div>
                        <label className="profile-switch">
                          <input
                            type="checkbox"
                            checked={partnerProfile.autoSettlement}
                            onChange={(e) => setPartnerProfile({ ...partnerProfile, autoSettlement: e.target.checked })}
                          />
                          <span className="profile-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Partner Performance Stats */}
                  <div className="profile-card">
                    <h3>📈 Performance Scorecard</h3>
                    <p className="profile-card-desc">Customer satisfaction and reliability metrics for dispatch prioritization.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid var(--line)' }}>
                        <small style={{ color: 'var(--mute)', fontWeight: 600 }}>On-Time Arrival Rate</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--coral2)', marginTop: 4 }}>98.4%</div>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 12, border: '1px solid #bbf7d0' }}>
                        <small style={{ color: '#166534', fontWeight: 600 }}>First-Time Fix Rate</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d', marginTop: 4 }}>96.8%</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef3c7', padding: '12px 14px', borderRadius: 12, border: '1px solid #fde68a' }}>
                      <span style={{ fontSize: '1.2rem' }}>⭐</span>
                      <small style={{ color: '#92400e', lineHeight: 1.4 }}>
                        You are ranked in the <strong>Top 5% Highest Rated Pros</strong> in Sector 21, Gurugram.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="profile-actions-bar">
                  <button
                    type="button"
                    className="btn o"
                    onClick={() => handleNavTabClick('p-dispatch')}
                  >
                    Back to Dispatch
                  </button>
                  <button
                    type="button"
                    className="btn b"
                    onClick={handleSavePartnerProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            3. ADMIN CONTROL CENTER VIEW (SEPARATE SUB-PAGES)
           ═══════════════════════════════════════════════════════════ */}
        {curView === 'admin' && (
          <section className="view on" id="v-admin">
            {/* SUB-PAGE 1: CONTROL CENTER METRICS */}
            {activeNav === 'a-metrics' && (
              <div className="subpage-view" id="a-metrics">
                <div className="hd">
                  <p className="hand">Platform health, live</p>
                  <h1>Control Center Metrics</h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Real-time platform KPIs, volume analytics, and regional distributions.</p>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid g4">
                  <div className="card stat lift">
                    <small>Total users</small>
                    <div className="n">{fmtNum(12480)}</div>
                  </div>
                  <div className="card stat lift">
                    <small>Active workers</small>
                    <div className="n">{fmtNum(1236)}</div>
                  </div>
                  <div className="card stat lift">
                    <small>Pending KYC</small>
                    <div className="n">{kycQueue.length}</div>
                  </div>
                  <div className="card stat lift">
                    <small>Daily revenue</small>
                    <div className="n">{fmtINR(384200)}</div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="sec">
                  <div className="grid g2">
                    <div className="card">
                      <h3>Bookings this week</h3>
                      <div className="bars" id="bars">
                        {[
                          ['Mon', 52],
                          ['Tue', 61],
                          ['Wed', 48],
                          ['Thu', 72],
                          ['Fri', 88],
                          ['Sat', 100],
                          ['Sun', 79],
                        ].map(([day, val], idx) => (
                          <div key={idx}>
                            <i style={{ height: `${Math.round(val * 1.3)}px` }} />
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h3>Bookings by city</h3>
                      <div id="city">
                        {[
                          ['Delhi-NCR', 92],
                          ['Mumbai', 78],
                          ['Bengaluru', 71],
                          ['Hyderabad', 54],
                          ['Pune', 41],
                        ].map(([city, pct], idx) => (
                          <div key={idx} className="hb">
                            <span>{city}</span>
                            <u>
                              <i style={{ width: `${pct}%` }} />
                            </u>
                            <b>{pct}%</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 2: KYC VERIFICATION QUEUE */}
            {activeNav === 'a-kyc' && (
              <div className="subpage-view" id="a-kyc">
                <div className="hd">
                  <p className="hand">Technician compliance & background verification</p>
                  <h1>
                    KYC Verification Queue{' '}
                    <span className={`chip ${kycQueue.length ? '' : 'g'}`} id="kn">
                      {kycQueue.length ? `${kycQueue.length} pending` : 'All caught up'}
                    </span>
                  </h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Review Aadhaar, Police clearance certificate, and skill certifications before onboarding.</p>
                </div>

                <div className="card" id="kyc">
                  {kycQueue.length > 0 ? (
                    kycQueue.map((k) => (
                      <div key={k.id} className="kyc">
                        <div>
                          <div className="it">
                            <div className="av">
                              {k.name.split(' ').map((w) => w[0]).join('')}
                            </div>
                            <div style={{ flex: 1, minWidth: 150 }}>
                              <b>{k.name}</b>
                              {k.isCurrentUser && (
                                <span className="chip" style={{ marginLeft: 8, fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8' }}>
                                  Newly Registered
                                </span>
                              )}
                              <br />
                              <small>
                                {k.trade} · {k.city} · Aadhaar: {k.aadharNo || 'Attached ✓'} · PAN: {k.panNo || 'Attached ✓'}
                              </small>
                            </div>
                            <div className="acts" style={{ margin: 0 }}>
                              <button
                                type="button"
                                className="btn b"
                                onClick={() => handleKycAction(k.id, k.name, true)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn o"
                                onClick={() => handleKycAction(k.id, k.name, false)}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: 24 }}>
                      <div style={{ fontSize: '2rem' }}>🎉</div>
                      <b>All caught up</b>
                      <br />
                      <small style={{ color: 'var(--mute)' }}>No technicians waiting for review.</small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-PAGE 3: LIVE ACTIVITY FEED */}
            {activeNav === 'a-activity' && (
              <div className="subpage-view" id="a-activity">
                <div className="hd">
                  <p className="hand">Real-time operations audit stream</p>
                  <h1>Platform Live Activity</h1>
                  <p style={{ color: 'var(--slate)', marginTop: 4 }}>Streaming live dispatches, PIN verifications, and completed jobs across regions.</p>
                </div>

                <div className="card list feed" id="feed">
                  {adminFeed.map((text, idx) => (
                    <div key={idx} className="it">
                      <span className="dot" />
                      <div>
                        <b>{text}</b>
                        <br />
                        <small>Just now</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PAGE 4: ADMIN PROFILE */}
            {activeNav === 'a-profile' && (
              <div className="subpage-view profile-container" id="a-profile">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                  <div className="profile-header-left">
                    <div className="profile-avatar-lg" style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1)' }}>
                      {adminProfile.name.split(' ').map(n => n[0]).join('') || 'AD'}
                    </div>
                    <div className="profile-header-meta">
                      <h2>{adminProfile.name}</h2>
                      <p>Principal Operations Administrator · ID: <strong>FXV-ADM-001</strong> · National HQ</p>
                      <div className="profile-badges-row">
                        <span className="profile-badge-pill">🛡️ Tier 1 Root Super Admin</span>
                        <span className="profile-badge-pill blue">🔐 Hardware 2FA Active</span>
                        <span className="profile-badge-pill amber">⚡ System Overrides Authorized</span>
                        <span className="profile-badge-pill purple">🌐 8 National Service Hubs</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn b"
                    onClick={() => triggerToast('Admin security configuration updated')}
                  >
                    Save Changes
                  </button>
                </div>

                {/* Profile Section Grid */}
                <div className="profile-section-grid">
                  {/* Card 1: Administrator Credentials */}
                  <div className="profile-card">
                    <h3>👤 Administrator Credentials</h3>
                    <p className="profile-card-desc">Your operational identity and emergency operations contact.</p>
                    <div className="profile-form">
                      <div className="profile-field">
                        <label>Admin Full Name</label>
                        <input
                          type="text"
                          value={adminProfile.name}
                          onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                        />
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Official System Email</label>
                          <input
                            type="email"
                            value={adminProfile.email}
                            onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                          />
                        </div>
                        <div className="profile-field">
                          <label>Emergency Escalation Hotline</label>
                          <input
                            type="text"
                            value={adminProfile.hotline}
                            onChange={(e) => setAdminProfile({ ...adminProfile, hotline: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="profile-field">
                        <label>Operational Command Jurisdiction</label>
                        <input
                          type="text"
                          value={adminProfile.hubJurisdiction}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Security & Authentication */}
                  <div className="profile-card">
                    <h3>🔐 Security & Multi-Factor Authentication</h3>
                    <p className="profile-card-desc">Safeguards protecting platform root access and dispatch overrides.</p>
                    <div>
                      <div className="profile-toggle-row">
                        <div className="profile-toggle-info">
                          <b>Hardware 2-Factor Authentication (2FA)</b>
                          <small>Require TOTP / FIDO2 security key for every administrative action.</small>
                        </div>
                        <label className="profile-switch">
                          <input
                            type="checkbox"
                            checked={adminProfile.twoFactor}
                            onChange={(e) => setAdminProfile({ ...adminProfile, twoFactor: e.target.checked })}
                          />
                          <span className="profile-slider"></span>
                        </label>
                      </div>

                      <div className="profile-field-row" style={{ marginTop: 12 }}>
                        <div className="profile-field">
                          <label>Admin Session Timeout</label>
                          <select
                            value={adminProfile.sessionTimeout}
                            onChange={(e) => setAdminProfile({ ...adminProfile, sessionTimeout: e.target.value })}
                          >
                            <option value="4 Hours">4 Hours</option>
                            <option value="8 Hours">8 Hours</option>
                            <option value="12 Hours">12 Hours (Standard)</option>
                            <option value="24 Hours">24 Hours</option>
                          </select>
                        </div>
                        <div className="profile-field">
                          <label>Auto-Approval Escrow Limit (₹)</label>
                          <input
                            type="text"
                            value={adminProfile.autoThreshold}
                            onChange={(e) => setAdminProfile({ ...adminProfile, autoThreshold: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: RBAC & Audit Trails */}
                  <div className="profile-card">
                    <h3>📜 Role-Based Access & Audit Logging</h3>
                    <p className="profile-card-desc">Permission grants and real-time administrative trace records.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--line)' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Partner KYC Approvals & Rejections</span>
                        <span className="profile-badge-pill">Unrestricted Root</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--line)' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Doorstep OTP Emergency Bypass</span>
                        <span className="profile-badge-pill amber">Supervisor Only</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--line)' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Wallet Sweeps & Bank Ledger Corrections</span>
                        <span className="profile-badge-pill blue">Dual Sign-Off</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Current Session Footprint */}
                  <div className="profile-card">
                    <h3>💻 Active Session Telemetry</h3>
                    <p className="profile-card-desc">Origin details for this administrative sign-in session.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid var(--line)' }}>
                        <small style={{ color: 'var(--mute)', fontWeight: 600 }}>Client IP Address</small>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>103.21.124.5 (Corporate VPN)</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid var(--line)' }}>
                        <small style={{ color: 'var(--mute)', fontWeight: 600 }}>Session Active Duration</small>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--coral2)', marginTop: 4 }}>42 minutes</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', padding: '10px 14px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                      <span style={{ color: '#16a34a', fontSize: '1.2rem' }}>✓</span>
                      <small style={{ color: '#166534' }}>
                        All queries encrypted with TLS 1.3 · Immutable ledger logging active.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="profile-actions-bar">
                  <button
                    type="button"
                    className="btn o"
                    onClick={() => handleNavTabClick('a-metrics')}
                  >
                    Back to Metrics
                  </button>
                  <button
                    type="button"
                    className="btn b"
                    onClick={() => triggerToast('Admin security configuration updated')}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating Bottom Toast */}
      <div id="toast" className={showToast ? 'show' : ''} role="status">
        {toastMsg}
      </div>
    </div>
  );
}
