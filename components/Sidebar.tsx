import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/provider/UserProvider";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Avatar } from "./ui/avatar";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: "home-outline" as const,
      path: "/",
      onPress: () => router.push("/"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings-outline" as const,
      path: "/settings",
      onPress: () => router.push("/settings"),
    },
  ];

  return (
    <ThemedView
      style={[
        styles.sidebar,
        {
          backgroundColor: theme.background,
          borderRightColor: theme.tabIconDefault,
        },
      ]}>
      <ScrollView
        style={[styles.sidebarScroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <ThemedView
          style={[
            styles.profileSection,
            { backgroundColor: theme.background },
          ]}>
          <Avatar fullName={user?.fullName || "User"} />
          <ThemedText style={[styles.userName, { color: theme.text }]}>
            {user?.fullName || "User"}
          </ThemedText>
          <ThemedText style={[styles.userEmail, { color: theme.icon }]}>
            {user?.email || "user@example.com"}
          </ThemedText>
        </ThemedView>

        {/* Divider */}
        <View
          style={[styles.divider, { backgroundColor: theme.tabIconDefault }]}
        />

        {/* Menu Items */}
        <ThemedView
          style={[styles.menuSection, { backgroundColor: theme.background }]}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  isActive && { backgroundColor: theme.tint + "15" },
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? theme.tint : theme.text}
                />
                <ThemedText
                  style={[
                    styles.menuItemText,
                    { color: isActive ? theme.tint : theme.text },
                  ]}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}

          {/* Logout button */}
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={logout}
            activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <ThemedText style={[styles.menuItemText, { color: "#EF4444" }]}>
              Logout
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    height: "100%",
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sidebarScroll: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  menuSection: {
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  logoutItem: {
    marginTop: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
  },
});
