import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { G, EASE_OUT } from '../constants.js';

/**
 * Одна метрика в секции «Параметры».
 * Анимируется при появлении в viewport: fade + slide-up + линия слева направо.
 *
 * Пропсы:
 *  - value   — основное значение (строка)
 *  - suffix  — необязательный курсивный постфикс (например, «года»)
 *  - label   — подпись под значением
 *  - delay   — задержка анимации (сек)
 */
export default function StatBlock({ value, label, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
      style={{ position: 'relative', padding: '48px 36px', borderTop: `1px solid ${G.divider}` }}
    >
      {/* Анимированная акцентная линия поверх разделителя */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: delay + 0.2, ease: EASE_OUT }}
        style={{
          position: 'absolute', top: '-1px', left: 0, right: 0, height: '1px',
          background: `linear-gradient(to right, ${G.moss}, transparent)`,
          transformOrigin: 'left',
        }}
      />

      <div
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 'clamp(3rem, 6vw, 5.5rem)',
          lineHeight: 1,
          color: G.ink,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
        }}
      >
        <span>{value}</span>
        {suffix && (
          <span style={{ color: G.moss, fontSize: '0.5em', fontStyle: 'italic' }}>
            {suffix}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: '11px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.28em',
          color: G.sage, lineHeight: 1.5,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
