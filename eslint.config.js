import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),

  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2026,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    extends: [
      js.configs.recommended,
      "plugin:@typescript-eslint/recommended",
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      "plugin:prettier/recommended", // use the plugin
    ],
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "import/no-relative-parent-imports": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern:
                "{components,pages,services,store,styles,hooks,utils,App,assets}/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "block", next: "*" },
        { blankLine: "always", prev: "class", next: "*" },
        { blankLine: "always", prev: "function", next: "*" },
        { blankLine: "always", prev: "*", next: "return" },
      ],
    },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
    },
  },
]);
