/* ========================================================
 * Nom du fichier : utils.js
 * Description    : Script JavaScript pour les fonctions utiliataires
 *                  
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 1.0.0
 * ======================================================== */


/* =============================== */
/*       Configuration Globale     */
/* =============================== */

const CONFIG = {
     /* ====== Configuration des logs ====== */
    ENABLE_LOGS: true, // Permet d'activer ou de désactiver les logs dans la console. Utile pour basculer entre les environnements (développement/production).
    
     /* ====== Niveaux de Logs ====== */
    LOG_LEVELS: {
        default: true,
        info: true,  // Activer/Désactiver les logs d'information
        warn: true,  // Activer/Désactiver les avertissements
        error: true, // Activer/Désactiver les erreurs
        success: true, // Activer/Désactiver les logs de succès
        check: true, // Activer/Désactiver les logs de la checkbox info
        checkfinal:true,
    },

    /*====== Classes CSS utilisées ======*/
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input', // Classe CSS pour styliser un champ avec une erreur (ex : bordure rouge).
        ERROR_MODAL: 'error-modal', // Classe CSS pour afficher une erreur dans la modale.
        MODAL_ACTIVE: 'active',  // Classe CSS pour indiquer qu'une modale est active et visible.
        BODY_NO_SCROLL: 'no-scroll', // Classe CSS pour empêcher le défilement de la page lorsque la modale est ouverte.
        NAV_RESPONSIVE: 'responsive', // Classe CSS pour activer le mode "responsive" du menu de navigation.
        HERO_DEFAULT: 'hero-default', // Classe CSS pour le style par défaut de la section "hero".
        HERO_RESPONSIVE: 'hero-responsive', // Classe CSS pour ajuster la section "hero" en mode responsive.
        MODAL_DEFAULT: 'modal-default', // Classe CSS pour le style par défaut de la modale.
        MODAL_RESPONSIVE: 'modal-responsive',  // Classe CSS pour adapter la modale au mode responsive.
    },


    /*====== styles tag log ======*/
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;", // Style pour les messages d'information.
        warn: "color: orange; font-weight: bold;", // Style pour les avertissements.
        error: "color: red; font-weight: bold;", // Style pour les erreurs critiques.
        success: "color: green; font-weight: bold;", // Style pour les messages indiquant une réussite.
        default: "color: black;", // Style par défaut pour les messages qui ne correspondent pas à un type spécifique.
        check: "background-color: pink; color: purple;font-weight: bold;", // Style pour la checkbox d'info
        checkfinal:"background-color: green; color: white;font-weight: bold;", // Style pour la checkbox d'info
    },

    /*====== styles icône log ======*/
    LOG_ICONS: {
        info: 'ℹ️',  // Icône pour les messages d'information.
        warn: '⚠️', // Icône pour les avertissements.
        error: '❌', // Icône pour les erreurs critiques.
        success: '✅', // Icône pour indiquer une réussite.
        default: '🔵', // Icône par défaut si le type de message n'est pas défini.
    },

    /*====== Configuration des médias ======*/
    MEDIA: {
        isMobile: window.matchMedia("(max-width: 1023px)").matches, // Indique si l'utilisateur utilise un appareil avec un écran de taille inférieure ou égale à 1024px.
    },
};

let modalOpen = false; // Variable globale pour suivre l'état de la modale
let isCheckboxValid = false; // Indique si la checkbox est valide

/*================================================================================================================================================*/
/*========================================================================================*/
/*                       =========== Fonctions utilitaires ===================            */
/*========================================================================================*/

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
    
    /* 1. Vérifie si les logs sont activés via CONFIG.ENABLE_LOGS.*/  
    if (!CONFIG.ENABLE_LOGS) {
        return; // Si les logs sont désactivés, sortir de la fonction immédiatement.
    }

    // Vérifie si le type de log est activé dans LOG_LEVELS
    if (!CONFIG.LOG_LEVELS[type]) {
        return; // Si le type de log est désactivé, ne rien afficher
    }

    /* 2. Récupère l'horodatage et construit un préfixe pour identifier la source du log.*/
    const timestamp = new Date().toLocaleTimeString(); // Récupère l'heure actuelle au format HH:MM:SS.
    const prefix = `[Fisheye][${timestamp}]`; // Préfixe standard pour identifier les logs et horodatage.

    /*3. Sélectionne une icône, un style en fonction du type de log  et construit le message complet avec le type, l'icône, et le contenu.*/
    const icon = CONFIG.LOG_ICONS[type] || CONFIG.LOG_ICONS.default;// Icône par défaut si le type est inconnu    
    const style = CONFIG.LOG_STYLES[type] || CONFIG.LOG_STYLES.default ;// Récupère le style approprié depuis `logStyles` en fonction du type (info, warn, error).
    const fullMessage = `${icon} ${prefix} ${type.toUpperCase()}: ${message}`; // Message complet à afficher.

    /*4. Vérifie si le message est vide pour éviter les logs inutiles.*/
    if (!message) {
        console.warn('%c[AVERTISSEMENT] Aucun message fourni dans logEvent', style);
        return;
    }

    /* 5. Affiche le log dans la console en utilisant le type dynamique (info, warn, error, etc.).*/
    try {
    console[type] 
        ? console[type](`%c${fullMessage}`, style, data) 
        : console.log(`%c${fullMessage}`, style, data);
    } catch (error) {
        console.error('Erreur dans logEvent :', error);
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
