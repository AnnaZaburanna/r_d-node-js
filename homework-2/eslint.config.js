import globals from "globals";
import {defineConfig} from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
    {
        files: ['**/*.js'],

        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            },
        },

        plugins: { js },
        extends: ['js/recommended'],

        rules: {
            'no-unused-vars': 'warn',
            'no-undef':       'warn',
        },
    },
]);