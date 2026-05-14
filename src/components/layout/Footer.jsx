import React from 'react';
import { Link } from 'react-router-dom';
import { Trees } from 'lucide-react';
import { FOOTER_COPY } from '../../constants/content.js';
import { FOOTER_NAV_LINKS } from '../../constants/navigation.js';

export default function Footer() {
  return (
    <footer className="bg-[#1A1E1B] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Trees className="w-4 h-4 text-[#8F9779]" />
              </div>
              <span className="text-xl font-serif tracking-widest">АЛЬМА</span>
            </div>
            <p className="text-white/50 text-sm font-light max-w-sm leading-relaxed">{FOOTER_COPY.description}</p>
          </div>

          <div>
            <h4 className="font-serif mb-6 text-white/90">Навигация</h4>
            <ul className="space-y-3 text-sm text-white/50 font-light">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif mb-6 text-white/90">Контакты</h4>
            <ul className="space-y-3 text-sm text-white/50 font-light">
              {FOOTER_COPY.contacts.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li className="pt-2">
                <a
                  href={`mailto:${FOOTER_COPY.email}`}
                  className="text-[#8F9779] hover:text-white transition-colors"
                >
                  {FOOTER_COPY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>{FOOTER_COPY.copyright}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              {FOOTER_COPY.legalPrivacy}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {FOOTER_COPY.legalReports}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
