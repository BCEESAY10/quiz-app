import { ToastProps, ToastType } from "@/types/toast";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  const config: Record<
    ToastType,
    {
      icon: keyof typeof Ionicons.glyphMap;
      bgColor: string;
      borderColor: string;
      iconColor: string;
      textColor: string;
    }
  > = {
    success: {
      icon: "checkmark-circle",
      bgColor: "#f0fdf4",
      borderColor: "#22c55e",
      iconColor: "#22c55e",
      textColor: "#166534",
    },
    error: {
      icon: "alert-circle",
      bgColor: "#fef2f2",
      borderColor: "#ef4444",
      iconColor: "#ef4444",
      textColor: "#991b1b",
    },
    warning: {
      icon: "warning",
      bgColor: "#fefce8",
      borderColor: "#eab308",
      iconColor: "#eab308",
      textColor: "#854d0e",
    },
  };

  const { icon, bgColor, borderColor, iconColor, textColor } = config[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}>
      <View
        style={[
          styles.toast,
          { backgroundColor: bgColor, borderLeftColor: borderColor },
        ]}>
        <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          activeOpacity={0.7}>
          <Ionicons name="close" size={18} color={iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 16,
    left: 16,
    zIndex: 9999,
    maxWidth: 400,
    alignSelf: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 2,
  },
});
