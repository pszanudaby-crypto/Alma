import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, titleId, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 px-4 pb-6 pt-16 backdrop-blur-sm sm:items-center sm:p-6 sm:pb-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[min(88vh,820px)] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] bg-[#F5F4F0] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-[#2D332F]/10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#2D332F]/08 text-[#2D332F] transition-colors hover:bg-[#2D332F]/12"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-8 pb-10 pt-14 md:p-11 md:pb-12 md:pt-12">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
