import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
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
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;

  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  // Profile settings (initially from user data)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setIsEditingProfile(false);
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen or show modal
    Alert.alert(
      "Change Password",
      "This will navigate to change password screen"
    );
  };

  const handleDeleteAccount = () => {
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
        contentContainerStyle={isWideScreen && styles.wideContainer}>
        {/* Profile Section */}
        <ThemedView
          style={[
            styles.section,
            isWideScreen && styles.wideSection,
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
                    { backgroundColor: theme.tint },
                  ]}>
                  <ThemedText style={[styles.buttonText, { color: "#FFFFFF" }]}>
                    Save Changes
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ThemedView>

        {/* Theme & Preferences Section */}
        <ThemedView
          style={[styles.section, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance & Preferences
          </ThemedText>

          <View
            style={[
              styles.settingItem,
              { borderBottomColor: theme.tabIconDefault },
            ]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color={theme.text} />
              <ThemedText style={[styles.settingText, { color: theme.text }]}>
                Dark Mode
              </ThemedText>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#D1D5DB", true: theme.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
        </ThemedView>

        {/* Security Section */}
        <ThemedView
          style={[styles.section, { backgroundColor: theme.background }]}>
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
          style={[styles.section, { backgroundColor: theme.background }]}>
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
    paddingVertical: 10,
  },
  backButton: {
    padding: 4,
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
    marginTop: 24,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
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
