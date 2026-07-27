'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendedCards } from '@/data/mock';

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const card = recommendedCards.find((c) => c.id === id);

  const [agreements, setAgreements] = useState({
    terms: true,
    privacy: true,
    mydata: true,
    marketing: false,
  });

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg" style={{ color: 'var(--text-sub)' }}>카드를 찾을 수 없습니다.</p>
        <button onClick={() => router.push('/products')} className="px-4 py-2 border rounded-md">목록으로</button>
      </div>
    );
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const toggleAgree = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getProgress = () => {
    if (step === 1) return '25%';
    if (step === 2) return '50%';
    if (step === 3) return '75%';
    return '100%';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full flex flex-col justify-center min-h-[80vh]">
      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full mb-16 mx-auto max-w-md overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
        <motion.div 
          className="h-full rounded-full" 
          style={{ backgroundColor: '#60b67a' }} 
          initial={{ width: 0 }}
          animate={{ width: getProgress() }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full"
          >
            <div className="text-5xl mb-6">🎉</div>
            <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-main)' }}>정말 탁월한 선택이에요!</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>
              {card.name} 발급을 시작할까요?
            </p>
            <div className="rounded-xl p-6 shadow-sm border mb-8 w-full" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
                샐러드카드 {card.name}로<br/>
                월 평균 최대 <span className="font-bold text-lg" style={{ color: '#60b67a' }}>{card.saving.toLocaleString()}원</span>을 절약할 수 있어요.
              </p>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 rounded-xl text-white font-bold text-[15px] transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#60b67a' }}
            >
              네, 발급할게요
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center max-w-md mx-auto w-full"
          >
            <h1 className="text-2xl font-bold mb-10 w-full text-center" style={{ color: 'var(--text-main)' }}>약관에 동의해주세요</h1>
            <div className="flex flex-col gap-4 w-full mb-10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={agreements.terms} onChange={() => toggleAgree('terms')} className="w-5 h-5 accent-[color:#60b67a]" />
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-main)' }}>카드 이용약관 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={agreements.privacy} onChange={() => toggleAgree('privacy')} className="w-5 h-5 accent-[color:#60b67a]" />
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-main)' }}>개인정보 수집 및 이용 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={agreements.mydata} onChange={() => toggleAgree('mydata')} className="w-5 h-5 accent-[color:#60b67a]" />
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-main)' }}>마이데이터 연동 동의 (필수)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={agreements.marketing} onChange={() => toggleAgree('marketing')} className="w-5 h-5 accent-[color:#60b67a]" />
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-main)' }}>마케팅 정보 수신 동의 (선택)</span>
              </label>
            </div>
            <button
              onClick={nextStep}
              disabled={!agreements.terms || !agreements.privacy || !agreements.mydata}
              className="w-full py-4 rounded-xl text-white font-bold text-[15px] transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#60b67a' }}
            >
              동의하고 다음
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center max-w-md mx-auto w-full text-center"
          >
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>거의 다 됐어요!</h1>
            <p className="text-sm mb-10" style={{ color: 'var(--text-sub)' }}>카드 발급을 위한 마지막 정보를 확인합니다.</p>
            
            <div className="rounded-xl shadow-sm border mb-8 w-full overflow-hidden" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
              <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-sub)' }}>신청 카드</span>
                <span className="text-[15px] font-bold" style={{ color: 'var(--text-main)' }}>{card.name}</span>
              </div>
              <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-sub)' }}>배송지</span>
                <span className="text-[15px] font-bold" style={{ color: 'var(--text-main)' }}>서울시 강남구 테헤란로 123</span>
              </div>
              <div className="flex justify-between items-center p-5">
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-sub)' }}>연회비</span>
                <span className="text-[15px] font-bold" style={{ color: 'var(--text-main)' }}>₩12,000 / 년</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 rounded-xl text-white font-bold text-[15px] transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#60b67a' }}
            >
              최종 신청하기
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center max-w-md mx-auto text-center w-full"
          >
            <div className="text-6xl mb-6">🎊</div>
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>신청이 완료되었습니다!</h1>
            <p className="text-[15px] mb-10 font-medium" style={{ color: 'var(--text-sub)', lineHeight: '1.6' }}>
              이제 새로운 소비 생활이 시작됩니다.<br/>
              카드 수령 전까지 <strong>가상 카드</strong>로 바로 결제할 수 있어요.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 rounded-xl text-white font-bold text-[15px] transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#60b67a' }}
              >
                대시보드로 돌아가기 (O)
              </button>
              <button
                onClick={() => router.push('/reports')}
                className="w-full py-4 rounded-xl font-bold text-[15px] transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                나의 분석 리포트 보기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
