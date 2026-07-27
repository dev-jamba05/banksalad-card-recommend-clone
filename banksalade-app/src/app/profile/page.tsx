'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

export default function ProfilePage() {
  const { state, updateUser, notify, logout } = useApp();
  const router = useRouter();

  /* 로그인 확인 */
  useEffect(() => {
    if (!state.auth.isLoading && !state.auth.isAuthenticated) {
      router.replace('/login');
    }
  }, [state.auth, router]);

  const user = state.auth.user;

  /* ── 프로필 정보 폼 ── */
  const [name,  setName]  = useState(user?.name  ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  /* ── 비밀번호 변경 폼 ── */
  const [pwModal, setPwModal] = useState(false);
  const [curPw,   setCurPw]  = useState('');
  const [newPw,   setNewPw]  = useState('');
  const [cfPw,    setCfPw]   = useState('');
  const [pwErr,   setPwErr]  = useState('');
  const [savingPw, setSavingPw] = useState(false);

  /* ── 알림 설정 ── */
  const [notif, setNotif] = useState(
    user?.notifications ?? { email: true, sms: true, push: false, marketing: false }
  );

  /* ── 프로필 이미지 ── */
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { notify('error', '이미지는 2MB 이하만 업로드 가능합니다.'); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { notify('error', '이름을 입력해주세요.'); return; }
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name, email, phone });
    notify('success', '프로필이 저장되었습니다.');
    setSavingProfile(false);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr('');
    if (!curPw) { setPwErr('현재 비밀번호를 입력해주세요.'); return; }
    if (newPw.length < 6) { setPwErr('새 비밀번호는 최소 6자 이상이어야 합니다.'); return; }
    if (newPw !== cfPw)   { setPwErr('새 비밀번호가 일치하지 않습니다.'); return; }
    setSavingPw(true);
    await new Promise((r) => setTimeout(r, 1000));
    notify('success', '비밀번호가 변경되었습니다.');
    setSavingPw(false);
    setPwModal(false);
    setCurPw(''); setNewPw(''); setCfPw('');
  }

  function toggleNotif(key: keyof typeof notif) {
    const next = { ...notif, [key]: !notif[key] };
    setNotif(next);
    updateUser({ notifications: next });
    notify('info', '알림 설정이 저장되었습니다.');
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  if (state.auth.isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  const NOTIF_LABELS: { key: keyof typeof notif; label: string; desc: string }[] = [
    { key: 'email',     label: '이메일 알림',   desc: '거래 내역, 소비 리포트를 이메일로 받습니다' },
    { key: 'sms',       label: 'SMS 알림',      desc: '결제 승인, 보안 알림을 문자로 받습니다' },
    { key: 'push',      label: '푸시 알림',     desc: '앱 푸시 알림을 받습니다' },
    { key: 'marketing', label: '마케팅 수신',   desc: '혜택, 이벤트 정보를 받습니다' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">

      {/* 프로필 헤더 */}
      <motion.div {...fadeUp(0)}
        className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-2xl card-shadow"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="relative flex-shrink-0">
          <button
            onClick={() => fileRef.current?.click()}
            aria-label="프로필 이미지 변경"
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-3xl font-bold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="프로필" className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </button>
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-xs bg-white shadow border"
            style={{ borderColor: 'var(--border-color)' }}>
            📷
          </span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{user.name} 님</h1>
          <p className="text-sm" style={{ color: 'var(--text-sub)' }}>{user.email}</p>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#e6f7ef', color: 'var(--primary)' }}>
            {user.membership}
          </span>
        </div>
      </motion.div>

      {/* 기본 정보 수정 */}
      <motion.form onSubmit={saveProfile} {...fadeUp(0.06)}
        className="p-6 rounded-2xl card-shadow flex flex-col gap-4"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <h2 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>기본 정보 수정</h2>
        <Input label="이름" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="이메일" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="휴대전화" name="phone" placeholder="010-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="flex justify-end">
          <Button type="submit" loading={savingProfile} size="md">저장하기</Button>
        </div>
      </motion.form>

      {/* 비밀번호 변경 */}
      <motion.div {...fadeUp(0.1)}
        className="p-6 rounded-2xl card-shadow flex items-center justify-between"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>비밀번호 변경</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>주기적으로 변경하면 보안에 도움이 됩니다</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPwModal(true)}>변경</Button>
      </motion.div>

      {/* 알림 설정 */}
      <motion.div {...fadeUp(0.13)}
        className="p-6 rounded-2xl card-shadow flex flex-col gap-4"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <h2 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>알림 설정</h2>
        {NOTIF_LABELS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b last:border-0"
            style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>{desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={notif[key]}
              onClick={() => toggleNotif(key)}
              className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              style={{ backgroundColor: notif[key] ? 'var(--primary)' : 'var(--border-color)' }}
            >
              <motion.span
                animate={{ x: notif[key] ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* 로그아웃 */}
      <motion.div {...fadeUp(0.16)} className="flex justify-end">
        <Button variant="danger" size="sm" onClick={handleLogout}>로그아웃</Button>
      </motion.div>

      {/* 비밀번호 변경 모달 */}
      <Modal isOpen={pwModal} onClose={() => { setPwModal(false); setPwErr(''); }} title="비밀번호 변경">
        <form onSubmit={savePassword} className="flex flex-col gap-4">
          {pwErr && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200">{pwErr}</div>
          )}
          <Input label="현재 비밀번호" type="password" name="curPw"
            value={curPw} onChange={(e) => setCurPw(e.target.value)} required autoFocus />
          <Input label="새 비밀번호" type="password" name="newPw" hint="6자 이상"
            value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
          <Input label="새 비밀번호 확인" type="password" name="cfPw"
            value={cfPw} onChange={(e) => setCfPw(e.target.value)} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setPwModal(false)}>취소</Button>
            <Button type="submit" loading={savingPw} className="flex-1">변경하기</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
