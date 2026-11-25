import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Controls';
import type { EntryFlow } from '@/hooks/useEntryFlow';
interface WelcomeScreenProps { flow: EntryFlow }
export const WelcomeScreen = memo(function WelcomeScreen({ flow }: WelcomeScreenProps) {
  const splash = flow.stage === 'splash';
  const headlines = [flow.strings.travel, flow.strings.citySlide, flow.strings.safeSlide];
  const captions = [flow.strings.travelSub, flow.strings.citySlideSub, flow.strings.safeSlideSub];
  return <View style={styles.page}>
    <Image source={require('@/assets/images/kherja-city.png')} contentFit="cover" transition={200} style={[styles.art, splash ? styles.splashArt : null]} accessibilityLabel={flow.locale === 'ar' ? 'مدينة وسيارة' : 'Illustration de ville et voiture'} />
    <LinearGradient colors={[theme.colors.transparent, theme.colors.surface, theme.colors.surface]} locations={[0, 0.3, 1]} style={styles.fade} />
    {splash ? <View style={styles.splashBrand}><View style={styles.logo}><Ionicons name="location" size={84} color={theme.colors.aqua} /><View style={styles.logoRoute}><Ionicons name="navigate" size={36} color={theme.colors.text} /></View></View><Text style={styles.brand}>KHERJA</Text><Text style={styles.tagline}>{flow.strings.tagline}</Text></View> : <View style={styles.bottom}>
      <Text style={styles.brand}>KHERJA</Text><Text style={styles.title}>{headlines[flow.slide]}</Text><Text style={styles.subtitle}>{captions[flow.slide]}</Text>
      <View style={styles.dots}><View style={[styles.dot, flow.slide === 0 ? styles.activeDot : null]} /><View style={[styles.dot, flow.slide === 1 ? styles.activeDot : null]} /><View style={[styles.dot, flow.slide === 2 ? styles.activeDot : null]} /></View>
      <Button label={flow.slide === 0 ? flow.strings.start : flow.strings.next} onPress={flow.next} />
      <Pressable accessibilityRole="button" onPress={flow.skip} style={({ pressed }) => [styles.skip, pressed ? styles.pressed : null]}><Text style={styles.link}>{flow.strings.skip}</Text></Pressable>
    </View>}
  </View>;
});
const styles = StyleSheet.create({
  page: { flex: 1, minHeight: 560, backgroundColor: theme.colors.surface },
  art: { position: 'absolute', top: 0, width: '100%', height: '65%' }, splashArt: { top: '30%', height: '70%' },
  fade: { position: 'absolute', bottom: 0, width: '100%', height: '56%' },
  bottom: { marginTop: 'auto', paddingHorizontal: theme.space.xl, paddingBottom: theme.space.md, alignItems: 'center', gap: theme.space.md },
  brand: { fontSize: theme.type.brand, fontWeight: '800', letterSpacing: -1.5, color: theme.colors.text, includeFontPadding: false },
  title: { fontSize: theme.type.section, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  subtitle: { fontSize: theme.type.body, lineHeight: 24, color: theme.colors.subtle, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: theme.space.sm, paddingVertical: theme.space.md },
  dot: { height: 6, width: 6, borderRadius: 3, backgroundColor: theme.colors.muted }, activeDot: { backgroundColor: theme.colors.violet },
  skip: { minHeight: 48, justifyContent: 'center', paddingHorizontal: theme.space.lg }, link: { color: theme.colors.violet, fontSize: theme.type.small, fontWeight: '600' },
  pressed: { opacity: 0.6 }, splashBrand: { alignItems: 'center', paddingTop: theme.space.xxl, gap: theme.space.sm },
  logo: { height: 104, width: 104, alignItems: 'center', justifyContent: 'center' }, logoRoute: { position: 'absolute', bottom: 0, right: 5 },
  tagline: { color: theme.colors.text, fontSize: theme.type.small, fontWeight: '600', textAlign: 'center' },
});
