import { CustomDrawerContent } from "@/components/CustomDrawerContent";
import { Sidebar } from "@/components/Sidebar";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { AuthProvider, useAuth } from "@/provider/UserProvider";
import { Stack, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
      <AuthGate />
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
  const segment = useSegments();
  const isAuthPage = segment[0] === "(auth)";

  if (isWeb) {
    return (
      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: theme.background,
        }}>
        {!isAuthPage && <Sidebar />}
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

  // Mobile: Drawer + Tabs Navigation
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthGate />
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerStyle: {
              width: 280,
              backgroundColor: theme.background,
            },
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            drawerType: "front",
          }}>
          {/* Main tabs - bottom tab navigation */}
          <Drawer.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              drawerLabel: "Home",
              title: "QuizMaster",
            }}
          />

          {/* Auth screens - hidden from drawer */}
          <Drawer.Screen
            name="(auth)"
            options={{
              headerShown: false,
              drawerItemStyle: { display: "none" },
            }}
          />

          {/* Additional screens in drawer */}
          <Drawer.Screen
            name="quiz"
            options={{
              title: "Quiz",
              headerShown: true,
              drawerLabel: "Quiz",
            }}
          />

          <Drawer.Screen
            name="scores"
            options={{
              title: "Scores",
              headerShown: true,
              drawerLabel: "Scores",
            }}
          />

          {/* Modal - hidden from drawer */}
          <Drawer.Screen
            name="modal"
            options={{
              title: "Modal",
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
