import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <h1 className={styles.logo}>BankSalade</h1>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>
            <span className={styles.icon}>🏠</span>
            <span>홈 (분류/피드백)</span>
          </Link>
          <Link href="/reports" className={styles.navItem}>
            <span className={styles.icon}>📊</span>
            <span>소비 분석 (H)</span>
          </Link>
          <Link href="/products" className={styles.navItem}>
            <span className={styles.icon}>💳</span>
            <span>카드 추천 (M)</span>
          </Link>
        </nav>
      </div>

      <div className={styles.bottom}>
        <button className={styles.darkMode} onClick={toggleTheme}>
          {theme === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </button>
        <div className={styles.profile}>
          <div className={styles.avatar}></div>
          <div className={styles.profileInfo}>
            <div className={styles.userName}>김뱅샐 님</div>
            <div className={styles.membership}>Premium Member</div>
          </div>
        </div>
        <Link href="/login" className={styles.logout}>로그아웃</Link>
      </div>
    </aside>
  );
};

export default Sidebar;
