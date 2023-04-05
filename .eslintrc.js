module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/airbnb"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: 0,
    "no-unused-expressions": 0,
    "import/no-unresolved": "off",
    "import/extensions": "off",
    // "import/extensions": [
    //   2,
    //   "always",
    //   {
    //     ignorePackages: true,
    //   },
    // ],
    "no-plusplus": "off",
    "no-continue": "off",
    "no-param-reassign": "off",
    "operator-linebreak": "off",
  },
};
