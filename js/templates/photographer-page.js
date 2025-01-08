// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe (détails et galerie)
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.3.0
// ========================================================

import { getPhotographersAndMedia, filterMediaByPhotographer, displayMedia } from '../modules/mediaManager.js';
import { logEvent } from '../utils/utils.js';
import domSelectors from '../modules/domSelectors.js';
import initEventListeners from '../modules/eventlisteners.js';

async function initPhotographerPage() {
    logEvent('info', "Initialisation de la page photographe... (Début)");

    try {
        // Étape 1 : Récupérer l'ID du photographe depuis l'URL
        logEvent('info', "Étape 1 : Récupération de l'ID du photographe depuis l'URL... (Début)");
        const photographerId = getPhotographerIdFromURL();
        if (!photographerId) {
            throw new Error("ID du photographe manquant ou invalide dans l'URL.");
        }
        logEvent('success', `Étape 1 : ID du photographe récupéré avec succès : ${photographerId}`);

        // Étape 2 : Charger les données JSON
        logEvent('info', "Étape 2 : Récupération des données JSON... (Début)");
        const { photographers, media } = await getPhotographersAndMedia();
        logEvent('success', "Étape 2 : Données JSON récupérées avec succès.", {
            photographersCount: photographers.length,
            mediaCount: media.length,
        });

        // Étape 3 : Trouver le photographe correspondant
        logEvent('info', `Étape 3 : Recherche du photographe avec l'ID ${photographerId}... (Début)`);
        const photographer = photographers.find(p => p.id === parseInt(photographerId, 10));
        if (!photographer) {
            throw new Error(`Photographe avec l'ID ${photographerId} introuvable.`);
        }
        logEvent('success', `Étape 3 : Photographe trouvé : ${photographer.name}`);

        // Étape 4 : Injecter les détails du photographe dans le DOM
        logEvent('info', `Étape 4 : Injection des détails du photographe ${photographer.name} dans le DOM... (Début)`);
        injectPhotographerDetails(photographer);
        logEvent('success', `Étape 4 : Détails du photographe injectés avec succès.`);

        // Étape 5 : Filtrer les médias pour ce photographe
        logEvent('info', `Étape 5 : Filtrage des médias pour le photographe ID ${photographerId}... (Début)`);
        const photographerMedia = filterMediaByPhotographer(media, photographer.id);
        logEvent('success', `Étape 5 : ${photographerMedia.length} médias filtrés pour le photographe.`);

        // Étape 6 : Afficher les médias dans la galerie
        logEvent('info', `Étape 6 : Affichage des médias dans la galerie... (Début)`);
        displayMedia(photographerMedia, domSelectors.photographerPage.galleryContainer);
        logEvent('success', `Étape 6 : Médias affichés dans la galerie avec succès.`);

        logEvent('success', "Page photographe initialisée avec succès. (Fin)");
    } catch (error) {
        logEvent('error', "Erreur lors de l'initialisation de la page photographe.", {
            message: error.message,
            stack: error.stack,
        });
    }
}


function getPhotographerIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function injectPhotographerDetails(photographer) {
    const { name, city, country, tagline, portrait, folderName, } = photographer;

    domSelectors.photographerPage.photographerTitle.textContent = name;
    domSelectors.photographerPage.photographerLocation.textContent = `${city}, ${country}`;
    domSelectors.photographerPage.photographerTagline.textContent = tagline || "Pas de slogan disponible.";
    domSelectors.photographerPage.photographerProfileImage.src = `../../../assets/photographers/${folderName}/${portrait}`;
    domSelectors.photographerPage.photographerProfileImage.alt = `Portrait de ${name}`;
}

document.addEventListener('DOMContentLoaded', () => {
    initPhotographerPage(); // Initialisation de la page photographe
    initEventListeners(); // Attache les gestionnaires d'événements
});
