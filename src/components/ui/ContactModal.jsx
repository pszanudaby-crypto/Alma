import React, { useEffect } from 'react';
import { X, Mail, Phone, User, Leaf } from 'lucide-react';
import { CONTACT_INFO } from '../../constants/content.js';

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Тёмный backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: 9998,
          backgroundColor: 'rgba(26,30,27,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Карточка — абсолютно по центру viewport */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: 'min(440px, calc(100vw - 32px))',
          backgroundColor: '#F5F4F0',
          borderRadius: '28px',
          boxShadow: '0 32px 80px -16px rgba(26,30,27,0.6)',
          overflow: 'hidden',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Контакты"
      >
        {/* Шапка */}
        <div style={{ backgroundColor: '#2D332F', padding: '32px 32px 36px' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '36px', height: '36px', borderRadius: '50%',
              border: 'none', backgroundColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>

          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            backgroundColor: '#4A5D4E', marginBottom: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={22} color="#F5F4F0" strokeWidth={1.5} />
          </div>

          <p style={{ color: '#8F9779', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, margin: '0 0 6px' }}>
            Связаться с нами
          </p>
          <h2 style={{ color: '#fff', fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', margin: 0, fontWeight: 400 }}>
            Проект «Альма»
          </h2>
        </div>

        {/* Контактные строки */}
        <div style={{ padding: '24px 32px 8px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <ContactRow icon={<User size={15} color="#4A5D4E" />} label={CONTACT_INFO.role} value={CONTACT_INFO.name} />

          <div style={{ height: '1px', backgroundColor: '#E5E3DB' }} />

          <ContactRow
            icon={<Phone size={15} color="#4A5D4E" />}
            label="Телефон"
            value={
              <a href={CONTACT_INFO.phoneHref} style={{ color: '#2D332F', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
                {CONTACT_INFO.phone}
              </a>
            }
          />

          <div style={{ height: '1px', backgroundColor: '#E5E3DB' }} />

          <ContactRow
            icon={<Mail size={15} color="#4A5D4E" />}
            label="Электронная почта"
            value={
              <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: '#2D332F', fontWeight: 600, fontSize: '15px', textDecoration: 'none', wordBreak: 'break-all' }}>
                {CONTACT_INFO.email}
              </a>
            }
          />
        </div>

        {/* Кнопки */}
        <div style={{ padding: '20px 32px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href={CONTACT_INFO.phoneHref}
            style={{
              display: 'block', textAlign: 'center', padding: '14px',
              borderRadius: '14px', backgroundColor: '#2D332F', color: '#F5F4F0',
              fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textDecoration: 'none',
            }}
          >
            Позвонить
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            style={{
              display: 'block', textAlign: 'center', padding: '14px',
              borderRadius: '14px', border: '1.5px solid rgba(45,51,47,0.18)',
              color: '#2D332F', fontWeight: 700, fontSize: '13px',
              letterSpacing: '0.06em', textDecoration: 'none',
            }}
          >
            Написать письмо
          </a>
        </div>
      </div>
    </>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        backgroundColor: '#EBE9E1', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 3px', color: '#8F9779', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          {label}
        </p>
        {typeof value === 'string'
          ? <p style={{ margin: 0, color: '#2D332F', fontWeight: 600, fontSize: '15px' }}>{value}</p>
          : value}
      </div>
    </div>
  );
}
