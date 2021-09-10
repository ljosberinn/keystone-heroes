import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: "api",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.ts"],
  coverageThreshold: {
    global: {
      statements: 49,
      branches: 36,
      functions: 46,
      lines: 50,
    },
  },
};

export default config;
