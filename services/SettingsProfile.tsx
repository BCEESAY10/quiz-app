import { SettingsProfileProps } from "@/types/settings";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const SettingsProfile: React.FC<SettingsProfileProps> = ({
  user,
  onLogout,
  onUpdateProfile,
  onChangePassword,
  onDeleteAccount,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        onLogout();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: onLogout },
      ]);
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (confirmed && onDeleteAccount) {
        onDeleteAccount();
      }
    } else {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: onDeleteAccount,
          },
        ]
      );
    }
  };

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    dangerous?: boolean
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={dangerous ? "#ef4444" : "#5B48E8"}
          style={styles.settingIcon}
        />
        <Text style={[styles.settingTitle, dangerous && styles.dangerousText]}>
          {title}
        </Text>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons
          name={icon}
          size={24}
          color="#5B48E8"
          style={styles.settingIcon}
        />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: "#A78BFA" }}
        thumbColor={value ? "#5B48E8" : "#F3F4F6"}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>

        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Edit Profile Button */}
          {onUpdateProfile && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onUpdateProfile(user)}>
              <Ionicons name="create-outline" size={20} color="#5B48E8" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {onUpdateProfile &&
            renderSettingItem("person-outline", "Edit Profile", () =>
              onUpdateProfile(user)
            )}
          {onChangePassword &&
            renderSettingItem(
              "lock-closed-outline",
              "Change Password",
              onChangePassword
            )}
          {renderSettingItem("mail-outline", "Email Preferences", () =>
            console.log("Email preferences")
          )}
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.card}>
          {renderSwitchItem(
            "notifications-outline",
            "Push Notifications",
            notifications,
            setNotifications
          )}
          {renderSwitchItem(
            "volume-high-outline",
            "Sound Effects",
            soundEffects,
            setSoundEffects
          )}
          {renderSwitchItem("moon-outline", "Dark Mode", darkMode, setDarkMode)}
        </View>
      </View>

      {/* Other Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          {renderSettingItem("help-circle-outline", "Help & Support", () =>
            console.log("Help")
          )}
          {renderSettingItem("document-text-outline", "Terms of Service", () =>
            console.log("Terms")
          )}
          {renderSettingItem("shield-checkmark-outline", "Privacy Policy", () =>
            console.log("Privacy")
          )}
          {renderSettingItem("information-circle-outline", "About", () =>
            console.log("About")
          )}
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.card}>
          {renderSettingItem(
            "log-out-outline",
            "Logout",
            handleLogout,
            undefined,
            false
          )}
          {onDeleteAccount &&
            renderSettingItem(
              "trash-outline",
              "Delete Account",
              handleDeleteAccount,
              undefined,
              true
            )}
        </View>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>QuizMaster v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5B48E8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  joinedDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5B48E8",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5B48E8",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  dangerousText: {
    color: "#ef4444",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
