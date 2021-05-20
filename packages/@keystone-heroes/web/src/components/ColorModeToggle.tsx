import { useTheme } from "next-themes";
import { useEffect } from "react";

import { useIsMounted } from "../hooks/useIsMounted";
import { icons } from "../icons";

export function ColorModeToggle(): JSX.Element | null {
  const isMounted = useIsMounted();
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
      className="rounded p-3 h-10 w-10"
      onClick={handleThemeChange}
    >
      {isMounted && (
        <svg className="h-4 w-4 text-gray-800 dark:text-gray-200">
          <use href={`#${icon.id}`} />
        </svg>
      )}
    </button>
  );
}
