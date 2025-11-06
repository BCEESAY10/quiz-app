import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

const ThemeContext = createContext({
  colorScheme: "light",
  setColorScheme: (scheme: "light" | "dark") => {},
  theme: Colors.light,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState(systemScheme ?? "light");

  useEffect(() => {
    setColorScheme(systemScheme ?? "light");
  }, [systemScheme]);

  const theme = Colors[colorScheme ?? "light"];

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
