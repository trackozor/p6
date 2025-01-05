// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe (détails et galerie)
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.2.0
// ========================================================

import { getPhotographersAndMedia, filterMediaByPhotographer, displayMedia } from '/js/modules/mediaManager.js';
import { logEvent } from '/js/utils/utils.js'; // Gestion des logs
import domSelectors from '/js/modules/domSelectors.js'; // Sélecteurs DOM centralisés

/**
 * Initialise la page du photographe.
 * Cette fonction charge les données, injecte les détails du photographe et affiche les médias.
 */
async function initPhotographerPage() {
    try {
        logEvent('info', "Initialisation de la page photographe...");

        // === Étape 1 : Récupérer l'ID du photographe depuis l'URL ===
        const photographerId = getPhotographerIdFromURL();
        if (!photographerId) {
            throw new Error("ID du photographe manquant ou invalide dans l'URL.");
        }

        // === Étape 2 : Charger les données (photographes et médias) ===
        logEvent('info', "Récupération des données JSON...");
        const { photographers, media } = await getPhotographersAndMedia();

        // Trouver le photographe correspondant
        const photographer = photographers.find(p => p.id === parseInt(photographerId, 10));
        if (!photographer) {
            throw new Error(`Photographe avec l'ID ${photographerId} introuvable.`);
        }

        // === Étape 3 : Injecter les informations du photographe dans le DOM ===
        logEvent('info', "Injection des détails du photographe dans le DOM...");
        injectPhotographerDetails(photographer);

        // === Étape 4 : Filtrer et afficher les médias du photographe ===
        logEvent('info', `Filtrage des médias pour le photographe ID ${photographerId}...`);
        const photographerMedia = filterMediaByPhotographer(media, photographer.id);

        logEvent('info', `Affichage de ${photographerMedia.length} médias...`);
        displayMedia(photographerMedia, domSelectors.photographerPage.galleryContainer);

        logEvent('success', "Page photographe initialisée avec succès.");
    } catch (error) {
        logEvent('error', "Erreur lors de l'initialisation de la page photographe.", {
            message: error.message,
            stack: error.stack,
        });
    }
}

/**
 * Récupère l'ID du photographe depuis les paramètres de l'URL.
 * @returns {string|null} ID du photographe ou null si non trouvé.
 */
function getPhotographerIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Injecte les informations du photographe dans le DOM.
 * @param {Object} photographer - Données du photographe.
 */
function injectPhotographerDetails(photographer) {
    try {
        const { name, city, country, tagline, portrait } = photographer;

        // Mise à jour des éléments DOM
        domSelectors.photographerPage.photographerTitle.textContent = name;
        domSelectors.photographerPage.photographerLocation.textContent = `${city}, ${country}`;
        domSelectors.photographerPage.photographerTagline.textContent = tagline || "Pas de slogan disponible.";
        domSelectors.photographerPage.photographerProfileImage.src = `/assets/photographers/${name}/${portrait}`;
        domSelectors.photographerPage.photographerProfileImage.alt = `Portrait de ${name}`;

        logEvent('success', "Détails du photographe injectés dans le DOM avec succès.");
    } catch (error) {
        logEvent('error', "Erreur lors de l'initialisation de la page photographe.", {
            message: error.message,
            stack: error.stack,
        });
    }
}

// === Lancer l'initialisation lorsque le DOM est chargé ===
document.addEventListener('DOMContentLoaded', initPhotographerPage);
