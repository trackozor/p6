// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et opérations associées.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.3.1
// ========================================================

import { fetchJSON } from '../data/dataFetcher.js'; // Utilise fetchJSON pour standardiser l'appel réseau.
import { logEvent } from '../utils/utils.js'; // Utilitaire pour enregistrer les événements dans les logs.

// ========================================================
// Constante : Chemin vers le fichier JSON contenant les médias.
// ========================================================
const MEDIA_JSON_PATH = "../../assets/data/media.json";

/**
 * ========================================================
 * Fonction : isValidMedia
 * Description : Vérifie si un média possède toutes les propriétés requises.
 * ========================================================
 * @param {Object} media - Objet média à valider.
 * @returns {boolean} `true` si le média est valide, sinon `false`.
 */
function isValidMedia(media) {
    return media.id && media.photographerId && (media.image || media.video);
}

/**
 * ========================================================
 * Fonction : getMedia
 * Description : Récupère les données des médias depuis un fichier JSON
 * et retourne uniquement les médias valides.
 * ========================================================
 * @async
 * @returns {Promise<Array>} Une liste de médias valides ou un tableau vide en cas d'erreur.
 */
export async function getMedia() {
    // Log début du processus
    logEvent('test_start', "Début de la récupération des médias depuis JSON...");

    try {
        logEvent('info', "Récupération des données des médias...");
        
        // Appel à fetchJSON pour récupérer les données depuis le fichier JSON
        const data = await fetchJSON(MEDIA_JSON_PATH);

        // Vérifie que les données récupérées sont au bon format
        if (!data || typeof data !== 'object' || !Array.isArray(data.media)) {
            logEvent('warn', "Les données des médias sont absentes ou mal formatées.");
            return [];
        }

        // Filtrage des médias pour ne conserver que ceux qui sont valides
        const validMedia = data.media.filter(isValidMedia);

        // Log succès
        logEvent('success', "Données des médias récupérées avec succès.", {
            totalMedia: data.media.length,
            validMedia: validMedia.length,
        });

        // Log fin du processus
        logEvent('test_end', "Fin de la récupération des médias depuis JSON.");
        return validMedia;
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', "Erreur lors de la récupération des médias.", {
            message: error.message,
            stack: error.stack,
        });

        // Log fin en cas d'erreur
        logEvent('test_end', "Fin de la récupération des médias avec erreur.");
        return [];
    }
}

/**
 * ========================================================
 * Fonction : filterMediaByPhotographer
 * Description : Filtre les médias en fonction de l'ID du photographe.
 * ========================================================
 * @param {Array} mediaList - Liste des médias à filtrer.
 * @param {number} photographerId - ID unique du photographe.
 * @returns {Array} Liste des médias appartenant au photographe spécifié.
 */
export function filterMediaByPhotographer(mediaList, photographerId) {
    // Log début du filtrage
    logEvent('test_start', `Début du filtrage des médias pour le photographe ID ${photographerId}...`);

    // Validation des paramètres
    if (!Array.isArray(mediaList) || typeof photographerId !== 'number') {
        logEvent('warn', "Paramètres invalides pour le filtrage des médias.");
        logEvent('test_end', "Fin du filtrage des médias (échec).");
        return [];
    }

    // Filtrer les médias en fonction de l'ID du photographe
    const filteredMedia = mediaList.filter(media => media.photographerId === photographerId);

    // Log succès du filtrage
    logEvent('success', `Médias filtrés pour le photographe ID ${photographerId}.`, {
        totalFilteredMedia: filteredMedia.length,
    });

    // Log fin du filtrage
    logEvent('test_end', `Fin du filtrage des médias pour le photographe ID ${photographerId}.`);
    return filteredMedia;
}
