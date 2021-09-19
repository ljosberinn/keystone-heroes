import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: "api",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.ts"],
  coverageThreshold: {
    global: {
      statements: 38,
      branches: 26,
      functions: 38,
      lines: 39,
    },
  },
};

export default config;
