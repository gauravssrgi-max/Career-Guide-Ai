'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import api from '../lib/api';

const AuthContext = createContext({});

const isGenericName = (name) => {
  const normalized = (name || '').trim().toLowerCase();
  return !normalized || normalized === 'user' || normalized === 'original user';
};

const sessionIdentity = (sessionUser) => ({
  _id: sessionUser?.id,
  name: sessionUser?.name || sessionUser?.email?.split('@')[0] || 'Original User',
  email: sessionUser?.email || '',
  avatar: sessionUser?.image || '',
});

const mergeSessionUser = (backendUser, sessionUser) => {
  if (!sessionUser) return backendUser;
  const accountUser = sessionIdentity(sessionUser);
  return {
    ...(backendUser || {}),
    name: isGenericName(backendUser?.name) ? accountUser.name : backendUser.name,
    email: backendUser?.email || accountUser.email,
    avatar: backendUser?.avatar || accountUser.avatar,
  };
};

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const syncSocialSession = async () => {
      const accountUser = sessionIdentity(session.user);
      const res = await api.googleAuth({
        googleId: accountUser._id,
        email: accountUser.email,
        name: accountUser.name,
        avatar: accountUser.avatar,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('authEmail', accountUser.email);
      localStorage.setItem('authAccountId', accountUser._id || accountUser.email);
      return mergeSessionUser(res.data.user, session.user);
    };

    const loadAuth = async () => {
      if (status === 'loading') return;

      try {
        const token = localStorage.getItem('token');
        const tokenEmail = localStorage.getItem('authEmail');
        const tokenAccountId = localStorage.getItem('authAccountId');

        if (status === 'authenticated' && session?.user) {
          const currentEmail = session.user.email || '';
          const currentAccountId = session.user.id || currentEmail;
          const shouldResync = !token
            || tokenAccountId !== currentAccountId
            || (currentEmail && tokenEmail !== currentEmail);

          if (shouldResync) {
            const syncedUser = await syncSocialSession();
            if (!cancelled) setUser(syncedUser);
            return;
          }

          try {
            const res = await api.getProfile();
            if (!cancelled) setUser(mergeSessionUser(res.data, session.user));
          } catch {
            const syncedUser = await syncSocialSession();
            if (!cancelled) setUser(syncedUser);
          }
          return;
        }

        if (token) {
          const res = await api.getProfile();
          localStorage.setItem('authEmail', res.data.email || '');
          localStorage.removeItem('authAccountId');
          if (!cancelled) setUser(res.data);
          return;
        }

        localStorage.removeItem('authEmail');
        localStorage.removeItem('authAccountId');
        if (!cancelled) setUser(null);
      } catch (err) {
        console.error('Auth load failed', err);
        localStorage.removeItem('token');
        localStorage.removeItem('authEmail');
        localStorage.removeItem('authAccountId');
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAuth();

    return () => {
      cancelled = true;
    };
  }, [status, session]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('authEmail', res.data.user.email || email);
    localStorage.removeItem('authAccountId');
    setUser(res.data.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('authEmail', res.data.user.email || email);
    localStorage.removeItem('authAccountId');
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authAccountId');
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
