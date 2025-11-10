import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    {
        ignores: [
            "vite.config.js",
            "**/*.spec.ts", // TODO: Remove me
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        plugins: {
            '@stylistic': stylistic,
        },

        files: [
            '**/*.ts',
        ],

        rules: {
            "no-unused-vars": 0,
            "@stylistic/array-bracket-spacing": ["error", "always"],
            "@stylistic/brace-style": ["error", "stroustrup"],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-tabs": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@typescript-eslint/adjacent-overload-signatures": 0,
            "@typescript-eslint/explicit-module-boundary-types": 0, // We don't want to specify ": void" everywhere
            "@typescript-eslint/naming-convention": [
                "error",
                { selector: ["class", "enum", "interface", "typeAlias"], format: ["PascalCase"] },
                { selector: "classicAccessor", format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "forbid" },
                { selector: "classProperty", modifiers: ["readonly"], format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "forbid" },
                { selector: "default", format: ["camelCase"] },
                { selector: "enumMember", format: ["UPPER_CASE"] },
                { selector: "import", format: ["camelCase", "PascalCase"] },
                { selector: "objectLiteralProperty", format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "forbid" },
                { selector: "typeParameter", format: ["PascalCase"] },
                { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE"] },
            ],
            "@typescript-eslint/no-unused-vars": 0,
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/restrict-template-expressions": ["error", { "allowNumber": true }],
            indent: ["error", 4, {"SwitchCase": 1}],
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            semi: "off",
            "space-before-function-paren": ["error", "never"],
        },
    },
];
