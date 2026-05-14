import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';

/**
 * Модалка входа для комментирования.
 * Пропсы:
 *   isOpen      — управляет видимостью
 *   onClose     — закрыть модалку
 *   onSubmit    — async ({ email, password }) => void
 */
export default function JoinModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    try {
      await onSubmit({ email, password });
      setMessage('Вход выполнен. Можно оставлять комментарии.');
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setMessage(err.message ?? 'Не удалось войти');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2D332F]/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
    >
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-[#F5F4F0]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/80 border border-[#E5E3DB] text-[#2D332F] transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <h2 id="join-modal-title" className="text-2xl font-serif text-[#2D332F] mb-2">
            Вход в комьюнити
          </h2>
          <p className="text-sm text-[#5A635D] mb-6 font-light leading-relaxed">
            Войдите через email и пароль, чтобы оставлять комментарии.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp-email" className="block text-xs uppercase tracking-wider text-[#5A635D] mb-2">
                Email
              </label>
              <input
                id="otp-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white border border-[#E5E3DB] px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/40 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]"
              />
            </div>

            <div>
              <label htmlFor="otp-password" className="block text-xs uppercase tracking-wider text-[#5A635D] mb-2">
                Пароль
              </label>
              <input
                id="otp-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl bg-white border border-[#E5E3DB] px-4 py-3 text-sm text-[#2D332F] placeholder:text-[#5A635D]/40 focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]"
              />
            </div>

            {message && (
              <p className="text-sm rounded-xl px-4 py-3 bg-[#4A5D4E]/10 border border-[#4A5D4E]/25 text-[#2D332F]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 rounded-full bg-[#2D332F] text-[#F5F4F0] font-bold text-sm uppercase tracking-widest hover:bg-[#4A5D4E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
