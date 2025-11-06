import { ThemedText } from "@/components/themed-text";
import { Avatar } from "@/components/ui/avatar";
import { useAppTheme } from "@/provider/ThemeProvider";
import { useAuth } from "@/provider/UserProvider";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppTheme();

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: "home-outline",
      path: "/",
      onPress: () => {
        props.navigation.closeDrawer();
        router.push("/(tabs)");
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings-outline",
      path: "/settings",
      onPress: () => {
        props.navigation.closeDrawer();
        router.push("/settings");
      },
    },
  ];

  const handleLogout = () => {
    props.navigation.closeDrawer();
    logout();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <DrawerContentScrollView {...props} scrollEnabled={true}>
        {/* Brand */}
        <View
          style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 }}>
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme.text,
              textAlign: "center",
            }}>
            🧠 QuizMaster
          </ThemedText>
        </View>

        {/* User Profile */}
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <Avatar fullName={user?.fullName || "User"} />
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginTop: 12,
              color: theme.text,
            }}>
            {user?.fullName || "User"}
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: theme.icon }}>
            {user?.email || "user@example.com"}
          </ThemedText>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: theme.tabIconDefault,
            marginHorizontal: 20,
            marginVertical: 8,
          }}
        />

        {/* Menu Items */}
        <View style={{ paddingTop: 16, paddingHorizontal: 12 }}>
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(item.path);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginBottom: 4,
                  backgroundColor: isActive ? theme.tint + "15" : "transparent",
                }}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={isActive ? theme.tint : theme.text}
                />
                <ThemedText
                  style={{
                    marginLeft: 16,
                    fontSize: 16,
                    color: isActive ? theme.tint : theme.text,
                    fontWeight: "500",
                  }}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Logout at bottom */}
      <View style={{ paddingBottom: 30, paddingHorizontal: 12 }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <ThemedText
            style={{
              marginLeft: 16,
              fontSize: 16,
              color: "#EF4444",
              fontWeight: "500",
            }}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
