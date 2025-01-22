import "@testing-library/jest-dom";

// Suppress specific console error messages for cleaner test output
const IGNORED_MESSAGES = [
  "When testing, code that causes React state updates should be wrapped into act(...):",
  "Error:",
  "The above error occurred",
];

const originalConsoleError = console.error.bind(console.error);
console.error = (...args) => {
  const shouldIgnore = IGNORED_MESSAGES.some((message) =>
    args.toString().includes(message)
  );
  if (!shouldIgnore) originalConsoleError(...args);
};

// Mocking environment variables globally for test compatibility
global.process = {
  env: {
    VITE_REDIRECT_URI_LOCAL: "http://localhost:3000",
    VITE_REDIRECT_URI_PRODUCTION: "https://example.com",
    VITE_REACT_APP_USE_MOCK_DATA: "true", // Mock value for tests
  },
};

// Mock `getEnvVariable` function and retain other exports
jest.mock("./api", () => {
  const actualApi = jest.requireActual("./api.js");
  return {
    ...actualApi,
    getEnvVariable: jest.fn((key) => {
      const mockEnv = {
        VITE_REDIRECT_URI_LOCAL: "http://localhost:3000",
        VITE_REDIRECT_URI_PRODUCTION: "https://example.com",
        VITE_REACT_APP_USE_MOCK_DATA: "true",
      };
      return mockEnv[key];
    }),
  };
});
