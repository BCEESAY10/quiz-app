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
      const stored = await getLoggedInUser();
      if (stored) setUser(stored);
      setLoading(false);
    };
    loadUser();
  }, []);

  async function getLoggedInUser(): Promise<User | null> {
    if (Platform.OS === "web") {
      const data = window.localStorage.getItem("loggedInUser");
      return data ? JSON.parse(data) : null;
    } else {
      const data = await AsyncStorage.getItem("loggedInUser");
      return data ? JSON.parse(data) : null;
    }
  }

  const logout = async () => {
    if (Platform.OS === "web") {
      window.localStorage.removeItem("loggedInUser");
      setUser(null);
    } else {
      await AsyncStorage.removeItem("loggedInUser");
      setUser(null);
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
