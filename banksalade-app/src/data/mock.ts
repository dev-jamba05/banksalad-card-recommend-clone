import { RecommendedCard, Transaction } from '../types';

// 1. 20대 대학생 페르소나 랜덤 결제 내역 생성기
function generateUniversityStudentTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const categories = [
    { name: '식비', icon: '🍔', monthlyAvg: 350000, count: 20 },
    { name: '카페', icon: '☕', monthlyAvg: 100000, count: 15 },
    { name: '교통', icon: '🚇', monthlyAvg: 80000, count: 40 },
    { name: '쇼핑', icon: '🛍️', monthlyAvg: 100000, count: 4 },
    { name: '통신', icon: '📱', monthlyAvg: 50000, count: 1 },
    { name: '편의점', icon: '🏪', monthlyAvg: 50000, count: 10 },
  ];

  let idCounter = 1;
  const today = new Date();

  categories.forEach((cat) => {
    // 각 카테고리별로 랜덤하게 쪼개서 생성
    for (let i = 0; i < cat.count; i++) {
      const baseAmount = cat.monthlyAvg / cat.count;
      const randomVariance = baseAmount * 0.4 * (Math.random() - 0.5); // +- 20%
      let amount = Math.floor((baseAmount + randomVariance) / 100) * 100; // 100원 단위
      
      // 통신비처럼 1건인 경우 정확한 금액 설정
      if (cat.count === 1) amount = cat.monthlyAvg;

      // 최근 30일 이내의 랜덤 날짜
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const txDate = new Date(today.getTime());
      txDate.setDate(today.getDate() - randomDaysAgo);
      const formattedDate = txDate.toISOString().split('T')[0];

      transactions.push({
        id: idCounter++,
        date: formattedDate,
        name: `(주)${cat.name} 가맹점`,
        amount: -amount,
        category: cat.name,
        icon: cat.icon,
      });
    }
  });

  // 날짜 내림차순 정렬
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return transactions;
}

// 대학생 페르소나의 랜덤 결제 내역 (약 90건)
export const transactions: Transaction[] = generateUniversityStudentTransactions();

// 2. 실제 대한민국 인기 신용카드 데이터 (전월 실적 30만원 충족 가정)
const rawCards = [
  {
    id: 'kb-toktok-d',
    name: 'KB국민 톡톡D 카드',
    color: '#ffc107',
    annualFee: 12000,
    benefits: [
      { category: '식비', desc: '배달앱(배민/요기요 등) 50% 할인', discountRate: 0.5, maxLimit: 10000 },
      { category: '교통', desc: '대중교통 5% 할인', discountRate: 0.05, maxLimit: 3000 },
      { category: '편의점', desc: '편의점 5% 할인', discountRate: 0.05, maxLimit: 3000 }
    ]
  },
  {
    id: 'samsung-taptap-o',
    name: '삼성카드 taptap O',
    color: '#0054a6',
    annualFee: 10000,
    benefits: [
      { category: '카페', desc: '스타벅스 50% 할인 등', discountRate: 0.3, maxLimit: 10000 },
      { category: '교통', desc: '대중교통/택시 10% 할인', discountRate: 0.1, maxLimit: 5000 },
      { category: '통신', desc: '이동통신요금 10% 할인', discountRate: 0.1, maxLimit: 5000 },
      { category: '쇼핑', desc: '오픈마켓 7% 할인', discountRate: 0.07, maxLimit: 5000 }
    ]
  },
  {
    id: 'shinhan-mr-life',
    name: '신한카드 Mr.Life',
    color: '#1d3557',
    annualFee: 15000,
    benefits: [
      { category: '편의점', desc: '편의점 10% 할인', discountRate: 0.1, maxLimit: 10000 },
      { category: '식비', desc: '식음료(야간) 10% 할인', discountRate: 0.1, maxLimit: 10000 },
      { category: '통신', desc: '통신요금 10% 할인', discountRate: 0.1, maxLimit: 3000 }
    ]
  },
  {
    id: 'hyundai-zero-ed2',
    name: '현대카드 ZERO Edition2',
    color: '#8d99ae',
    annualFee: 10000,
    benefits: [
      { category: '식비', desc: '생활필수영역 1.5% 할인', discountRate: 0.015, maxLimit: 999999 },
      { category: '편의점', desc: '생활필수영역 1.5% 할인', discountRate: 0.015, maxLimit: 999999 },
      { category: '교통', desc: '생활필수영역 1.5% 할인', discountRate: 0.015, maxLimit: 999999 },
      { category: '카페', desc: '전가맹점 0.7% 할인', discountRate: 0.007, maxLimit: 999999 },
      { category: '쇼핑', desc: '전가맹점 0.7% 할인', discountRate: 0.007, maxLimit: 999999 },
      { category: '통신', desc: '전가맹점 0.7% 할인', discountRate: 0.007, maxLimit: 999999 }
    ]
  }
];

// 3. 소비 데이터 그룹화 (Map-Reduce)
const monthlySpendingByCategory = transactions.reduce((acc, tx) => {
  if (tx.amount < 0) {
    const amount = Math.abs(tx.amount);
    acc[tx.category] = (acc[tx.category] || 0) + amount;
  }
  return acc;
}, {} as Record<string, number>);

// 총 지출액 계산
const totalMonthlySpending = Object.values(monthlySpendingByCategory).reduce((sum, val) => sum + val, 0);

// 4. 혜택 매칭 및 피킹률 산출 함수
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

    // 피킹률 산출: (예상 총 할인 금액 - 월환산 연회비) / 총 지출액 * 100
    const monthlyAnnualFee = Math.floor(card.annualFee / 12);
    const netSaving = totalDiscount - monthlyAnnualFee;
    
    const pickingRate = totalMonthlySpending > 0 ? (netSaving / totalMonthlySpending) * 100 : 0;

    return {
      id: card.id,
      name: card.name,
      color: card.color,
      annualFee: card.annualFee,
      benefits: card.benefits.map(b => ({ category: b.category, desc: b.desc })),
      saving: Math.floor(netSaving), // 최종 절약 금액
      pickingRate,
      isBest: false
    };
  });

  // 5. 최적 정렬 (Sorting) - 절약 금액(피킹률) 기준 내림차순 정렬
  calculatedCards.sort((a, b) => b.saving - a.saving);
  
  if (calculatedCards.length > 0) {
    calculatedCards[0].isBest = true; // 가장 금전적 이득이 되는 상위 카드 선정
  }

  // TypeScript의 RecommendedCard 타입에 맞춰서 반환
  return calculatedCards as any as RecommendedCard[];
}

export const recommendedCards: RecommendedCard[] = calculateCardEfficiency(rawCards);
