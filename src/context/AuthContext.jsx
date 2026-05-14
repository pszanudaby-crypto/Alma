import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, readPersistedAuthHint } from '../api/supabase.js';

const AuthContext = createContext(null);

/** Мгновенный fallback из session.user, пока строка в profiles не подтянулась */
function deriveSessionProfile(user) {
  if (!user) {
    return null;
  }
  const email = user.email ?? null;
  const displayName =
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    (email && email.includes('@') ? email.split('@')[0] : email);
  return {
    display_name: displayName || null,
    email,
    role: 'user',
  };
}

async function fetchProfileFromDb(user) {
  if (!supabase || !user?.id) {
    return null;
  }
  try {
    const res = await supabase
      .from('profiles')
      .select('display_name, role, email')
      .eq('id', user.id)
      .maybeSingle();

    if (res.error) {
      console.warn('[Auth] profiles:', res.error.message);
      return null;
    }
    if (!res.data) {
      return null;
    }
    const r = res.data.role ?? 'user';
    return {
      profile: {
        display_name: res.data.display_name,
        email: res.data.email,
        role: r,
      },
      role: r,
    };
  } catch (err) {
    console.warn('[Auth] fetchProfileFromDb:', err?.message ?? err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      setUser(null);
      setRole(null);
      setProfile(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const applySession = async (event, sessionArg) => {
      if (cancelled) {
        return;
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
        return;
      }

      let session = sessionArg ?? null;
      if (!session?.user) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[Auth] getSession (sync):', error.message);
        }
        session = data.session ?? null;
      }

      if (cancelled) {
        return;
      }

      setSession(session);
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setRole(null);
        return;
      }

      const derived = deriveSessionProfile(nextUser);
      setProfile(derived);
      setRole(derived.role);

      const fromDb = await fetchProfileFromDb(nextUser);
      if (!cancelled && fromDb) {
        setProfile(fromDb.profile);
        setRole(fromDb.role);
      }
    };

    const run = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth] getSession:', error.message);
        }
        if (!cancelled) {
          await applySession('INITIAL_SESSION', session ?? null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) {
        return;
      }
      void applySession(event, session ?? null).catch((err) => {
        console.error('[Auth] applySession:', err);
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async ({ email, password }) => {
    if (!supabase) {
      throw new Error(
        'Supabase не подключён. Укажите VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в файле .env.',
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  };

  const signUp = async ({ email, password, displayName }) => {
    if (!supabase) {
      throw new Error(
        'Supabase не подключён. Укажите VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в файле .env.',
      );
    }
    const cleanEmail = email.trim();
    const name = displayName.trim();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });
    if (error) {
      throw error;
    }
    return data;
  };

  const signInWithOtp = async (email) => {
    if (!supabase) {
      throw new Error(
        'Supabase не подключён. Укажите VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в файле .env.',
      );
    }
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/construction-diary`,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const hasPersistedAuthHint = isSupabaseConfigured && readPersistedAuthHint();

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
        isSupabaseConfigured,
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
