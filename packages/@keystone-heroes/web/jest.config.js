module.exports = {
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  setupFilesAfterEnv: ["<rootDir>/jest/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/../../../node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
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
