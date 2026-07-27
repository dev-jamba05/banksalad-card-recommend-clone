'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendedCards } from '@/data/mock';
import { submitApplication } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

const STEPS = ['개인 정보', '금융 정보', '확인 및 제출'];
const phoneReg = /^01[0-9]-\d{3,4}-\d{4}$/;

interface Form {
  name: string; birth: string; phone: string;
  income: string; job: string; creditScore: string; agree: boolean;
}
type Errors = Partial<Record<keyof Form, string>>;

export default function ApplyPage() {
  const { id }     = useParams<{ id: string }>();
  const router     = useRouter();
  const { notify } = useApp();
  const firstRef   = useRef<HTMLInputElement>(null);

  const card = recommendedCards.find((c) => c.id === id);

  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState<Form>({
    name: '', birth: '', phone: '', income: '', job: '', creditScore: '', agree: false,
  });
  const [errors, setErrors]     = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [doneModal, setDoneModal]   = useState(false);
  const [appId, setAppId]           = useState('');

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg" style={{ color: 'var(--text-sub)' }}>카드를 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => router.push('/products')}>목록으로</Button>
      </div>
    );
  }

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 0) {
      if (!form.name.trim())  e.name  = '이름을 입력해주세요';
      if (!form.birth.trim()) e.birth = '생년월일을 입력해주세요';
      if (!form.phone.trim()) e.phone = '전화번호를 입력해주세요';
      else if (!phoneReg.test(form.phone)) e.phone = '010-0000-0000 형식으로 입력해주세요';
    }
    if (s === 1) {
      if (!form.income.trim()) e.income = '연 소득을 입력해주세요';
      else if (!/^\d+$/.test(form.income)) e.income = '숫자만 입력해주세요';
      if (!form.job.trim()) e.job = '직업을 입력해주세요';
    }
    return e;
  }

  function set(field: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((p) => ({ ...p, [field]: val }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
    setTimeout(() => firstRef.current?.focus(), 100);
  }

  async function handleSubmit() {
    if (!form.agree) { setErrors({ agree: '약관에 동의해주세요' }); return; }
    if (!card) return;
    setSubmitting(true);
    try {
      const res = await submitApplication(card.id, { name: form.name, phone: form.phone, income: form.income });
      setAppId(res.applicationId);
      setDoneModal(true);
      notify('success', '카드 신청이 완료되었습니다!');
    } catch {
      notify('error', '신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 카드 배너 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl mb-8 card-shadow"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ backgroundColor: card.color }} />
        <div>
          <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-sub)' }}>샐러드카드</p>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>{card.name}</h2>
          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            월 +₩{card.saving.toLocaleString()} 절약 예상
          </p>
        </div>
      </motion.div>

      {/* 스텝 인디케이터 */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ backgroundColor: i <= step ? 'var(--primary)' : 'var(--border-color)', color: i <= step ? '#fff' : 'var(--text-sub)' }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              >
                {i < step ? '✓' : i + 1}
              </motion.div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: i === step ? 'var(--text-main)' : 'var(--text-sub)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 rounded" style={{ backgroundColor: 'var(--border-color)' }}>
                <motion.div className="h-full rounded" style={{ backgroundColor: 'var(--primary)' }}
                  animate={{ width: i < step ? '100%' : '0%' }} transition={{ duration: 0.4 }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 폼 카드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-6 sm:p-8 card-shadow"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>개인 정보 입력</h3>
              <Input ref={firstRef} label="성명" name="name" placeholder="홍길동"
                value={form.name} onChange={set('name')} error={errors.name} required autoFocus />
              <Input label="생년월일" name="birth" placeholder="YYYYMMDD"
                value={form.birth} onChange={set('birth')} error={errors.birth} required />
              <Input label="휴대전화" name="phone" placeholder="010-0000-0000"
                value={form.phone} onChange={set('phone')} error={errors.phone} required />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>금융 정보 입력</h3>
              <Input ref={firstRef} label="연 소득 (만원)" name="income" placeholder="예: 4000"
                value={form.income} onChange={set('income')} error={errors.income} required autoFocus
                hint="세전 연 소득을 만원 단위로 입력해주세요" />
              <Input label="직업" name="job" placeholder="예: 직장인, 자영업자"
                value={form.job} onChange={set('job')} error={errors.job} required />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>신용 점수 구간</label>
                <select value={form.creditScore} onChange={set('creditScore')}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                  <option value="">선택해주세요</option>
                  <option value="900+">900점 이상 (매우 우수)</option>
                  <option value="800-899">800~899점 (우수)</option>
                  <option value="700-799">700~799점 (보통)</option>
                  <option value="600-699">600~699점 (주의)</option>
                  <option value="600-">600점 미만</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>신청 내용 확인</h3>
              <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--background)' }}>
                {[['카드명', card.name], ['성명', form.name], ['생년월일', form.birth],
                  ['휴대전화', form.phone], ['연 소득', `${form.income}만원`],
                  ['직업', form.job], ['신용 점수', form.creditScore || '미입력']].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-sub)' }}>{k}</span>
                    <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agree} onChange={set('agree')}
                  className="mt-0.5 w-4 h-4 accent-[color:var(--primary)]" />
                <span className="text-sm" style={{ color: 'var(--text-sub)' }}>
                  개인정보 수집·이용 및 카드 발급 약관에 동의합니다. <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-500 -mt-2">{errors.agree}</p>}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">이전</Button>
            )}
            {step < 2 ? (
              <Button onClick={next} className="flex-1">다음</Button>
            ) : (
              <Button onClick={handleSubmit} loading={submitting} className="flex-1">신청 완료</Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 완료 모달 */}
      <Modal isOpen={doneModal} onClose={() => { setDoneModal(false); router.push('/'); }} title="신청 완료 🎉">
        <div className="text-center py-2">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-bold text-lg mb-2" style={{ color: 'var(--text-main)' }}>카드 신청이 완료되었습니다!</p>
          <p className="text-sm mb-1" style={{ color: 'var(--text-sub)' }}>접수 번호</p>
          <p className="font-mono font-bold text-base mb-6" style={{ color: 'var(--primary)' }}>{appId}</p>
          <Button onClick={() => router.push('/')} className="w-full">홈으로 돌아가기</Button>
        </div>
      </Modal>
    </div>
  );
}
