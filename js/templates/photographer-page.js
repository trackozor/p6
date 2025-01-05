// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe (détails et galerie)
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.1.0
// ========================================================

import { getPhotographersAndMedia, filterMediaByPhotographer, displayMedia } from '/js/modules/mediaManager.js';
import { logEvent } from '/js/utils/utils.js'; // Logging des événements
import domSelectors from '/js/modules/domSelectors.js'; // Centralisation des sélecteurs DOM

/**
 * Initialise la page du photographe.
 */
async function initPhotographerPage() {
    try {
        // Étape 1 : Récupérer l'ID du photographe depuis l'URL
        const photographerId = getPhotographerIdFromURL();
        if (!photographerId) {
            logEvent('error', "ID du photographe manquant dans l'URL.");
            return;
        }

        // Étape 2 : Récupérer les données des photographes et médias
        const { photographers, media } = await getPhotographersAndMedia();

        // Trouver le photographe
        const photographer = photographers.find(p => p.id === parseInt(photographerId, 10));
        if (!photographer) {
            logEvent('error', "Photographe introuvable.");
            return;
        }

        // Injecter les informations du photographe dans le DOM
        injectPhotographerDetails(photographer);

        // Étape 3 : Filtrer et afficher les médias pour ce photographe
        const photographerMedia = filterMediaByPhotographer(media, photographer.id);
        displayMedia(photographerMedia, domSelectors.photographerPage.galleryContainer);

        logEvent('success', "Page photographe initialisée avec succès.");
    } catch (error) {
        logEvent('error', "Erreur lors de l'initialisation de la page du photographe.", {
            message: error.message,
            stack: error.stack,
        });
    }
}

/**
 * Récupère l'ID du photographe depuis les paramètres de l'URL.
 */
function getPhotographerIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Injecte les informations du photographe dans le DOM.
 */
function injectPhotographerDetails(photographer) {
    const { name, city, country, tagline, portrait } = photographer;

    domSelectors.photographerPage.photographerTitle.textContent = name;
    domSelectors.photographerPage.photographerLocation.textContent = `${city}, ${country}`;
    domSelectors.photographerPage.photographerTagline.textContent = tagline || "Pas de slogan disponible.";
    domSelectors.photographerPage.photographerProfileImage.src = `/assets/photographers/${photographer.portrait}`;
    domSelectors.photographerPage.photographerProfileImage.alt = `Portrait de ${name}`;
}

// Lancer l'initialisation
document.addEventListener('DOMContentLoaded', initPhotographerPage);
