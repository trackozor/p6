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
