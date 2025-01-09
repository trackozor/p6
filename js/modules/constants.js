/* =============================================================================
    Projet      : Fisheye
    Fichier     : constants.js
    Auteur      : trackozor
    Date        : 01/01/2025
    Version     : 1.2
    Description : Fichier englobant toutes les variables et chemins utilisés
                  dans l'application, incluant une gestion dynamique des chemins
                  pour GitHub Pages ou un environnement local.
============================================================================= */

// === Détection de l'environnement (local ou GitHub Pages) ===
const ENVIRONMENT = window.location.hostname === 'username.github.io' ? 'production' : 'development';

// === Définition du chemin de base en fonction de l'environnement ===
const BASE_PATH = ENVIRONMENT === 'production' ? '/fisheye/' : './';

/**
 * Ajoute dynamiquement le préfixe nécessaire aux chemins absolus.
 * @param {string} path - Le chemin absolu à ajuster.
 * @returns {string} Le chemin ajusté avec le préfixe approprié.
 */
function getAbsolutePath(path) {
    return `${BASE_PATH}${path.replace(/^\//, '')}`; // Supprime le slash initial pour éviter les doublons
}

export const CONFIGLOG = {
    /* ====== Informations sur l'environnement ====== */
    ENVIRONMENT, // Environnement actuel ('production' ou 'development')
    BASE_PATH, // Chemin de base pour les ressources

    /* ====== Configuration des logs ====== */
    ENABLE_LOGS: ENVIRONMENT === 'development', // Activer les logs uniquement en développement
    LOG_LEVELS: {
        default: true,
        info: ENVIRONMENT === 'development', // Activer les logs d'information en dev uniquement
        warn: true, // Toujours activer les avertissements
        error: true, // Toujours activer les erreurs critiques
        success: true, // Toujours activer les succès
        test_start: ENVIRONMENT === 'development', // Logs de tests activés en dev uniquement
        test_end: ENVIRONMENT === 'development', // Logs de fin de tests activés en dev uniquement
    },

    /* ====== Classes CSS utilisées ====== */
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input', // Classe CSS pour styliser un champ avec une erreur (ex : bordure rouge).
        ERROR_MODAL: 'error-modal', // Classe CSS pour afficher une erreur dans la modale.
        MODAL_ACTIVE: 'active', // Classe CSS pour indiquer qu'une modale est active et visible.
        BODY_NO_SCROLL: 'no-scroll', // Classe CSS pour empêcher le défilement de la page lorsque la modale est ouverte.
    },

    /* ====== Styles des logs ====== */
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;", // Style pour les messages d'information.
        warn: "color: orange; font-weight: bold;", // Style pour les avertissements.
        error: "color: red; font-weight: bold;", // Style pour les erreurs critiques.
        success: "color: green; font-weight: bold;", // Style pour les messages indiquant une réussite.
        default: "color: black;", // Style par défaut pour les messages qui ne correspondent pas à un type spécifique.
        test_start: "background-color: #4682B4; color: white; font-weight: bold;", // Style pour les logs de début de test.
        test_end: "background-color:#00CED1; color: black; font-weight: bold;", // Style pour les logs de fin de test.
    },

    /* ====== Icônes des logs ====== */
    LOG_ICONS: {
        info: 'ℹ️', // Icône pour les messages d'information.
        warn: '⚠️', // Icône pour les avertissements.
        error: '❌', // Icône pour les erreurs critiques.
        success: '✅', // Icône pour indiquer une réussite.
        default: '🔵', // Icône par défaut si le type de message n'est pas défini.
    },

    /* ====== Chemins des fichiers ====== */
    PATHS: {
        // === Chemins pour les données JSON ===
        DATA: {
            PHOTOGRAPHERS_JSON: getAbsolutePath('/assets/data/photographers.json'), // Données des photographes
        },

        // === Chemins pour les modules JS ===
        MODULES: {
            CONSTANTS: getAbsolutePath('/js/modules/constants.js'),
            DOM_SELECTORS: getAbsolutePath('/js/modules/domSelectors.js'),
            EVENT_LISTENERS: getAbsolutePath('/js/modules/eventListeners.js'),
            LIGHTBOX: getAbsolutePath('/js/modules/lightbox.js'),
            LISTENERS: getAbsolutePath('/js/modules/listeners.js'),
            MEDIA_MANAGER: getAbsolutePath('/js/modules/mediaManager.js'),
            MODAL_MANAGER: getAbsolutePath('/js/modules/modalManager.js'),
            PHOTOGRAPHER_MANAGER: getAbsolutePath('/js/modules/photographerManager.js'),
        },

        // === Chemins pour les templates ===
        TEMPLATES: {
            INDEX: getAbsolutePath('/js/templates/index.js'),
            MEDIA_TEMPLATE: getAbsolutePath('/js/templates/media-template-logic.js'),
            PHOTOGRAPHER_LOGIC: getAbsolutePath('/js/templates/photographer-logic.js'),
            PHOTOGRAPHER_PAGE: getAbsolutePath('/js/templates/photographer-page.js'),
        },

        // === Chemins pour les utilitaires ===
        UTILS: {
            ACCESSIBILITY: getAbsolutePath('/js/utils/accessibility.js'),
            CONTACT_FORM: getAbsolutePath('/js/utils/contactForm.js'),
            UTILS: getAbsolutePath('/js/utils/utils.js'),
            MAIN: getAbsolutePath('/js/utils/main.js'),
        },

        // === Chemins spécifiques aux assets ===
        ASSETS: {
            IMAGES: getAbsolutePath('/assets/images/'),
            VIDEOS: getAbsolutePath('/assets/videos/'),
            ICONS: getAbsolutePath('/assets/icons/'),
        },
    },
};
