'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import api from '../lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If NextAuth session is active but we don't have local token, sync it with our backend
    if (status === 'authenticated' && session?.user && !localStorage.getItem('token')) {
      api.googleAuth({
        googleId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.image
      }).then(res => {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setLoading(false);
      }).catch(err => {
        console.error('Failed to sync Google Auth with backend', err);
        setLoading(false);
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(res => { setUser(res.data); setLoading(false); })
        .catch(() => { localStorage.removeItem('token'); setLoading(false); });
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (status === 'authenticated') {
      signOut({ callbackUrl: '/login' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
