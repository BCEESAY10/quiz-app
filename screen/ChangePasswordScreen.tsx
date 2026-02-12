import { FormComponent } from "@/components/form/Form";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Toast } from "@/components/ui/toast";
import { useChangePassword } from "@/hooks/use-user";
import { useAppTheme } from "@/provider/ThemeProvider";
import { useAuth } from "@/provider/UserProvider";
import { ToastState } from "@/types/toast";
import { changePasswordFields } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const changePasswordMutation = useChangePassword();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const onSubmit = async (data: any) => {
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        userId: user.id,
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setToast({ message: "Password updated", type: "success" });
      setResetSignal((current) => current + 1);
      router.replace("/settings");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error?.message ||
        "Failed to change password. Please check your current password and try again.";
      setToast({ message: errorMessage, type: "error" });
      setResetSignal((current) => current + 1);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["right", "left", "bottom"]}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
              <Ionicons name="shield-checkmark" size={64} color={theme.tint} />
            </View>

            {/* Title & Description */}
            <ThemedText style={[styles.title, { color: theme.text }]}>
              Change Password
            </ThemedText>

            <ThemedText style={[styles.description, { color: theme.icon }]}>
              Please enter your current password and choose a new secure
              password
            </ThemedText>

            {/* Form */}
            <FormComponent
              fields={changePasswordFields}
              onSubmit={onSubmit}
              submitButtonText="Change Password"
              isLoading={changePasswordMutation.isPending}
              resetSignal={resetSignal}
            />
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
    paddingBottom: 40,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    maxWidth: 600,
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
  requirementsContainer: {
    marginTop: 24,
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
  tipsContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
});
