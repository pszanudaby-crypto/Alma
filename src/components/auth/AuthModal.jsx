import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { supabase } from '../../api/supabase.js';
import { useAuth } from '../../context/AuthContext.jsx';

function GoogleMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function translateAuthError(message) {
  if (!message) return 'Что-то пошло не так. Попробуйте снова.';
  const m = message.toLowerCase();
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Этот email уже зарегистрирован. Войдите или восстановите доступ.';
  if (m.includes('already exists'))
    return 'Учётная запись с таким email уже существует.';
  if (m.includes('password') && (m.includes('at least') || m.includes('6')))
    return 'Пароль слишком короткий. Используйте не менее 6 символов.';
  if (m.includes('invalid login') || m.includes('invalid credentials'))
    return 'Неверный email или пароль.';
  if (m.includes('email not confirmed'))
    return 'Подтвердите email по ссылке из письма, затем войдите.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Нет соединения с сервером. Проверьте интернет.';
  if (m.includes('oauth') || m.includes('provider'))
    return 'Не удалось войти через Google. Попробуйте снова или используйте email.';
  return message;
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { signInWithPassword, signUp, isSupabaseConfigured, session } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [infoBanner, setInfoBanner] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setFieldErrors({});
      setFormError(null);
      setInfoBanner(null);
      setBusy(false);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && session) onClose();
  }, [isOpen, session, onClose]);

  const handleGoogleLogin = async () => {
    setFormError(null);
    if (!isSupabaseConfigured || !supabase) {
      setFormError('Supabase не настроен. Проверьте файл .env.');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      setFormError(translateAuthError(err.message));
    } finally {
      setBusy(false);
    }
  };

  const validate = (mode) => {
    const errs = {};
    if (!email.trim()) errs.email = 'Укажите email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Введите корректный email.';
    if (!password) errs.password = 'Введите пароль.';
    else if (password.length < 6) errs.password = 'Минимум 6 символов.';
    if (mode === 'register' && !displayName.trim()) errs.displayName = 'Как к вам обращаться?';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const errs = validate(tab === 'login' ? 'login' : 'register');
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!isSupabaseConfigured) {
      setFormError('Supabase не настроен. Проверьте файл .env.');
      return;
    }
    setBusy(true);
    try {
      if (tab === 'login') {
        await signInWithPassword({ email: email.trim(), password });
        onClose();
      } else {
        await signUp({ email: email.trim(), password, displayName: displayName.trim() });
        setFormError(null);
        setFieldErrors({});
        setTab('login');
        setPassword('');
        setInfoBanner('Регистрация прошла успешно. Если включено подтверждение email — проверьте почту и войдите.');
      }
    } catch (err) {
      const msg = translateAuthError(err.message);
      if (msg.toLowerCase().includes('парол') || msg.toLowerCase().includes('password'))
        setFieldErrors((prev) => ({ ...prev, password: msg }));
      else if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('зарегистрирован') || msg.toLowerCase().includes('exists'))
        setFieldErrors((prev) => ({ ...prev, email: msg }));
      else
        setFormError(msg);
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex min-h-0 items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 z-0 bg-[#2D332F]/45 backdrop-blur-md"
            aria-label="Закрыть окно"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="auth-modal-title"
            className="relative z-10 my-auto w-full max-w-md rounded-[2rem] border border-[#E5E3DB]/90 bg-[#F5F4F0]/95 backdrop-blur-2xl shadow-[0_24px_80px_-20px_rgba(45,51,47,0.35)]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button" onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white border border-[#E5E3DB] text-[#2D332F] transition-colors shadow-sm"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[min(90vh,760px)] overflow-y-auto p-8 md:p-10 pt-12 md:pt-14">
              <h2 id="auth-modal-title" className="text-2xl md:text-3xl font-serif text-[#2D332F] mb-2">Альма</h2>
              <p className="text-sm text-[#5A635D] mb-6 font-light">
                Войдите или создайте аккаунт для комьюнити и дневника стройки.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <button
                  type="button" onClick={handleGoogleLogin} disabled={busy}
                  className="relative flex w-full min-h-[52px] shrink-0 items-center justify-center rounded-full border border-[#D8D6CF] bg-white px-5 py-3.5 text-sm font-semibold text-[#2D332F] tracking-wide shadow-[0_1px_3px_rgba(45,51,47,0.08)] transition-all duration-300 hover:border-[#4A5D4E]/40 hover:shadow-[0_10px_28px_-10px_rgba(45,51,47,0.18)] disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute left-5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center" aria-hidden>
                    <GoogleMark className="h-5 w-5" />
                  </span>
                  <span className="px-12 text-center">Войти через Google</span>
                </button>

                <div className="relative py-1" aria-hidden>
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E5E3DB]" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#F5F4F0] px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F9779]">или email</span>
                  </div>
                </div>

                <div className="flex p-1 rounded-full bg-[#EBE9E1]/80 border border-[#E5E3DB]">
                  {['login', 'register'].map((t) => (
                    <button
                      key={t} type="button"
                      onClick={() => { setTab(t); setFormError(null); setInfoBanner(null); setFieldErrors({}); }}
                      className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        tab === t ? 'bg-[#2D332F] text-[#F5F4F0] shadow-md' : 'text-[#5A635D] hover:text-[#2D332F]'
                      }`}
                    >
                      {t === 'login' ? 'Вход' : 'Регистрация'}
                    </button>
                  ))}
                </div>

                {tab === 'register' && (
                  <div>
                    <label htmlFor="auth-name" className="block text-xs uppercase tracking-wider text-[#5A635D] mb-2 font-semibold">Имя</label>
                    <input
                      id="auth-name" type="text" autoComplete="name" value={displayName}
                      onChange={(e) => { setDisplayName(e.target.value); setFieldErrors((p) => ({ ...p, displayName: undefined })); }}
                      className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/40 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/50 ${fieldErrors.displayName ? 'border-red-400/80' : 'border-[#E5E3DB]'}`}
                      placeholder="Ваше имя"
                    />
                    {fieldErrors.displayName && <p className="mt-2 text-sm text-red-700 font-medium">{fieldErrors.displayName}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="auth-email" className="block text-xs uppercase tracking-wider text-[#5A635D] mb-2 font-semibold">Email</label>
                  <input
                    id="auth-email" type="email" required autoComplete="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                    className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/40 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/50 ${fieldErrors.email ? 'border-red-400/80' : 'border-[#E5E3DB]'}`}
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && <p className="mt-2 text-sm text-red-700 font-medium">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="auth-password" className="block text-xs uppercase tracking-wider text-[#5A635D] mb-2 font-semibold">Пароль</label>
                  <input
                    id="auth-password" type="password"
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                    className={`w-full rounded-xl bg-white border px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/40 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/50 ${fieldErrors.password ? 'border-red-400/80' : 'border-[#E5E3DB]'}`}
                    placeholder="••••••••"
                  />
                  {fieldErrors.password && <p className="mt-2 text-sm text-red-700 font-medium">{fieldErrors.password}</p>}
                </div>

                {infoBanner && (
                  <div className="rounded-xl border border-[#4A5D4E]/25 bg-[#4A5D4E]/10 px-4 py-3 text-sm text-[#2D332F] leading-relaxed font-medium">{infoBanner}</div>
                )}
                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 leading-relaxed">{formError}</div>
                )}

                <button
                  type="submit" disabled={busy}
                  className="w-full py-4 rounded-full bg-[#2D332F] text-[#F5F4F0] font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#4A5D4E] transition-colors disabled:opacity-55 flex items-center justify-center gap-2 shadow-lg"
                >
                  {busy && <Loader2 className="w-5 h-5 animate-spin" />}
                  {tab === 'login' ? 'Войти' : 'Создать аккаунт'}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
