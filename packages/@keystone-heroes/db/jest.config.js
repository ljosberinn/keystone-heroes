module.exports = {
  collectCoverageFrom: ["src/**/*.{ts}"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/../../../node_modules/babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  modulePaths: ["<rootDir>"],
  coverageDirectory: "coverage",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
};
