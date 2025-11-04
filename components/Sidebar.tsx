import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Avatar } from "./ui/avatar";

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  user: {
    fullName?: string;
    email?: string;
  } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  user,
  onLogout,
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isWeb = Platform.OS === "web";

  //   const handleNavigateToSettings = () => {
  //     onClose();
  //     router.push("/settings");
  //   };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  const menuItems = [
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: "settings-outline" as const,
    //   onPress: handleNavigateToSettings,
    // },
    {
      id: "logout",
      label: "Logout",
      icon: "log-out-outline" as const,
      onPress: handleLogout,
      isDanger: true,
    },
  ];

  const sidebarContent = (
    <ThemedView style={[styles.sidebar, { backgroundColor: theme.background }]}>
      {/* Header with close button for mobile */}
      {!isWeb && (
        <View style={styles.header}>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
            Menu
          </ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* User Profile Section */}
      <ThemedView style={styles.profileSection}>
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
      <ThemedView style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem]}
            onPress={item.onPress}
            activeOpacity={0.7}>
            <Ionicons
              name={item.icon}
              size={22}
              color={item.isDanger ? "#EF4444" : theme.text}
            />
            <ThemedText
              style={[
                styles.menuItemText,
                { color: item.isDanger ? "#EF4444" : theme.text },
              ]}>
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );

  if (isWeb) {
    // For web, render as a fixed sidebar
    if (!isVisible) return null;

    return (
      <>
        {/* Overlay */}
        <TouchableOpacity
          style={styles.webOverlay}
          onPress={onClose}
          activeOpacity={1}
        />
        {/* Sidebar */}
        <View style={styles.webSidebarContainer}>{sidebarContent}</View>
      </>
    );
  }

  // For mobile, use Modal
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalContent}>{sidebarContent}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal styles (Mobile)
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 280,
    height: "100%",
  },
  // Web styles
  webOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  webSidebarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    zIndex: 1000,
  },
  // Sidebar styles
  sidebar: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
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
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
  },
});
