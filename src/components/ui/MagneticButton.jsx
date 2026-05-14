import React, { useRef, useEffect, useState } from 'react';

/**
 * Кнопка с магнитным эффектом при наведении.
 * Передайте `strength` (0–1) для настройки силы притяжения.
 * Все остальные props (style, onClick, disabled…) прокидываются на <button>.
 */
export default function MagneticButton({ children, strength = 0.35, style, ...rest }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < Math.max(r.width, r.height) * 0.9) {
        setOffset({ x: dx * strength, y: dy * strength });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    const onLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <button
      ref={ref}
      {...rest}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'inherit',
          transform: `translate3d(${offset.x * 0.4}px, ${offset.y * 0.4}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </span>
    </button>
  );
}
