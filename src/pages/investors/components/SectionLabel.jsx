import React from 'react';
import { G } from '../constants.js';

/**
 * Маленькая метка раздела: горизонтальная линия + текст в uppercase.
 * Используется перед заголовком каждой секции.
 */
export default function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.4em',
        color: G.sage,
      }}
    >
      <span style={{ width: '32px', height: '1px', background: G.sage }} />
      {children}
    </div>
  );
}
