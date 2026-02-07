import { useAuth } from "@/provider/UserProvider";
import { authApi } from "@/services/authApi";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: () => {
      // Invalidate any cached data if needed
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogin = () => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: async (response) => {
      // Convert API user format to app user format
      const user = {
        id: response.user.id,
        fullName: response.user.fullname,
        email: response.user.email,
        password: "", // Don't store password
        stats: {
          quizzesCompleted: 0,
          totalPoints: 0,
          streak: 0,
        },
      };

      // Store user in context
      setUser(user);

      // Also store user in storage for persistence
      const userData = JSON.stringify(user);
      if (Platform.OS === "web") {
        localStorage.setItem("loggedInUser", userData);
      } else {
        await AsyncStorage.setItem("loggedInUser", userData);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      // Clear all cached data
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => authApi.resetPassword(token, password, confirmPassword),
  });
};
