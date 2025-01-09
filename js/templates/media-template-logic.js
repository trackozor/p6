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
 *                 isValidMedia
 * ========================================================
 * 
 * Description : Vérifie si un média possède toutes les propriétés requises.
 * 
 *
 * @param {Object} media - Objet média à valider.
 * @returns {boolean} `true` si le média est valide, sinon `false`.
 */
function isValidMedia(media) {
    return (
        typeof media === 'object' &&
        media.id &&
        media.photographerId &&
        (media.image || media.video)
    );
}


/**
 * ========================================================
 *               getMedia
 * ========================================================
 * 
 * Description : 
 * Récupère les données des médias depuis un fichier JSON et retourne uniquement
 * les médias valides.
 *
 * Étapes principales :
 * - Appelle le fichier JSON contenant les données des médias.
 * - Valide le format des données reçues.
 * - Filtre les médias pour ne conserver que les éléments valides.
 *
 * @async
 * @returns {Promise<Array>} Une liste de médias valides ou un tableau vide en cas d'erreur.
 */
export async function getMedia() {
    logEvent('test_start', "Début de la récupération des médias depuis JSON...");

    try {
        logEvent('info', "Récupération des données des médias...");

        // Récupérer les données du fichier JSON
        const data = await fetchJSON(MEDIA_JSON_PATH);

        if (!data || typeof data !== 'object' || !Array.isArray(data.media)) {
            logEvent('warn', "Les données des médias sont absentes ou mal formatées.");
            return [];
        }

        // Filtrer les médias valides
        const validMedia = data.media.filter(isValidMedia);

        logEvent('success', "Données des médias récupérées avec succès.", {
            totalMedia: data.media.length,
            validMedia: validMedia.length,
        });

        logEvent('test_end', "Fin de la récupération des médias depuis JSON.");
        return validMedia;
    } catch (error) {
        logEvent('error', "Erreur lors de la récupération des médias.", {
            message: error.message,
            stack: error.stack,
        });

        logEvent('test_end', "Fin de la récupération des médias avec erreur.");
        return [];
    }
}

/**
 * ========================================================
 *               filterMediaByPhotographer
 * ========================================================
 * 
 * Description : Filtre les médias en fonction de l'ID du photographe.
 *
 * Cette fonction prend une liste de médias et retourne uniquement les éléments
 * correspondant à l'ID du photographe spécifié.
 *
 * @param {Array} mediaList - Liste des médias à filtrer.
 * @param {number} photographerId - ID unique du photographe.
 * @returns {Array} Liste des médias appartenant au photographe spécifié.
 */
export function filterMediaByPhotographer(mediaList, photographerId) {
    logEvent('test_start', `Début du filtrage des médias pour le photographe ID ${photographerId}...`);

    if (!Array.isArray(mediaList) || typeof photographerId !== 'number') {
        logEvent('warn', "Paramètres invalides pour le filtrage des médias.");
        logEvent('test_end', "Fin du filtrage des médias (échec).");
        return [];
    }

    const filteredMedia = mediaList.filter(media => media.photographerId === photographerId);

    logEvent('success', `Médias filtrés pour le photographe ID ${photographerId}.`, {
        totalFilteredMedia: filteredMedia.length,
    });

    logEvent('test_end', `Fin du filtrage des médias pour le photographe ID ${photographerId}.`);
    return filteredMedia;
}