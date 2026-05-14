import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  : null;

/** true, если в localStorage есть сохранённая сессия Supabase (первый запрос ещё может идти) */
export function readPersistedAuthHint() {
  if (typeof window === 'undefined' || !isSupabaseConfigured) {
    return false;
  }
  try {
    const host = new URL(supabaseUrl).hostname;
    const projectRef = host.split('.')[0];
    if (!projectRef) {
      return false;
    }
    const raw = window.localStorage.getItem(`sb-${projectRef}-auth-token`);
    return Boolean(raw && raw.length > 2);
  } catch {
    return false;
  }
}
