import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FadeUp from '../components/ui/FadeUp.jsx';
import SEOMeta from '../components/ui/SEOMeta.jsx';
import { TERRITORY_HERO } from '../constants/content.js';
import { fetchTerritoryFeatures, fetchTerritoryIntro } from '../api/mocks.js';

/** Фото-карточка: подпись скрывается при hover (desktop) или пока палец на экране (touch). */
function TerritoryImageCard({
  size,
  className,
  imageSrc,
  imageAlt,
  imageClassName = '',
  tag,
  title,
  description,
  /** Первые карточки — eager (видны сразу на мобильном), остальные — lazy. */
  loadingImg = 'lazy',
}) {
  const [touchPeek, setTouchPeek] = useState(false);
  const overlayClass = touchPeek ? 'opacity-0' : 'opacity-100 group-hover:opacity-0';

  const pointerHandlers = {
    onPointerDown: (e) => {
      if (e.pointerType === 'touch') setTouchPeek(true);
    },
    onPointerUp: (e) => {
      if (e.pointerType === 'touch') setTouchPeek(false);
    },
    onPointerCancel: (e) => {
      if (e.pointerType === 'touch') setTouchPeek(false);
    },
    onPointerLeave: (e) => {
      if (e.pointerType === 'touch') setTouchPeek(false);
    },
  };

  const isWide = size === 'wide';

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] group touch-manipulation cursor-pointer select-none shadow-[0_12px_48px_-28px_rgba(45,51,47,0.16)] ring-1 ring-[#2D332F]/[0.06] ${className}`}
      {...pointerHandlers}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        loading={loadingImg}
        decoding="async"
        draggable={false}
        sizes={isWide
          ? '(max-width: 768px) 100vw, 80vw'
          : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[2s] group-hover:scale-105 bg-[#D5D3CC] ${imageClassName}`}
      />

      <div
        className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 ease-out motion-reduce:transition-none ${overlayClass}`}
      >
        <div
          className={
            isWide
              ? 'pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-[linear-gradient(to_top,rgb(12,14,13)_0%,rgba(12,14,13,0.88)_22%,rgba(12,14,13,0.42)_48%,transparent_100%)]'
              : 'pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,rgb(12,14,13)_0%,rgba(12,14,13,0.9)_26%,rgba(12,14,13,0.38)_52%,transparent_100%)]'
          }
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-black/10"
          aria-hidden
        />
        <div
          className={
            isWide
              ? 'absolute bottom-0 left-0 right-0 p-7 pb-8 md:p-10 md:pb-10'
              : 'absolute bottom-0 left-0 right-0 p-6 pb-6 md:p-8 md:pb-8'
          }
        >
          <div
            className={
              isWide
                ? 'max-w-2xl rounded-[1.25rem] bg-black/35 px-5 py-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.12] backdrop-blur-md md:px-6 md:py-5'
                : 'rounded-[1.2rem] bg-black/40 px-4 py-3.5 shadow-[0_10px_36px_-6px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.14] backdrop-blur-md md:px-5 md:py-4'
            }
          >
            <span
              className={
                isWide
                  ? 'mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white drop-shadow-sm md:text-xs'
                  : 'mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white opacity-95 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)] md:text-[11px]'
              }
            >
              {tag}
            </span>
            <h3
              className={
                isWide
                  ? 'mb-3 font-serif text-3xl leading-[1.15] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.75)] md:text-[2.15rem]'
                  : 'mb-2 font-serif text-xl leading-snug text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.82)] md:text-2xl'
              }
            >
              {title}
            </h3>
            <p
              className={
                isWide
                  ? 'text-sm font-normal leading-relaxed text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)] md:text-[15px]'
                  : 'text-[13px] font-normal leading-relaxed text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.92)] md:text-sm'
              }
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Territory() {
  const { data: intro } = useQuery({
    queryKey: ['territory', 'intro'],
    queryFn: fetchTerritoryIntro,
  });

  const { data: features } = useQuery({
    queryKey: ['territory', 'features'],
    queryFn: fetchTerritoryFeatures,
  });

  /** Ранняя подсказка браузеру: тот же домен, что и страница — быстрее на мобильном, чем внешний CDN. */
  useEffect(() => {
    const sm = TERRITORY_HERO.imageSrcMobile;
    const full = TERRITORY_HERO.imageSrc;
    const links = [
      { href: sm, media: '(max-width: 600px)' },
      { href: full, media: '(min-width: 601px)' },
    ];
    const els = links.map(({ href, media }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      link.setAttribute('fetchpriority', 'high');
      link.media = media;
      document.head.appendChild(link);
      return link;
    });
    return () => {
      els.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="page-transition bg-[#EBE9E1] min-h-screen pb-24">
      <SEOMeta
        title="Территория"
        description="Барнхаусы, купели, лес и берег залива — узнайте, как устроена территория wellness-проекта «Альма» в Ленинградской области."
        path="/territory"
      />
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={TERRITORY_HERO.imageSrc}
            srcSet={`${TERRITORY_HERO.imageSrcMobile} 800w, ${TERRITORY_HERO.imageSrc} 1600w`}
            sizes="100vw"
            alt={TERRITORY_HERO.imageAlt}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover bg-[#5a6b7a]"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 mt-20 text-center">
          <FadeUp>
            <h1 className="font-serif text-5xl text-white md:text-6xl">{TERRITORY_HERO.title}</h1>
            <p className="mt-4 font-light tracking-wide text-white/80">{TERRITORY_HERO.subtitle}</p>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {intro && (
          <FadeUp>
            <p className="mb-16 max-w-2xl text-lg font-light leading-relaxed text-[#5A635D]">{intro}</p>
          </FadeUp>
        )}

        {features && (
          <div className="mb-32 grid grid-cols-1 items-stretch gap-6 md:grid-cols-12 md:gap-7">
            {features.map((item, index) => {
              const eagerFirst = index < 2;
              if (item.kind === 'wide-image') {
                return (
                  <TerritoryImageCard
                    key={item.tag}
                    size="wide"
                    className="aspect-[16/9] h-full md:col-span-12 md:aspect-[2/1] lg:col-span-8"
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                    tag={item.tag}
                    title={item.title}
                    description={item.description}
                    loadingImg={eagerFirst ? 'eager' : 'lazy'}
                  />
                );
              }
              if (item.kind === 'square-image') {
                return (
                  <TerritoryImageCard
                    key={item.tag}
                    size="square"
                    className={`h-full md:col-span-6 ${item.spanClass ?? 'lg:col-span-4'} ${item.aspectClass ?? 'aspect-square'} ${item.cardClassName ?? ''}`}
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                    imageClassName={item.imageClassName ?? ''}
                    tag={item.tag}
                    title={item.title}
                    description={item.description}
                    loadingImg={eagerFirst ? 'eager' : 'lazy'}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
