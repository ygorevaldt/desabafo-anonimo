module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    indent: ["error", 4],
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"]
  }
};
