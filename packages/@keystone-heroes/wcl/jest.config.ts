import type { Config } from "@jest/types";

import baseConfig from "../../../jest.config";
import tsConfig from "../web/tsconfig.json";

const moduleNameMapper = Object.fromEntries(
  Object.entries(tsConfig.compilerOptions.paths).map(([key, value]) => {
    return [key, `<rootDir>/${value[0]}`];
  })
);

const config: Config.InitialOptions = {
  ...baseConfig,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  preset: "ts-jest",
  displayName: "wcl",
  moduleNameMapper,
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
};

export default config;
