import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: "wcl",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  coverageThreshold: {
    global: {
      statements: 91,
      branches: 80,
      functions: 84,
      lines: 91,
    },
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/queries/introspection.ts",
    "<rootDir>/src/queries/index.ts",
    "<rootDir>/src/queries/types.ts",
  ],
};

export default config;
