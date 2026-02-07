import { User } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await getLoggedInUser();
        if (stored) setUser(stored);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  async function getLoggedInUser(): Promise<User | null> {
    try {
      if (Platform.OS === "web") {
        if (typeof window === "undefined") return null;
        const data = window.localStorage.getItem("loggedInUser");
        return data ? JSON.parse(data) : null;
      } else {
        const data = await AsyncStorage.getItem("loggedInUser");
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error("Error reading user data:", error);
      return null;
    }
  }

  const logout = async () => {
    try {
      if (Platform.OS === "web") {
        window.localStorage.removeItem("loggedInUser");
      } else {
        await AsyncStorage.removeItem("loggedInUser");
      }
      setUser(null);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
