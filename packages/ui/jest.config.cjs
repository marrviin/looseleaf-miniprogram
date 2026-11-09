/** Jest config for the looseleaf ui package.
 *  Docs: tests/README.md
 */
module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // miniprogram-simulate touches layout APIs loosely; jsdom's default
    // "pretendToBeVisual" timers keep it happy.
    pretendToBeVisual: true,
  },
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/simulate/setup.cjs'],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {
    '^.+\\.[jt]s$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  // Component sources and ink-engine are ESM; node_modules deps are CJS.
  transformIgnorePatterns: ['node_modules/(?!miniprogram-simulate)'],
  modulePathIgnorePatterns: ['dist'],
  testTimeout: 20000,
  maxWorkers: '50%',
};
