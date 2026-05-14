import React, { useEffect } from 'react';
import { X, Mail, Phone, User, Leaf } from 'lucide-react';
import { CONTACT_INFO } from '../../constants/content.js';

/**
 * Модальное окно контактов.
 * Принимает: isOpen (bool), onClose (fn).
 * Используется из Header и со страницы инвесторов.
 */
export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Контакты"
    >
      {/* Overlay — за карточкой */}
      <div
        className="fixed inset-0 bg-[#1A1E1B]/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Враппер центрирования */}
      <div className="flex min-h-full items-center justify-center p-4 py-20">

      {/* Карточка */}
      <div className="relative z-10 w-full max-w-md bg-[#F5F4F0] rounded-3xl shadow-2xl overflow-hidden">
        {/* Шапка */}
        <div className="bg-[#2D332F] px-8 pt-8 pb-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-full bg-[#4A5D4E] flex items-center justify-center mb-5">
            <Leaf className="w-6 h-6 text-[#F5F4F0]" strokeWidth={1.5} />
          </div>
          <p className="text-[#8F9779] text-xs uppercase tracking-[0.2em] font-semibold mb-1">
            Связаться с нами
          </p>
          <h2 className="text-white font-serif text-2xl leading-snug">
            Проект «Альма»
          </h2>
        </div>

        {/* Тело */}
        <div className="px-8 py-8 space-y-5">
          {/* Имя */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBE9E1] flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4 text-[#4A5D4E]" />
            </div>
            <div>
              <p className="text-[#8F9779] text-xs uppercase tracking-[0.15em] font-semibold mb-0.5">
                {CONTACT_INFO.role}
              </p>
              <p className="text-[#2D332F] font-semibold text-base">
                {CONTACT_INFO.name}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#E5E3DB]" aria-hidden />

          {/* Телефон */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBE9E1] flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4 text-[#4A5D4E]" />
            </div>
            <div>
              <p className="text-[#8F9779] text-xs uppercase tracking-[0.15em] font-semibold mb-0.5">
                Телефон
              </p>
              <a
                href={CONTACT_INFO.phoneHref}
                className="text-[#2D332F] font-semibold text-base hover:text-[#4A5D4E] transition-colors"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          <div className="w-full h-px bg-[#E5E3DB]" aria-hidden />

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBE9E1] flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-[#4A5D4E]" />
            </div>
            <div>
              <p className="text-[#8F9779] text-xs uppercase tracking-[0.15em] font-semibold mb-0.5">
                Электронная почта
              </p>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-[#2D332F] font-semibold text-base hover:text-[#4A5D4E] transition-colors break-all"
              >
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </div>

        {/* CTA-кнопки */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <a
            href={CONTACT_INFO.phoneHref}
            className="w-full py-4 rounded-2xl bg-[#2D332F] text-[#F5F4F0] text-sm font-bold tracking-wider text-center hover:bg-[#4A5D4E] transition-colors"
          >
            Позвонить
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="w-full py-4 rounded-2xl border border-[#2D332F]/25 text-[#2D332F] text-sm font-bold tracking-wider text-center hover:bg-[#2D332F]/5 transition-colors"
          >
            Написать письмо
          </a>
        </div>
      </div>
      </div>{/* /враппер центрирования */}
    </div>
  );
}
