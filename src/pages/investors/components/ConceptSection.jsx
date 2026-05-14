import React from 'react';
import { motion } from 'framer-motion';
import ManifestoParagraph from './ManifestoParagraph.jsx';
import SectionLabel from './SectionLabel.jsx';
import { EASE_OUT, CONCEPT_TEXT } from '../constants.js';

/**
 * Секция «Концепция» — раскрывает суть проекта через пословный reveal манифеста.
 */
export default function ConceptSection() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(120px, 18vw, 220px) 32px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: EASE_OUT }}
        style={{ marginBottom: '64px' }}
      >
        <SectionLabel>Концепция</SectionLabel>
      </motion.div>

      <ManifestoParagraph text={CONCEPT_TEXT} />
    </section>
  );
}
