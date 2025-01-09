/* ========================================================
 * Nom du fichier : utils.js
 * Description    : Script JavaScript pour les fonctions utiliataires
 *                  
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 1.0.0
 * ======================================================== */
/*================================================================================================================================================*/
/*========================================================================================*/
/*                       =========== imports ===================            */
/*========================================================================================*/

import { CONFIGLOG } from "../modules/constants.js";

/*================================================================================================================================================*/
/*========================================================================================*/
/*                       =========== Fonctions utilitaires ===================            */
/*========================================================================================*/




/**
 * Détermine si un type de log doit être affiché en fonction de la 
 * configuration globale et des paramètres personnalisés.
 *
 * @param {string} type - Type de log (info, warn, error, etc.)
 * @param {Object} config - Configuration globale (e.g., CONFIGLOG)
 * @returns {boolean} - `true` si le log doit être affiché, sinon `false`.
 */
export function isLogEnabled(type, config) {
    // Si les logs globaux sont désactivés, retourne `false`
    if (!config.ENABLE_LOGS) {
        return false;
    }

    // Priorité : CUSTOM_LOG_SETTINGS > LOG_LEVELS
    if (type in config.CUSTOM_LOG_SETTINGS) {
        return config.CUSTOM_LOG_SETTINGS[type]; // Retourne la valeur personnalisée
    }

    // Sinon, retourne la configuration par défaut
    return config.LOG_LEVELS[type] || false;
}
/*======================Fonction log console==============================================*/
/**
 * Log les événements dans la console avec horodatage, icônes et styles personnalisés.
 * 
 * Étapes principales :
 * 1. Vérifie si les logs sont activés globalement (`CONFIG.ENABLE_LOGS`).
 * 2. Filtre les logs en fonction des niveaux activés dans `CONFIG.LOG_LEVELS`.
 * 3. Récupère l'horodatage et construit un préfixe pour identifier l'origine du log.
 * 4. Associe une icône et un style au log en fonction de son type.
 * 5. Valide que le message est fourni avant d'afficher quoi que ce soit.
 * 6. Affiche le log dans la console avec un style formaté, ou gère les erreurs si elles surviennent.
 *
 * @param {string} type - Niveau du log : 'info', 'warn', 'error', 'success', etc.
 * @param {string} message - Description de l'événement à loguer.
 * @param {Object} [data={}] - (Optionnel) Données supplémentaires liées au log.
 * 
 * @example
 * logEvent('info', 'Chargement terminé', { module: 'Formulaire', status: 'OK' });
 * logEvent('error', 'Échec de la validation', { field: 'email', reason: 'Format invalide' });
 */

export function logEvent(type, message, data = {}) {
    // 1. Vérifie si les logs sont activés globalement via ENABLE_LOGS.
    if (!CONFIGLOG.ENABLE_LOGS) {
      return;
    }

    // 2. Détermine si le type de log est activé selon l'environnement.
    const isLogEnabled =
        CONFIGLOG.ENVIRONMENT === 'development'
            ? CONFIGLOG.CUSTOM_LOG_SETTING[type] // En dev, utilise les paramètres personnalisés
            : CONFIGLOG.LOG_LEVELS[type];       // En prod, utilise les niveaux définis

    if (!isLogEnabled) {
      return;
    } // Sort si le log est désactivé.

    // 3. Récupère l'horodatage et construit le préfixe.
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[Fisheye][${timestamp}]`;

    // 4. Récupère l'icône et le style pour le type de log.
    const icon = CONFIGLOG.LOG_ICONS?.[type] || CONFIGLOG.LOG_ICONS?.default || '';
    const style = CONFIGLOG.LOG_STYLES?.[type] || CONFIGLOG.LOG_STYLES?.default || '';

    // 5. Construit le message complet.
    const fullMessage = `${icon} ${prefix} ${type.toUpperCase()}: ${message}`;

    // 6. Affiche le log dans la console.
    try {
        if (console[type] && typeof console[type] === 'function') {
            console[type](`%c${fullMessage}`, style, data);
        } else {
            console.log(`%c${fullMessage}`, style, data);
        }
    } catch (error) {
        console.error('%cErreur dans logEvent :', CONFIGLOG.LOG_STYLES.error, error);
    }
}


/* ========================= Fonction pour ajouter une classe CSS =================*/
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
        logEvent('error','addClass: Le paramètre "element" n\'est pas un élément HTML valide.', { element });
        return false; // Échec de l'opération
    }

    // Vérifie si la classe est une chaîne de caractères valide
    if (typeof className !== 'string' || className.trim() === '') {
        logEvent('error','addClass: Le paramètre "className" est invalide.', { className });
        return false; // Échec de l'opération
    }

    // Vérifie si la classe est déjà présente
    if (element.classList.contains(className)) {
        logEvent('info'`addClass: La classe "${className}" est déjà présente sur l'élément.`, { element });
        return false; // Pas besoin d'ajouter la classe
    }

    // Ajoute la classe à l'élément
    try {
        element.classList.add(className);
        logEvent('success',`addClass: La classe "${className}" a été ajoutée avec succès.`, { element });
        return true; // Succès de l'opération
    } catch (error) {
        logEvent('error','addClass: Une erreur est survenue lors de l\'ajout de la classe.', { error });
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
        logEvent('error','removeClass: Le paramètre "element" n\'est pas un élément HTML valide.', { element });
        return false; // Échec de l'opération
    }

    // 2. Vérifie que le nom de la classe est une chaîne non vide
    if (typeof className !== 'string' || className.trim() === '') {
        logEvent('error','removeClass: Le paramètre "className" est invalide.', { className });
        return false; // Échec de l'opération
    }

    // 3. Vérifie si la classe est présente sur l'élément
    if (!element.classList.contains(className)) {
        logEvent('info',`removeClass: La classe "${className}" n'est pas présente sur l'élément.`, { element });
        return false; // Pas besoin de retirer la classe
    }

    // 4. Retire la classe de l'élément
    try {
        element.classList.remove(className);
        logEvent('success',`removeClass: La classe "${className}" a été retirée avec succès.`, { element });
        return true; // Succès de l'opération
    } catch (error) {
        logEvent('error','removeClass: Une erreur est survenue lors de la suppression de la classe.', { error });
        return false; // Échec de l'opération
    }
}

