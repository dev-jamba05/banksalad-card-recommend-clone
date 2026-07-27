'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  { href: '/',         label: '홈 (분류/피드백)', icon: '🏠' },
  { href: '/reports',  label: '소비 분석 (H)', icon: '📊' },
  { href: '/products', label: '카드 추천 (M)', icon: '💳' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useApp();
  const { theme, toggleTheme } = useTheme();

  if (pathname === '/login') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r hidden md:flex flex-col z-40" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--white)' }}>
      {/* Logo */}
      <div className="p-6 pb-8">
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="font-extrabold text-2xl" style={{ color: '#5b8df2' }}>BankSalade</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {navLinks.map((link) => {
          // Exact match for Home to prevent highlighting on /products or /reports.
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all"
              style={{
                backgroundColor: active ? 'transparent' : 'transparent', // Looks like active state has no bg color in screenshot, maybe just default
                color: 'var(--text-main)'
              }}
            >
              <span className="text-xl" style={{ filter: !active ? 'grayscale(100%) opacity(0.5)' : 'none' }}>{link.icon}</span>
              <span style={{ fontWeight: active ? 'bold' : 'normal', color: active ? 'var(--text-main)' : 'var(--text-sub)' }}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 flex flex-col gap-4">
        {/* Dark Mode */}
        <button
          onClick={toggleTheme}
          className="w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)', backgroundColor: 'var(--card-bg)' }}
        >
          {theme === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--badge-bg)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e5e5e5' }}>
            <span style={{ opacity: 0.1 }}>👤</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold" style={{ color: 'var(--text-main)' }}>김뱅샐 님</span>
            <span className="text-[11px]" style={{ color: 'var(--text-sub)' }}>Premium Member</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-1 text-[13px] transition-colors"
          style={{ color: 'var(--text-sub)' }}
        >
          <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[12px] font-bold" style={{ backgroundColor: '#2b2b2b' }}>N</div>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
