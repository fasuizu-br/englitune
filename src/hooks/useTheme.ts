import { useMemo } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

const useTheme = () => {
  const isDarkOS = useMediaQuery("(prefers-color-scheme: dark)");
  const [storedTheme, setStoredTheme] = useLocalStorage<boolean | null>(
    "englitune-dark",
    null
  );

  const isDark = useMemo(
    () => storedTheme ?? isDarkOS,
    [storedTheme, isDarkOS]
  );

  const toggle = () => setStoredTheme(!isDark);

  return { isDark, toggle };
};

export default useTheme;
