import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const DEFAULT_WEB_BASE_URL = "http://localhost:5000/api/v1";
const DEFAULT_ANDROID_EMULATOR_BASE_URL = "http://10.0.2.2:5000/api/v1";
const DEFAULT_IOS_SIMULATOR_BASE_URL = "http://localhost:5000/api/v1";

const getDefaultBaseUrl = (): string => {
  if (Platform.OS === "android") {
    return DEFAULT_ANDROID_EMULATOR_BASE_URL;
  }

  if (Platform.OS === "ios") {
    return DEFAULT_IOS_SIMULATOR_BASE_URL;
  }

  return DEFAULT_WEB_BASE_URL;
};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || getDefaultBaseUrl();

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
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      await removeToken();
    }
    return Promise.reject(error);
  },
);
