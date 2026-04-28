import { createContext, useEffect, useMemo, useState } from 'react';
import { loginAdmin } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('adminToken', token);
    else localStorage.removeItem('adminToken');
  }, [token]);

  const value = useMemo(() => ({
    token,
    admin,
    isAuthenticated: Boolean(token),
    login: async (credentials) => {
      const data = await loginAdmin(credentials);
      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
    },
    logout: () => {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem('adminUser');
    }
  }), [token, admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
