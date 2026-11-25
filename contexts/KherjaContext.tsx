import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/template';
import { getLocales } from 'expo-localization';
import { loadAccount, saveAccountName, signOutAccount, type KherjaAccount, type Locale } from '@/services/accountService';

interface KherjaContextValue {
  session: Session | null; account: KherjaAccount | null; locale: Locale; loading: boolean; accountError: string;
  setLocale: (locale: Locale) => void; retryAccount: () => Promise<void>; saveName: (name: string) => Promise<void>; logout: () => Promise<void>;
}
export const KherjaContext = createContext<KherjaContextValue | undefined>(undefined);
export function KherjaProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<KherjaAccount | null>(null);
  const [locale, setLocale] = useState<Locale>('fr');
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const alive = useRef(true);
  const generation = useRef(0);
  useEffect(() => {
    alive.current = true;
    setLocale(getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'fr');
    const client = getSupabaseClient();
    let observed = false;
    const { data: listener } = client.auth.onAuthStateChange((_event, next) => {
      observed = true;
      if (alive.current) { setSession(next); setLoading(false); }
    });
    void client.auth.getSession().then(({ data, error }) => {
      if (!alive.current || observed) return;
      if (error) setAccountError(error.message);
      setSession(data.session); setLoading(false);
    }).catch((error: Error) => { if (alive.current) { setAccountError(error.message); setLoading(false); } });
    return () => { alive.current = false; listener.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    const current = ++generation.current;
    setAccount(null); setAccountError('');
    if (!session) return;
    void loadAccount(session).then((value) => {
      if (alive.current && generation.current === current) { setAccount(value); setLocale(value.locale); }
    }).catch((error: Error) => { if (alive.current && generation.current === current) setAccountError(error.message); });
  }, [session?.user.id]);
  const retryAccount = async () => {
    if (!session) return;
    setAccountError('');
    try { const value = await loadAccount(session); if (alive.current) setAccount(value); }
    catch (error) { if (alive.current) setAccountError(error instanceof Error ? error.message : 'Network error'); }
  };
  const saveName = async (name: string) => {
    if (!session) throw new Error('Session unavailable');
    const value = await saveAccountName(session.user.id, name);
    if (alive.current) setAccount(value);
  };
  const logout = async () => { await signOutAccount(); };
  return <KherjaContext.Provider value={{ session, account, locale, loading, accountError, setLocale, retryAccount, saveName, logout }}>{children}</KherjaContext.Provider>;
}
