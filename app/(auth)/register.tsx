import { FormComponent } from "@/components/form/Form";
import { Colors } from "@/constants/theme";
import { RegisterFormData } from "@/types/auth";
import { formFields } from "@/utils/validation";
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

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && width >= 768;
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Register data:", data);
      setIsLoading(false);
      // Navigate to home screen or login
      router.push("/");
    }, 1500);
  };

  const handleNavigateToLogin = () => {
    router.push("/login");
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
                Create Account
              </Text>
              <Text style={[styles.subtitle, { color: theme.icon }]}>
                Join thousands of learners around the world
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formWrapper}>
              <FormComponent
                fields={formFields}
                onSubmit={handleRegister}
                submitButtonText="Create Account"
                isLoading={isLoading}
              />

              {/* Terms */}
              <Text style={[styles.termsText, { color: theme.icon }]}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
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

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.text }]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleNavigateToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
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
  termsText: {
    fontSize: 13,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
  termsLink: {
    color: "#5B48E8",
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B48E8",
  },
});
