import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { KherjaProvider } from '@/contexts/KherjaContext';

export default function RootLayout() {
  return (
    // ⚠️ PRESET: AlertProvider enables showAlert() - DO NOT REMOVE
    <AlertProvider>
      <SafeAreaProvider>
        <KherjaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </KherjaProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}