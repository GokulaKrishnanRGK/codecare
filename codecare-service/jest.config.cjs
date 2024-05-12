module.exports = {
  testEnvironment: "node",
  transform: {"^.+\\.[jt]sx?$": "babel-jest"},
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup/env.js",
    "<rootDir>/__tests__/setup/jest.setup.js"],
  clearMocks: true,
  restoreMocks: true,
};
