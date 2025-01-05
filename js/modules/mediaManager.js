// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et affichage dans la galerie
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.1.0
// ========================================================

import { fetchJSON } from '/js/data/dataFetcher.js'; // Standardisation des appels réseau
import { logEvent } from '/js/utils/utils.js'; // Logging des événements

// Chemin vers le fichier JSON contenant photographes et médias
const DATA_JSON_PATH = '/assets/data/photographers.json';

/**
 * Récupère tous les photographes et médias depuis le fichier JSON.
 * @returns {Promise<Object>} Un objet contenant `photographers` et `media`.
 */
export async function getPhotographersAndMedia() {
    try {
        logEvent('info', "Récupération des données JSON (photographes et médias)...");
        const data = await fetchJSON(DATA_JSON_PATH);

        if (!data || !Array.isArray(data.photographers) || !Array.isArray(data.media)) {
            logEvent('warn', "Structure JSON invalide ou données absentes.");
            return { photographers: [], media: [] };
        }

        logEvent('success', "Données JSON récupérées avec succès.");
        return { photographers: data.photographers, media: data.media };
    } catch (error) {
        logEvent('error', "Erreur lors de la récupération des données JSON.", {
            message: error.message,
            stack: error.stack,
        });
        return { photographers: [], media: [] };
    }
}

/**
 * Filtre les médias pour un photographe spécifique.
 * @param {Array} mediaList - Liste complète des médias.
 * @param {number} photographerId - ID du photographe.
 * @returns {Array} Liste des médias appartenant au photographe.
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

/**
 * Affiche les médias dans une galerie pour un photographe donné.
 * @param {Array} mediaList - Liste des médias à afficher.
 * @param {HTMLElement} galleryContainer - Conteneur de la galerie.
 */
export function displayMedia(mediaList, galleryContainer) {
    galleryContainer.innerHTML = ''; // Réinitialiser la galerie

    if (!mediaList || mediaList.length === 0) {
        galleryContainer.innerHTML = `<p>Aucune œuvre trouvée pour ce photographe.</p>`;
        return;
    }

    // Parcourir et afficher chaque média
    mediaList.forEach(media => {
        const mediaSrc = media.image
            ? `/assets/photographers/${media.photographerId}/${media.image}`
            : `/assets/photographers/${media.photographerId}/${media.video}`;

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
        caption.textContent = media.title;

        figure.appendChild(mediaElement);
        figure.appendChild(caption);

        galleryContainer.appendChild(figure);
    });

    logEvent('success', `${mediaList.length} médias affichés.`);
}
