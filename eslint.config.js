import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import pluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Configuration de base pour JavaScript
  {
    languageOptions: {
      ecmaVersion: "latest", // Support des dernières fonctionnalités ECMAScript
      sourceType: "module", // Utilisation des modules ES
      globals: {
        ...globals.browser, // Variables globales pour un environnement navigateur
        ...globals.node, // Variables globales pour Node.js
        ...globals.jest, // Variables globales pour Jest
      },
    },
    rules: {
      indent: ["error", 2], // Indentation à 2 espaces
      quotes: ["error", "double"], // Utilisation des guillemets doubles
      semi: ["error", "always"], // Points-virgules obligatoires
      "no-unused-vars": "warn", // Avertissement pour les variables inutilisées
      "no-console": "off", // Autoriser console.log
      "eol-last": ["error", "always"], // Ligne vide en fin de fichier
      "prettier/prettier": "error", // Respect des règles de Prettier
    },
    plugins: {
      prettier: pluginPrettier,
    },
  },

  // Configuration ESLint recommandée
  pluginJs.configs.recommended,

  // Configuration spécifique pour Jest
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"], // Appliquer aux fichiers de test uniquement
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJest.configs.recommended.rules, // Règles recommandées de Jest
    },
  },

  // Configuration Prettier pour désactiver les conflits entre ESLint et Prettier
  prettierConfig,
];
