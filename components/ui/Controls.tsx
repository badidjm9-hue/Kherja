import { memo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface ButtonProps { label: string; onPress: () => void; busy?: boolean; disabled?: boolean; secondary?: boolean; accessibilityLabel?: string }
export const Button = memo(function Button({ label, onPress, busy = false, disabled = false, secondary = false, accessibilityLabel }: ButtonProps) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} disabled={busy || disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary ? styles.secondary : null, (busy || disabled) ? styles.disabled : null, pressed ? styles.pressed : null]}>
    {secondary ? <Text style={styles.secondaryLabel}>{label}</Text> : <LinearGradient colors={[theme.colors.violet, theme.colors.violetDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>{busy ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.buttonLabel}>{label}</Text>}</LinearGradient>}
  </Pressable>;
});
interface FieldProps extends TextInputProps { label: string; icon: keyof typeof Ionicons.glyphMap; rtl?: boolean }
export const Field = memo(function Field({ label, icon, rtl = false, secureTextEntry = false, ...props }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  return <View style={styles.fieldWrap}>
    <Text style={[styles.fieldLabel, rtl ? styles.rtlText : null]}>{label}</Text>
    <View style={[styles.field, focused ? styles.focused : null, rtl ? styles.rtlRow : null]}>
      <Ionicons name={icon} size={19} color={theme.colors.text} />
      <TextInput {...props} accessibilityLabel={label} secureTextEntry={secureTextEntry && !visible} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholderTextColor={theme.colors.subtle} style={[styles.input, rtl && props.keyboardType !== 'phone-pad' && props.keyboardType !== 'number-pad' ? styles.rtlText : null]} />
      {secureTextEntry ? <Pressable accessibilityRole="button" accessibilityLabel={visible ? (rtl ? 'إخفاء كلمة المرور' : 'Masquer le mot de passe') : (rtl ? 'إظهار كلمة المرور' : 'Afficher le mot de passe')} onPress={() => setVisible(!visible)} style={({ pressed }) => [styles.eye, pressed ? styles.pressed : null]}><Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={19} color={theme.colors.subtle} /></Pressable> : null}
    </View>
  </View>;
});
interface FeedbackProps { error: string; notice: string; rtl?: boolean }
export const Feedback = memo(function Feedback({ error, notice, rtl }: FeedbackProps) {
  if (!error && !notice) return null;
  return <View accessibilityLiveRegion="polite" style={[styles.feedback, rtl ? styles.rtlRow : null]}><Ionicons name={error ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={20} color={error ? theme.colors.error : theme.colors.success} /><Text selectable style={[styles.feedbackText, { color: error ? theme.colors.error : theme.colors.success }, rtl ? styles.rtlText : null]}>{error || notice}</Text></View>;
});
const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: theme.radius.md, overflow: 'hidden', width: '100%' },
  gradient: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.space.md },
  buttonLabel: { color: theme.colors.white, fontSize: theme.type.body, fontWeight: '700', includeFontPadding: false },
  secondary: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', padding: theme.space.sm },
  secondaryLabel: { color: theme.colors.violet, fontSize: theme.type.body, fontWeight: '600' },
  disabled: { opacity: 0.5 }, pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  fieldWrap: { gap: theme.space.xs }, fieldLabel: { fontSize: theme.type.small, fontWeight: '500', color: theme.colors.subtle },
  field: { minHeight: 50, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, backgroundColor: theme.colors.surface, paddingHorizontal: theme.space.md, flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  focused: { borderColor: theme.colors.violet }, input: { flex: 1, minWidth: 1, fontSize: theme.type.body, color: theme.colors.text, paddingVertical: theme.space.sm, includeFontPadding: false },
  eye: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -theme.space.sm },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' }, rtlRow: { flexDirection: 'row-reverse' },
  feedback: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.sm, padding: theme.space.md, backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm },
  feedbackText: { flex: 1, fontSize: theme.type.small, lineHeight: 22 },
});
