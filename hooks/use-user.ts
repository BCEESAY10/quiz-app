import { useAuth } from "@/provider/UserProvider";
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  userApi,
} from "@/services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

export const useUpdateProfile = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => {
      if (!user?.id) throw new Error("User not authenticated");
      return userApi.updateProfile(user.id, data);
    },
    onSuccess: async (response) => {
      // Update user in context
      if (user) {
        const updatedUser = {
          ...user,
          fullName: response.fullname,
          email: response.email,
        };

        setUser(updatedUser);

        // Update storage
        const userData = JSON.stringify(updatedUser);
        if (Platform.OS === "web") {
          localStorage.setItem("loggedInUser", userData);
        } else {
          await AsyncStorage.setItem("loggedInUser", userData);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest & { userId: string }) => {
      return userApi.changePassword(data.userId, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    },
  });
};

export const useDeleteAccount = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return userApi.deleteAccount(user.id);
    },
  });
};

export const useUserStats = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => userApi.getUserStats(userId),
    enabled: enabled && !!userId,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true, // Refetch when app regains focus
    refetchInterval: 60000, // Refetch every 60 seconds for continuous updates
  });
};
