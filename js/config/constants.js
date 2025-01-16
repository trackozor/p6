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
 * =============================================================================
 * Détection et Gestion des Environnements
 * =============================================================================
 */

// Définition des environnements possibles.
const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
};

/**
 * Détecte l'environnement actif en fonction du domaine.
 * @returns {string} L'environnement détecté (development, staging ou production).
 */
const detectEnvironment = () => {
  const { hostname } = window.location;
  if (hostname === "username.github.io") {
    return ENVIRONMENTS.PRODUCTION;
  }
  if (hostname === "staging.domain.com") {
    return ENVIRONMENTS.STAGING;
  }
  return ENVIRONMENTS.DEVELOPMENT;
};

// Force le mode développement, quelle que soit l'URL (utile pour les tests locaux).
const FORCE_DEV_MODE = true;

// Détermination de l'environnement actif.
const ACTIVE_ENVIRONMENT = FORCE_DEV_MODE
  ? ENVIRONMENTS.DEVELOPMENT
  : detectEnvironment();

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
  // Configuration des Logs
  // -------------------------------------------------------------------------
  LOG_LEVELS: {
    default: true, // Toujours activé.
    info: true, // Logs informatifs.
    warn: true, // Toujours activé : avertissements.
    error: true, // Toujours activé : erreurs critiques.
    success: true, // Toujours activé : succès des opérations.
    test_start: ACTIVE_ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT, // Activé en mode développement.
    test_end: ACTIVE_ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT, // Activé en mode développement.
  },

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
