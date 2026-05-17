import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../api/client';

type AuthContextValue = {
  token?: string;
  user?: { id: string; email: string; name: string };
  login: (email: string, password: string, mode: 'login' | 'register', name?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(() => localStorage.getItem('outreachhq_token') ?? undefined);
  const [user, setUser] = useState<AuthContextValue['user']>(() => {
    const raw = localStorage.getItem('outreachhq_user');
    return raw ? JSON.parse(raw) : undefined;
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login: AuthContextValue['login'] = async (email, password, mode, name) => {
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const response = await api.post(endpoint, { email, password, name });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('outreachhq_token', response.data.token);
    localStorage.setItem('outreachhq_user', JSON.stringify(response.data.user));
    setAuthToken(response.data.token);
  };

  const logout = () => {
    setToken(undefined);
    setUser(undefined);
    localStorage.removeItem('outreachhq_token');
    localStorage.removeItem('outreachhq_user');
    setAuthToken(undefined);
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

