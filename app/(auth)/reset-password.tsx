import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
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

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters with uppercase, lowercase, and number"
      );
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

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: theme.icon }]}>
                New Password
              </ThemedText>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.tabIconDefault,
                  },
                ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.icon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter new password"
                  placeholderTextColor={theme.icon}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: theme.icon }]}>
                Confirm Password
              </ThemedText>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.tabIconDefault,
                  },
                ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.icon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirm new password"
                  placeholderTextColor={theme.icon}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color={theme.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

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

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              style={[
                styles.submitButton,
                { backgroundColor: theme.tint },
                loading && styles.disabledButton,
              ]}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.submitButtonText}>
                  Reset Password
                </ThemedText>
              )}
            </TouchableOpacity>

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
