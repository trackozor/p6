/* ========================================================
 * Nom du fichier : utils.js
 * Description    : Fonctions utilitaires pour le projet Fisheye
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 1.1.0 (Optimisée)
 * ======================================================== */

import {
  CONFIGLOG,
  ENVIRONMENTS,
  ACTIVE_ENVIRONMENT,
} from "../config/constants.js";

/* ========================= Fonction utilitaire : Vérification des logs ========================= */
/**
 * Vérifie si un type de log est activé en fonction de la configuration globale.
 *
 * @param {string} type - Type de log (info, warn, error, etc.).
 * @returns {boolean} - `true` si le log est activé, sinon `false`.
 */

export const isLogEnabled = (level) => {
  // Cartographie des niveaux de log autorisés par niveau de verbosité
  const verbosityMap = {
    low: ["error", "warn"], // Verbosité basse : uniquement les erreurs et avertissements
    medium: ["error", "warn", "success"], // Verbosité moyenne : ajoute les succès
    high: ["error", "warn", "success", "info", "test_start", "test_end"], // Verbosité haute : tous les niveaux
  };

  // Obtenir les niveaux autorisés selon la verbosité
  const allowedLevels = verbosityMap[CONFIGLOG.VERBOSITY] || [];

  // Conditions pour déterminer si un log est activé
  const isLevelEnabledInConfig = CONFIGLOG.LOG_LEVELS[level]; // Niveau activé dans la config
  const isAllowedByVerbosity = allowedLevels.includes(level); // Niveau autorisé par la verbosité
  const isEnvironmentAllowed =
    ACTIVE_ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT || // Autoriser tous les logs en dev
    !["info", "test_start", "test_end"].includes(level); // Limiter certains logs aux dev/staging

  // Retourner `true` si toutes les conditions sont remplies
  return isLevelEnabledInConfig && isAllowedByVerbosity && isEnvironmentAllowed;
};

/* ========================= Fonction utilitaire : Logger ========================= */
/**
 * Logue des événements dans la console avec horodatage, icônes et styles.
 *
 * @param {string} type - Type de log : 'info', 'warn', 'error', etc.
 * @param {string} message - Message à loguer.
 * @param {Object} [data={}] - Données supplémentaires pour contexte.
 */
export const logEvent = (type, message, data = {}) => {
  // Validation du type de log
  if (!type || typeof type !== "string") {
    console.error("logEvent : Type de log invalide ou non défini.", { type });
    return;
  }

  // Récupération des métadonnées pour le log
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[Fisheye][${timestamp}]`;
  const icon =
    CONFIGLOG.LOG_ICONS?.[type] || CONFIGLOG.LOG_ICONS?.default || "🔵";
  const style =
    CONFIGLOG.LOG_STYLES?.[type] ||
    CONFIGLOG.LOG_STYLES?.default ||
    "color: black;";
  const fullMessage = `${icon} ${prefix} ${type.toUpperCase()}: ${message}`;

  try {
    // Vérifie si `console[type]` est disponible
    if (console[type] && typeof console[type] === "function") {
      console[type](`%c${fullMessage}`, style, data);
    } else {
      // Fallback sur `console.log` si `console[type]` n'existe pas
      console.log(`%c${fullMessage}`, style, data);
    }
  } catch (error) {
    // Gestion des erreurs dans logEvent
    console.error(
      "%cErreur dans logEvent :",
      CONFIGLOG.LOG_STYLES?.error || "color: red;",
      error,
    );
  }
};

/**
 * Ajoute une classe CSS à un élément HTML.
 *
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à ajouter.
 * @returns {boolean} - `true` si la classe a été ajoutée, `false` si elle était déjà présente ou en cas d'erreur.
 */
export function addClass(element, className) {
  // Vérifie si l'élément est valide
  if (!(element instanceof HTMLElement)) {
    logEvent(
      "error",
      'addClass: Le paramètre "element" n\'est pas un élément HTML valide.',
      { element },
    );
    return false; // Échec de l'opération
  }

  // Vérifie si la classe est une chaîne de caractères valide
  if (typeof className !== "string" || className.trim() === "") {
    logEvent("error", 'addClass: Le paramètre "className" est invalide.', {
      className,
    });
    return false; // Échec de l'opération
  }

  // Vérifie si la classe est déjà présente
  if (element.classList.contains(className)) {
    logEvent(
      "info"`addClass: La classe "${className}" est déjà présente sur l'élément.`,
      { element },
    );
    return false; // Pas besoin d'ajouter la classe
  }

  // Ajoute la classe à l'élément
  try {
    element.classList.add(className);
    logEvent(
      "success",
      `addClass: La classe "${className}" a été ajoutée avec succès.`,
      { element },
    );
    return true; // Succès de l'opération
  } catch (error) {
    logEvent(
      "error",
      "addClass: Une erreur est survenue lors de l'ajout de la classe.",
      { error },
    );
    return false; // Échec de l'opération
  }
}

