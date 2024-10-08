module.exports = {
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-organize-attributes"],

    // Plugin: '@trivago/prettier-plugin-sort-imports'
    importOrder: ["^zone.js", "^@angular", "^@|^rxjs", "^src"],
    importOrderCaseInsensitive: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
    importOrderSeparation: true,

    // Plugin: prettier-plugin-organize-attributes
    // See https://github.com/NiklasPor/prettier-plugin-organize-attributes/blob/main/src/presets.ts
    attributeGroups: [
        "^(id|name)$",
        "$ANGULAR_STRUCTURAL_DIRECTIVE",
        "$ANGULAR_TWO_WAY_BINDING",
        "$ANGULAR_ANIMATION",
        "$ANGULAR_ANIMATION_INPUT",
        "$ANGULAR_INPUT",
        "$ANGULAR_OUTPUT",
        "$ANGULAR_ELEMENT_REF",
        "^cdk",
        "^form",
        "$DEFAULT",
        "^aria-",
    ],
    attributeSort: "ASC",
};
