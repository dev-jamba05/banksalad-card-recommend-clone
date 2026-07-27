import { RecommendedCard, Transaction } from '../types';

export const transactions: Transaction[] = [
  { id: 1, date: '2026-04-10', name: '배달의민족', amount: -25000, category: '식비', icon: '🍕' },
  { id: 2, date: '2026-04-09', name: '(주)슬레이드', amount: 3500000, category: '급여', icon: '💰' },
  { id: 3, date: '2026-04-09', name: '쿠팡결제', amount: -142000, category: '쇼핑', icon: '🛍️' },
  { id: 4, date: '2026-04-08', name: '지하철', amount: -45000, category: '교통', icon: '🚇' },
  { id: 5, date: '2026-04-08', name: '스타벅스', amount: -16000, category: '카페', icon: '☕' },
];

// 원본 카드 데이터 (알고리즘 계산용)
const rawCards = [
  {
    id: 'gourmet-meal',
    name: '고메 식사 카드',
    color: '#ff6b6b',
    annualFee: 12000, // 연회비
    benefits: [
      { category: '식비', desc: '모든 음식점 10% 할인', discountRate: 0.1, maxLimit: 15000 },
      { category: '카페', desc: '스타벅스/폴바셋 20% 할인', discountRate: 0.2, maxLimit: 10000 }
    ]
  },
  {
    id: 'shopping-master',
    name: '쇼핑 마스터 카드',
    color: '#3a82ee',
    annualFee: 15000, // 연회비
    benefits: [
      { category: '쇼핑', desc: '쿠팡/무신사 15% 할인', discountRate: 0.15, maxLimit: 20000 },
      { category: '식비', desc: '점심시간 식당 5% 할인', discountRate: 0.05, maxLimit: 10000 }
    ]
  }
];

// 1. 소비 데이터 그룹화 (Map-Reduce)
const monthlySpendingByCategory = transactions.reduce((acc, tx) => {
  if (tx.amount < 0) {
    const amount = Math.abs(tx.amount);
    acc[tx.category] = (acc[tx.category] || 0) + amount;
  }
  return acc;
}, {} as Record<string, number>);

// 총 지출액 계산
const totalMonthlySpending = Object.values(monthlySpendingByCategory).reduce((sum, val) => sum + val, 0);

// 2. 혜택 매칭 및 피킹률 산출 함수
function calculateCardEfficiency(cards: typeof rawCards) {
  const calculatedCards = cards.map(card => {
    let totalDiscount = 0;
    
    // 카테고리별 할인 금액 계산 및 한도 적용
    card.benefits.forEach(benefit => {
      const spending = monthlySpendingByCategory[benefit.category] || 0;
      const expectedDiscount = spending * benefit.discountRate;
      const actualDiscount = Math.min(expectedDiscount, benefit.maxLimit); // 월 최대 할인 한도(maxLimit) 초과 방지
      totalDiscount += actualDiscount;
    });

    // 3. 피킹률 산출: (예상 총 할인 금액 - 월환산 연회비) / 총 지출액 * 100
    const monthlyAnnualFee = Math.floor(card.annualFee / 12);
    const netSaving = totalDiscount - monthlyAnnualFee;
    
    // 피킹률 (Picking Rate)
    const pickingRate = totalMonthlySpending > 0 ? (netSaving / totalMonthlySpending) * 100 : 0;

    return {
      ...card,
      saving: Math.floor(netSaving), // 최종 절약 금액
      pickingRate,
      isBest: false
    };
  });

  // 4. 최적 정렬 (Sorting) - 절약 금액(피킹률) 기준 내림차순 정렬
  calculatedCards.sort((a, b) => b.saving - a.saving);
  
  if (calculatedCards.length > 0) {
    calculatedCards[0].isBest = true; // 가장 금전적 이득이 되는 상위 카드 선정
  }

  return calculatedCards as RecommendedCard[];
}

// 계산된 결과를 화면에 렌더링하도록 export
export const recommendedCards: RecommendedCard[] = calculateCardEfficiency(rawCards);
