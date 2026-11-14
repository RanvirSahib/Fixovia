import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

/* ── Demo accounts for quick dev login ── */
export const DEMO_ACCOUNTS = {
  customer: { email: 'customer@fixovia.in', password: 'demo123', role: 'customer', name: 'Arjun Mehta' },
  worker:   { email: 'worker@fixovia.in',   password: 'demo123', role: 'worker',   name: 'Raj Kumar', trade: 'Electrician', visitRate: 499 },
  admin:    { email: 'admin@fixovia.in',     password: 'demo123', role: 'admin',    name: 'Admin User'  },
};

/* ── Persistent Local Database for Fixovia Users ── */
const USERS_DB_KEY = 'fixovia_users_db';

export const getLocalDb = () => {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // Initial seed with default demo accounts
  const seed = [
    { id: 'usr-customer', email: 'customer@fixovia.in', password: 'demo123', role: 'customer', name: 'Arjun Mehta' },
    { id: 'usr-worker',   email: 'worker@fixovia.in',   password: 'demo123', role: 'worker',   name: 'Raj Kumar', trade: 'Electrician', visitRate: 499 },
    { id: 'usr-admin',    email: 'admin@fixovia.in',    password: 'demo123', role: 'admin',    name: 'Admin User'  },
  ];
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(seed));
  } catch {}
  return seed;
};

export const saveUserToDb = (user) => {
  try {
    const db = getLocalDb();
    const idx = db.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      db[idx] = { ...db[idx], ...user };
    } else {
      db.push(user);
    }
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save user to db', e);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fixovia_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveSession = useCallback((userData, token) => {
    localStorage.setItem('fixovia_user', JSON.stringify(userData));
    if (token) localStorage.setItem('fixovia_access_token', token);
    setUser(userData);
    setError(null);
  }, []);

  const login = useCallback(async (identifier, otpOrPw = '4827', fallbackRole = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const cleanId = (identifier || '').trim().toLowerCase();
      if (!cleanId) throw new Error('Please enter your mobile number or email.');

      const cleanPhone = cleanId.replace(/\s|-/g, '').replace(/^\+?91/, '');
      const isPhone = /^\d{10}$/.test(cleanPhone);
      const email = isPhone ? `${cleanPhone}@fixovia.in` : cleanId;

      // 1. Search persistent local database
      const db = getLocalDb();
      let matched = db.find((u) => (u.email && u.email.toLowerCase() === email) || (u.phone && u.phone === cleanPhone));

      // 2. Check demo accounts fallback
      if (!matched) {
        const demo = Object.values(DEMO_ACCOUNTS).find(
          (d) => d.email.toLowerCase() === email || (fallbackRole === 'worker' && d.role === 'worker') || (fallbackRole === 'customer' && d.role === 'customer'),
        );
        if (demo && (cleanId.includes(demo.role) || cleanId === demo.email)) {
          matched = { id: `usr-${demo.role}`, email: demo.email, role: demo.role, name: demo.name, phone: '9876543210' };
          saveUserToDb(matched);
        }
      }

      let userData = null;
      let token = null;

      if (matched) {
        userData = {
          id: matched.id,
          email: matched.email,
          name: matched.name,
          role: matched.role,
          phone: matched.phone,
          trade: matched.trade,
          visitRate: matched.visitRate || (matched.role === 'worker' ? 499 : undefined),
          kycStatus: matched.kycStatus || (matched.role === 'worker' ? 'approved' : 'approved'),
          aadharNumber: matched.aadharNumber,
          panNumber: matched.panNumber,
          aadharUploaded: matched.aadharUploaded,
          panUploaded: matched.panUploaded,
        };
        token = `fixovia-token-${matched.role}-${Date.now()}`;
      } else {
        const prettyName = isPhone ? (fallbackRole === 'worker' ? 'Partner Pro' : 'Customer Member') : cleanId.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const newUser = {
          id: `usr-${Date.now()}`,
          email: email,
          phone: isPhone ? cleanPhone : undefined,
          role: fallbackRole,
          trade: fallbackRole === 'worker' ? 'Electrician' : undefined,
          visitRate: fallbackRole === 'worker' ? 499 : undefined,
          name: prettyName || (fallbackRole === 'worker' ? 'Partner Pro' : 'Customer Member'),
          kycStatus: fallbackRole === 'worker' ? 'approved' : 'approved',
        };
        saveUserToDb(newUser);
        userData = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, phone: newUser.phone, trade: newUser.trade, visitRate: newUser.visitRate, kycStatus: newUser.kycStatus };
        token = `fixovia-token-${newUser.role}-${Date.now()}`;
      }

      // Also attempt real API in background if online (gracefully catch if offline)
      try {
        await api.login(email, otpOrPw || '4827');
      } catch {}

      saveSession(userData, token);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const cleanPhone = (data.phone || '').replace(/\s|-/g, '').replace(/^\+?91/, '');
      const cleanEmail = (data.email || (cleanPhone ? `${cleanPhone}@fixovia.in` : '')).trim().toLowerCase();
      const assignedRole = data.role || 'customer';
      const prettyName = data.name || (assignedRole === 'worker' ? 'Partner Pro' : 'Customer Member');
      const defaultKyc = data.kycStatus || (assignedRole === 'worker' ? 'under_verification' : 'approved');

      const newUser = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        phone: cleanPhone,
        trade: data.trade,
        visitRate: data.visitRate ? Number(data.visitRate) : (assignedRole === 'worker' ? 499 : undefined),
        role: assignedRole,
        name: prettyName,
        kycStatus: defaultKyc,
        aadharNumber: data.aadharNumber || '',
        panNumber: data.panNumber || '',
        aadharUploaded: !!data.aadharUploaded,
        panUploaded: !!data.panUploaded,
      };

      // Add to persistent local database
      saveUserToDb(newUser);

      let token = `fixovia-token-${newUser.role}-${Date.now()}`;
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        trade: newUser.trade,
        visitRate: newUser.visitRate,
        kycStatus: newUser.kycStatus,
        aadharNumber: newUser.aadharNumber,
        panNumber: newUser.panNumber,
        aadharUploaded: newUser.aadharUploaded,
        panUploaded: newUser.panUploaded,
      };

      // Also register on backend if server is online
      try {
        const res = await api.register({ ...data, email: cleanEmail, password: 'otp-verified' });
        if (res?.token) token = res.token;
      } catch {}

      saveSession(userData, token);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveSession(updated, localStorage.getItem('fixovia_access_token'));
      saveUserToDb(updated);
      return updated;
    });
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('fixovia_user');
    localStorage.removeItem('fixovia_access_token');
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    updateUser,
    logout,
    isAuthenticated: !!user,
    role: user?.role ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
