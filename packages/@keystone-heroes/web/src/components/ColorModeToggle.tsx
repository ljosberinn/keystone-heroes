import { useTheme } from "next-themes";
import { useEffect } from "react";

import { useIsHydrated } from "../hooks/useIsHydrated";
import { sun, moon } from "../icons";
import { classnames } from "../utils/classnames";

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

  const icon = theme === "dark" ? sun : moon;

  return (
    <button
      type="button"
      className="flex items-center justify-between"
      onClick={handleThemeChange}
    >
      <span className="mr-3">
        {isMounted ? (isDark ? "Dark" : "Light") : ""} Mode
      </span>
      <span className="flex-shrink-0 w-16 h-10 p-1 bg-gray-100 rounded-full dark:bg-coolgray-800">
        <span
          className={classnames(
            "bg-white w-8 h-8 rounded-full shadow-md duration-300 ease-in-out flex items-center justify-center dark:bg-coolgray-900",
            isMounted && isDark && "translate-x-6"
          )}
        >
          {isMounted && (
            <svg className="w-4 h-4 text-gray-800 dark:text-gray-300">
              <use href={`#${icon.id}`} />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
