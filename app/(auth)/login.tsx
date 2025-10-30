import { FormComponent, FormField } from "@/components/form/Form";
import { Colors } from "@/constants/theme";
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

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;
  const [isLoading, setIsLoading] = useState(false);

  const formFields: FormField<LoginFormData>[] = [
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      keyboardType: "email-address",
      autoCapitalize: "none",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      secureTextEntry: true,
      rules: {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      },
    },
  ];

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login data:", data);
      setIsLoading(false);
      // Navigate to home screen
      router.push("/");
    }, 1500);
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
        {" "}
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
              <FormComponent
                fields={formFields}
                onSubmit={handleLogin}
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
