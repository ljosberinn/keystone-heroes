import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: "wcl",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 87,
      functions: 87,
      lines: 95,
    },
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/queries/introspection.ts",
    "<rootDir>/src/queries/wcl-static-data.ts",
    "<rootDir>/src/queries/index.ts",
    "<rootDir>/src/queries/types.ts",
  ],
};

export default config;
