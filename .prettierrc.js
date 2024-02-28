module.exports = {
    plugins: ["@trivago/prettier-plugin-sort-imports"],

    // Plugin: '@trivago/prettier-plugin-sort-imports'
    importOrder: ["^zone.js", "^@angular", "^@|^rxjs", "^src"],
    importOrderCaseInsensitive: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
    importOrderSeparation: true,
};
