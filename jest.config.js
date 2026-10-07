/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // The build tsconfig only includes nodes/ and credentials/; tests live
        // outside it so they are never compiled into dist/.
        tsconfig: {
          module: 'commonjs',
          target: 'es2019',
          lib: ['es2019', 'es2020', 'es2022.error'],
          strict: true,
          esModuleInterop: true,
          useUnknownInCatchVariables: false,
          skipLibCheck: true,
          types: ['jest', 'node'],
        },
        diagnostics: { warnOnly: false },
      },
    ],
  },
};
