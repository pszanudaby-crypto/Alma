import React from 'react';

/** Лёгкий индикатор при lazy-импорте страницы — не тянет framer-motion. */
export default function RoutePageFallback() {
  return (
    <div
      className="flex min-h-[55vh] w-full flex-col items-center justify-center gap-4 bg-[#F5F4F0] px-6"
      aria-busy="true"
      aria-label="Загрузка страницы"
    >
      <div className="h-px w-16 bg-[#4A5D4E]/25" />
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E3DB] border-t-[#4A5D4E]" />
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[#8F9779]">
        Загрузка…
      </p>
    </div>
  );
}
