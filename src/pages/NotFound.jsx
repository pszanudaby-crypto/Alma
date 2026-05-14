import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { ROUTES } from '../constants/navigation.js';
import SEOMeta from '../components/ui/SEOMeta.jsx';

/**
 * Страница 404 — отображается при переходе на несуществующий маршрут.
 * Визуально вписана в общую гамму сайта: кремовый фон, зелёный акцент.
 */
export default function NotFound() {
  return (
    <>
      <SEOMeta
        title="Страница не найдена"
        description="Запрошенная страница не существует. Вернитесь на главную."
        path="/404"
        noindex
      />

      <div className="min-h-screen bg-[#F5F4F0] flex flex-col items-center justify-center px-6 text-center">
        {/* Декоративный фон */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234A5D4E' fill-opacity='1'%3E%3Cpath d='M40 40c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm-40 0c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-lg w-full">
          {/* Иконка */}
          <div className="w-16 h-16 rounded-full bg-[#EBE9E1] border border-[#E5E3DB] flex items-center justify-center mx-auto mb-10">
            <Leaf className="w-7 h-7 text-[#4A5D4E]" strokeWidth={1.5} />
          </div>

          {/* Номер */}
          <p
            className="font-serif text-[clamp(6rem,20vw,10rem)] leading-none text-[#2D332F]/[0.06] select-none mb-2"
            aria-hidden
          >
            404
          </p>

          {/* Заголовок */}
          <h1 className="font-serif text-3xl md:text-4xl text-[#2D332F] mb-4 -mt-4">
            Страница не найдена
          </h1>

          {/* Описание */}
          <p className="text-[#5A635D] font-light leading-relaxed mb-10 max-w-sm mx-auto">
            Этой страницы не существует или она была перемещена.
            Попробуйте вернуться на главную — там всё на месте.
          </p>

          {/* Разделитель */}
          <div className="w-12 h-px bg-[#4A5D4E]/30 mx-auto mb-10" aria-hidden />

          {/* CTA */}
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#2D332F] text-[#F5F4F0] text-sm font-semibold tracking-wide hover:bg-[#4A5D4E] transition-colors shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>

          {/* Вторичные ссылки */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#5A635D]">
            <Link to={ROUTES.philosophy}      className="hover:text-[#2D332F] transition-colors">Философия</Link>
            <span className="w-1 h-1 rounded-full bg-[#8F9779]" aria-hidden />
            <Link to={ROUTES.territory}       className="hover:text-[#2D332F] transition-colors">Территория</Link>
            <span className="w-1 h-1 rounded-full bg-[#8F9779]" aria-hidden />
            <Link to={ROUTES.support}         className="hover:text-[#2D332F] transition-colors">Инвесторам</Link>
            <span className="w-1 h-1 rounded-full bg-[#8F9779]" aria-hidden />
            <Link to={ROUTES.constructionDiary} className="hover:text-[#2D332F] transition-colors">Дневник</Link>
          </div>
        </div>
      </div>
    </>
  );
}
