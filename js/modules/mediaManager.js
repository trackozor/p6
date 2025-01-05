// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et affichage dans la galerie
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.2.0
// ========================================================

import { fetchJSON } from '/js/data/dataFetcher.js'; // Standardisation des appels réseau
import { logEvent } from '/js/utils/utils.js'; // Logging des événements

// Chemin vers le fichier JSON contenant photographes et médias
const DATA_JSON_PATH = '/assets/data/photographers.json';

/**
 * ========================================================
 * Fonction : getPhotographersAndMedia
 * Description : Récupère les données des photographes et des médias
 * depuis un fichier JSON.
 * ========================================================
 * @returns {Promise<Object>} Un objet contenant deux tableaux : 
 * `photographers` (les photographes) et `media` (les médias associés).
 */
export async function getPhotographersAndMedia() {
    try {
        logEvent('info', "Début de la récupération des données JSON...");

        // Récupérer les données depuis le fichier JSON
        const data = await fetchJSON(DATA_JSON_PATH);

        // Validation de la structure des données
        if (!data || !Array.isArray(data.photographers) || !Array.isArray(data.media)) {
            logEvent('warn', "Structure JSON invalide ou données absentes.", data);
            return { photographers: [], media: [] };
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

        // Retourner des tableaux vides en cas d'erreur pour éviter les crashs
        return { photographers: [], media: [] };
    }
}

/**
 * ========================================================
 * Fonction : filterMediaByPhotographer
 * Description : Filtre les médias pour un photographe spécifique
 * en utilisant son ID.
 * ========================================================
 * @param {Array} mediaList - Liste complète des médias.
 * @param {number} photographerId - ID du photographe.
 * @returns {Array} Liste des médias appartenant au photographe.
 */
export function filterMediaByPhotographer(mediaList, photographerId) {
    // Vérification des paramètres
    if (!Array.isArray(mediaList) || typeof photographerId !== 'number') {
        logEvent('warn', "Paramètres invalides pour le filtrage des médias.", {
            mediaList: mediaList,
            photographerId: photographerId,
        });
        return [];
    }

    // Filtrer les médias par ID du photographe
    const filteredMedia = mediaList.filter(media => media.photographerId === photographerId);

    logEvent('info', `Médias filtrés pour le photographe ID ${photographerId}.`, {
        totalFilteredMedia: filteredMedia.length,
    });

    return filteredMedia;
}

/**
 * ========================================================
 * Fonction : displayMedia
 * Description : Génère dynamiquement les éléments DOM pour
 * afficher les médias dans la galerie.
 * ========================================================
 * @param {Array} mediaList - Liste des médias à afficher.
 * @param {HTMLElement} galleryContainer - Conteneur de la galerie.
 */
export function displayMedia(mediaList, galleryContainer) {
    logEvent('info', "Début de l'affichage des médias dans la galerie...");

    // Réinitialiser le contenu de la galerie
    galleryContainer.innerHTML = '';

    // Vérifier si la liste des médias est vide
    if (!mediaList || mediaList.length === 0) {
        galleryContainer.innerHTML = `<p>Aucune œuvre trouvée pour ce photographe.</p>`;
        logEvent('warn', "Aucun média à afficher.");
        return;
    }

    // Parcourir et afficher chaque média
    mediaList.forEach((media, index) => {
        logEvent('info', `Affichage du média ${index + 1}/${mediaList.length}`, {
            mediaTitle: media.title,
            mediaType: media.image ? 'image' : 'video',
        });

        // Générer le chemin source du média (image ou vidéo)
        const mediaSrc = media.image
            ? `/assets/photographers/${media.id}/${media.image}`
            : `/assets/photographers/${media.id}/${media.video}`;

        const figure = document.createElement('figure');
        figure.classList.add('gallery-item');
        figure.setAttribute('tabindex', '0');

        // Créer l'élément DOM pour le média (img ou video)
        const mediaElement = media.image ? document.createElement('img') : document.createElement('video');
        mediaElement.src = mediaSrc;
        mediaElement.alt = media.title || 'Œuvre sans titre';

        // Activer les contrôles si c'est une vidéo
        if (media.video) {
            mediaElement.controls = true;
        };

        // Ajouter le titre du média en tant que légende
        const caption = document.createElement('figcaption');
        caption.textContent = media.title;

        // Ajouter les éléments au conteneur figure
        figure.appendChild(mediaElement);
        figure.appendChild(caption);

        // Ajouter la figure à la galerie
        galleryContainer.appendChild(figure);
    });

    logEvent('success', `${mediaList.length} médias affichés dans la galerie.`);
}
