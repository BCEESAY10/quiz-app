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

export const userApi = {
  updateProfile: async (
    userId: string,
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> => {
    const response = await apiClient.patch<UpdateProfileResponse>(
      `/users/${userId}`,
      data,
    );
    return response.data;
  },

  changePassword: async (
    userId: string,
    data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.patch<ChangePasswordResponse>(
      `/users/${userId}/password`,
      data,
    );
    return response.data;
  },
};
