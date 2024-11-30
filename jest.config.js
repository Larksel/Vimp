/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@main-utils/(.*)$": "<rootDir>/app/main/utils/$1",
    "^@modules/(.*)$": "<rootDir>/app/main/modules/$1",
    "^@databases/(.*)$": "<rootDir>/app/main/databases/$1",
    "^@shared/(.*)$": "<rootDir>/app/shared/$1",
    "^@interfaces/(.*)$": "<rootDir>/app/shared/interfaces/$1",
    "^@assets/(.*)$": "<rootDir>/app/renderer/assets/$1",
    "^@components/(.*)$": "<rootDir>/app/renderer/components/$1",
    "^@features/(.*)$": "<rootDir>/app/renderer/features/$1",
    "^@hooks/(.*)$": "<rootDir>/app/renderer/hooks/$1",
    "^@stores/(.*)$": "<rootDir>/app/renderer/stores/$1",
    "^@render-utils/(.*)$": "<rootDir>/app/renderer/utils/$1",
    "^@views/(.*)$": "<rootDir>/app/renderer/views/$1",
    "^@renderer/(.*)$": "<rootDir>/app/renderer/$1"
  },

  // testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  // errorOnDeprecated: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",
};