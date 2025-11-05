import { Sidebar } from "@/components/Sidebar";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/provider/UserProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AuthGate() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [user, loading, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width >= 768;

  return (
    <AuthProvider>
      <InnerLayout theme={theme} isWeb={isWeb} colorScheme={colorScheme} />
    </AuthProvider>
  );
}

function InnerLayout({
  theme,
  isWeb,
  colorScheme,
}: {
  theme: (typeof Colors)["light"];
  isWeb: boolean;
  colorScheme: string | null | undefined;
}) {
  const { user, logout } = useAuth();

  if (isWeb) {
    return (
      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: theme.background,
        }}>
        <Sidebar user={user} onLogout={logout} />
        <ThemedView style={{ flex: 3 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="quiz" />
            <Stack.Screen name="scores" />
          </Stack>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthGate />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
