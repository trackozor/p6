// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe (détails et galerie)
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.4.1
// ========================================================

import { getPhotographersAndMedia, filterMediaByPhotographer, displayMedia } from '../modules/mediaManager.js';
import { logEvent } from '../utils/utils.js';
import domSelectors from '../modules/domSelectors.js';
import initEventListeners from '../modules/eventlisteners.js';


/**
 * Initialise la page du photographe.
 */
async function initPhotographerPage() {
    logEvent('test_start', "Initialisation de la page photographe...");

    try {
        const photographerId = getPhotographerIdFromURL();
        validatePhotographerId(photographerId);

        const { photographers, media } = await getPhotographersAndMedia();
        validateData(photographers, media);

        const photographer = findPhotographer(photographers, photographerId);


        const photographerMedia = filterMediaByPhotographer(media, photographer.id);
        displayMedia(photographerMedia, domSelectors.photographerPage.galleryContainer);

        logEvent('success', "Page photographe initialisée avec succès.");
 

    } finally {
        logEvent('test_end', "Fin de l'initialisation de la page photographe.");
    }
}

function getPhotographerIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log(`Photographer ID from URL: ${id}`);
    return id;
}

function validatePhotographerId(photographerId) {
    if (!photographerId) {
        logEvent('warn', "L'ID du photographe est manquant ou invalide.");
        throw new Error("ID du photographe manquant ou invalide dans l'URL.");
    }
}

function validateData(photographers, media) {
    if (!Array.isArray(photographers) || photographers.length === 0) {
        throw new Error("Liste des photographes introuvable ou vide.");
    }
    if (!Array.isArray(media)) {
        throw new Error("Liste des médias introuvable ou invalide.");
    }
}

function findPhotographer(photographers, photographerId) {
    const photographer = photographers.find(p => p.id === Number(photographerId));
    if (!photographer) {
        logEvent('warn', `Photographe introuvable pour l'ID ${photographerId}.`);
        throw new Error(`Photographe avec l'ID ${photographerId} introuvable.`);
    }
    return photographer;
}
;

    // Afficher un message d'erreur dans le DO


document.addEventListener('DOMContentLoaded', () => {
    initPhotographerPage();
    initEventListeners();
});
