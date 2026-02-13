import { FormComponent } from "@/components/form/Form";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Toast } from "@/components/ui/toast";
import { useForgotPassword } from "@/hooks/use-auth";
import { useAppTheme } from "@/provider/ThemeProvider";
import { ToastState } from "@/types/toast";
import { resetPasswordField } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const forgotPasswordMutation = useForgotPassword();
  const isLoading = forgotPasswordMutation.isPending;

  const onSubmit = async (data: any) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setSentEmail(data.email);
      setToast({
        message: "Reset link successfully sent to your email",
        type: "success",
      });
      setEmailSent(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link";
      setToast({
        message: errorMessage,
        type: "error",
      });
      console.error("Link sent failed:", error);
    }
  };

  const handleResendEmail = async () => {
    setEmailSent(false);

    try {
      await forgotPasswordMutation.mutateAsync(sentEmail);
      setEmailSent(true);
      setToast({ message: "Reset link resent successfully!", type: "success" });
    } catch (error: any) {
      console.error("Resent link failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend link";
      setToast({
        message: errorMessage,
        type: "error",
      });
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

              {toast && (
                <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
                />
              )}

              <ThemedText style={[styles.description, { color: theme.icon }]}>
                We&apos;ve sent a password reset link to
              </ThemedText>

              <ThemedText style={[styles.email, { color: theme.tint }]}>
                {sentEmail}
              </ThemedText>

              <ThemedText style={[styles.description, { color: theme.icon }]}>
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </ThemedText>

              {/* Resend Link */}
              <View style={styles.resendContainer}>
                <ThemedText style={[styles.resendText, { color: theme.icon }]}>
                  Didn&apos;t receive the email?
                </ThemedText>
                <TouchableOpacity
                  onPress={handleResendEmail}
                  disabled={isLoading}>
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
              No worries! Enter your email address and we&apos;ll send you a
              link to reset your password.
            </ThemedText>

            {/* Email Input */}
            <FormComponent
              fields={resetPasswordField}
              onSubmit={onSubmit}
              submitButtonText="Send Reset Link"
              isLoading={isLoading}
            />

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
