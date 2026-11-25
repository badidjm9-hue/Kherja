import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button, Feedback, Field } from '@/components/ui/Controls';
import type { EntryFlow } from '@/hooks/useEntryFlow';
interface AuthScreenProps { flow: EntryFlow }
export const AuthScreen = memo(function AuthScreen({ flow }: AuthScreenProps) {
  const { strings: t, mode } = flow;
  const rtl = flow.locale === 'ar';
  return <View style={styles.page}>
    <Text style={styles.title}>{mode === 'login' ? t.login : mode === 'register' ? t.register : t.otpTitle}</Text>
    <Text style={styles.subtitle}>{mode === 'login' ? t.loginSub : mode === 'register' ? t.registerSub : t.otpSub}</Text>
    <View style={styles.form}>
      {mode === 'register' ? <Field label={t.name} icon="person-outline" rtl={rtl} value={flow.name} onChangeText={flow.setName} autoComplete="name" maxLength={100} editable={!flow.busy} /> : null}
      <Field label={t.phone} icon="call-outline" value={flow.phone} rtl={rtl} onChangeText={flow.setPhone} keyboardType="phone-pad" autoComplete="tel" placeholder="0550 00 00 00" editable={!flow.busy && mode !== 'otp'} maxLength={20} />
      {mode === 'otp' ? <Field label={t.code} icon="shield-checkmark-outline" rtl={rtl} value={flow.code} onChangeText={flow.setCode} keyboardType="number-pad" autoComplete="sms-otp" textContentType="oneTimeCode" maxLength={8} editable={!flow.busy} /> : <Field label={t.password} icon="lock-closed-outline" rtl={rtl} value={flow.password} onChangeText={flow.setPassword} secureTextEntry autoComplete={mode === 'register' ? 'new-password' : 'current-password'} editable={!flow.busy} />}
      {mode === 'register' ? <Field label={t.confirm} icon="lock-closed-outline" rtl={rtl} value={flow.confirm} onChangeText={flow.setConfirm} secureTextEntry autoComplete="new-password" editable={!flow.busy} /> : null}
      <Feedback error={flow.error} notice={flow.notice} rtl={rtl} />
      <Button label={mode === 'login' ? t.signIn : mode === 'register' ? t.signUp : t.verify} onPress={flow.submit} busy={flow.busy} />
      {mode === 'otp' ? <Button secondary label={flow.cooldown ? `${t.resend} (${flow.cooldown}s)` : t.resend} onPress={flow.resend} disabled={flow.busy || flow.cooldown > 0} /> : <View style={[styles.switchRow, rtl ? styles.reverse : null]}><Text style={styles.small}>{mode === 'login' ? t.noAccount : t.already}</Text><Pressable accessibilityRole="button" disabled={flow.busy} onPress={flow.switchMode} style={({ pressed }) => [styles.switch, pressed ? styles.pressed : null]}><Text style={styles.link}>{mode === 'login' ? t.register : t.signIn}</Text></Pressable></View>}
    </View>
    <View style={[styles.notice, rtl ? styles.reverse : null]}><Ionicons name="information-circle-outline" size={20} color={theme.colors.subtle} /><Text style={[styles.noticeText, rtl ? styles.rtl : null]}>{t.smsNotice}</Text></View>
    {flow.role === 'driver' ? <Text style={[styles.driverNotice, rtl ? styles.rtl : null]}>{t.verificationNotice}</Text> : null}
  </View>;
});
const styles = StyleSheet.create({
  page: { flex: 1, minHeight: 560, padding: theme.space.lg, paddingTop: theme.space.lg, backgroundColor: theme.colors.surface },
  title: { textAlign: 'center', fontSize: theme.type.title, color: theme.colors.text, fontWeight: '700' },
  subtitle: { textAlign: 'center', color: theme.colors.text, fontSize: theme.type.body, marginTop: theme.space.sm, lineHeight: 24 },
  form: { marginTop: theme.space.xl, gap: theme.space.md }, switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: theme.space.xs },
  small: { color: theme.colors.subtle, fontSize: theme.type.small }, switch: { minHeight: 48, justifyContent: 'center', paddingHorizontal: theme.space.xs },
  link: { color: theme.colors.violet, fontWeight: '600', fontSize: theme.type.small }, notice: { marginTop: theme.space.lg, padding: theme.space.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', gap: theme.space.sm },
  noticeText: { flex: 1, fontSize: theme.type.small, lineHeight: 22, color: theme.colors.subtle }, driverNotice: { marginTop: theme.space.md, fontSize: theme.type.small, lineHeight: 22, color: theme.colors.subtle },
  reverse: { flexDirection: 'row-reverse' }, rtl: { textAlign: 'right', writingDirection: 'rtl' }, pressed: { opacity: 0.6 },
});
