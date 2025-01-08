// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et affichage dans la galerie
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.3.0
// ========================================================

// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et affichage dans la galerie
// ========================================================

import { fetchJSON } from '../data/dataFetcher.js';
import { logEvent } from '../utils/utils.js';

// Chemin vers le fichier JSON contenant les photographes et médias
const DATA_JSON_PATH = '../../../assets/data/photographers.json';

/**
 * Récupère les données des photographes et des médias.
 */
export async function getPhotographersAndMedia() {
    try {
        logEvent('info', "Début de la récupération des données JSON...");
        const data = await fetchJSON(DATA_JSON_PATH);

        if (!data || !Array.isArray(data.photographers) || !Array.isArray(data.media)) {
            throw new Error("Structure JSON invalide ou données absentes.");
        }

        logEvent('success', "Données JSON récupérées avec succès.", {
            photographersCount: data.photographers.length,
            mediaCount: data.media.length,
        });

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
 */
export function filterMediaByPhotographer(mediaList, photographerId) {
    const filteredMedia = mediaList.filter(media => media.photographerId === photographerId);
    logEvent('info', `Médias filtrés pour le photographe ID ${photographerId}.`, {
        totalFilteredMedia: filteredMedia.length,
    });
    return filteredMedia;
}

/**
 * Affiche les médias dans la galerie.
 */
export function displayMedia(mediaList, galleryContainer) {
    galleryContainer.innerHTML = ''; // Réinitialiser la galerie

    if (!mediaList || mediaList.length === 0) {
        galleryContainer.innerHTML = `<p>Aucune œuvre trouvée pour ce photographe.</p>`;
        logEvent('warn', "Aucun média à afficher.");
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
}
