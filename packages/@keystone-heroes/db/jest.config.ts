import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  collectCoverageFrom: ["src/**/*.{ts}"],
  preset: "ts-jest",
  displayName: "db",
};

export default config;
