/* =============================================================================
    Projet      : Fisheye
    Fichier     : constants.js
    Auteur      : trackozor
    Date        : 01/01/2025
    Version     : 1.3
    Description : Fichier centralisant toutes les constantes globales du projet.
                  Ce fichier inclut une gestion dynamique des chemins pour GitHub Pages
                  ou un environnement local, des configurations pour les logs et 
                  des styles CSS prédéfinis.
============================================================================= */

// === Détection de l'environnement (local ou GitHub Pages) ===
// Cette variable permet de différencier un environnement local (localhost)
// d'un environnement de production (hébergé sur GitHub Pages).
const ENVIRONMENT = window.location.hostname === 'username.github.io' ? 'production' : 'development';

// === Définition du chemin de base en fonction de l'environnement ===
// Le chemin de base est ajusté en fonction de l'environnement pour permettre
// un chargement correct des ressources (images, scripts, JSON, etc.).
const BASE_PATH = ENVIRONMENT === 'production' ? '/fisheye/' : './';

/* =============================================================================
    Configuration Globale de l'Application
============================================================================= */

export const CONFIGLOG = {
    /* -------------------------------------------------------------------------
        Informations sur l'Environnement
        - ENVIRONMENT : Permet de savoir si l'application est en production ou développement.
        - BASE_PATH : Préfixe des chemins pour les fichiers du projet.
    ------------------------------------------------------------------------- */
    ENVIRONMENT, // 'production' ou 'development'
    BASE_PATH,   // Préfixe des chemins relatifs (ajouté dynamiquement)

    /* -------------------------------------------------------------------------
        Configuration des Logs
        - Ces options permettent de personnaliser les messages dans la console.
        - Les logs peuvent être désactivés en production pour éviter les fuites
          d'informations sensibles.
    ------------------------------------------------------------------------- */
    ENABLE_LOGS: ENVIRONMENT === 'development', // Activer les logs uniquement en développement

    LOG_LEVELS: {
        default: true,                  // Activer les logs par défaut (génériques)
        info: ENVIRONMENT === 'development', // Logs d'information (dev uniquement)
        warn: true,                     // Logs d'avertissement (toujours activés)
        error: true,                    // Logs d'erreurs critiques (toujours activés)
        success: true,                  // Logs de succès (toujours activés)
        test_start: ENVIRONMENT === 'development', // Début des tests (dev uniquement)
        test_end: ENVIRONMENT === 'development',   // Fin des tests (dev uniquement)
    },

    /* -------------------------------------------------------------------------
        Classes CSS Utilisées
        - Ces classes CSS standardisées peuvent être appliquées aux éléments HTML
          pour styliser dynamiquement des erreurs, modales, etc.
    ------------------------------------------------------------------------- */
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input',     // Pour styliser un champ de formulaire invalide
        ERROR_MODAL: 'error-modal',     // Pour afficher une erreur dans une modale
        MODAL_ACTIVE: 'active',         // Indique qu'une modale est ouverte
        BODY_NO_SCROLL: 'no-scroll',    // Empêche le défilement du body lorsque la modale est ouverte
    },

    /* -------------------------------------------------------------------------
        Styles pour les Logs
        - Ces styles permettent de personnaliser les messages affichés dans la console.
        - Ils aident à identifier visuellement les différents types de logs.
    ------------------------------------------------------------------------- */
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;",      // Style pour les logs d'information
        warn: "color: orange; font-weight: bold;",    // Style pour les avertissements
        error: "color: red; font-weight: bold;",      // Style pour les erreurs critiques
        success: "color: green; font-weight: bold;",  // Style pour les succès
        default: "color: black;",                     // Style par défaut (neutre)
        test_start: "background-color: #4682B4; color: white; font-weight: bold;", // Style pour le début des tests
        test_end: "background-color:#00CED1; color: black; font-weight: bold;",    // Style pour la fin des tests
    },

    /* -------------------------------------------------------------------------
        Icônes des Logs
        - Ces icônes peuvent être utilisées pour rendre les logs plus visuels.
        - Chaque type de log est associé à une icône descriptive.
    ------------------------------------------------------------------------- */
    LOG_ICONS: {
        info: 'ℹ️',      // Icône pour les messages d'information
        warn: '⚠️',      // Icône pour les avertissements
        error: '❌',      // Icône pour les erreurs critiques
        success: '✅',    // Icône pour indiquer un succès
        default: '🔵',    // Icône par défaut (neutre)
    },

    /* -------------------------------------------------------------------------
        Chemins des Fichiers et des Ressources
        - Centralisation des chemins pour les fichiers JSON, images, vidéos, etc.
        - Utilise BASE_PATH pour ajuster dynamiquement les chemins en fonction
          de l'environnement (local ou production).
    ------------------------------------------------------------------------- */
    PATHS: {
        // === Données JSON ===
        DATA: {
            PHOTOGRAPHERS_JSON: `${BASE_PATH}assets/data/photographers.json`, // Fichier JSON des photographes
        },

        // === Ressources Statiques (Assets) ===
        ASSETS: {
            IMAGES: `${BASE_PATH}assets/images/`, // Dossier contenant les images
            VIDEOS: `${BASE_PATH}assets/videos/`, // Dossier contenant les vidéos
            ICONS: `${BASE_PATH}assets/icons/`,   // Dossier contenant les icônes
        },
    },
};
