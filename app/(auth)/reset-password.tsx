import { FormComponent } from "@/components/form/Form";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { formFields, newPasswordFields } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token, email } = useLocalSearchParams<{
    token: string;
    email: string;
  }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call to reset password
      // await resetPassword(token, newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success", "Your password has been reset successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}>
          <ThemedView
            style={[styles.content, { backgroundColor: theme.background }]}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.tint + "15" },
              ]}>
              <Ionicons name="key-outline" size={64} color={theme.tint} />
            </View>

            {/* Title & Description */}
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Reset Password
            </ThemedText>

            <ThemedText style={[styles.description, { color: theme.icon }]}>
              Create a new password for your account
            </ThemedText>

            {email && (
              <ThemedText style={[styles.email, { color: theme.icon }]}>
                {email}
              </ThemedText>
            )}

            <FormComponent
              fields={newPasswordFields}
              onSubmit={onSubmit}
              submitButtonText="Reset Password"
              isLoading={loading}
            />

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <ThemedText
                style={[styles.requirementsTitle, { color: theme.icon }]}>
                Password must contain:
              </ThemedText>
              <View style={styles.requirement}>
                <Ionicons
                  name={
                    newPassword.length >= 8
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={newPassword.length >= 8 ? "#10B981" : theme.icon}
                />
                <ThemedText
                  style={[styles.requirementText, { color: theme.icon }]}>
                  At least 8 characters
                </ThemedText>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={
                    /[A-Z]/.test(newPassword)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={/[A-Z]/.test(newPassword) ? "#10B981" : theme.icon}
                />
                <ThemedText
                  style={[styles.requirementText, { color: theme.icon }]}>
                  One uppercase letter
                </ThemedText>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={
                    /[a-z]/.test(newPassword)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={/[a-z]/.test(newPassword) ? "#10B981" : theme.icon}
                />
                <ThemedText
                  style={[styles.requirementText, { color: theme.icon }]}>
                  One lowercase letter
                </ThemedText>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={
                    /\d/.test(newPassword)
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={/\d/.test(newPassword) ? "#10B981" : theme.icon}
                />
                <ThemedText
                  style={[styles.requirementText, { color: theme.icon }]}>
                  One number
                </ThemedText>
              </View>
            </View>

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              style={styles.loginLinkContainer}>
              <ThemedText style={[styles.loginLink, { color: theme.tint }]}>
                Back to Login
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </KeyboardAvoidingView>
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
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  email: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  requirementsContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLinkContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
