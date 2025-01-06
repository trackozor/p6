// ========================================================
// Nom du fichier : index.js
// Description    : Initialisation de l'application Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.1.0
// ========================================================

/**
 * Fichier principal de l'application. 
 * Ce fichier initialise l'application en récupérant les données des photographes
 * et en les affichant dynamiquement sur la page principale.
 */

// === Importation des modules nécessaires ===
import { getPhotographers, displayData } from '../modules/photographerManager.js';
import { logEvent } from '../utils/utils.js'; // Utilitaire pour journaliser les événements
import domSelectors from '../modules/domSelectors.js'; // Sélecteurs DOM centralisés

/**
 * Fonction d'initialisation principale.
 * Cette fonction gère les étapes suivantes :
 * - Journalisation du démarrage de l'application.
 * - Récupération des données des photographes depuis une source externe.
 * - Affichage dynamique des photographes dans le DOM.
 * - Gestion des erreurs critiques pour garantir la stabilité.
 * 
 * @async
 * @function init
 * @returns {Promise<void>} Rien.
 */
export async function init() {
    try {
        // === Étape 1 : Journalisation de l'initialisation ===
        logEvent('test_start', "Initialisation de l'application");

        // === Étape 2 : Récupération des données des photographes ===
        logEvent('info', "Récupération des données des photographes...");
        const photographers = await getPhotographers(); // Appel à la fonction pour récupérer les données

        // Vérification des données reçues
        if (!Array.isArray(photographers)) {
            throw new Error("Les données récupérées ne sont pas valides ou non formatées correctement.");
        }

        // === Étape 3 : Affichage des photographes dans le DOM ===
        logEvent('info', "Affichage des photographes dans le DOM...");
        displayData(photographers, domSelectors.indexPage.photographersContainer);

        // === Étape 4 : Journalisation du succès ===
        logEvent('success', "Application initialisée avec succès.");
        logEvent('test_end', "Fin de l'initialisation de l'application");

    } catch (error) {
        // === Gestion des erreurs critiques ===
        logEvent('error', "Erreur critique lors de l'initialisation de l'application", {
            message: error.message,
            stack: error.stack,
        });
        logEvent('test_end', "Initialisation échouée");
    }
}

// === Ajout d'un écouteur pour lancer l'initialisation une fois le DOM chargé ===
document.addEventListener('DOMContentLoaded', init);
