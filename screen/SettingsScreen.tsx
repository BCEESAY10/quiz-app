import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppTheme } from "@/provider/ThemeProvider";
import { useAuth } from "@/provider/UserProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;

  // Theme settings
  const { colorScheme, setColorScheme, theme } = useAppTheme();

  const isDarkMode = colorScheme === "dark";

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = () => {
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setIsEditingProfile(false);
  };

  const handleToggle = () => {
    const newValue = !isDarkMode;
    setColorScheme(newValue ? "dark" : "light");
  };

  const handleChangePassword = () => {
    router.push("/settings/change-password");
  };

  const handleDeleteAccount = () => {
    if (isWeb) {
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
    }
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            console.log("Account deletion requested");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "right", "left"]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isWideScreen ? styles.wideContainer : undefined,
        ]}>
        {/* Profile Section */}
        <ThemedView
          style={[
            styles.section,
            isWideScreen && styles.wideSection,
            isWeb && styles.profileSection,
            { backgroundColor: theme.background },
          ]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
              Profile Settings
            </ThemedText>
            {!isEditingProfile && (
              <TouchableOpacity
                onPress={() => setIsEditingProfile(true)}
                style={styles.editButton}>
                <Ionicons name="pencil" size={18} color={theme.tint} />
                <ThemedText
                  style={[styles.editButtonText, { color: theme.tint }]}>
                  Edit
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: theme.icon }]}>
                Full Name
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.tabIconDefault,
                  },
                  !isEditingProfile && styles.inputDisabled,
                ]}
                value={fullName}
                onChangeText={setFullName}
                editable={isEditingProfile}
                placeholder="Enter your full name"
                placeholderTextColor={theme.icon}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: theme.icon }]}>
                Email
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.tabIconDefault,
                  },
                  !isEditingProfile && styles.inputDisabled,
                ]}
                value={email}
                onChangeText={setEmail}
                editable={isEditingProfile}
                placeholder="Enter your email"
                placeholderTextColor={theme.icon}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {isEditingProfile && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { borderColor: theme.tabIconDefault },
                  ]}>
                  <ThemedText
                    style={[styles.buttonText, { color: theme.text }]}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={[
                    styles.button,
                    styles.saveButton,
                    { backgroundColor: theme.primaryButton.background },
                  ]}>
                  <ThemedText
                    style={[
                      styles.buttonText,
                      { color: theme.primaryButton.text },
                    ]}>
                    Save Changes
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ThemedView>

        {/* Theme & Preferences Section */}
        <ThemedView
          style={[
            styles.section,
            isWideScreen && styles.wideSection,
            { backgroundColor: theme.background },
          ]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance & Preferences
          </ThemedText>

          <View
            style={[
              styles.settingItem,
              { borderBottomColor: theme.tabIconDefault },
            ]}
            pointerEvents="box-none">
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color={theme.text} />
              <ThemedText style={[styles.settingText, { color: theme.text }]}>
                Dark Mode
              </ThemedText>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={handleToggle}
              trackColor={{ false: "#D1D5DB", true: theme.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
        </ThemedView>

        {/* Security Section */}
        <ThemedView
          style={[
            styles.section,
            isWideScreen && styles.wideSection,
            { backgroundColor: theme.background },
          ]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Security
          </ThemedText>

          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              styles.settingItem,
              { borderBottomColor: theme.tabIconDefault },
            ]}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={theme.text}
              />
              <ThemedText style={[styles.settingText, { color: theme.text }]}>
                Change Password
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>
        </ThemedView>

        {/* Danger Zone */}
        <ThemedView
          style={[
            styles.section,
            isWideScreen && styles.wideSection,
            { backgroundColor: theme.background },
          ]}>
          <ThemedText style={[styles.sectionTitle, { color: "#EF4444" }]}>
            Danger Zone
          </ThemedText>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={[styles.dangerButton, { borderColor: "#EF4444" }]}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <ThemedText style={[styles.dangerButtonText, { color: "#EF4444" }]}>
              Delete Account
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView
          style={[styles.bottomPadding, { backgroundColor: theme.background }]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  wideContainer: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 0,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  wideSection: {
    paddingVertical: 16,
  },
  profileSection: {
    marginBottom: 150,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    // backgroundColor set inline
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 40,
  },
});
