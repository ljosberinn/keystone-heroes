import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: "wcl",
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
};

export default config;
