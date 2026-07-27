export const transactions = [
  { id: 1, date: '2026-04-10', name: '배달의민족', amount: -25000, category: '식비', icon: '🍕' },
  { id: 2, date: '2026-04-09', name: '(주)슬레이드', amount: 3500000, category: '급여', icon: '💰' },
  { id: 3, date: '2026-04-09', name: '쿠팡결제', amount: -142000, category: '쇼핑', icon: '🛍️' },
  { id: 4, date: '2026-04-08', name: '지하철', amount: -45000, category: '교통', icon: '🚇' },
  { id: 5, date: '2026-04-08', name: '스타벅스', amount: -16000, category: '카페', icon: '☕' },
];

export const recommendedCards = [
  {
    id: 'gourmet-meal',
    name: '고메 식사 카드',
    saving: 6900,
    benefits: [
      { category: '식비', desc: '모든 음식점 10% 할인' },
      { category: '카페', desc: '스타벅스/폴바셋 20% 할인' }
    ],
    color: '#ff6b6b'
  },
  {
    id: 'shopping-master',
    name: '쇼핑 마스터 카드',
    saving: 23150,
    benefits: [
      { category: '쇼핑', desc: '쿠팡/무신사 15% 할인' },
      { category: '식비', desc: '점심시간 식당 5% 할인' }
    ],
    color: '#3a82ee',
    isBest: true
  }
];
