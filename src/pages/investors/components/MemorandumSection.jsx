import React from 'react';
import { motion } from 'framer-motion';
import { Download, Lock, Mail } from 'lucide-react';
import MeshBackground from './MeshBackground.jsx';
import MagneticButton from '../../../components/ui/MagneticButton.jsx';
import { G, EASE_OUT } from '../constants.js';

/**
 * CTA-секция «Инвестиционный меморандум».
 * Тёмная карточка на светлом фоне страницы — единственный тёмный акцент,
 * создаёт визуальный якорь перед финальным footer strip.
 *
 * Кнопка заблокирована (disabled) — файл ещё не готов к публикации.
 * Когда файл появится: уберите disabled, замените href на реальную ссылку.
 */
export default function MemorandumSection({ onContact }) {
  return (
    <section style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
        style={{
          position: 'relative',
          maxWidth: '1180px', margin: '0 auto',
          borderRadius: '36px', overflow: 'hidden',
          background: G.forest, color: G.paper,
          padding: 'clamp(70px, 9vw, 130px) clamp(28px, 6vw, 96px)',
          boxShadow: '0 30px 80px -40px rgba(45,51,47,0.45)',
        }}
      >
        <MeshBackground intensity={0.45} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          {/* Метка секции */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: EASE_OUT }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(245,244,240,0.65)' }}>
              <span style={{ width: '32px', height: '1px', background: 'rgba(245,244,240,0.55)' }} />
              Инвестиционный меморандум
            </div>
          </motion.div>

          {/* Заголовок */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2.2rem, 6vw, 5.4rem)',
              lineHeight: 1.05, margin: 0, fontWeight: 300,
              letterSpacing: '-0.02em', marginBottom: '32px',
            }}
          >
            Один документ. <br />
            <span style={{ fontStyle: 'italic', color: G.paper }}>Всё о проекте.</span>
          </motion.h2>

          {/* Подзаголовок */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE_OUT }}
            style={{
              maxWidth: '560px', margin: '0 auto 48px',
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              lineHeight: 1.7, fontWeight: 300,
              color: 'rgba(245,244,240,0.78)',
            }}
          >
            Архитектура. Финансовая модель. Юридическая структура.
            Дорожная карта. Всё, что важно — в одном PDF.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE_OUT }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          >
            <MagneticButton
              disabled
              strength={0.22}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '14px',
                padding: '22px 44px', borderRadius: '100px',
                background: G.paper, color: G.ink, border: 'none',
                fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em',
                cursor: 'not-allowed',
                boxShadow: '0 18px 50px -16px rgba(0,0,0,0.45)',
              }}
            >
              <Lock size={15} />
              Скоро · По запросу
              <Download size={15} />
            </MagneticButton>

            <MagneticButton
              onClick={onContact}
              strength={0.22}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                padding: '16px 36px', borderRadius: '100px',
                background: 'transparent',
                border: '1.5px solid rgba(245,244,240,0.35)',
                color: 'rgba(245,244,240,0.9)',
                fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              <Mail size={14} />
              Связаться с командой
            </MagneticButton>
          </motion.div>

          {/* NDA-дисклеймер */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{
              marginTop: '24px', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.3em',
              color: 'rgba(245,244,240,0.55)',
            }}
          >
            NDA · аккредитованные инвесторы
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
