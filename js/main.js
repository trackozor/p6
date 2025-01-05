/* =============================================================================
    Projet      : Fisheye
    Fichier     : main.js
    Auteur      : [Votre nom ou équipe]
    Date        : [Date de création ou mise à jour]
    Version     : [Numéro de version]
    Description : Point d'entrée principal de l'application
============================================================================= */

// Import des modules nécessaires
import { logEvent } from '/js/utils/utils.js';
import { init } from '/js/templates/index.js';

/**
 * Fonction principale de l'application.
 */
function main() {
    try {
        logEvent('info', "Lancement de l'application...");

        // Initialisation principale
        init();

        logEvent('success', "Application lancée avec succès.");
    } catch (error) {
        logEvent('error', "Erreur critique lors du lancement de l'application", {
            message: error.message,
            stack: error.stack,
        });
    }
}

// Exécution de la fonction principale lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', main);
