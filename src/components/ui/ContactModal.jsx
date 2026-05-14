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
    /* Полноэкранный overlay */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(26,30,27,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Контакты"
    >
      {/* Карточка — stopPropagation чтобы клик внутри не закрывал */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#F5F4F0',
          borderRadius: '28px',
          boxShadow: '0 32px 80px -24px rgba(26,30,27,0.55)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div style={{ backgroundColor: '#2D332F', padding: '32px 32px 40px' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>

          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            backgroundColor: '#4A5D4E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <Leaf size={22} color="#F5F4F0" strokeWidth={1.5} />
          </div>

          <p style={{ color: '#8F9779', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: '6px' }}>
            Связаться с нами
          </p>
          <h2 style={{ color: '#fff', fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', margin: 0 }}>
            Проект «Альма»
          </h2>
        </div>

        {/* Тело */}
        <div style={{ padding: '28px 32px 8px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Имя */}
          <Row icon={<User size={16} color="#4A5D4E" />} label={CONTACT_INFO.role} value={CONTACT_INFO.name} />
          <Divider />

          {/* Телефон */}
          <Row
            icon={<Phone size={16} color="#4A5D4E" />}
            label="Телефон"
            value={<a href={CONTACT_INFO.phoneHref} style={{ color: '#2D332F', fontWeight: 600, textDecoration: 'none' }}>{CONTACT_INFO.phone}</a>}
          />
          <Divider />

          {/* Email */}
          <Row
            icon={<Mail size={16} color="#4A5D4E" />}
            label="Электронная почта"
            value={<a href={`mailto:${CONTACT_INFO.email}`} style={{ color: '#2D332F', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>{CONTACT_INFO.email}</a>}
          />
        </div>

        {/* Кнопки */}
        <div style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href={CONTACT_INFO.phoneHref}
            style={{
              display: 'block', textAlign: 'center',
              padding: '15px', borderRadius: '14px',
              backgroundColor: '#2D332F', color: '#F5F4F0',
              fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            Позвонить
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            style={{
              display: 'block', textAlign: 'center',
              padding: '15px', borderRadius: '14px',
              border: '1.5px solid rgba(45,51,47,0.2)',
              color: '#2D332F', fontWeight: 700, fontSize: '14px',
              letterSpacing: '0.05em', textDecoration: 'none',
            }}
          >
            Написать письмо
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%',
        backgroundColor: '#EBE9E1', flexShrink: 0, marginTop: '2px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 3px', color: '#8F9779', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          {label}
        </p>
        <div style={{ color: '#2D332F', fontWeight: 600, fontSize: '15px' }}>{value}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', backgroundColor: '#E5E3DB' }} />;
}
