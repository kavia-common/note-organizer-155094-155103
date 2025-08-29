import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../utils';

/**
 * AuthContext provides a simple session across the app.
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Auth provider that persists mock session in localStorage. */
  const [session, setSession] = useState(() => authApi.getSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keep in sync with storage changes (multi-tab)
  useEffect(() => {
    const handler = () => setSession(authApi.getSession());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    loading,
    error,
    // PUBLIC_INTERFACE
    async login(email, password) {
      try {
        setLoading(true); setError('');
        const s = await authApi.login(email, password);
        setSession(s);
        return s;
      } catch (e) {
        setError(e.message || 'Login failed'); throw e;
      } finally { setLoading(false); }
    },
    // PUBLIC_INTERFACE
    async register(email, password) {
      try {
        setLoading(true); setError('');
        const s = await authApi.register(email, password);
        setSession(s);
        return s;
      } catch (e) {
        setError(e.message || 'Registration failed'); throw e;
      } finally { setLoading(false); }
    },
    // PUBLIC_INTERFACE
    async logout() {
      await authApi.logout();
      setSession(null);
    }
  }), [session, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
