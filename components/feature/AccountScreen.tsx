import { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button, Feedback, Field } from '@/components/ui/Controls';
import type { EntryFlow } from '@/hooks/useEntryFlow';
interface AccountScreenProps { flow: EntryFlow }
export const AccountScreen = memo(function AccountScreen({ flow }: AccountScreenProps) {
  const t = flow.strings;
  const rtl = flow.locale === 'ar';
  return <View style={styles.page}><Text style={styles.title}>{t.myProfile}</Text>
    <View style={styles.identity}><View style={styles.avatar}><Ionicons name="person-outline" size={48} color={theme.colors.violet} /></View><Text style={styles.name}>{flow.account?.full_name || 'KHERJA'}</Text><Text style={styles.phone}>{flow.session?.user.phone ? `+${flow.session.user.phone.replace(/^\+/, '')}` : ''}</Text><View style={styles.badge}><Text style={styles.badgeText}>{flow.account?.role === 'driver' ? t.driver : t.passenger}</Text></View></View>
    <View style={styles.status}><Ionicons name="construct-outline" size={22} color={theme.colors.violet} /><Text style={[styles.statusTitle, rtl ? styles.rtl : null]}>{t.foundation}</Text><Text style={[styles.statusText, rtl ? styles.rtl : null]}>{t.foundationSub}</Text></View>
    {flow.accountError ? <><Feedback error={flow.accountError} notice="" rtl={rtl} /><Button secondary label={t.retry} onPress={() => { void flow.retryAccount(); }} /></> : flow.account ? <><Field label={t.name} icon="person-outline" rtl={rtl} value={flow.name} onChangeText={flow.setName} editable={!flow.busy} maxLength={100} /><Feedback error={flow.error} notice={flow.notice} rtl={rtl} /><Button label={t.save} onPress={flow.save} busy={flow.busy} /></> : <ActivityIndicator size="large" color={theme.colors.violet} />}
    {flow.accountError ? <Feedback error={flow.error} notice={flow.notice} rtl={rtl} /> : null}
    <Button secondary label={t.logout} onPress={flow.logout} disabled={flow.busy} />
  </View>;
});
const styles = StyleSheet.create({
  page: { flex: 1, minHeight: 560, backgroundColor: theme.colors.surface, padding: theme.space.lg, gap: theme.space.md },
  title: { fontSize: theme.type.section, color: theme.colors.text, fontWeight: '700', textAlign: 'center' },
  identity: { alignItems: 'center', paddingVertical: theme.space.md, gap: theme.space.sm }, avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: theme.type.title, fontWeight: '700', color: theme.colors.text }, phone: { fontSize: theme.type.body, color: theme.colors.subtle },
  badge: { paddingHorizontal: theme.space.md, paddingVertical: theme.space.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.white }, badgeText: { fontSize: theme.type.small, color: theme.colors.violet, fontWeight: '600' },
  status: { padding: theme.space.md, gap: theme.space.sm, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.white },
  statusTitle: { fontSize: theme.type.body, fontWeight: '700', color: theme.colors.text }, statusText: { fontSize: theme.type.small, color: theme.colors.subtle, lineHeight: 22 }, rtl: { textAlign: 'right', writingDirection: 'rtl' },
});
