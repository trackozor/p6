/* ========================================================
 * Nom du fichier : photographer.js
 * Description    : Gestion des photographes et rendu dynamique
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 2.0.0
 * ======================================================== */

import { logEvent } from '/js/utils/utils.js'; // Utilitaire de logging
import { photographerTemplate } from '/js/templates/photographer.js'; // Modèle de carte pour les photographes

// ----------------------------------------
// Variables globales
// ----------------------------------------

// Sélecteurs DOM
const photographersSection = document.querySelector(".photographer_section");

// Chemin vers les ressources JSON et images
const PHOTOGRAPHERS_JSON_PATH = "/assets/data/photographers.json";
const PHOTO_BASE_PATH = "/assets/images/photographers/"; // Dossier contenant les photos des photographes

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
        const response = await fetch(path);

        // Vérifie si la réponse est valide
        if (!response.ok) {
            logEvent('warn', `Erreur lors de la récupération de ${path}`, { status: response.status });
            return null;
        }

        logEvent('info', `Données récupérées avec succès depuis ${path}`);
        return await response.json();
    } catch (error) {
        logEvent('error', "Erreur lors du fetch JSON", { message: error.message, stack: error.stack });
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
    const data = await fetchJSON(PHOTOGRAPHERS_JSON_PATH);
    return data ? data.photographers : [];
}

/**
 * Affiche les données des photographes dans la section correspondante.
 * @param {Array} photographers - Liste des photographes à afficher.
 */
function displayData(photographers) {
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

    logEvent('info', `${photographers.length} photographes affichés.`);
}

// ----------------------------------------
// Initialisation principale
// ----------------------------------------

/**
 * Fonction d'initialisation principale.
 */
async function init() {
    logEvent('info', "Initialisation de l'application...");

    // Récupère les données des photographes
    const photographers = await getPhotographers();

    // Affiche les données dans le DOM
    displayData(photographers);

    logEvent('info', "Initialisation terminée.");
}

// ----------------------------------------
// Exécution
// ----------------------------------------
init();
