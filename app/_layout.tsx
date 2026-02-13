import { CustomDrawerContent } from "@/components/CustomDrawerContent";
import { Sidebar } from "@/components/Sidebar";
import { ThemedView } from "@/components/themed-view";
import { QueryProvider } from "@/provider/QueryProvider";
import { ThemeProvider, useAppTheme } from "@/provider/ThemeProvider";
import { AuthProvider, useAuth } from "@/provider/UserProvider";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { BackHandler, Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import ReviewModal from "./modal";

export const unstable_settings = {
  anchor: "(tabs)",
};

export function AuthGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const isAuthRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password");

    if (!user && !isAuthRoute) {
      if (Platform.OS !== "web") {
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => true,
        );
        router.replace("/login");
        return () => backHandler.remove();
      } else {
        router.replace("/login");
      }
    } else if (user && isAuthRoute) {
      router.replace("/");
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    if (Platform.OS !== "web" || loading) return;

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();

      const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

      if (user && isAuthRoute) {
        router.replace("/");
      } else if (!user && isAuthRoute) {
        router.replace("/login");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user, pathname, loading, router]);

  if (loading) return null;

  return null;
}

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width >= 768;

  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <AuthGate />
          <InnerLayout isWeb={isWeb} />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

function InnerLayout({ isWeb }: { isWeb: boolean }) {
  const { theme, colorScheme } = useAppTheme();
  const segment = useSegments();
  const isAuthPage = segment[0] === "(auth)";
  const [showReviewModal, setShowReviewModal] = useState(false);

  if (isWeb) {
    return (
      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: theme.background,
        }}>
        {!isAuthPage && (
          <>
            <Sidebar onReviewClick={() => setShowReviewModal(true)} />

            <ReviewModal
              visible={showReviewModal}
              onClose={() => setShowReviewModal(false)}
              onSubmitSuccess={() => setShowReviewModal(false)}
              onDontAskAgain={() => setShowReviewModal(false)}
            />
          </>
        )}
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
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.background }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            onReviewClick={() => setShowReviewModal(true)}
          />
        )}
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
          }}
        />

        <Drawer.Screen
          name="scores"
          options={{
            title: "Scores",
            headerShown: true,
          }}
        />
      </Drawer>
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmitSuccess={() => setShowReviewModal(false)}
        onDontAskAgain={() => setShowReviewModal(false)}
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </GestureHandlerRootView>
  );
}
