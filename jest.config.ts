import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    coverageProvider: "v8",
    preset: "ts-jest/presets/js-with-ts",
    setupFiles: ["dotenv/config"],
    transform: {
        "^.+\\mjs": "ts-jest",
    },
    moduleNameMapper: {
        '^src/(.*)$': ['<rootDir>/src/$1'],
    },
};

export default config;