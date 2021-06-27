import { useTheme } from "next-themes";
import { useEffect } from "react";

import { useIsHydrated } from "../hooks/useIsHydrated";
import { icons } from "../icons";

export function ColorModeToggle(): JSX.Element | null {
  const isMounted = useIsHydrated();
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  function handleThemeChange() {
    setTheme(isDark ? "light" : "dark");
  }

  // fixes the following situation:
  // - initial theme = dark
  // - toggle to light
  // - reload: theme var says its light
  // - html element has both dark and light classes, dark prevails
  // - thus, remove dark
  useEffect(() => {
    if (
      isMounted &&
      theme === "light" &&
      document.documentElement.classList.contains("dark")
    ) {
      document.documentElement.classList.remove("dark");
    }
  }, [isMounted, theme]);

  const icon = theme === "dark" ? icons.sun : icons.moon;

  return (
    <button
      type="button"
      className="w-10 h-10 p-3 rounded"
      onClick={handleThemeChange}
    >
      {isMounted && (
        <svg className="w-4 h-4 text-gray-800 dark:text-gray-200">
          <use href={`#${icon.id}`} />
        </svg>
      )}
    </button>
  );
}
