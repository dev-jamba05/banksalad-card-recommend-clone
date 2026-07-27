'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (step === 3) {
      // Simulate data fetching
      const timer = setTimeout(async () => {
        await login('test@test.com', 'password123'); // Bypass login logic for visual flow
        router.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, router, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="text-5xl mb-4">🥗</div>
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#68B67D' }}>BankSalade</h1>
            <p className="text-sm mb-10 font-medium" style={{ color: 'var(--text-sub)' }}>
              나보다 나를 더 잘 아는<br/>금융 건강 코치, 뱅크샐러드
            </p>
            <button
              onClick={nextStep}
              className="px-16 py-3 rounded-lg text-white font-bold text-base"
              style={{ backgroundColor: '#68B67D' }}
            >
              시작하기
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="text-5xl mb-6">📊</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>금융 데이터를 연결해볼까요?</h2>
            <p className="text-sm mb-10" style={{ color: 'var(--text-sub)' }}>
              뱅크샐러드의 AI가 흩어져 있는 내역을 분석하여<br/>똑똑한 절약 가이드를 만들어드립니다.
            </p>
            <button
              onClick={nextStep}
              className="px-12 py-3 rounded-lg text-white font-bold text-base"
              style={{ backgroundColor: '#68B67D' }}
            >
              데이터 연동하기
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="mb-6">
              <svg className="animate-spin h-10 w-10" style={{ color: '#68B67D' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-base font-medium" style={{ color: '#68B67D' }}>
              나의 소비를 정밀 분석 중이에요...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
