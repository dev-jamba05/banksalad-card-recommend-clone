'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/* ── 유효성 검사 ── */
const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwdReg   = /^.{6,}$/;

function validateEmail(v: string) {
  if (!v) return '이메일을 입력해주세요';
  if (!emailReg.test(v)) return '올바른 이메일 형식이 아닙니다';
}
function validatePwd(v: string) {
  if (!v) return '비밀번호를 입력해주세요';
  if (!pwdReg.test(v)) return '비밀번호는 최소 6자 이상이어야 합니다';
}

export default function LoginPage() {
  const router  = useRouter();
  const { state, login } = useApp();

  const [email, setEmail]       = useState('');
  const [pwd,   setPwd]         = useState('');
  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [pwdErr,   setPwdErr]   = useState<string | undefined>();
  const [touched, setTouched]   = useState({ email: false, pwd: false });
  const [submitting, setSubmitting] = useState(false);
  const [generalErr, setGeneralErr] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);

  /* 이미 로그인 상태면 홈으로 */
  useEffect(() => {
    if (state.auth.isAuthenticated) router.replace('/');
  }, [state.auth.isAuthenticated, router]);

  /* 자동 포커스 */
  useEffect(() => { emailRef.current?.focus(); }, []);

  /* 실시간 유효성 검사 */
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (touched.email) setEmailErr(validateEmail(email)); }, [email, touched.email]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (touched.pwd)   setPwdErr(validatePwd(pwd)); },     [pwd,   touched.pwd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, pwd: true });

    const eErr = validateEmail(email);
    const pErr = validatePwd(pwd);
    setEmailErr(eErr);
    setPwdErr(pErr);
    if (eErr || pErr) return;

    setSubmitting(true);
    setGeneralErr('');

    try {
      const ok = await login(email, pwd);
      if (ok) {
        router.push('/');
      } else {
        setGeneralErr('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #e6f7ef 0%, var(--background) 60%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥗</div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>BankSalade</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
            나보다 나를 더 잘 아는 금융 건강 코치
          </p>
        </div>

        {/* 카드 */}
        <div className="rounded-2xl p-8 card-shadow" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-main)' }}>로그인</h2>

          {/* 전체 오류 */}
          <AnimatePresence>
            {generalErr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200"
              >
                {generalErr}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              ref={emailRef}
              label="이메일"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              error={emailErr}
              required
              autoComplete="email"
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              placeholder="6자 이상 입력"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, pwd: true }))}
              error={pwdErr}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              loading={submitting}
              className="w-full mt-2"
              aria-label="로그인 버튼"
            >
              로그인
            </Button>
          </form>

          <p className="text-xs text-center mt-5" style={{ color: 'var(--text-sub)' }}>
            💡 임의 이메일 + 6자 이상 비밀번호로 테스트 가능합니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}
