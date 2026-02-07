import { LoginFormData, RegisterFormData } from "@/types/auth";
import { apiClient, removeToken, setToken } from "./api.config";

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authApi = {
  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const requestData: RegisterRequest = {
      fullname: data.fullName,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    };

    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      requestData,
    );
    return response.data;
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const requestData: LoginRequest = {
      email: data.email,
      password: data.password,
    };

    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      requestData,
    );

    // Store token
    if (response.data.accessToken) {
      await setToken(response.data.accessToken);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    // Remove token from storage
    await removeToken();
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      { email },
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<ResetPasswordResponse> => {
    const requestData: ResetPasswordRequest = {
      token,
      password,
      confirm_password: confirmPassword,
    };

    const response = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      requestData,
    );
    return response.data;
  },
};
