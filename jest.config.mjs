// jest.config.cjs
export default {
  testEnvironment: 'node',
  // REMOVE the transform: {} line
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/config/setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/scripts/'],
};

