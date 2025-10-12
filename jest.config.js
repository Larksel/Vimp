/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  projects: [
    {
      displayName: 'main',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/app/main/**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
    },
    {
      displayName: 'preload',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/app/preload/**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
    },
    {
      displayName: 'renderer',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/app/renderer/**/*.test.{ts,tsx}'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {}],
      },
      // setupFilesAfterEnv: ['<rootDir>/app/renderer/__tests__/setup.ts'],
      // moduleNameMapper: {
      //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      //   '\\.(jpg|jpeg|png|gif|svg)$':
      //     '<rootDir>/app/renderer/__tests__/mocks/fileMock.js',
      // },
    },
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@main/(.*)$': '<rootDir>/app/main/$1',
    '^@shared/(.*)$': '<rootDir>/app/shared/$1',
    '^@preload/(.*)$': '<rootDir>/app/preload/$1',
    '^@renderer/(.*)$': '<rootDir>/app/renderer/$1',
  },
};
