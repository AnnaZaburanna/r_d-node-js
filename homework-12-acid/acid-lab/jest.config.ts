import type { Config } from 'jest';

const config: Config = {
    projects: [
        {
            displayName: 'unit',
            testEnvironment: 'node',
            moduleFileExtensions: ['ts', 'js', 'json'],
            transform: { '^.+\\.ts$': 'ts-jest' },
            testMatch: ['<rootDir>/src/**/*.spec.ts'],
        },
        {
            displayName: 'e2e',
            testEnvironment: 'node',
            moduleFileExtensions: ['ts', 'js', 'json'],
            transform: { '^.+\\.ts$': 'ts-jest' },
            testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
        },
    ],
};

export default config;
