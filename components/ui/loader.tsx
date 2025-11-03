import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface AuthLoaderProps {
  message?: string;
}

export const Loader: React.FC<AuthLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Brain emoji */}
        <Text style={styles.logo}>🧠</Text>

        {/* App name */}
        <Text style={styles.appName}>QuizMaster</Text>

        {/* Loader */}
        <ActivityIndicator size="large" color="#5B48E8" style={styles.loader} />

        {/* Loading message */}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#5B48E8",
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  loader: {
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});
