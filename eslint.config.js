import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    {
        files: ['src/*.js'],
        plugins: {
            js
        },
        extends: ['js/recommended'],
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            'no-console': 'error',
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'comma-dangle': 'error'
        }
    }
]);
