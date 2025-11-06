import { Colors } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import {
  Platform,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web" && width >= 768;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerShadowVisible: false,
        // Hide back button on web when sidebar is visible
        headerLeft: isWeb ? () => null : undefined,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