/* ========================= Fonction pour supprimer une classe CSS =================*/
/**
 * Supprime une classe CSS d'un élément HTML.
 *
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à supprimer.
 * @returns {boolean} - `true` si la classe a été supprimée, `false` si elle n'était pas présente ou en cas d'erreur.
 */
export function removeClass(element, className) {
  // 1. Vérifie que l'élément est un élément HTML valide
  if (!(element instanceof HTMLElement)) {
    logEvent(
      "error",
      'removeClass: Le paramètre "element" n\'est pas un élément HTML valide.',
      { element },
    );
    return false; // Échec de l'opération
  }

  // 2. Vérifie que le nom de la classe est une chaîne non vide
  if (typeof className !== "string" || className.trim() === "") {
    logEvent("error", 'removeClass: Le paramètre "className" est invalide.', {
      className,
    });
    return false; // Échec de l'opération
  }

  // 3. Vérifie si la classe est présente sur l'élément
  if (!element.classList.contains(className)) {
    logEvent(
      "info",
      `removeClass: La classe "${className}" n'est pas présente sur l'élément.`,
      { element },
    );
    return false; // Pas besoin de retirer la classe
  }

  // 4. Retire la classe de l'élément
  try {
    element.classList.remove(className);
    logEvent(
      "success",
      `removeClass: La classe "${className}" a été retirée avec succès.`,
      { element },
    );
    return true; // Succès de l'opération
  } catch (error) {
    logEvent(
      "error",
      "removeClass: Une erreur est survenue lors de la suppression de la classe.",
      { error },
    );
    return false; // Échec de l'opération
  }
}

/**
 * Détecte la page actuelle à partir de l'URL.
 * @returns {string} Nom de la page actuelle (par exemple, "index", "photographer").
 */
export const getCurrentPage = () => {
  const path = window.location.pathname;
  if (path.includes("index.html") || path === "/") {
    return "index";
  }
  if (path.includes("photographer.html")) {
    return "photographer";
  }
  return "unknown"; // Retourne "unknown" si la page est inconnue
};

/**
 * Vérifie la présence de tous les sélecteurs pour une page donnée.
 * @param {Object} selectors - Sélecteurs de la page en cours.
 * @returns {boolean} True si tous les sélecteurs sont présents, sinon False.
 */
export const verifySelectors = (selectors) => {
  const missingSelectors = [];

  const checkSelectors = (obj, parentKey = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = `${parentKey}${key}`;

      // Exclure les sélecteurs spécifiques
      if (
        fullKey === "photographerPage.totalLikes" ||
        fullKey === "photographerPage.dailyRate"
      ) {
        return;
      }

      if (typeof value === "object" && value !== null) {
        checkSelectors(value, `${fullKey}.`);
      } else if (!value) {
        missingSelectors.push(fullKey);
      }
    });
  };

  checkSelectors(selectors);

  if (missingSelectors.length > 0) {
    logEvent(
      "error",
      `⚠️ Les sélecteurs suivants sont manquants : ${missingSelectors.join(", ")}.`,
      {},
    );
    return false;
  }

  logEvent("success", "✅ Tous les sélecteurs nécessaires sont présents.");
  return true;
};

/**
 * Sélectionne de manière sécurisée un élément DOM.
 * @param {string} selector - Le sélecteur CSS.
 * @returns {Element|null} Élément DOM correspondant ou null s'il n'existe pas.
 */
export const safeQuerySelector = (selector) => {
  try {
    return document.querySelector(selector);
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la sélection de l'élément : ${selector}`,
      {
        error,
      },
    );
    return null;
  }
};
