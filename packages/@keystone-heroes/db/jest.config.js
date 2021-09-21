// @ts-check
const baseConfig = require("../../../jest.config");

/**
 * @type import('@jest/types').Config.InitialOptions
 */
const config = {
  ...baseConfig,
  displayName: "db",
};

module.exports = config;