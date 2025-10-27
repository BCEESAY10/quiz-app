import React, { createContext, useContext, useEffect, useState } from "react";

// Simulated user type
type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
};

// Context shape
type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Simulated backend fetch
const fetchAuthenticatedUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "u123",
        name: "Awa Jallow",
        email: "awa.jallow@example.com",
        role: "teacher",
      });
    }, 1000);
  });
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    const fetchedUser = await fetchAuthenticatedUser();
    setUser(fetchedUser);
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for consuming the context
export const useAuth = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useAuth must be used within a UserProvider");
  return context;
};
