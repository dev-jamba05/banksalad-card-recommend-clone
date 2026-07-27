'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './reports.module.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function Reports() {
  const categories = [
    { 
      name: '쇼핑', 
      amount: 142000, 
      percentage: 59, 
      color: '#3a82ee',
      increaseRate: 45,
      subCategories: [
        { name: '온라인 쇼핑 (쿠팡 등)', amount: 92000 },
        { name: '의류/신발', amount: 50000 },
      ]
    },
    { name: '교통', amount: 45000, percentage: 19, color: '#5dade2' },
    { 
      name: '식비', 
      amount: 37000, 
      percentage: 15, 
      color: '#7fb3d5',
      increaseRate: 20,
      subCategories: [
        { name: '배달 음식', amount: 25000 },
        { name: '외식', amount: 12000 },
      ]
    },
    { name: '카페', amount: 16000, percentage: 7, color: '#a9cce3' },
  ];

  return (
    <div className={styles.container}>
      <motion.header className={styles.header} {...fadeUp(0)}>
        <h1 className={styles.title}>소비 분석 리포트</h1>
        <p className={styles.subtitle}>최근 거래 내역을 기반으로 분석한 결과입니다.</p>
      </motion.header>

      <motion.div className={styles.summaryGrid} {...fadeUp(0.05)}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>이번 달 총 지출</div>
          <div className={styles.totalAmount}>₩240,000</div>
          <div className={styles.comparison}>
            지난달 대비 <span className={styles.highlight}>12% 더</span> 지출하고 있습니다.
          </div>
        </div>
        <div className={`${styles.card} ${styles.insightCard}`}>
          <div className={styles.cardLabel}>소비 인사이트 💡</div>
          <p className={styles.insightText}>
            가장 큰 비중을 차지하는 항목은 <strong>&apos;쇼핑&apos;</strong>(59%)입니다.<br />
            지난달 대비 <strong className={styles.increaseText}>쇼핑</strong> 카테고리가 가장 큰 폭(
            <strong className={styles.increaseText}>45%</strong>)으로 올랐습니다.
          </p>
        </div>
      </motion.div>

      <motion.div className={styles.card} {...fadeUp(0.1)}>
        <h2 className={styles.cardTitle}>카테고리별 소비</h2>
        <div className={styles.categoryList}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className={styles.categoryItem}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <div className={styles.catHeader}>
                <span className={styles.catName}>{cat.name}</span>
                <span className={styles.catAmount}>₩{cat.amount.toLocaleString()}</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  style={{ backgroundColor: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
                />
              </div>
              {cat.subCategories && (
                <div className={styles.subCategoryList}>
                  {cat.subCategories.map((sub) => (
                    <div key={sub.name} className={styles.subCategoryItem}>
                      <span>{sub.name}</span>
                      <span>₩{sub.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
