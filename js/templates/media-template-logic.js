import { fetchJSON } from '/js/data/dataFetcher.js'; // Utilise fetchJSON pour standardiser l'appel réseau
import { logEvent } from '/js/utils/utils.js'; // Utilitaire pour le logging

// Chemin vers le fichier JSON des médias
const MEDIA_JSON_PATH = "/assets/data/media.json";

/**
 * Récupère les médias depuis un fichier JSON via `fetchJSON`.
 * @returns {Promise<Array>} Une liste de médias ou un tableau vide en cas d'erreur.
 */
export async function getMedia() {
    try {
        logEvent('info', "Récupération des données des médias...");

        // Appel à fetchJSON pour récupérer les données des médias
        const data = await fetchJSON(MEDIA_JSON_PATH);

        // Validation des données récupérées
        if (!data || typeof data !== 'object' || !Array.isArray(data.media)) {
            logEvent('warn', "Les données des médias sont absentes ou mal formatées.");
            return [];
        }

        logEvent('success', "Données des médias récupérées avec succès.");
        return data.media; // Retourne la liste des médias
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', "Erreur lors de la récupération des médias.", {
            message: error.message,
            stack: error.stack,
        });
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

/**
 * Filtre les médias en fonction de l'ID du photographe.
 * @param {Array} mediaList - Liste des médias.
 * @param {number} photographerId - ID du photographe.
 * @returns {Array} Liste des médias appartenant au photographe spécifié.
 */
export function filterMediaByPhotographer(mediaList, photographerId) {
    if (!Array.isArray(mediaList) || typeof photographerId !== 'number') {
        logEvent('warn', "Paramètres invalides pour le filtrage des médias.");
        return [];
    }

    const filteredMedia = mediaList.filter(media => media.photographerId === photographerId);
    logEvent('info', `Médias filtrés pour le photographe ID ${photographerId}: ${filteredMedia.length} trouvés.`);
    return filteredMedia;
}

