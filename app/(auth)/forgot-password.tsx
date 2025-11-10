import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call to send reset link
      // await sendPasswordResetEmail(email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setEmailSent(true);
    } catch (error) {
      Alert.alert("Error", "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setEmailSent(false);
    setLoading(true);

    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);
      Alert.alert("Success", "Reset link resent successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to resend link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </TouchableOpacity>

              {/* Success Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.tint + "15" },
                ]}>
                <Ionicons name="mail-outline" size={64} color={theme.tint} />
              </View>

              {/* Success Message */}
              <ThemedText style={[styles.title, { color: theme.text }]}>
                Check Your Email
              </ThemedText>

              <ThemedText style={[styles.description, { color: theme.icon }]}>
                We've sent a password reset link to
              </ThemedText>

              <ThemedText style={[styles.email, { color: theme.tint }]}>
                {email}
              </ThemedText>

              <ThemedText style={[styles.description, { color: theme.icon }]}>
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </ThemedText>

              {/* Resend Link */}
              <View style={styles.resendContainer}>
                <ThemedText style={[styles.resendText, { color: theme.icon }]}>
                  Didn't receive the email?
                </ThemedText>
                <TouchableOpacity
                  onPress={handleResendEmail}
                  disabled={loading}>
                  <ThemedText
                    style={[styles.resendLink, { color: theme.tint }]}>
                    Resend Link
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Back to Login */}
              <TouchableOpacity
                onPress={() => router.replace("/login")}
                style={[
                  styles.backToLoginButton,
                  { borderColor: theme.tabIconDefault },
                ]}>
                <ThemedText
                  style={[styles.backToLoginText, { color: theme.text }]}>
                  Back to Login
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Lock Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.tint + "15" },
              ]}>
              <Ionicons
                name="lock-closed-outline"
                size={64}
                color={theme.tint}
              />
            </View>

            {/* Title & Description */}
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Forgot Password?
            </ThemedText>

            <ThemedText style={[styles.description, { color: theme.icon }]}>
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </ThemedText>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: theme.icon }]}>
                Email Address
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
                  name="mail-outline"
                  size={20}
                  color={theme.icon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.icon}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSendResetLink}
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
                  Send Reset Link
                </ThemedText>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.loginLinkContainer}>
              <ThemedText style={[styles.loginLinkText, { color: theme.icon }]}>
                Remember your password?
              </ThemedText>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <ThemedText style={[styles.loginLink, { color: theme.tint }]}>
                  Back to Login
                </ThemedText>
              </TouchableOpacity>
            </View>
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
    paddingTop: 20,
    paddingBottom: 40,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 24,
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
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loginLinkText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  backToLoginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
