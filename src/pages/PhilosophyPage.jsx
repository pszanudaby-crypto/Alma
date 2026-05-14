import React from 'react';
import FadeUp from '../components/ui/FadeUp.jsx';
import SEOMeta from '../components/ui/SEOMeta.jsx';
import { PHILOSOPHY_PAGE } from '../constants/content.js';

export default function PhilosophyPage() {
  const { hero, introLead, introBody, closingNote, primarySegments, secondarySegments } = PHILOSOPHY_PAGE;

  return (
    <div className="page-transition bg-[#F5F4F0] min-h-screen">
      <SEOMeta
        title="Философия"
        description="Для кого создана «Альма»: семьи, пары, те, кто восстанавливается после болезни, и те, кто просто хочет выдохнуть среди природы."
        path="/philosophy"
      />
      <section className="relative h-[48vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.imageSrc}
            alt={hero.imageAlt}
            className="w-full h-full object-cover object-center lg:object-bottom scale-[1.02] saturate-[0.94] brightness-[1.02]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#2b3531]/50 via-[#3d4740]/38 to-[#2d332f]/52"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#4A5D4E]/10 mix-blend-soft-light" aria-hidden />
        </div>
        <div className="relative z-10 text-center mt-16 px-6">
          <FadeUp>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.35)] tracking-tight">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg font-light text-white leading-relaxed tracking-[0.02em] [text-shadow:0_1px_4px_rgba(0,0,0,0.55),0_10px_36px_rgba(0,0,0,0.28)]">
              {hero.subtitle}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="relative px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#8F9779]/55 to-transparent hidden md:block" aria-hidden />

        <FadeUp>
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
            <p className="font-serif text-xl md:text-2xl text-[#2D332F] leading-relaxed mb-6">{introLead}</p>
            <p className="text-[#5A635D] text-base md:text-lg font-light leading-relaxed">{introBody}</p>
          </div>
        </FadeUp>

        <FadeUp delay={80}>
          <div className="mb-4 md:mb-8">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-[#8F9779] font-semibold">
              Круг заботы
            </span>
            <div className="mt-5 h-px w-20 bg-gradient-to-r from-[#4A5D4E] to-transparent rounded-full" aria-hidden />
          </div>
        </FadeUp>

        <div className="grid gap-5 md:gap-6 md:grid-cols-2 mb-20 md:mb-28">
          {primarySegments.map((item, idx) => (
            <FadeUp key={item.key} delay={idx * 40}>
              <article className="group h-full rounded-[1.35rem] border border-[#E5E3DB]/95 bg-white/75 backdrop-blur-sm px-7 py-7 md:px-8 md:py-8 shadow-[0_4px_36px_-20px_rgba(45,51,47,0.18)] hover:border-[#8F9779]/35 hover:shadow-[0_12px_48px_-28px_rgba(45,51,47,0.22)] transition-all duration-500">
                <div className="flex gap-4">
                  <span
                    className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-[#8F9779] ring-4 ring-[#8F9779]/15"
                    aria-hidden
                  />
                  <div>
                    <h3 className="font-serif text-lg md:text-xl text-[#2D332F] mb-2 leading-snug">{item.title}</h3>
                    <p className="text-[#5A635D] text-sm md:text-[15px] font-light leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={60}>
          <div className="mb-4 md:mb-8">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-[#8F9779]/90 font-semibold">
              Шире охват
            </span>
            <div className="mt-5 h-px w-20 bg-gradient-to-r from-[#8F9779]/70 to-transparent rounded-full" aria-hidden />
          </div>
        </FadeUp>

        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-20 md:mb-24">
          {secondarySegments.map((item, idx) => (
            <FadeUp key={item.key} delay={idx * 45}>
              <article className="h-full rounded-2xl border border-[#E5E3DB] bg-[#FAFAF8]/90 px-6 py-6 hover:bg-white hover:border-[#E5E3DB] transition-colors duration-300">
                <div className="flex gap-3">
                  <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-[#4A5D4E]/40" aria-hidden />
                  <div>
                    <h3 className="font-semibold text-[#2D332F] text-[15px] md:text-base mb-1.5 leading-snug">{item.title}</h3>
                    <p className="text-[#5A635D] text-sm font-light leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={100}>
          <div className="max-w-3xl mx-auto rounded-[2rem] border border-[#E5E3DB] bg-gradient-to-br from-white via-[#FAFAF8] to-[#F0EFE9]/80 px-8 py-10 md:px-12 md:py-12 text-center shadow-[0_8px_44px_-28px_rgba(45,51,47,0.15)]">
            <p className="font-serif text-lg md:text-xl text-[#2D332F] leading-relaxed font-light">{closingNote}</p>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
