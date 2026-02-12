import { apiClient } from "./api.config";

export interface UpdateProfileRequest {
  fullname?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  id: string;
  fullname: string;
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface DeleteAccountResponse {
  message: string;
}

export interface UserActivity {
  category: string;
  score: number;
  percentage: number;
  takenAt: string;
}

export interface UserStats {
  total_quizzes: number;
  total_points: number;
  streak: number;
  longest_streak: number;
}

export const userApi = {
  updateProfile: async (
    userId: string,
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> => {
    const response = await apiClient.patch<UpdateProfileResponse>(
      `/user/${userId}`,
      data,
    );
    return response.data;
  },

  changePassword: async (
    userId: string,
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.patch<ChangePasswordResponse>(
      `/user/${userId}/password`,
      data,
    );
    return response.data;
  },

  deleteAccount: async (userId: string): Promise<DeleteAccountResponse> => {
    const response = await apiClient.delete<DeleteAccountResponse>(
      `/user/${userId}`,
    );
    return response.data;
  },

  getActivities: async (userId: string): Promise<UserActivity[]> => {
    const response = await apiClient.get<UserActivity[]>(
      `/user/${userId}/activities`,
    );
    return response.data;
  },

  getUserStats: async (userId: string): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>(`/user/${userId}/stats`);
    return response.data;
  },
};
