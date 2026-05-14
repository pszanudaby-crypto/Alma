import React from 'react';
import { G } from '../constants.js';

/**
 * Бесконечная горизонтальная бегущая строка.
 * Пропс `items` — массив строк.
 * CSS-анимация `marquee` определена глобально в investors/index.jsx.
 */
export default function Marquee({ items }) {
  const repeated = [...items, ...items, ...items];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '34px 0',
        borderTop: `1px solid ${G.divider}`,
        borderBottom: `1px solid ${G.divider}`,
        background: G.paperSoft,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '60px',
          width: 'max-content',
          animation: 'marquee 38s linear infinite',
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '24px',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: G.moss,
              whiteSpace: 'nowrap',
              opacity: 0.9,
            }}
          >
            {item}
            <span
              style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: G.sage,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
