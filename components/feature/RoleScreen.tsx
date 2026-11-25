import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import type { EntryFlow } from '@/hooks/useEntryFlow';
interface RoleScreenProps { flow: EntryFlow }
export const RoleScreen = memo(function RoleScreen({ flow }: RoleScreenProps) {
  const rtl = flow.locale === 'ar';
  return <View style={styles.page}>
    <Text style={styles.title}>{flow.strings.welcome}</Text><Text style={styles.subtitle}>{flow.strings.choose}</Text>
    <View style={styles.cards}>
      <Pressable accessibilityRole="button" accessibilityLabel={flow.strings.passenger} onPress={() => flow.selectRole('customer')} style={({ pressed }) => [styles.card, rtl ? styles.reverse : null, pressed ? styles.pressed : null]}>
        <View style={[styles.vehicle, styles.car]}><Ionicons name="car-sport-outline" size={48} color={theme.colors.primary} /></View><View style={styles.copy}><Text style={[styles.name, rtl ? styles.rtl : null]}>{flow.strings.passenger}</Text><Text style={[styles.description, rtl ? styles.rtl : null]}>{flow.strings.passengerSub}</Text></View><Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={19} color={theme.colors.violet} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={flow.strings.driver} onPress={() => flow.selectRole('driver')} style={({ pressed }) => [styles.card, rtl ? styles.reverse : null, pressed ? styles.pressed : null]}>
        <View style={styles.vehicle}><Ionicons name="bicycle-outline" size={48} color={theme.colors.burgundy} /></View><View style={styles.copy}><Text style={[styles.name, rtl ? styles.rtl : null]}>{flow.strings.driver}</Text><Text style={[styles.description, rtl ? styles.rtl : null]}>{flow.strings.driverSub}</Text></View><Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={19} color={theme.colors.violet} />
      </Pressable>
    </View>
    <Image source={require('@/assets/images/kherja-city.png')} transition={200} contentFit="cover" style={styles.art} />
  </View>;
});
const styles = StyleSheet.create({
  page: { flex: 1, minHeight: 560, paddingTop: theme.space.lg, backgroundColor: theme.colors.surface },
  title: { fontSize: theme.type.title, fontWeight: '700', color: theme.colors.text, textAlign: 'center', paddingHorizontal: theme.space.lg },
  subtitle: { color: theme.colors.text, fontSize: theme.type.body, textAlign: 'center', marginTop: theme.space.sm },
  cards: { paddingHorizontal: theme.space.lg, gap: theme.space.md, marginTop: theme.space.xl, zIndex: 1 },
  card: { minHeight: 108, flexDirection: 'row', alignItems: 'center', gap: theme.space.md, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.white, padding: theme.space.md, shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  vehicle: { width: 64, alignItems: 'center' }, car: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm, height: 64, justifyContent: 'center' },
  copy: { flex: 1 }, name: { fontSize: theme.type.section, color: theme.colors.text, fontWeight: '700' }, description: { color: theme.colors.subtle, fontSize: theme.type.small, marginTop: theme.space.xs, lineHeight: 20 },
  art: { width: '100%', flex: 1, minHeight: 200, marginTop: theme.space.lg },
  reverse: { flexDirection: 'row-reverse' }, rtl: { textAlign: 'right', writingDirection: 'rtl' }, pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});
