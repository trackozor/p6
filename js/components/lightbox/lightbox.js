// ========================================================
// Nom du fichier : mediaManager.js
// Description    : Gestion des médias et intégration avec la lightbox.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.4.0
// ========================================================

import { fetchJSON } from '../data/dataFetcher.js'; // Utilitaire pour récupérer les données JSON.
import { logEvent } from '../utils/utils.js'; // Utilitaire pour enregistrer les événements dans les logs.
import { PATHS } from '../config/constants.js'; // Centralisation des chemins.
import { initializeLightbox } from './lightbox.js'; // Gestion de la lightbox.

// ========================================================
// Constante : Chemin vers le fichier JSON contenant les médias.
// ========================================================
const MEDIA_JSON_PATH = PATHS.DATA.MEDIA_JSON;

/**
 * ========================================================
 *               isValidMedia
 * ========================================================
 * Description : Vérifie si un média possède toutes les propriétés requises.
 * @typedef {Object} Media
 * @property {number} id - ID unique du média.
 * @property {number} photographerId - ID du photographe associé.
 * @property {string} [image] - Nom du fichier image (optionnel).
 * @property {string} [video] - Nom du fichier vidéo (optionnel).
 *
 * @param {Media} media - Objet média à valider.
 * @returns {boolean} `true` si le média est valide, sinon `false`.
 */
function isValidMedia(media) {
    return (
        typeof media === 'object' &&
        typeof media.id === 'number' &&
        typeof media.photographerId === 'number' &&
        (typeof media.image === 'string' || typeof media.video === 'string')
    );
}

/**
 * ========================================================
 *               getMedia
 * ========================================================
 * Description :
 * Récupère les données des médias depuis un fichier JSON et retourne uniquement
 * les médias valides.
 *
 * @async
 * @returns {Promise<Media[]>} Une liste de médias valides ou un tableau vide en cas d'erreur.
 */
export async function getMedia() {
    logEvent('test_start', "Début de la récupération des médias depuis JSON...");

    try {
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
 *               displayMedia
 * ========================================================
 * Description : Génère et affiche les médias dans la galerie.
 * Intègre la lightbox pour permettre un affichage en pleine vue.
 *
 * @param {Media[]} mediaList - Liste des médias à afficher.
 * @param {HTMLElement} galleryContainer - Conteneur de la galerie.
 */
export function displayMedia(mediaList, galleryContainer) {
    logEvent('test_start', "Début de l'affichage des médias dans la galerie...");

    // Réinitialiser la galerie
    galleryContainer.innerHTML = '';

    if (!mediaList || mediaList.length === 0) {
        galleryContainer.innerHTML = `<p>Aucune œuvre trouvée pour ce photographe.</p>`;
        logEvent('warn', "Aucun média à afficher.");
        logEvent('test_end', "Fin de l'affichage des médias (aucun média trouvé).");
        return;
    }

    // Stocker les médias pour la lightbox
    const lightboxItems = [];

    // Générer et afficher les médias
    mediaList.forEach((media, index) => {
        const mediaFile = media.image || media.video;
        const mediaSrc = `${PATHS.ASSETS.IMAGES}photographers/${media.folderName}/${mediaFile}`;
        const mediaType = media.image ? 'image' : 'video';

        // Ajout de l'élément au tableau lightbox
        lightboxItems.push({
            type: mediaType,
            src: mediaSrc,
            title: media.title || 'Œuvre sans titre',
        });

        // Création de l'élément figure
        const figure = document.createElement('figure');
        figure.classList.add('gallery-item');
        figure.setAttribute('tabindex', '0');

        // Création de l'élément média (img ou video)
        const mediaElement = media.image ? document.createElement('img') : document.createElement('video');
        mediaElement.src = mediaSrc;
        mediaElement.alt = media.title || 'Œuvre sans titre';
        if (media.video) {
          mediaElement.controls = true;
        }

        // Création de la légende
        const caption = document.createElement('figcaption');
        caption.textContent = media.title || 'Œuvre sans titre';

        // Ajout des événements pour ouvrir la lightbox
        figure.addEventListener('click', () => initializeLightbox(lightboxItems, index));
        figure.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                initializeLightbox(lightboxItems, index);
            }
        });

        // Construction de la figure
        figure.appendChild(mediaElement);
        figure.appendChild(caption);
        galleryContainer.appendChild(figure);
    });

    logEvent('success', `${mediaList.length} médias affichés dans la galerie.`);
    logEvent('test_end', "Fin de l'affichage des médias dans la galerie.");
}
