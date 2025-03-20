/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Ensure Jest processes TypeScript files
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/tests/**/*.test.ts"], // Look for tests in /tests/
};