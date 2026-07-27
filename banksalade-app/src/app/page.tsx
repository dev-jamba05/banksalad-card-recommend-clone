'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { fetchTransactions } from '@/lib/api';
import type { Transaction } from '@/types';
import styles from './page.module.css';

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 20 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

export default function Dashboard() {
  const { state } = useApp();
  const [txList, setTxList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const totalExpense = 228000;
  const budget       = 600000;
  const pct          = Math.round((totalExpense / budget) * 100);

  useEffect(() => {
    fetchTransactions().then((data) => {
      setTxList(data);
      setLoading(false);
    });
  }, []);

  // const userName = state.auth.user?.name ?? '김뱅샐';

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <motion.header className={styles.header} {...fadeUp(0)}>
        <h1 className={styles.title}>오늘의 금융 건강</h1>
      </motion.header>

      <div className={styles.grid}>
        <section className={styles.mainCol}>
          {/* 인사이트 카드 */}
          <motion.div className={styles.card} {...fadeUp(0.05)}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>Salade Insight</span>
            </div>
            <p className={styles.insightText}>아주 알뜰하게 소비 중이시네요! 👏</p>
          </motion.div>

          {/* 거래 내역 */}
          <motion.div className={styles.card} {...fadeUp(0.1)}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>지출 내역 분류</h2>
              <span className={styles.subText}>자동 분류 알고리즘 작동 중</span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3 py-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-24 rounded bg-[color:var(--border-color)] animate-pulse" />
                      <div className="h-4 w-40 rounded bg-[color:var(--border-color)] animate-pulse" />
                    </div>
                    <div className="h-5 w-20 rounded bg-[color:var(--border-color)] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.transactionList}>
                {txList.map((t, i) => (
                  <motion.div
                    key={t.id}
                    className={styles.transactionItem}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div className={styles.tLeft}>
                      <span className={styles.date}>{t.date}</span>
                      <div className={styles.nameGroup}>
                        <span className="text-xl">{t.icon}</span>
                        <span className={styles.tName}>{t.name}</span>
                        <span className={styles.categoryBadge}>{t.category}</span>
                      </div>
                    </div>
                    <div className={`${styles.amount} ${t.amount > 0 ? styles.positive : ''}`}>
                      {t.amount > 0 ? '+' : ''}₩{Math.abs(t.amount).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </section>

        <aside className={styles.sideCol}>
          {/* 지출 현황 위젯 */}
          <motion.div className={styles.card} {...fadeUp(0.15)}>
            <h2 className={styles.cardTitle}>실시간 지출 현황</h2>
            <div className={styles.expenseAmount}>₩{totalExpense.toLocaleString()}</div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-sub)' }}>
              예산 ₩{budget.toLocaleString()} 중 {pct}% 사용
            </p>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* 카드 추천 위젯 */}
          <motion.div className={`${styles.card} ${styles.recommendCard}`} {...fadeUp(0.2)}>
            <h2 className={styles.cardTitle} style={{ marginBottom: '16px' }}>최적 카드 발견 💡</h2>
            <p className={styles.recommendDesc}>
              분석 결과, 현재 카드를 변경하면<br />
              <strong>연간 약 36만원</strong>을 더 절약할 수 있어요.
            </p>
            <Link href="/products" className={styles.actionButton}>
              절약 비법 확인하기
            </Link>
          </motion.div>

          {/* 빠른 이동 */}
          <motion.div className={styles.card} {...fadeUp(0.25)}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 12 }}>빠른 이동</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: '/reports',  label: '📊 소비 분석 보기' },
                { href: '/products', label: '💳 카드 추천 보기' },
                { href: '/profile',  label: '👤 프로필 관리' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-main)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--item-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
