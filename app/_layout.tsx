import { AuthProvider } from "@/auth/AuthProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>

            {/* MAIN APP (tabs navigator) */}
            <Stack.Screen name="(tabs)" />

            {/* AUTH SCREENS */}
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/complete-profile" />
            <Stack.Screen name="(auth)/preferences" />

            {/* OTHER SCREENS */}
            <Stack.Screen
              name="edit-profile"
              options={{
                headerShown: true,
                title: "Edit Profile",
              }}
            />

            <Stack.Screen
              name="call/[userId]"
              options={{
                headerShown: true,
                title: "Call",
              }}
            />

          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}