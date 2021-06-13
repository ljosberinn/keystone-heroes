import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  collectCoverageFrom: ["src/**/*.{ts}"],
  preset: "ts-jest",
  displayName: "api",
};

export default config;
