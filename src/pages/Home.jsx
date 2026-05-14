import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trees } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp.jsx';
import SEOMeta from '../components/ui/SEOMeta.jsx';
import { ROUTES } from '../constants/navigation.js';
import {
  HOME_AUDIENCE_SECTION,
  HOME_HERO,
  HOME_HERO_IMAGE,
  HOME_TEASER,
} from '../constants/content.js';
import { fetchHomeAudience } from '../api/mocks.js';

export default function Home() {
  const { data: audienceItems } = useQuery({
    queryKey: ['home', 'audience'],
    queryFn: fetchHomeAudience,
  });

  return (
    <div className="page-transition">
      <SEOMeta
        title="Место восстановления"
        description="Загородный wellness-проект на берегу Финского залива. Барнхаусы, купели, лес и вода — пространство, где природа сама возвращает силы."
        path="/"
      />
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={HOME_HERO_IMAGE.src}
            alt={HOME_HERO_IMAGE.alt}
            className="w-full h-full object-cover scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#F5F4F0]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <FadeUp delay={100}>
            <p className="text-white/80 uppercase tracking-[0.3em] text-xs font-semibold mb-6">
              {HOME_HERO.locationLine}
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] drop-shadow-lg">
              {HOME_HERO.titleLine1}
              <br />
              <span className="italic font-light">{HOME_HERO.titleLine2Italic}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={500}>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {HOME_HERO.subtitle}
            </p>
          </FadeUp>
          <FadeUp delay={700}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to={ROUTES.philosophy}
                className="px-8 py-4 bg-white text-[#2D332F] rounded-full font-medium hover:scale-105 transition-transform shadow-xl w-full sm:w-auto text-center"
              >
                {HOME_HERO.primaryCta}
              </Link>
              <Link
                to={ROUTES.territory}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-medium hover:bg-white/20 transition-colors w-full sm:w-auto text-center"
              >
                {HOME_HERO.secondaryCta}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-24 bg-[#F5F4F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <div className="w-12 h-12 rounded-full bg-[#E5E3DB] flex items-center justify-center mx-auto mb-8">
              <Trees className="w-6 h-6 text-[#4A5D4E] opacity-70" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2D332F] mb-6 max-w-3xl mx-auto leading-tight">
              {HOME_TEASER.title}
            </h2>
          </FadeUp>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#E5E3DB] bg-[#F5F4F0]">
        <FadeUp>
          <div className="text-center mb-20">
            <span className="text-[#8F9779] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              {HOME_AUDIENCE_SECTION.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2D332F]">{HOME_AUDIENCE_SECTION.title}</h2>
          </div>
        </FadeUp>

        {audienceItems && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audienceItems.map((item, idx) => (
              <FadeUp key={item.t} delay={idx * 100}>
                <div className="bg-white/60 backdrop-blur-sm border border-[#E5E3DB] p-10 rounded-[2rem] hover:bg-white transition-all duration-500 h-full shadow-sm hover:shadow-lg hover:-translate-y-1 group cursor-default">
                  <div className="w-10 h-[1px] bg-[#8F9779]/50 mb-8 group-hover:w-16 group-hover:bg-[#4A5D4E] transition-all duration-700"></div>
                  <h4 className="font-serif text-2xl text-[#2D332F] mb-4">{item.t}</h4>
                  <p className="text-[#5A635D] font-light leading-relaxed">{item.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
