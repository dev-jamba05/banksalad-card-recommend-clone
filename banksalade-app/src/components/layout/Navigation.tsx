'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  { href: '/',         label: '홈',     icon: '🏠' },
  { href: '/reports',  label: '소비 분석', icon: '📊' },
  { href: '/products', label: '카드 추천', icon: '💳' },
  { href: '/profile',  label: '내 프로필', icon: '👤' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname === '/login') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-shadow duration-200"
      style={{
        backgroundColor: 'var(--white)',
        borderBottom: scrolled ? 'none' : '1px solid var(--border-color)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <nav className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-14 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="text-2xl">🥗</span>
          <span className="font-extrabold text-lg" style={{ color: 'var(--primary)' }}>BankSalade</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  backgroundColor: active ? '#e6f7ef' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-sub)',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="테마 변경"
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-sub)' }}
            title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {state.auth.isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-[color:var(--item-hover)]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--primary)' }}>
                  {state.auth.user?.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
                  {state.auth.user?.name} 님
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-2 rounded-xl transition-colors"
                style={{ color: 'var(--text-sub)' }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
          className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-main)' }}
        >
          <div className="w-5 flex flex-col gap-1.5">
            <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block h-0.5 rounded-full origin-left"
              style={{ backgroundColor: 'currentColor' }} />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 rounded-full"
              style={{ backgroundColor: 'currentColor' }} />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block h-0.5 rounded-full origin-left"
              style={{ backgroundColor: 'currentColor' }} />
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--white)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: active ? '#e6f7ef' : 'transparent',
                      color: active ? 'var(--primary)' : 'var(--text-main)',
                    }}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-2 pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors"
                  style={{ color: 'var(--text-sub)' }}>
                  {theme === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
                </button>
                {state.auth.isAuthenticated && (
                  <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                    로그아웃
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
