import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Toast } from "@/components/ui/toast";
import { useResetPassword } from "@/hooks/use-auth";
import { useAppTheme } from "@/provider/ThemeProvider";
import { ToastState } from "@/types/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, step } = useLocalSearchParams<{
    email: string;
    step?: string;
  }>();
  const { theme } = useAppTheme();

  const [currentStep, setCurrentStep] = useState<"pin" | "password">(
    (step as "pin" | "password") || "pin",
  );
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const resetPasswordMutation = useResetPassword();
  const isLoading = resetPasswordMutation.isPending;

  const handlePinSubmit = async () => {
    if (!pin || pin.length !== 6) {
      setToast({
        message: "Please enter a valid 6-digit PIN",
        type: "error",
      });
      return;
    }

    // PIN is extracted, move to password step
    setCurrentStep("password");
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setToast({
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 8) {
      setToast({
        message: "Password must be at least 8 characters",
        type: "error",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token: pin,
        password: newPassword,
        confirmPassword,
      });

      setToast({
        message: "Password reset successfully!",
        type: "success",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error?.message ||
        "Failed to reset password";
      setToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "right", "left"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedView
            style={[styles.content, { backgroundColor: theme.background }]}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.tint + "15" },
              ]}>
              <Ionicons
                name={
                  currentStep === "pin" ? "key-outline" : "lock-closed-outline"
                }
                size={64}
                color={theme.tint}
              />
            </View>

            {/* Toast */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}

            {/* PIN Step */}
            {currentStep === "pin" ? (
              <>
                <ThemedText style={[styles.title, { color: theme.text }]}>
                  Enter PIN Code
                </ThemedText>

                <ThemedText style={[styles.description, { color: theme.icon }]}>
                  Enter the 6-digit PIN code sent to your email
                </ThemedText>

                {email && (
                  <ThemedText style={[styles.email, { color: theme.tint }]}>
                    {email}
                  </ThemedText>
                )}

                <TextInput
                  style={[
                    styles.pinInput,
                    {
                      borderColor: theme.tint,
                      color: theme.text,
                      backgroundColor: theme.tabIconDefault + "10",
                    },
                  ]}
                  placeholder="000000"
                  placeholderTextColor={theme.icon}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pin}
                  onChangeText={setPin}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  onPress={handlePinSubmit}
                  disabled={isLoading || pin.length !== 6}
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor:
                        pin.length === 6 ? theme.tint : theme.tabIconDefault,
                      opacity: isLoading ? 0.6 : 1,
                    },
                  ]}>
                  <ThemedText style={[styles.submitButtonText]}>
                    {isLoading ? "Verifying..." : "Continue"}
                  </ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ThemedText style={[styles.title, { color: theme.text }]}>
                  Create New Password
                </ThemedText>

                <ThemedText style={[styles.description, { color: theme.icon }]}>
                  Enter your new password
                </ThemedText>

                {/* New Password */}
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: theme.tabIconDefault },
                  ]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="New Password"
                    placeholderTextColor={theme.icon}
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={theme.icon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: theme.tabIconDefault },
                  ]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={theme.icon}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color={theme.icon}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handlePasswordSubmit}
                  disabled={isLoading || !newPassword || !confirmPassword}
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor:
                        newPassword && confirmPassword
                          ? theme.tint
                          : theme.tabIconDefault,
                      opacity: isLoading ? 0.6 : 1,
                    },
                  ]}>
                  <ThemedText style={[styles.submitButtonText]}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCurrentStep("pin")}
                  style={styles.backStepButton}>
                  <ThemedText
                    style={[styles.backStepText, { color: theme.tint }]}>
                    Back to PIN Entry
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login */}
            {currentStep === "pin" && (
              <TouchableOpacity
                onPress={() => router.replace("/login")}
                style={styles.backToLoginButton}>
                <ThemedText
                  style={[styles.backToLoginText, { color: theme.tint }]}>
                  Back to Login
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
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
  disabledButton: {
    opacity: 0.6,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 16,
  },
  pinInput: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 12,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
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
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backStepButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  backStepText: {
    fontSize: 14,
    fontWeight: "600",
  },
  backToLoginButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backToLoginText: {
    fontSize: 14,
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
