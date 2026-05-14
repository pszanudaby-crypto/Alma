import React, { useState } from 'react';
import SmoothScroll from '../../components/ui/SmoothScroll.jsx';
import SEOMeta from '../../components/ui/SEOMeta.jsx';
import ContactModal from '../../components/ui/ContactModal.jsx';
import HeroSection from './components/HeroSection.jsx';
import Marquee from './components/Marquee.jsx';
import ConceptSection from './components/ConceptSection.jsx';
import StatsSection from './components/StatsSection.jsx';
import MemorandumSection from './components/MemorandumSection.jsx';
import FooterStrip from './components/FooterStrip.jsx';
import { G, MARQUEE_ITEMS } from './constants.js';

/**
 * Страница «Инвесторам» (/support).
 *
 * Структура:
 *   HeroSection       → параллакс-заголовок на весь экран
 *   Marquee           → бегущая строка с тезисами
 *   ConceptSection    → пословный reveal манифеста
 *   StatsSection      → три ключевые метрики
 *   MemorandumSection → тёмная CTA-карточка с меморандумом
 *   FooterStrip       → контакты, локация, статус раунда
 *
 * Каждая секция — отдельный компонент в ./components/.
 * Тексты и данные — в ./constants.js.
 */
export default function InvestorsPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <SEOMeta
        title="Инвесторам"
        description="Инвестиционный меморандум wellness-проекта «Альма» на берегу Финского залива. Загородная недвижимость, барнхаусы, устойчивая бизнес-модель."
        path="/support"
      />
      <SmoothScroll />

      {/* @keyframes используются в MeshBackground, Marquee и HeroSection */}
      <style>{`
        @keyframes float-slow-1 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(8vw, 6vh); }
        }
        @keyframes float-slow-2 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(-7vw, 5vh); }
        }
        @keyframes float-slow-3 {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(5vw, -7vh); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes scroll-pulse {
          0%, 100% { transform: translateY(0); opacity: 0.55; }
          50%       { transform: translateY(8px); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          background: G.paper,
          color: G.ink,
          fontFamily: 'Inter, system-ui, sans-serif',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <HeroSection />
        <Marquee items={MARQUEE_ITEMS} />
        <ConceptSection />
        <StatsSection />
        <MemorandumSection onContact={() => setContactOpen(true)} />
        <FooterStrip onContact={() => setContactOpen(true)} />
      </div>
    </>
  );
}
