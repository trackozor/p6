// ========================================================
// Nom du fichier : index.js
// Description    : Initialisation de l'application
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.1.0
// ========================================================

// Import des modules nécessaires
import { getPhotographers, displayData } from '/js/modules/photographerManager.js';
import { logEvent } from '/js/utils/utils.js'; // Utilitaire de logging

// Sélecteurs DOM
const photographersSection = document.querySelector(".photographer-section");

/**
 * Fonction d'initialisation principale.
 */
export async function init() {
    try {
        logEvent('test_start', "Initialisation de l'application");

        logEvent('info', "Récupération des données des photographes...");
        // Récupère les données des photographes
        const photographers = await getPhotographers();

        logEvent('info', "Affichage des photographes dans le DOM...");
        // Affiche les données dans le DOM
        displayData(photographers, photographersSection);

        logEvent('success', "Application initialisée avec succès.");
        logEvent('test_end', "Fin de l'initialisation de l'application");
    } catch (error) {
        logEvent('error', "Erreur critique lors de l'initialisation de l'application", { message: error.message });
        logEvent('test_end', "Initialisation échouée");
    }
}

// Lancer l'initialisation une fois le DOM prêt
document.addEventListener('DOMContentLoaded', init);
