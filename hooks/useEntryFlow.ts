import { useCallback, useEffect, useRef, useState } from 'react';
import { useKherja } from '@/hooks/useKherja';
import { getStrings } from '@/constants/translations';
import { isAlgerianPhone, loginWithPhone, registerWithPhone, resendPhoneCode, verifyPhone, type AccountRole } from '@/services/accountService';

export function useEntryFlow() {
  const shared = useKherja();
  const strings = getStrings(shared.locale);
  const [stage, setStage] = useState<'splash' | 'intro' | 'role' | 'auth'>('splash');
  const [slide, setSlide] = useState(0);
  const [role, setRole] = useState<AccountRole>('customer');
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const mounted = useRef(true);
  const locked = useRef(false);
  useEffect(() => { mounted.current = true; const timer = setTimeout(() => setStage('intro'), 1400); return () => { mounted.current = false; clearTimeout(timer); }; }, []);
  useEffect(() => { if (cooldown <= 0) return; const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000); return () => clearTimeout(timer); }, [cooldown]);
  useEffect(() => { if (shared.account) setName(shared.account.full_name); }, [shared.account?.full_name]);
  const run = useCallback(async (action: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError(''); setNotice('');
    try { await action(); } catch (failure) { if (mounted.current) setError(failure instanceof Error ? failure.message : 'Network error'); }
    finally { locked.current = false; if (mounted.current) setBusy(false); }
  }, []);
  const submit = () => {
    if (!isAlgerianPhone(phone)) { setError(strings.phoneError); return; }
    if (mode === 'otp') {
      if (!/^\d{4,8}$/.test(code.trim())) { setError(strings.codeError); return; }
      void run(async () => { await verifyPhone(phone, code.trim()); setPassword(''); setConfirm(''); setCode(''); });
      return;
    }
    if (password.length < 6) { setError(strings.passError); return; }
    if (mode === 'register') {
      if (name.trim().length < 2) { setError(strings.nameError); return; }
      if (password !== confirm) { setError(strings.confirmError); return; }
      void run(async () => { const state = await registerWithPhone(phone, password, name, role, shared.locale); if (state === 'otp' && mounted.current) { setMode('otp'); setCooldown(60); } });
    } else void run(async () => { await loginWithPhone(phone, password); setPassword(''); setConfirm(''); });
  };
  const resend = () => { if (cooldown > 0) return; void run(async () => { await resendPhoneCode(phone); if (mounted.current) { setCooldown(60); setNotice(strings.sent); } }); };
  const save = () => {
    if (name.trim().length < 2) { setError(strings.nameError); return; }
    void run(async () => { await shared.saveName(name); if (mounted.current) setNotice(strings.saved); });
  };
  const logout = () => { void run(async () => { await shared.logout(); if (mounted.current) { setStage('role'); setMode('login'); setPassword(''); setConfirm(''); setCode(''); setName(''); setPhone(''); } }); };
  const selectRole = (value: AccountRole) => { setRole(value); setStage('auth'); setMode('login'); setError(''); setNotice(''); };
  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setNotice(''); setCode(''); };
  const back = () => { setError(''); setNotice(''); if (stage === 'auth' && mode === 'otp') setMode('register'); else if (stage === 'auth') setStage('role'); else setStage('intro'); };
  const next = () => { if (slide < 2) setSlide(slide + 1); else setStage('role'); };
  return { ...shared, strings, stage, slide, role, mode, name, phone, password, confirm, code, busy, error, notice, cooldown,
    setName, setPhone, setPassword, setConfirm, setCode, selectRole, switchMode, submit, resend, save, logout, back, next, skip: () => setStage('role') };
}
export type EntryFlow = ReturnType<typeof useEntryFlow>;
