// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe (détails et galerie)
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.4.0
// ========================================================

import { getPhotographersAndMedia, filterMediaByPhotographer, displayMedia } from '../modules/mediaManager.js';
import { logEvent } from '../utils/utils.js';
import domSelectors from '../modules/domSelectors.js';
import initEventListeners from '../modules/eventlisteners.js';

const BASE_ASSETS_PATH = '../../../assets/photographers';

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

        injectPhotographerDetails(photographer);

        const photographerMedia = filterMediaByPhotographer(media, photographer.id);
        displayMedia(photographerMedia, domSelectors.photographerPage.galleryContainer);

        logEvent('success', "Page photographe initialisée avec succès.");
    } catch (error) {
        handleError(error);
    } finally {
        logEvent('test_end', "Fin de l'initialisation de la page photographe.");
    }
}

/**
 * Récupère l'ID du photographe depuis l'URL.
 */
function getPhotographerIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Valide que l'ID du photographe est valide.
 */
function validatePhotographerId(photographerId) {
    if (!photographerId) {
        logEvent('warn', "L'ID du photographe est manquant ou invalide.");
        throw new Error("ID du photographe manquant ou invalide dans l'URL.");
    }
}

/**
 * Valide les données JSON récupérées.
 */
function validateData(photographers, media) {
    if (!Array.isArray(photographers) || photographers.length === 0) {
        throw new Error("Liste des photographes introuvable ou vide.");
    }
    if (!Array.isArray(media)) {
        throw new Error("Liste des médias introuvable ou invalide.");
    }
}

/**
 * Trouve le photographe correspondant à l'ID donné.
 */
function findPhotographer(photographers, photographerId) {
    const photographer = photographers.find(p => p.id === parseInt(photographerId, 10));
    if (!photographer) {
        logEvent('warn', `Photographe introuvable pour l'ID ${photographerId}.`);
        throw new Error(`Photographe avec l'ID ${photographerId} introuvable.`);
    }
    return photographer;
}

/**
 * Injecte les détails du photographe dans le DOM.
 */
function injectPhotographerDetails(photographer) {
    const { name, city, country, tagline, portrait, folderName } = photographer;

    domSelectors.photographerPage.photographerTitle.textContent = name;
    domSelectors.photographerPage.photographerLocation.textContent = `${city}, ${country}`;
    domSelectors.photographerPage.photographerTagline.textContent = tagline || "Pas de slogan disponible.";
    domSelectors.photographerPage.photographerProfileImage.src = `${BASE_ASSETS_PATH}/${folderName}/${portrait}`;
    domSelectors.photographerPage.photographerProfileImage.alt = `Portrait de ${name}`;
}

/**
 * Gère les erreurs et les affiche dans les logs.
 */
function handleError(error) {
    logEvent('error', "Erreur lors de l'initialisation de la page photographe.", {
        message: error.message,
        stack: error.stack,
    });
}

// Initialisation de la page photographe
document.addEventListener('DOMContentLoaded', () => {
    initPhotographerPage();
    initEventListeners();
});
