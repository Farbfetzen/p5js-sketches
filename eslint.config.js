// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // eslint
            "no-console": ["error", { allow: ["warn", "error"] }],
            "no-constructor-return": "error",
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["./", "../"],
                            message: "Relative imports are not allowed.",
                        },
                    ],
                },
            ],
            "no-self-compare": "error",
            "no-template-curly-in-string": "error",
            "no-useless-assignment": "error",

            // typescript-eslint
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-deprecated": "warn",
            "@typescript-eslint/no-extraneous-class": ["warn", { allowWithDecorator: true }],
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
            "@typescript-eslint/no-unnecessary-parameter-property-assignment": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/prefer-readonly": "warn",

            // angular
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "app",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "app",
                    style: "kebab-case",
                },
            ],
        },
    },
    {
        files: ["**/*.spec.ts"],
        rules: {
            // Disable this rule because some tests need empty mock components.
            "@typescript-eslint/no-extraneous-class": "off",
            // Disable this rule because it complains about jasmine.createSpyObj().
            "@typescript-eslint/no-unsafe-assignment": "off",
            // Disable because it complains about expect(...).toHaveBeenCalled(...).
            "@typescript-eslint/unbound-method": "off",
        },
    },
    {
        files: ["**/*.html"],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {},
    },
);
