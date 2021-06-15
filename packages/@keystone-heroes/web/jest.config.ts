import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  displayName: "web",
  testEnvironment: "jsdom",
  transform: {
    ...baseConfig.transform,
    "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
  },
};

export default config;
