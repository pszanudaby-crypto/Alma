import React from 'react';

/**
 * Декоративный фон: три медленно плавающих градиентных пятна (мох / шалфей / золото)
 * и едва заметный слой бумажного шума.
 *
 * Пропс `intensity` (0–1) масштабирует прозрачность всех слоёв —
 * удобно для тёмной карточки меморандума (intensity = 0.45).
 *
 * ⚠️  @keyframes float-slow-{1,2,3} определены глобально в investors/index.jsx
 */
export default function MeshBackground({ intensity = 1 }) {
  const blobs = [
    {
      style: {
        width: '72vw', height: '72vw',
        left: '-18vw', top: '-22vw',
        background: 'radial-gradient(circle, rgba(74,93,78,0.16) 0%, transparent 65%)',
        filter: 'blur(80px)',
        animation: 'float-slow-1 32s ease-in-out infinite',
      },
    },
    {
      style: {
        width: '60vw', height: '60vw',
        right: '-15vw', top: '5vh',
        background: 'radial-gradient(circle, rgba(143,151,121,0.14) 0%, transparent 60%)',
        filter: 'blur(90px)',
        animation: 'float-slow-2 36s ease-in-out infinite',
      },
    },
    {
      style: {
        width: '50vw', height: '50vw',
        left: '18vw', bottom: '-22vh',
        background: 'radial-gradient(circle, rgba(185,154,85,0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        animation: 'float-slow-3 40s ease-in-out infinite',
      },
    },
  ];

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {blobs.map((b, i) => (
        <div key={i} style={{ position: 'absolute', opacity: intensity, ...b.style }} />
      ))}

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, mixBlendMode: 'multiply' }}>
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>
    </div>
  );
}
