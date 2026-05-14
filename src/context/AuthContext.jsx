import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, isApiConfigured } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const applyUser = (nextUser) => {
      setUser(nextUser);
      setSession(nextUser ? { user: nextUser } : null);
      setProfile(nextUser ? {
        display_name: nextUser.display_name,
        email: nextUser.email,
        role: nextUser.role,
      } : null);
      setRole(nextUser?.role ?? null);
    };

    const run = async () => {
      try {
        const { user } = await apiRequest('/api/auth/me');
        if (!cancelled) {
          applyUser(user ?? null);
        }
      } catch (err) {
        console.warn('[Auth] me:', err?.message ?? err);
        if (!cancelled) applyUser(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithPassword = async ({ email, password }) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
      email: email.trim(),
      password,
      },
    });
    setUser(data.user);
    setSession({ user: data.user });
    setProfile({ display_name: data.user.display_name, email: data.user.email, role: data.user.role });
    setRole(data.user.role);
    return data;
  };

  const signUp = async ({ email, password, displayName }) => {
    const cleanEmail = email.trim();
    const name = displayName.trim();
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { email: cleanEmail, password, displayName: name },
    });
    setUser(data.user);
    setSession({ user: data.user });
    setProfile({ display_name: data.user.display_name, email: data.user.email, role: data.user.role });
    setRole(data.user.role);
    return data;
  };

  const signInWithOtp = async (email) => {
    throw new Error(`Magic link временно отключён после миграции. Войдите через email и пароль: ${email.trim()}`);
  };

  const signOut = async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const hasPersistedAuthHint = false;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        profile,
        loading,
        hasPersistedAuthHint,
        signInWithPassword,
        signUp,
        signInWithOtp,
        signOut,
        isApiConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри AuthProvider');
  }
  return ctx;
}
