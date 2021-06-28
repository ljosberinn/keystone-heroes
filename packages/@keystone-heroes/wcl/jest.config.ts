import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: "wcl",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  coverageThreshold: {
    global: {
      statements: 94,
      branches: 87,
      functions: 87,
      lines: 94,
    },
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/queries/introspection.ts",
    "<rootDir>/src/queries/index.ts",
    "<rootDir>/src/queries/types.ts",
  ],
};

export default config;
