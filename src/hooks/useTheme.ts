import { useEffect, useLayoutEffect, useRef, useState } from "react";

const THEME_STORAGE_KEY = "app-theme";

const getInitialIsDark = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme === "dark";
  }

  return document.body.getAttribute("arco-theme") === "dark";
};

export const useTheme = () => {
  const [isDark, setIsDark] = useState(getInitialIsDark);
  const initializedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const body = document.body;

    if (isDark) {
      body.setAttribute("arco-theme", "dark");
    } else {
      body.removeAttribute("arco-theme");
    }

    if (initializedRef.current) {
      body.classList.add("theme-switching");
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        body.classList.remove("theme-switching");
      }, 140);
    } else {
      initializedRef.current = true;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      document.body.classList.remove("theme-switching");
    };
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme };
};
