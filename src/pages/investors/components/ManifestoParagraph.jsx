import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { G } from '../constants.js';

/**
 * Пословное проявление текста по мере прокрутки.
 * Каждое слово проявляется по очереди в диапазоне scrollY.
 */
function ScrollWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity, display: 'inline-block', marginRight: '0.25em' }}>
      {children}
    </motion.span>
  );
}

/**
 * Пропс `text` — полная строка текста.
 * Слова разбиваются по пробелам и анимируются последовательно.
 */
export default function ManifestoParagraph({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });
  const words = text.split(' ');

  return (
    <p
      ref={ref}
      style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(1.6rem, 4.5vw, 4rem)',
        lineHeight: 1.18,
        color: G.ink,
        margin: 0,
        fontWeight: 300,
      }}
    >
      {words.map((word, i) => (
        <ScrollWord
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}
