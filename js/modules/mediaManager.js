// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et affichage dans la galerie
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.3.1
// ========================================================

import { fetchJSON } from '../data/dataFetcher.js';
import { logEvent } from '../utils/utils.js';

// Chemin vers le fichier JSON contenant les photographes et médias
const DATA_JSON_PATH = '../../../assets/data/photographers.json';

/**
 * ========================================================
 * Fonction : getPhotographersAndMedia
 * Description : Récupère les données des photographes et des médias
 * ========================================================
 */
export async function getPhotographersAndMedia() {
    logEvent('test_start', "Début de la récupération des données JSON...");

    try {
        const data = await fetchJSON(DATA_JSON_PATH);

        if (!data || !Array.isArray(data.photographers) || !Array.isArray(data.media)) {
            throw new Error("Structure JSON invalide ou données absentes.");
        }

        logEvent('success', "Données JSON récupérées avec succès.", {
            photographersCount: data.photographers.length,
            mediaCount: data.media.length,
        });

        logEvent('test_end', "Fin de la récupération des données JSON.");
        return { photographers: data.photographers, media: data.media };
    } catch (error) {
        logEvent('error', "Erreur lors de la récupération des données JSON.", {
            message: error.message,
            stack: error.stack,
        });
        logEvent('test_end', "Fin de la tentative de récupération des données JSON avec erreur.");
        return { photographers: [], media: [] };
    }
}

/**
 * ========================================================
 * Fonction : filterMediaByPhotographer
 * Description : Filtre les médias pour un photographe spécifique
 * ========================================================
 * @param {Array} mediaList - Liste complète des médias.
 * @param {number} photographerId - ID du photographe.
 * @returns {Array} Médias filtrés pour le photographe.
 */
export function filterMediaByPhotographer(mediaList, photographerId) {
    logEvent('test_start', `Début du filtrage des médias pour le photographe ID ${photographerId}...`);

    const filteredMedia = mediaList.filter(media => media.photographerId === photographerId);

    logEvent('info', `Médias filtrés pour le photographe ID ${photographerId}.`, {
        totalFilteredMedia: filteredMedia.length,
    });

    logEvent('test_end', `Fin du filtrage des médias pour le photographe ID ${photographerId}.`);
    return filteredMedia;
}

/**
 * ========================================================
 * Fonction : displayMedia
 * Description : Génère et affiche les médias dans la galerie
 * ========================================================
 * @param {Array} mediaList - Liste des médias à afficher.
 * @param {HTMLElement} galleryContainer - Conteneur de la galerie.
 */
export function displayMedia(mediaList, galleryContainer) {
    logEvent('test_start', "Début de l'affichage des médias dans la galerie...");

    galleryContainer.innerHTML = ''; // Réinitialiser la galerie

    if (!mediaList || mediaList.length === 0) {
        galleryContainer.innerHTML = `<p>Aucune œuvre trouvée pour ce photographe.</p>`;
        logEvent('warn', "Aucun média à afficher.");
        logEvent('test_end', "Fin de l'affichage des médias (aucun média trouvé).");
        return;
    }

    mediaList.forEach(media => {
        const mediaSrc = media.image
            ? `../../../assets/photographers/${media.folderName}/${media.image}`
            : `../../../assets/photographers/${media.folderName}/${media.video}`;

        const figure = document.createElement('figure');
        figure.classList.add('gallery-item');
        figure.setAttribute('tabindex', '0');

        const mediaElement = media.image ? document.createElement('img') : document.createElement('video');
        mediaElement.src = mediaSrc;
        mediaElement.alt = media.title || 'Œuvre sans titre';

        if (media.video) {
            mediaElement.controls = true;
        }

        const caption = document.createElement('figcaption');
        caption.textContent = media.title || 'Œuvre sans titre';

        figure.appendChild(mediaElement);
        figure.appendChild(caption);
        galleryContainer.appendChild(figure);
    });

    logEvent('success', `${mediaList.length} médias affichés dans la galerie.`);
    logEvent('test_end', "Fin de l'affichage des médias dans la galerie.");
}
