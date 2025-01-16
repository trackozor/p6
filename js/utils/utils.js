/* ========================================================
 * Nom du fichier : utils.js
 * Description    : Fonctions utilitaires pour le projet Fisheye
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 1.1.0 (Optimisée)
 * ======================================================== */

import { CONFIGLOG } from "../config/constants.js";

/* ========================= Fonction utilitaire : Vérification des logs ========================= */
/**
 * Vérifie si un type de log est activé en fonction de la configuration globale.
 *
 * @param {string} type - Type de log (info, warn, error, etc.).
 * @returns {boolean} - `true` si le log est activé, sinon `false`.
 */
const isLogEnabled = (type) => {
  if (!CONFIGLOG || !CONFIGLOG.ENABLE_LOGS) {
    console.warn(
      "CONFIGLOG est invalide ou les logs sont désactivés.",
      CONFIGLOG,
    );
    return false;
  }

  // Vérifie que les objets nécessaires existent et renvoie `false` par défaut en cas de problème
  const customLogSetting = CONFIGLOG.CUSTOM_LOG_SETTING?.[type];
  const logLevel = CONFIGLOG.LOG_LEVELS?.[type];

  return customLogSetting ?? logLevel ?? false;
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
  if (!type || typeof type !== "string") {
    console.error("logEvent : Type de log invalide ou non défini.", { type });
    return;
  }

  if (!isLogEnabled(type)) {
    console.warn(`logEvent : Le type de log "${type}" est désactivé.`, {
      type,
    });
    return;
  }

  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[Fisheye][${timestamp}]`;

  // Protection contre les propriétés inexistantes
  const icon =
    CONFIGLOG.LOG_ICONS?.[type] || CONFIGLOG.LOG_ICONS?.default || "🔵";
  const style =
    CONFIGLOG.LOG_STYLES?.[type] ||
    CONFIGLOG.LOG_STYLES?.default ||
    "color: black;";

  const fullMessage = `${icon} ${prefix} ${type.toUpperCase()}: ${message}`;

  try {
    // Vérifie si `console[type]` est disponible, sinon utilise `console.log`
    if (console[type] && typeof console[type] === "function") {
      console[type](`%c${fullMessage}`, style, data);
    } else {
      console.log(`%c${fullMessage}`, style, data);
    }
  } catch (error) {
    console.error(
      "%cErreur dans logEvent :",
      CONFIGLOG.LOG_STYLES?.error || "color: red;",
      error,
    );
  }
};

/* ========================= Fonctions utilitaires : Gestion des classes CSS ========================= */
/**
 * Modifie une classe CSS sur un élément HTML.
 *
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à modifier.
 * @param {boolean} shouldAdd - `true` pour ajouter la classe, `false` pour la supprimer.
 * @returns {boolean} - `true` si l'opération a réussi, sinon `false`.
 */
const modifyClass = (element, className, shouldAdd) => {
  if (!(element instanceof HTMLElement)) {
    logEvent("error", "modifyClass: L'élément fourni n'est pas valide.", {
      element,
    });
    return false;
  }

  if (typeof className !== "string" || className.trim() === "") {
    logEvent("error", "modifyClass: Le nom de la classe est invalide.", {
      className,
    });
    return false;
  }

  try {
    if (shouldAdd) {
      if (element.classList.contains(className)) {
        logEvent(
          "info",
          `modifyClass: La classe "${className}" est déjà présente.`,
          { element },
        );
        return false;
      }
      element.classList.add(className);
      logEvent(
        "success",
        `modifyClass: La classe "${className}" a été ajoutée.`,
        { element },
      );
    } else {
      if (!element.classList.contains(className)) {
        logEvent("info", `modifyClass: La classe "${className}" est absente.`, {
          element,
        });
        return false;
      }
      element.classList.remove(className);
      logEvent(
        "success",
        `modifyClass: La classe "${className}" a été supprimée.`,
        { element },
      );
    }
    return true;
  } catch (error) {
    logEvent(
      "error",
      "modifyClass: Une erreur est survenue lors de la modification de la classe.",
      { error },
    );
    return false;
  }
};

/**
 * Ajoute une classe CSS à un élément HTML.
 *
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à ajouter.
 * @returns {boolean} - `true` si réussi, sinon `false`.
 */
export const addClass = (element, className) =>
  modifyClass(element, className, true);

/**
 * Supprime une classe CSS d'un élément HTML.
 *
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à supprimer.
 * @returns {boolean} - `true` si réussi, sinon `false`.
 */
export const removeClass = (element, className) =>
  modifyClass(element, className, false);

/**
 * Construit dynamiquement le chemin d'une image ou d'une ressource.
 * @param {string} folder - Nom du dossier principal (e.g., "photographers").
 * @param {string} fileName - Nom du fichier (e.g., "Mimi Keel.jpg").
 * @returns {string} Chemin complet vers la ressource.
 */
export function buildImagePath(folder, fileName) {
  if (!folder || !fileName) {
    logEvent(
      "warn",
      "Impossible de construire le chemin d'image. Informations manquantes.",
      {
        folder,
        fileName,
      },
    );
    return ""; // Retourne une chaîne vide si les informations sont manquantes
  }

  // Utilise encodeURIComponent pour gérer les caractères spéciaux et les espaces
  return `../../assets/images/${folder}/${encodeURIComponent(fileName)}`;
}
