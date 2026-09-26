export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  testMatch: ['**/?(*.)+(spec|test).ts'],
  // Expone el objeto `jest` como global en ESM (ver jest.setup.js).
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    // ignoreCodes 151002: silencia el aviso de "módulo híbrido nodenext" que ts-jest
    // emite al usar isolatedModules:false (necesario para el type-check completo).
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, diagnostics: { ignoreCodes: [151002] } }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
