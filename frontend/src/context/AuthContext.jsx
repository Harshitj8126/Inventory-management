/* ============================================================
   AuthContext.jsx — Authentication State Management
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================
   Holds user session state across the entire app.
   Uses sessionStorage so auth persists on page refresh
   but clears when the browser tab closes.

   Future: Swap sessionStorage with real JWT token logic
   once Django backend is connected.
   ============================================================ */

import { createContext, useContext, useState, useCallback } from 'react';
import { clearAuthToken } from '../services/authService';

/* ── Create Context ── */
const AuthContext = createContext(null);

/* ── Session Storage Key ── */
const SESSION_KEY = 'codlix_user';

/* ── Format display name helper ── */
export const formatDisplayName = (inputStr = '') => {
  if (!inputStr) return 'User';
  let str = inputStr.includes('@') ? inputStr.split('@')[0] : inputStr;
  str = str.trim();

  // If already formatted with spaces (e.g., "Harshit Jindal"), format words cleanly
  if (str.includes(' ')) {
    return str
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // Strip trailing numbers (e.g. "harshitjindal0203" -> "harshitjindal")
  const strippedDigits = str.replace(/\d+$/, '');

  // Split on dots, underscores, or hyphens (e.g. "harshit.jindal" -> ["harshit", "jindal"])
  let words = strippedDigits.split(/[._-]+/).filter(Boolean);

  // If single word containing harshit & jindal (e.g. "harshitjindal")
  if (words.length === 1) {
    const lower = words[0].toLowerCase();
    if (lower.includes('harshit') && lower.includes('jindal')) {
      words = ['Harshit', 'Jindal'];
    }
  }

  if (words.length === 0) words = [str];

  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

/* ── Read existing session (survives page refresh) ── */
const readSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    let parsed = JSON.parse(raw);
    if (typeof parsed === 'string') {
      parsed = { email: parsed, name: '' };
    }

    if (parsed && parsed.email) {
      try {
        const storedUsers = localStorage.getItem('app_registered_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const matched = users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase());
          if (matched && matched.name) {
            parsed.name = matched.name;
          }
        }
      } catch (e) {
        // fallback
      }
    }

    const rawName = parsed.name || (parsed.email ? parsed.email.split('@')[0] : '');
    parsed.name = formatDisplayName(rawName);

    return parsed;
  } catch {
    return null;
  }
};

/* ══════════════════════════════════════════
   AuthProvider
══════════════════════════════════════════ */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readSession());

  /* login — store user info object { name, email } */
  const login = useCallback((userData) => {
    let userObj = {};
    if (typeof userData === 'string') {
      userObj = { email: userData, name: formatDisplayName(userData) };
    } else if (userData && typeof userData === 'object') {
      const rawName = userData.name || userData.email || 'User';
      userObj = {
        email: userData.email || '',
        name: formatDisplayName(rawName),
      };
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
    setUser(userObj);
  }, []);




  /* logout — clear session and user state */
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    clearAuthToken();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ── useAuth hook — convenience accessor ── */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

export default AuthContext;
