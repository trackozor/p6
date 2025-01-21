/* =============================================================================
    Projet      : Fisheye
    Fichier     : constants.js
    Auteur      : trackozor
    Date        : 01/01/2025
    Version     : 2.1
    Description : Fichier centralisant les constantes globales du projet.
                  Optimisation pour une gestion flexible des environnements,
                  des logs et des styles CSS standardisés.
============================================================================= */

/**
 * Détection et Gestion des Environnements
 * =============================================================================
 */

// Définition des environnements possibles.
export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
};

/**
 * Détecte l'environnement actif en fonction du domaine.
 * @returns {string} L'environnement détecté (development, staging ou production).
 */
export const detectEnvironment = () => {
  const { hostname } = window.location;

  if (hostname === "username.github.io") {
    return ENVIRONMENTS.PRODUCTION;
  }

  // Vérification correcte pour le localhost ou autre domaine local
  if (hostname === "127.0.0.1" || hostname === "localhost") {
    return ENVIRONMENTS.STAGING;
  }

  // Par défaut, retourner l'environnement développement
  return ENVIRONMENTS.DEVELOPMENT;
};

// Force le mode développement, quelle que soit l'URL (utile pour les tests locaux).
export const FORCE_DEV_MODE = true;

// Détermination de l'environnement actif.
export const ACTIVE_ENVIRONMENT = FORCE_DEV_MODE
  ? ENVIRONMENTS.DEVELOPMENT
  : detectEnvironment();

console.log(`Environnement actif : ${ACTIVE_ENVIRONMENT}`);

/**
 * =============================================================================
 * Configuration Globale de l'Application
 * =============================================================================
 * Toutes les configurations sont regroupées dans une constante exportée.
 * Cela inclut la gestion des logs, des styles CSS, et des comportements par environnement.
 */
export const CONFIGLOG = {
  // -------------------------------------------------------------------------
  // Informations sur l'Environnement
  // -------------------------------------------------------------------------
  ENVIRONMENT: ACTIVE_ENVIRONMENT, // Environnement actif.
  ENABLE_LOGS: ACTIVE_ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT, // Activer les logs uniquement en dev.

  // -------------------------------------------------------------------------
  // Niveau de verbosité global
  // -------------------------------------------------------------------------
  VERBOSITY: (() => {
    switch (ACTIVE_ENVIRONMENT) {
      case ENVIRONMENTS.DEVELOPMENT:
        return "high"; // Tous les logs sont activés
      case ENVIRONMENTS.STAGING:
        return "medium"; // Logs essentiels pour staging
      case ENVIRONMENTS.PRODUCTION:
        return "low"; // Logs critiques uniquement
      default:
        return "low"; // Par défaut, verbosité minimale
    }
  })(),

  // -------------------------------------------------------------------------
  // Configuration des logs par environnement
  // -------------------------------------------------------------------------
  LOG_LEVELS: (() => {
    switch (ACTIVE_ENVIRONMENT) {
      case ENVIRONMENTS.DEVELOPMENT:
        return {
          default: true,
          info: true, // Tout afficher
          warn: true,
          error: true,
          success: true,
          test_start: true, // Logs pour les tests activés
          test_end: true, // Logs pour les tests activés
        };
      case ENVIRONMENTS.STAGING:
        return {
          default: true,
          info: true, // Afficher uniquement les informations clés
          warn: true,
          error: true,
          success: true,
          test_start: true, // Pas de logs de tests
          test_end: true, // Pas de logs de tests
        };
      case ENVIRONMENTS.PRODUCTION:
        return {
          default: true,
          info: false, // Désactiver les logs d'informations
          warn: true,
          error: true, // Logs critiques activés
          success: true,
          test_start: true, // Aucun log inutile
          test_end: true, // Aucun log inutile
        };
      default:
        return {
          default: true,
          info: false,
          warn: true,
          error: true,
          success: true,
          test_start: true,
          test_end: true,
        };
    }
  })(),

  // -------------------------------------------------------------------------
  // Classes CSS Utilisées
  // -------------------------------------------------------------------------
  CSS_CLASSES: {
    ERROR_INPUT: "error-input", // Classe pour les champs en erreur.
    ERROR_MODAL: "error-modal", // Classe pour les modales d'erreur.
    MODAL_ACTIVE: "active", // Classe pour les modales actives.
    BODY_NO_SCROLL: "no-scroll", // Classe pour empêcher le scroll en arrière-plan.
  },

  // -------------------------------------------------------------------------
  // Styles pour les Logs
  // -------------------------------------------------------------------------
  LOG_STYLES: {
    default: "color: black;", // Style par défaut.
    info: "color: blue; font-weight: bold;", // Style pour les infos.
    warn: "color: orange; font-weight: bold;", // Style pour les avertissements.
    error: "color: red; font-weight: bold;", // Style pour les erreurs.
    success: "color: green; font-weight: bold;", // Style pour les succès.
    test_start: "background-color: purple; color: white; font-weight: bold;", // Style pour le début des tests.
    test_end: "background-color: brown; color: white; font-weight: bold;", // Style pour la fin des tests.
  },

  // -------------------------------------------------------------------------
  // Icônes des Logs
  // -------------------------------------------------------------------------
  LOG_ICONS: {
    default: "🔵", // Icône par défaut.
    info: "ℹ️", // Icône pour les infos.
    warn: "⚠️", // Icône pour les avertissements.
    error: "❌", // Icône pour les erreurs.
    success: "✅", // Icône pour les succès.
    test_start: "🔧", // Icône pour le début des tests.
    test_end: "🏁", // Icône pour la fin des tests.
  },
};
