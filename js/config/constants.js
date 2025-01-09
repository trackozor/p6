/* =============================================================================
    Projet      : Fisheye
    Fichier     : constants.js
    Auteur      : trackozor
    Date        : 01/01/2025
    Version     : 1.3
    Description : Fichier centralisant toutes les constantes globales du projet.
                  Gère les chemins dynamiques pour GitHub Pages ou environnement local,
                  les configurations de logs et les styles CSS standardisés.
============================================================================= */

// =============================================================================
// Détection de l'environnement (local ou GitHub Pages)
// =============================================================================

// Différencie l'environnement local (localhost) de la production (GitHub Pages).
const ENVIRONMENT = window.location.hostname === 'username.github.io' ? 'production' : 'development';

// Permet de forcer le mode développement, quelle que soit l'URL.
let FORCE_DEV_MODE = false;

// Déterminer l'environnement actif.
const ACTIVE_ENVIRONMENT = FORCE_DEV_MODE ? 'development' : ENVIRONMENT;

// Définir le chemin de base en fonction de l'environnement pour un chargement correct des ressources.
const BASE_PATH = ENVIRONMENT === 'production' ? '/fisheye/' : './';

// =============================================================================
// Configuration Globale de l'Application
// =============================================================================

export const CONFIGLOG = {
    // -------------------------------------------------------------------------
    // Informations sur l'Environnement
    // -------------------------------------------------------------------------
    ENVIRONMENT: ACTIVE_ENVIRONMENT, // Environnement actif
    ENABLE_LOGS: ACTIVE_ENVIRONMENT === 'development', // Activer les logs uniquement en dev

    // -------------------------------------------------------------------------
    // Configuration des Logs
    // -------------------------------------------------------------------------
    LOG_LEVELS: {
        default: true, // Logs génériques toujours activés
        info: ACTIVE_ENVIRONMENT === 'development', // Logs d'information (dev uniquement)
        warn: true, // Logs d'avertissement activés en tout temps
        error: true, // Logs d'erreurs critiques toujours activés
        success: true, // Logs de succès toujours activés
        test_start: ACTIVE_ENVIRONMENT === 'development', // Début des tests (dev uniquement)
        test_end: ACTIVE_ENVIRONMENT === 'development', // Fin des tests (dev uniquement)
    },

    // Configuration personnalisée des logs.
    CUSTOM_LOG_SETTING: {
        info: true, 
        test_start: true,
        test_end: true,
        warn: true,
        error: true,
        success: true,
    },

    // -------------------------------------------------------------------------
    // Classes CSS Utilisées
    // -------------------------------------------------------------------------
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input', // Champ invalide
        ERROR_MODAL: 'error-modal', // Modale d'erreur
        MODAL_ACTIVE: 'active', // Indicateur de modale ouverte
        BODY_NO_SCROLL: 'no-scroll', // Bloque le défilement quand la modale est active
    },

    // -------------------------------------------------------------------------
    // Styles pour les Logs
    // -------------------------------------------------------------------------
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;", // Information
        warn: "color: orange; font-weight: bold;", // Avertissements
        error: "color: red; font-weight: bold;", // Erreurs critiques
        success: "color: green; font-weight: bold;", // Succès
        default: "color: black;", // Neutre
        test_start: "background-color: purple; color: white; font-weight: bold;", // Début des tests
        test_end: "background-color: brown; color: white; font-weight: bold;", // Fin des tests
    },

    // -------------------------------------------------------------------------
    // Icônes des Logs
    // -------------------------------------------------------------------------
    LOG_ICONS: {
        info: 'ℹ️', // Information
        warn: '⚠️', // Avertissements
        error: '❌', // Erreurs critiques
        success: '✅', // Succès
        default: '🔵', // Neutre
        test_start: '🔧',  // Début des tests
        est_end: '🏁',    // Fin des tests
    },

    // -------------------------------------------------------------------------
    // Chemins des Fichiers et des Ressources
    // -------------------------------------------------------------------------
    PATHS: {
        // Données JSON
        DATA: {
            PHOTOGRAPHERS_JSON: `${BASE_PATH}assets/data/photographers.json`, // Données des photographes
        },

        // Ressources Statiques (Assets)
        ASSETS: {
            IMAGES: `${BASE_PATH}assets/images/`, // Dossier des images
            VIDEOS: `${BASE_PATH}assets/videos/`, // Dossier des vidéos
            ICONS: `${BASE_PATH}assets/icons/`, // Dossier des icônes
        },
    },
};
