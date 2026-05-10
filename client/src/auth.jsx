import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [vulnerableMode, setVulnerableMode] = useState(undefined);

  const refresh = useCallback(async () => {
    try {
      const h = await api.health();
      setVulnerableMode(!!h.vulnerableMode);
    } catch {
      setVulnerableMode(false);
    }
    try {
      const d = await api.me();
      setUser(d.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (creds) => {
      await api.login(creds);
      await refresh();
    },
    [refresh],
  );

  const register = useCallback(
    async (creds) => {
      await api.register(creds);
      await api.login(creds);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      vulnerableMode,
      refresh,
      login,
      register,
      logout,
      loading: user === undefined,
    }),
    [user, vulnerableMode, refresh, login, register, logout],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) {
    throw new Error('useAuth outside AuthProvider');
  }
  return v;
}
