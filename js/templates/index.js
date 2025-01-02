/* ========================================================
 * Nom du fichier : photographer.js
 * Description    : Gestion des photographes et rendu dynamique
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 2.1.0
 * ======================================================== */

import { logEvent } from '/js/utils/utils.js'; // Utilitaire de logging
import { photographerTemplate } from '/js/templates/photographer-logic.js'; // Modèle de carte pour les photographes

// ----------------------------------------
// Variables globales
// ----------------------------------------

// Sélecteurs DOM
const photographersSection = document.querySelector(".photographer-section");

// Chemin vers les ressources JSON et images
const PHOTOGRAPHERS_JSON_PATH = "/assets/data/photographers.json";

// ----------------------------------------
// Fonctions utilitaires
// ----------------------------------------

/**
 * Récupère les données JSON depuis un chemin donné.
 * @param {string} path - Chemin vers le fichier JSON.
 * @returns {Promise<Object>} Les données JSON.
 */
async function fetchJSON(path) {
    try {
        logEvent('test_start', `Début de la récupération des données depuis ${path}`);
        const response = await fetch(path);

        // Vérifie si la réponse est valide
        if (!response.ok) {
            logEvent('warn', `Erreur lors de la récupération de ${path}`, { status: response.status });
            return null;
        }

        logEvent('success', `Données récupérées avec succès depuis ${path}`);
        logEvent('test_end', `Fin de la récupération des données depuis ${path}`);
        return await response.json();
    } catch (error) {
        logEvent('error', "Erreur lors du fetch JSON", { message: error.message, stack: error.stack });
        logEvent('test_end', `Récupération des données échouée depuis ${path}`);
        return null;
    }
}

// ----------------------------------------
// Gestion des photographes
// ----------------------------------------

/**
 * Récupère les données des photographes depuis un fichier JSON.
 * @returns {Promise<Array>} Liste des photographes.
 */
async function getPhotographers() {
    try {
        logEvent('test_start', "Début de la récupération des photographes");
        const data = await fetchJSON(PHOTOGRAPHERS_JSON_PATH);

        if (!data || !data.photographers) {
            logEvent('warn', "Aucune donnée de photographes trouvée dans le JSON");
            return [];
        }

        logEvent('success', "Données des photographes récupérées avec succès");
        logEvent('test_end', "Fin de la récupération des photographes");
        return data.photographers;
    } catch (error) {
        logEvent('error', "Erreur lors de la récupération des photographes", { message: error.message });
        logEvent('test_end', "Récupération des photographes échouée");
        return [];
    }
}

/**
 * Affiche les données des photographes dans la section correspondante.
 * @param {Array} photographers - Liste des photographes à afficher.
 */
function displayData(photographers) {
    try {
        logEvent('test_start', "Début de l'affichage des photographes");

        if (!photographers || photographers.length === 0) {
            logEvent('warn', "Aucun photographe à afficher");
            photographersSection.innerHTML = `<p>Aucun photographe trouvé.</p>`;
            return;
        }

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer); // Génération du modèle
            const userCardDOM = photographerModel.getUserCardDOM(); // Récupération de l'élément DOM
            photographersSection.appendChild(userCardDOM); // Ajout au DOM
        });

        logEvent('success', `${photographers.length} photographes affichés.`);
        logEvent('test_end', "Fin de l'affichage des photographes");
    } catch (error) {
        logEvent('error', "Erreur lors de l'affichage des photographes", { message: error.message });
        logEvent('test_end', "Affichage des photographes échoué");
    }
}

// ----------------------------------------
// Initialisation principale
// ----------------------------------------

/**
 * Fonction d'initialisation principale.
 */
export async function init() {
    try {
        logEvent('test_start', "Initialisation de l'application");

        logEvent('info', "Initialisation de l'application...");

        // Récupère les données des photographes
        const photographers = await getPhotographers();

        // Affiche les données dans le DOM
        displayData(photographers);

        logEvent('success', "Initialisation terminée avec succès.");
        logEvent('test_end', "Fin de l'initialisation de l'application");
    } catch (error) {
        logEvent('error', "Erreur critique lors de l'initialisation de l'application", { message: error.message });
        logEvent('test_end', "Initialisation échouée");
    }
}


