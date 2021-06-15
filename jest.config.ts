import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest/utils";
import tsConfig from "./packages/@keystone-heroes/web/tsconfig.json";

const config: Config.InitialOptions = {
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  errorOnDeprecated: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
      isolatedModules: true,
      useESM: true,
      babelConfig: {
        presets: ["next/babel"],
      },
    },
  },
};

export default config;
