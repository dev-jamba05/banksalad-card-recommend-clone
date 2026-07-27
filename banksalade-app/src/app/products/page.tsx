'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './products.module.css';
import { recommendedCards } from '@/data/mock';

export default function Products() {
  return (
    <div className={styles.container}>
      <motion.header className={styles.header}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className={styles.title}>맞춤 카드 추천</h1>
        <p className={styles.subtitle}>
          사용자님의 지출 데이터를 분석한 결과입니다.<br />
          가장 높은 수익률(ROI)을 주는 카드를 선택해보세요.
        </p>
      </motion.header>

      <motion.div className={styles.diagnosisBox}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <div className={styles.diagnosisLabel}>금융 건강 진단 결과</div>
        <h2 className={styles.diagnosisTitle}>
          <span className={styles.highlight}>쇼핑</span> 소비를 최적화할 시간이에요!
        </h2>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>월 평균 소비액</span>
          <span className={styles.statValue}>₩142,000</span>
        </div>
      </motion.div>

      <div className={styles.cardGrid}>
        {recommendedCards.map((card, i) => (
          <motion.div
            key={card.id}
            className={`${styles.card} ${card.isBest ? styles.bestCard : ''}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            {card.isBest && <div className={styles.bestBadge}>최적의 선택</div>}
            <div className={styles.cardInfo}>
              <div className={styles.cardVisual} style={{ backgroundColor: card.color }}></div>
              <div className={styles.cardMeta}>
                <span className={styles.brand}>샐러드카드</span>
                <h3 className={styles.cardName}>{card.name}</h3>
              </div>
            </div>

            <div className={styles.savingBox}>
              <div className={styles.savingLabel}>월 예상 절약 금액</div>
              <div className={styles.savingValue}>+₩{card.saving.toLocaleString()} / 월</div>
            </div>

            <div className={styles.benefitSummary}>
              <h4 className={styles.benefitTitle}>나를 위한 혜택 요약</h4>
              {card.benefits.map((b, idx) => (
                <div key={idx} className={styles.benefitItem}>
                  <span className={styles.benefitCat}>{b.category}</span>
                  <span className={styles.benefitDesc}>{b.desc}</span>
                </div>
              ))}
            </div>

            <Link href={`/products/apply/${card.id}`} className={styles.applyButton}>
              카드 신청하기
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
