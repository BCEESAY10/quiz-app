import { FormComponent } from "@/components/form/Form";
import { Toast } from "@/components/ui/toast";
import { Colors } from "@/constants/theme";
import { LoginFormData } from "@/types/auth";
import { ToastState } from "@/types/toast";
import { loginUser } from "@/utils/mock-auth";
import { loginFields } from "@/utils/validation";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      await new Promise((res) => setTimeout(res, 800));

      const user = loginUser(data.email, data.password);
      if (!user) throw new Error("Invalid credentials");

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setToast({ message: "Login successful!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Login Failed!", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleNavigateToRegister = () => {
    router.push("/register");
  };

  const handleForgotPassword = () => {
    // Handle forgot password
    console.log("Forgot password");
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
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          contentContainerStyle={[
            styles.scrollContent,
            isWideScreen && styles.scrollContentWide,
          ]}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.contentContainer,
              isWideScreen && styles.contentContainerWide,
            ]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.logo, { color: theme.text }]}>
                🧠 QuizMaster
              </Text>
              <Text style={[styles.title, { color: theme.tint }]}>
                Welcome Back!
              </Text>
              <Text style={[styles.subtitle, { color: theme.icon }]}>
                Sign in to continue your learning journey
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formWrapper}>
              {toast && (
                <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
                />
              )}
              <FormComponent
                fields={loginFields}
                onSubmit={onSubmit}
                submitButtonText="Sign In"
                isLoading={isLoading}
              />

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[styles.dividerLine, { backgroundColor: theme.icon }]}
              />
              <Text style={[styles.dividerText, { color: theme.icon }]}>
                OR
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: theme.icon }]}
              />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.text }]}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleNavigateToRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContentWide: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
  },
  contentContainerWide: {
    maxWidth: 480,
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
  formWrapper: {
    marginBottom: 24,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#5B48E8",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8EAED",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  registerLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B48E8",
  },
});
