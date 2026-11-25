import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useEntryFlow } from '@/hooks/useEntryFlow';
import { WelcomeScreen } from '@/components/feature/WelcomeScreen';
import { RoleScreen } from '@/components/feature/RoleScreen';
import { AuthScreen } from '@/components/feature/AuthScreen';
import { AccountScreen } from '@/components/feature/AccountScreen';

export default function EntryPage() {
  const flow = useEntryFlow();
  const rtl = flow.locale === 'ar';
  const canGoBack = !flow.session && (flow.stage === 'role' || flow.stage === 'auth');
  return <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
    <StatusBar style="dark" />
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>
      <View style={styles.shell}>
        <View style={[styles.toolbar, rtl ? styles.reverse : null]}>
          {canGoBack ? <Pressable accessibilityRole="button" accessibilityLabel={flow.strings.back} onPress={flow.back} disabled={flow.busy} style={({ pressed }) => [styles.back, pressed ? styles.pressed : null]}><Ionicons name={rtl ? 'chevron-forward' : 'chevron-back'} size={20} color={theme.colors.text} /></Pressable> : <View style={styles.toolbarSpacer} />}
          <Pressable accessibilityRole="button" accessibilityLabel={rtl ? 'Passer en français' : 'التبديل إلى العربية'} onPress={() => flow.setLocale(rtl ? 'fr' : 'ar')} style={({ pressed }) => [styles.language, pressed ? styles.pressed : null]}><Ionicons name="language-outline" color={theme.colors.violet} size={17} /><Text style={styles.languageText}>{rtl ? 'Français' : 'العربية'}</Text></Pressable>
        </View>
        {flow.loading ? <View style={styles.loading}><ActivityIndicator size="large" color={theme.colors.violet} /></View> : <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {flow.session ? <AccountScreen flow={flow} /> : flow.stage === 'splash' || flow.stage === 'intro' ? <WelcomeScreen flow={flow} /> : flow.stage === 'role' ? <RoleScreen flow={flow} /> : <AuthScreen flow={flow} />}
        </ScrollView>}
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas }, keyboard: { flex: 1, alignItems: 'center' },
  shell: { flex: 1, width: '100%', maxWidth: 440, backgroundColor: theme.colors.surface },
  toolbar: { minHeight: 56, paddingHorizontal: theme.space.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.surface },
  toolbarSpacer: { width: 48, height: 48 }, back: { height: 48, width: 48, alignItems: 'center', justifyContent: 'center' },
  language: { flexDirection: 'row', gap: theme.space.sm, minHeight: 48, alignItems: 'center', paddingHorizontal: theme.space.sm },
  languageText: { fontSize: theme.type.small, fontWeight: '600', color: theme.colors.violet }, reverse: { flexDirection: 'row-reverse' }, pressed: { opacity: 0.6 },
  scroll: { flex: 1 }, content: { flexGrow: 1 }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
