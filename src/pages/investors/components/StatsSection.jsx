import React from 'react';
import { motion } from 'framer-motion';
import StatBlock from './StatBlock.jsx';
import SectionLabel from './SectionLabel.jsx';
import { EASE_OUT, STATS } from '../constants.js';

/**
 * Секция «Параметры» — сетка из трёх ключевых метрик проекта.
 * Данные берутся из constants.js — редактируйте их там.
 */
export default function StatsSection() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '40px 32px clamp(120px, 14vw, 180px)',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: EASE_OUT }}
        style={{ marginBottom: '24px' }}
      >
        <SectionLabel>Параметры</SectionLabel>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0 }}>
        {STATS.map((stat) => (
          <StatBlock key={stat.value} {...stat} />
        ))}
      </div>
    </section>
  );
}
