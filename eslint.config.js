import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Configuration de base
  {
    languageOptions: {
      ecmaVersion: "latest", // Support des dernières fonctionnalités ECMAScript
      sourceType: "module",  // Utilisation des modules ES
      globals: {
        ...globals.browser, // Variables globales du navigateur
      },
    },
    rules: {
      "indent": ["error", 2],           // Indentation à 2 espaces
      "quotes": ["error", "double"],    // Utilisation des guillemets doubles
      "semi": ["error", "always"],      // Points-virgules obligatoires
      "no-unused-vars": "warn",         // Avertissement pour les variables inutilisées
      "no-console": "off",              // Autoriser console.log
    },
  },
  // Configuration ESLint recommandée
  pluginJs.configs.recommended,

  // Configuration Prettier (désactive les règles en conflit avec Prettier)
  prettier,
];

