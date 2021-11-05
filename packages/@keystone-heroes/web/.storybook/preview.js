import "../src/styles/globals.css";
import * as icons from "../src/icons";
import { ColorModeToggle } from "../src/components/ColorModeToggle";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

import { ThemeProvider } from "next-themes";

export const decorators = [
  (Story) => (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="bg-white dark:bg-coolgray-900 dark:text-coolgray-200">
        <div>
          <ColorModeToggle />
        </div>

        <div>
          <Story />
        </div>

        <svg className="hidden">
          <defs>
            {Object.values(icons).map(({ component: Component, id }) => (
              <Component id={id} size="1em" key={id} />
            ))}
          </defs>
        </svg>
      </div>
    </ThemeProvider>
  ),
];
