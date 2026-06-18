import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  // Força 100% como valor inicial, ignorando qualquer valor salvo anteriormente
  const [fontSize, setFontSize] = useState(100);

  const [primaryColor, setPrimaryColor] = useState(
    () => localStorage.getItem("primaryColor") || "#0057B8",
  );

  // Sempre que o fontSize mudar, atualiza o localStorage e o estilo do documento
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  return {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    primaryColor,
    setPrimaryColor,
  };
};
