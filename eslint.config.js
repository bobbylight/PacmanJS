import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },

        ignores: [
            ".eslintrc.config.js",
            "jest.config.js",
            "vite.config.js",
        ],

        files: [
            '**/*.ts',
        ],

        rules: {
            "no-unused-vars": 0,
            "@typescript-eslint/adjacent-overload-signatures": 0,
            "@typescript-eslint/class-literal-property-style": 0, // TODO
            "@typescript-eslint/explicit-module-boundary-types": 0,
            "@typescript-eslint/no-empty-function": 0,
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-extraneous-class": 0, // TODO
            "@typescript-eslint/no-inferrable-types": 0, // TODO
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/no-unused-vars": 0,
            "brace-style": ["error", "stroustrup"],
            indent: ["error", 4, {"SwitchCase": 1}],
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            semi: "off",
            "space-before-function-paren": ["error", "never"],
        },
    },
];
