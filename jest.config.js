// @ts-check
const tsConfig = require("./packages/@keystone-heroes/web/tsconfig.json");

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
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
    "\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: Object.fromEntries(
    Object.entries(tsConfig.compilerOptions.paths).map(([key, value]) => {
      return [
        `^${key.replace("-", "\\-").replace("*", "(.*)$")}`,
        `<rootDir>/${value[0].replace("*", "$1")}`,
      ];
    })
  ),
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],
};

module.exports = config;
