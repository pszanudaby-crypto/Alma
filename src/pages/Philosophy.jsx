import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Coffee, Heart, Wind } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp.jsx';
import SEOMeta from '../components/ui/SEOMeta.jsx';
import { PHILOSOPHY_HERO, PHILOSOPHY_INTRO, PHILOSOPHY_SUPPORT_SECTION } from '../constants/content.js';
import { fetchPhilosophySupportRoles } from '../api/mocks.js';

function SupportIcon({ name }) {
  if (name === 'heart') return <Heart className="w-8 h-8 text-[#4A5D4E] mx-auto mb-6" />;
  if (name === 'wind') return <Wind className="w-8 h-8 text-[#4A5D4E] mx-auto mb-6" />;
  return <Coffee className="w-8 h-8 text-[#4A5D4E] mx-auto mb-6" />;
}

export default function Philosophy() {
  const { data: supportRoles } = useQuery({
    queryKey: ['rehabilitation', 'support-roles'],
    queryFn: fetchPhilosophySupportRoles,
  });

  return (
    <div className="page-transition bg-[#F5F4F0] min-h-screen">
      <SEOMeta
        title="Реабилитация"
        description="Комплексная программа восстановления в «Альма»: физическая реабилитация, психологическая поддержка и природная среда на берегу Финского залива."
        path="/rehabilitation"
      />
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={PHILOSOPHY_HERO.imageSrc}
            alt={PHILOSOPHY_HERO.imageAlt}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center scale-[1.03] saturate-[0.96] brightness-[1.03]"
          />
          {/* мягкий холодно-зелёный градиент вместо ровного чёрного — без «кровавых» оттенков */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#2b3531]/55 via-[#3d4740]/42 to-[#2d332f]/58"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#4A5D4E]/12 mix-blend-soft-light" aria-hidden />
        </div>
        <div className="relative z-10 text-center mt-20 px-6">
          <FadeUp>
            <h1 className="text-5xl md:text-6xl font-serif text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
              {PHILOSOPHY_HERO.title}
            </h1>
            <p className="mt-4 md:mt-5 max-w-2xl mx-auto text-base md:text-lg font-light tracking-[0.02em] leading-relaxed text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65),0_8px_32px_rgba(0,0,0,0.35)]">
              {PHILOSOPHY_HERO.subtitle}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2D332F] mb-8 leading-tight">
              {PHILOSOPHY_INTRO.titleStart}
              <br />
              {PHILOSOPHY_INTRO.titleBreak}
              <span className="text-[#4A5D4E] italic">{PHILOSOPHY_INTRO.titleAccent}</span>
            </h2>
            <div className="w-20 h-[1px] bg-[#4A5D4E] mb-8"></div>
            <p className="font-serif text-xl italic text-[#4A5D4E] leading-relaxed pl-6 border-l-2 border-[#4A5D4E]/30 mb-8">
              {PHILOSOPHY_INTRO.quote}
            </p>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="space-y-6 text-lg text-[#5A635D] font-light leading-relaxed">
              {PHILOSOPHY_INTRO.paragraphs.map((p) => (
                <p key={p.key}>
                  {p.lead && <strong>{p.lead}</strong>}
                  {p.text}
                </p>
              ))}
            </div>
          </FadeUp>
        </div>

        <div className="border-t border-[#E5E3DB] pt-24">
          <FadeUp>
            <h3 className="text-3xl font-serif text-[#2D332F] mb-12 text-center">{PHILOSOPHY_SUPPORT_SECTION.title}</h3>
          </FadeUp>
          {supportRoles && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportRoles.map((card, idx) => (
                <FadeUp key={card.title} delay={(idx + 1) * 100}>
                  <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#E5E3DB] h-full text-center">
                    <SupportIcon name={card.icon} />
                    <h4 className="font-serif text-xl mb-4 text-[#2D332F]">{card.title}</h4>
                    <p className="text-[#5A635D] text-sm font-light leading-relaxed">{card.description}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
