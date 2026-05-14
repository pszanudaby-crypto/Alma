import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MeshBackground from './MeshBackground.jsx';
import { G, EASE_OUT } from '../constants.js';

/**
 * Hero-секция страницы «Инвесторам».
 * Содержит параллакс-заголовок, подзаголовок и пульсирующую подсказку «прокрутите».
 * Параллакс управляется внутри компонента — не нужно прокидывать refs снаружи.
 */
export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '160px 32px 56px',
        overflow: 'hidden',
      }}
    >
      <MeshBackground intensity={1} />

      {/* Верхняя строка: бренд + статус раунда */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_OUT }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
          fontSize: '11px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.32em',
          color: G.sage,
        }}
      >
        <span>Альма · 2026</span>
        <span>Раунд А · Закрытое предложение</span>
      </motion.div>

      {/* Центральный параллакс-блок */}
      <motion.div
        style={{
          position: 'relative', zIndex: 10,
          maxWidth: '1200px', margin: '0 auto', width: '100%',
          y: heroY, opacity: heroOpacity,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.2, ease: EASE_OUT }}
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(3rem, 11vw, 11rem)',
            lineHeight: 0.95,
            margin: 0,
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: G.ink,
          }}
        >
          <span style={{ display: 'block' }}>Инвестиции в</span>
          <span style={{ display: 'block', fontStyle: 'italic', color: G.moss, fontWeight: 400 }}>
            восстановление.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: EASE_OUT }}
          style={{
            maxWidth: '480px', marginTop: '40px',
            fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
            fontWeight: 300, lineHeight: 1.7,
            color: G.inkSoft,
          }}
        >
          Загородный wellness-проект на берегу Финского залива.
          Полный пакет информации — в инвестиционном меморандуме.
        </motion.p>
      </motion.div>

      {/* Нижняя строка: локация + подсказка скролла */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '16px', fontSize: '10px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.32em',
          color: G.sage,
        }}
      >
        <span>Финский залив · Поселок Советский</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', animation: 'scroll-pulse 2.5s ease-in-out infinite' }}>
          Прокрутите <ChevronDown size={12} />
        </span>
      </motion.div>
    </section>
  );
}
