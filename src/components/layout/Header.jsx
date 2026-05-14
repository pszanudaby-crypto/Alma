import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Heart, Menu, X } from 'lucide-react';
import LeafIcon from '../ui/LeafIcon.jsx';
import AuthModal from '../auth/AuthModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { MOBILE_NAV_ITEMS, NAV_ITEMS, ROUTES } from '../../constants/navigation.js';
import { HEADER_COPY } from '../../constants/content.js';

function isActivePath(currentPath, itemPath) {
  if (itemPath === ROUTES.home) {
    return currentPath === ROUTES.home;
  }
  return currentPath === itemPath;
}

// Маршруты с тёмным full-screen hero — только здесь хедер стартует прозрачным с белым текстом.
// Всё остальное (светлые страницы, 404 и любые будущие маршруты) получает solidSurface по умолчанию.
const ROUTES_WITH_DARK_HERO = new Set([
  ROUTES.home,
  ROUTES.philosophy,
  ROUTES.rehabilitation,
  ROUTES.territory,
]);

export default function Header() {
  const { pathname } = useLocation();
  const { session, profile, loading: authLoading, hasPersistedAuthHint, signOut: authSignOut } = useAuth();
  const sessionUser = session?.user ?? null;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const authAreaReady = !authLoading || sessionUser || (authLoading && hasPersistedAuthHint);
  const authHydrating = authLoading && !sessionUser && hasPersistedAuthHint;

  const solidSurface = scrolled || mobileMenuOpen || !ROUTES_WITH_DARK_HERO.has(pathname);

  const displayLabel =
    profile?.display_name?.trim() ||
    sessionUser?.user_metadata?.full_name?.trim() ||
    sessionUser?.user_metadata?.name?.trim() ||
    sessionUser?.email?.trim() ||
    '';
  const initialChar = (displayLabel || sessionUser?.email || '?').trim().charAt(0).toUpperCase();

  const openAuth = useCallback(() => {
    setMobileMenuOpen(false);
    setAuthModalOpen(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    setMobileMenuOpen(false);
    try {
      await authSignOut();
    } catch (e) {
      console.error('[Header] signOut:', e);
    }
  }, [authSignOut]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      className={`fixed top-0 w-full z-50 flex flex-col transition-transform duration-500 ease-in-out ${
        scrolled ? '-translate-y-10 sm:-translate-y-12' : 'translate-y-0'
      }`}
    >
      <Link
        to={ROUTES.support}
        className="h-10 sm:h-12 flex items-center justify-center bg-[#4A5D4E] text-white cursor-pointer hover:bg-[#3d4d41] transition-colors"
      >
        <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium flex items-center gap-2 px-4 text-center">
          <Heart className="w-3.5 h-3.5 hidden sm:block text-[#8F9779]" />
          {HEADER_COPY.investorBanner}
          <ArrowRight className="w-3.5 h-3.5 hidden sm:block" />
        </span>
      </Link>

      <header
        className={`w-full transition-all duration-700 ${
          solidSurface
            ? 'py-3 bg-[#F5F4F0]/95 backdrop-blur-xl border-b border-[#E5E3DB] shadow-[0_8px_30px_-12px_rgba(45,51,47,0.12)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex-1 flex justify-start">
            <Link
              to={ROUTES.home}
              className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border transition-all duration-700 ${
                  solidSurface
                    ? 'border-[#4A5D4E]/30 bg-[#4A5D4E]/5 group-hover:bg-[#4A5D4E]/10'
                    : 'border-white/30 bg-white/10 backdrop-blur-sm group-hover:bg-white/20'
                }`}
              >
                <LeafIcon
                  className={`w-6 h-6 transition-colors duration-500 z-10 ${
                    solidSurface ? 'text-[#4A5D4E]' : 'text-white'
                  }`}
                />
                <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-current opacity-30 animate-[spin_20s_linear_infinite]"></div>
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-xl sm:text-2xl font-serif tracking-[0.15em] leading-none transition-colors duration-500 ${
                    solidSurface ? 'text-[#2D332F]' : 'text-white'
                  }`}
                >
                  {HEADER_COPY.brandTitle}
                </span>
                <span
                  className={`text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1.5 font-bold transition-colors duration-500 ${
                    solidSurface ? 'text-[#8F9779]' : 'text-white/70'
                  }`}
                >
                  {HEADER_COPY.brandTagline}
                </span>
              </div>
            </Link>
          </div>

          <nav
            className={`hidden md:flex items-center p-1.5 rounded-full transition-all duration-500 shrink-0 ${
              solidSurface
                ? 'bg-[#E8E6DE]/90 backdrop-blur-md border border-[#4A5D4E]/15 shadow-inner'
                : 'bg-white/10 backdrop-blur-md border border-white/20'
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${
                    active
                      ? solidSurface
                        ? 'text-[#F5F4F0] bg-[#2D332F] shadow-md ring-2 ring-[#8F9779]/35'
                        : 'text-[#2D332F] bg-white shadow-lg'
                      : solidSurface
                        ? 'text-[#2D332F] hover:text-[#1a1e1c] hover:bg-white/65'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 hidden md:flex justify-end items-center gap-3">
            {authAreaReady && (
              <>
                {authHydrating ? (
                  <div
                    className={`h-11 min-w-[10rem] max-w-[11rem] rounded-full animate-pulse shrink-0 ${
                      solidSurface ? 'bg-[#2D332F]/12' : 'bg-white/25'
                    }`}
                    aria-busy="true"
                    aria-label="Загрузка сессии"
                  />
                ) : sessionUser ? (
                  <div className="flex items-center gap-3 mr-1">
                    <div className="flex items-center gap-2 max-w-[160px]">
                      <div
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${
                          solidSurface
                            ? 'bg-[#2D332F] text-[#F5F4F0] border-[#2D332F]/20'
                            : 'bg-white/15 text-white border-white/25'
                        }`}
                        title={displayLabel || sessionUser.email}
                      >
                        {initialChar}
                      </div>
                      <span
                        className={`truncate text-sm font-semibold ${
                          solidSurface ? 'text-[#2D332F]' : 'text-white'
                        }`}
                        title={displayLabel || sessionUser.email}
                      >
                        {displayLabel || sessionUser.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={`px-5 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-500 border ${
                        solidSurface
                          ? 'border-[#2D332F]/25 text-[#2D332F] hover:bg-[#2D332F]/8'
                          : 'border-white/35 text-white hover:bg-white/10'
                      }`}
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openAuth}
                    className={`px-5 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-500 border ${
                      solidSurface
                        ? 'border-[#2D332F]/25 text-[#2D332F] hover:bg-[#2D332F]/8'
                        : 'border-white/35 text-white hover:bg-white/10'
                    }`}
                  >
                    Войти
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              className={`px-8 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-500 hover:-translate-y-0.5 ${
                solidSurface
                  ? 'bg-[#2D332F] text-white hover:bg-[#4A5D4E] shadow-lg shadow-black/10'
                  : 'bg-white text-[#2D332F] hover:bg-[#F5F4F0] shadow-xl shadow-black/20'
              }`}
            >
              {HEADER_COPY.contactButton}
            </button>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2 md:hidden">
            {authAreaReady && (
              <>
                {authHydrating ? (
                  <div
                    className={`h-9 w-24 rounded-full animate-pulse shrink-0 ${
                      solidSurface ? 'bg-[#2D332F]/15' : 'bg-white/25'
                    }`}
                    aria-hidden
                  />
                ) : !sessionUser ? (
                  <button
                    type="button"
                    onClick={openAuth}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-full border transition-colors ${
                      solidSurface
                        ? 'border-[#2D332F]/30 text-[#2D332F]'
                        : 'border-white/35 text-white'
                    }`}
                  >
                    Войти
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        solidSurface
                          ? 'bg-[#2D332F] text-[#F5F4F0] border-[#2D332F]/15'
                          : 'bg-white/15 text-white border-white/25'
                      }`}
                    >
                      {initialChar}
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-2 rounded-full ${
                        solidSurface ? 'text-[#2D332F]' : 'text-white'
                      }`}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </>
            )}
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Меню">
              {mobileMenuOpen ? (
                <X className="w-8 h-8 text-[#2D332F]" />
              ) : (
                <Menu
                  className={`w-8 h-8 transition-colors duration-500 ${
                    solidSurface ? 'text-[#2D332F]' : 'text-white'
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#F5F4F0] border-b border-[#E5E3DB] shadow-2xl flex flex-col px-6 py-6 gap-2 page-transition">
            {MOBILE_NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`text-left text-xl font-serif px-6 py-4 rounded-2xl transition-colors ${
                    active ? 'bg-[#EBE9E1] text-[#4A5D4E]' : 'text-[#2D332F] hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-[#E5E3DB] flex flex-col gap-3 px-2">
              {authAreaReady && authHydrating && (
                <div className="mx-2 h-14 rounded-2xl bg-[#EBE9E1]/90 animate-pulse" aria-hidden />
              )}
              {authAreaReady && !authHydrating && sessionUser && (
                <div className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center text-sm font-bold bg-[#2D332F] text-[#F5F4F0]">
                    {initialChar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2D332F] truncate">
                      {displayLabel || sessionUser.email}
                    </p>
                    {sessionUser.email && (
                      <p className="text-xs text-[#5A635D] truncate">{sessionUser.email}</p>
                    )}
                  </div>
                </div>
              )}
              {authAreaReady && !authHydrating && !sessionUser && (
                <button
                  type="button"
                  onClick={openAuth}
                  className="text-left px-6 py-4 rounded-2xl bg-[#2D332F] text-[#F5F4F0] text-base font-bold uppercase tracking-wider"
                >
                  Войти
                </button>
              )}
              {authAreaReady && !authHydrating && sessionUser && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-left px-6 py-4 rounded-2xl border border-[#2D332F]/20 text-[#2D332F] font-bold uppercase tracking-wider text-sm"
                >
                  Выйти
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
