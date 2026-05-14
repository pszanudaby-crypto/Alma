import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { G, FOOTER_CONTACTS } from '../constants.js';

/**
 * Контактная полоса в конце страницы.
 * Три колонки: «Прямой контакт», «Локация», «Статус».
 * Данные редактируются в constants.js (FOOTER_CONTACTS).
 */
export default function FooterStrip() {
  return (
    <section
      style={{
        padding: '80px 32px 100px',
        maxWidth: '1280px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        borderTop: `1px solid ${G.divider}`,
        alignItems: 'start',
      }}
    >
      {FOOTER_CONTACTS.map(({ label, value, isEmail, accent }) => (
        <div key={label}>
          <div
            style={{
              fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.32em',
              color: G.sage, marginBottom: '14px',
            }}
          >
            {label}
          </div>

          {isEmail ? (
            <EmailLink href={`mailto:${value}`} label={value} />
          ) : (
            <p
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                fontStyle: 'italic', color: G.ink,
                margin: 0, fontWeight: 300, lineHeight: 1.5,
              }}
            >
              {value.split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}{i < value.split('\n').length - 1 && <br />}</React.Fragment>
              ))}
              {accent && (
                <><br /><span style={{ color: G.moss }}>{accent}</span></>
              )}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

function EmailLink({ href, label }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
        fontStyle: 'italic', color: G.ink,
        textDecoration: 'none', fontWeight: 300, transition: 'color 0.3s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = G.moss)}
      onMouseLeave={(e) => (e.currentTarget.style.color = G.ink)}
    >
      {label}
      <ArrowUpRight size={18} style={{ color: G.moss }} />
    </a>
  );
}
