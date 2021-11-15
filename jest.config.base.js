// @ts-check

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
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],
};

module.exports = config;
