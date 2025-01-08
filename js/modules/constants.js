/* =============================================================================
    Projet      : Fisheye
    Fichier     : constant.js
    Auteur      : trackozor
    Date        : 01/01/2025
    Version     : 1.0
    Description : fichier englobant toutes les variables utilisables pour les scripts
============================================================================= */

export const CONFIGLOG= {
     /* ====== Configuration des logs ====== */
    ENABLE_LOGS: true, // Permet d'activer ou de désactiver les logs dans la console. Utile pour basculer entre les environnements (développement/production).
    
     /* ====== Niveaux de Logs ====== */
    LOG_LEVELS: {
        default: true,
        info: true,  // Activer/Désactiver  les logs d'information
        warn: true,  //                     les avertissements
        error: true, //                     les erreurs
        success: true, //                   les succès
        test_start: true, //                les démarrage de tests
        test_end:true, //                   les fins de tests
    },

    /*====== Classes CSS utilisées ======*/
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input', // Classe CSS pour styliser un champ avec une erreur (ex : bordure rouge).
        ERROR_MODAL: 'error-modal', // Classe CSS pour afficher une erreur dans la modale.
        MODAL_ACTIVE: 'active',  // Classe CSS pour indiquer qu'une modale est active et visible.
        BODY_NO_SCROLL: 'no-scroll', // Classe CSS pour empêcher le défilement de la page lorsque la modale est ouverte.
    },


    /*====== styles tag log ======*/
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;", // Style pour les messages d'information.
        warn: "color: orange; font-weight: bold;", // Style pour les avertissements.
        error: "color: red; font-weight: bold;", // Style pour les erreurs critiques.
        success: "color: green; font-weight: bold;", // Style pour les messages indiquant une réussite.
        default: "color: black;", // Style par défaut pour les messages qui ne correspondent pas à un type spécifique.
        test_start: "background-color: #4682B4; color: white; font-weight: bold;", // Style pour la checkbox d'info
        test_end:"background-color:#00CED1; color: black; font-weight: bold;", // Style pour la checkbox d'info
    },

    /*====== styles icône log ======*/
    LOG_ICONS: {
        info: 'ℹ️',  // Icône pour les messages d'information.
        warn: '⚠️', // Icône pour les avertissements.
        error: '❌', // Icône pour les erreurs critiques.
        success: '✅', // Icône pour indiquer une réussite.
        default: '🔵', // Icône par défaut si le type de message n'est pas défini.
    },

    // Variable globale pour suivre l'état de la modale
};
