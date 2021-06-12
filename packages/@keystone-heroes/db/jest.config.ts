import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  collectCoverageFrom: ["src/**/*.{ts}"],
  displayName: "db",
  preset: "ts-jest",
};

export default config;
