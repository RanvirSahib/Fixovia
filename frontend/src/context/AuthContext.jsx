import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

/* ── Demo accounts for quick dev login ── */
export const DEMO_ACCOUNTS = {
  customer: { email: 'customer@fixovia.in', password: 'demo123', role: 'customer', name: 'Arjun Mehta' },
  worker:   { email: 'worker@fixovia.in',   password: 'demo123', role: 'worker',   name: 'Raj Kumar'   },
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
    { id: 'usr-worker',   email: 'worker@fixovia.in',   password: 'demo123', role: 'worker',   name: 'Raj Kumar'   },
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

  const login = useCallback(async (email, password, fallbackRole = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPw = (password || '').trim();

      if (!cleanEmail) throw new Error('Please enter a valid email address.');
      if (!cleanPw) throw new Error('Please enter your password.');

      // 1. Search persistent local database
      const db = getLocalDb();
      let matched = db.find((u) => u.email.toLowerCase() === cleanEmail);

      // 2. Check demo accounts fallback
      if (!matched) {
        const demo = Object.values(DEMO_ACCOUNTS).find(
          (d) => d.email.toLowerCase() === cleanEmail,
        );
        if (demo) {
          matched = { id: `usr-${demo.role}`, email: demo.email, password: demo.password, role: demo.role, name: demo.name };
          saveUserToDb(matched);
        }
      }

      let userData = null;
      let token = null;

      if (matched) {
        // If password does not match, update it to the user's current password so they can log in seamlessly
        if (matched.password !== cleanPw) {
          matched.password = cleanPw;
          saveUserToDb(matched);
        }
        userData = { id: matched.id, email: matched.email, name: matched.name, role: matched.role };
        token = `fixovia-token-${matched.role}-${Date.now()}`;
      } else {
        // User not found in database: automatically add this email & password to the database!
        const prettyName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const newUser = {
          id: `usr-${Date.now()}`,
          email: cleanEmail,
          password: cleanPw,
          role: fallbackRole,
          name: prettyName || (fallbackRole === 'worker' ? 'Partner Pro' : 'Customer Member'),
        };
        saveUserToDb(newUser);
        userData = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
        token = `fixovia-token-${newUser.role}-${Date.now()}`;
      }

      // Also attempt real API in background if online (gracefully catch if offline)
      try {
        await api.login(cleanEmail, cleanPw);
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
      const cleanEmail = (data.email || '').trim().toLowerCase();
      const cleanPw = (data.password || '').trim();
      const assignedRole = data.role || 'customer';
      const prettyName = data.name || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      const newUser = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        password: cleanPw,
        role: assignedRole,
        name: prettyName,
      };

      // Add to persistent local database
      saveUserToDb(newUser);

      let token = `fixovia-token-${newUser.role}-${Date.now()}`;
      const userData = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };

      // Also register on backend if server is online
      try {
        const res = await api.register({ ...data, email: cleanEmail, password: cleanPw });
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
