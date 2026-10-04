import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("medicare-theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("medicare-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("medicare-theme", "light");
    }
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode((previous) => !previous);
  }

  return (
    <ThemeContext.Provider
  value={{
    darkMode,
    theme: darkMode ? "dark" : "light",
    toggleTheme,
  }}
>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}