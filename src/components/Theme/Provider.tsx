import { useLayoutEffect, type FragmentProps } from "react";
import useTheme from "@/hooks/useTheme";

const updateTheme = (isDark: boolean) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const updateFavicon = (isDark: boolean) => {
  const favicon = document.getElementById("favicon") as HTMLLinkElement;
  if (favicon) {
    favicon.href = `/favicon${isDark ? "-dark" : ""}.svg`;
  }
};

const Provider = ({ children }: FragmentProps) => {
  const { isDark } = useTheme();

  useLayoutEffect(() => {
    updateTheme(isDark);
    updateFavicon(isDark);
  }, [isDark]);

  return children;
};

export default Provider;
