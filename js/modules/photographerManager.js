/* photographerManager.js */

import { fetchJSON } from '/js/data/dataFetcher.js';
import { photographerTemplate } from '/js/templates/photographer-logic.js'; // Modèle pour les cartes
import { logEvent } from '/js/utils/utils.js';

// Chemin des données JSON
const PHOTOGRAPHERS_JSON_PATH = "/assets/data/photographers.json";

/**
 * Récupère les données des photographes depuis un fichier JSON.
 * @returns {Promise<Array>} Liste des photographes.
 */
export async function getPhotographers() {
    try {
        logEvent('test_start', "Début de la récupération des photographes");
        const data = await fetchJSON(PHOTOGRAPHERS_JSON_PATH);

        if (!data || !data.photographers) {
            logEvent('warn', "Aucune donnée de photographes trouvée dans le JSON");
            return [];
        }

        logEvent('success', "Données des photographes récupérées avec succès");
        return data.photographers;
    } catch (error) {
        logEvent('error', "Erreur lors de la récupération des photographes", { message: error.message });
        return [];
    }
}

/**
 * Affiche les données des photographes dans la section correspondante.
 * @param {Array} photographers - Liste des photographes à afficher.
 */
export function displayData(photographers, photographersSection) {
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
    } catch (error) {
        logEvent('error', "Erreur lors de l'affichage des photographes", { message: error.message });
    }
}
