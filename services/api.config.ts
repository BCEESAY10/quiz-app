import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

// Base URL from environment variable
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Token management
export const TOKEN_KEY = "auth_token";

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
};

export const setToken = async (token: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = async (): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
};

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      await removeToken();
    }
    return Promise.reject(error);
  },
);
