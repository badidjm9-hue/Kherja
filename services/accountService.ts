import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/template';

export type AccountRole = 'customer' | 'driver';
export type Locale = 'fr' | 'ar';
export interface KherjaAccount { user_id: string; full_name: string; phone: string | null; role: AccountRole; locale: Locale }
export function normalizePhone(value: string): string {
  const clean = value.replace(/[\s()-]/g, '');
  if (/^0[567]\d{8}$/.test(clean)) return `+213${clean.slice(1)}`;
  if (/^[567]\d{8}$/.test(clean)) return `+213${clean}`;
  return clean;
}
export function isAlgerianPhone(value: string): boolean { return /^\+213[567]\d{8}$/.test(normalizePhone(value)); }
export async function loginWithPhone(phone: string, password: string) {
  const { error } = await getSupabaseClient().auth.signInWithPassword({ phone: normalizePhone(phone), password });
  if (error) throw new Error(error.message);
}
export async function registerWithPhone(phone: string, password: string, name: string, role: AccountRole, locale: Locale) {
  const { data, error } = await getSupabaseClient().auth.signUp({ phone: normalizePhone(phone), password, options: { data: { full_name: name.trim(), requested_role: role, locale } } });
  if (error) throw new Error(error.message);
  if (data.session) return 'verified' as const;
  return 'otp' as const;
}
export async function verifyPhone(phone: string, token: string) {
  const { error } = await getSupabaseClient().auth.verifyOtp({ phone: normalizePhone(phone), token, type: 'sms' });
  if (error) throw new Error(error.message);
}
export async function resendPhoneCode(phone: string) {
  const { error } = await getSupabaseClient().auth.resend({ type: 'sms', phone: normalizePhone(phone) });
  if (error) throw new Error(error.message);
}
export async function signOutAccount() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw new Error(error.message);
}
export async function loadAccount(session: Session): Promise<KherjaAccount> {
  const client = getSupabaseClient();
  const { data, error } = await client.from('kherja_accounts').select('user_id,full_name,phone,role,locale').eq('user_id', session.user.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data as KherjaAccount;
  const metadata = session.user.user_metadata ?? {};
  const account: KherjaAccount = {
    user_id: session.user.id, full_name: metadata.full_name ?? '', phone: session.user.phone ?? null,
    role: metadata.requested_role === 'driver' ? 'driver' : 'customer', locale: metadata.locale === 'ar' ? 'ar' : 'fr',
  };
  const { data: created, error: creationError } = await client.from('kherja_accounts').upsert(account, { onConflict: 'user_id', ignoreDuplicates: true }).select().maybeSingle();
  if (creationError) throw new Error(creationError.message);
  if (created) return created as KherjaAccount;
  const { data: existing, error: retryError } = await client.from('kherja_accounts').select('*').eq('user_id', session.user.id).single();
  if (retryError) throw new Error(retryError.message);
  return existing as KherjaAccount;
}
export async function saveAccountName(userId: string, name: string): Promise<KherjaAccount> {
  const { data, error } = await getSupabaseClient().from('kherja_accounts').update({ full_name: name.trim() }).eq('user_id', userId).select().single();
  if (error) throw new Error(error.message);
  return data as KherjaAccount;
}
