import { useEffect, useState } from "react";

const getBodyDarkState = () => {
  if (typeof document === "undefined") {
    return false;
  }
  return document.body.getAttribute("arco-theme") === "dark";
};

export const useIsDarkTheme = () => {
  const [isDark, setIsDark] = useState(getBodyDarkState);
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const body = document.body;
    const observer = new MutationObserver(() => {
      setIsDark(getBodyDarkState());
    });
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["arco-theme"],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return isDark;
};
