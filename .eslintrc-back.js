// deps

    // externals
    const { defineConfig } = require("eslint/config");
    const personnallinter = require("eslint-plugin-personnallinter");

// module

module.exports = defineConfig({
    "plugins": {
        personnallinter
    },
    "extends": [ personnallinter.configs["ts-back"] ]
});
