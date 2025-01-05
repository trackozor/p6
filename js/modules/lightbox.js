// ========================================================
// Nom du fichier : lightbox.js
// Description    : Gestion de la lightbox pour les médias (images et vidéos)
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.0.0
// ========================================================

// Importation des sélecteurs DOM centralisés
import domSelectors from '/js/modules/domSelectors.js'; 

// Éléments DOM pour la lightbox
const { lightbox, mediaContainer, captionElement, closeButton, prevButton, nextButton } = domSelectors.lightbox;

// Variables globales pour la lightbox
let mediaItems = [];
let currentIndex = 0;

/**
 * ========================================================
 * Fonction : openLightbox
 * Description : Ouvre la lightbox pour un élément donné.
 * ========================================================
 */

/**
 * Ouvre la lightbox pour un média spécifique.
 * @param {number} index - Index de l'élément multimédia dans le tableau.
 */
function openLightbox(index) {
    currentIndex = index;
    const { type, src, title } = mediaItems[currentIndex];

    // Réinitialisation du conteneur multimédia
    mediaContainer.innerHTML = "";
    if (type === "image") {
        const img = document.createElement("img");
        img.src = src;
        img.alt = title;
        mediaContainer.appendChild(img);
    } else if (type === "video") {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        mediaContainer.appendChild(video);
    }

    captionElement.textContent = title; // Ajoute la légende
    lightbox.setAttribute("aria-hidden", "false"); // Affiche la lightbox
}

/**
 * ========================================================
 * Fonction : closeLightbox
 * Description : Ferme la lightbox.
 * ========================================================
 */

/**
 * Ferme la lightbox.
 */
function closeLightbox() {
    lightbox.setAttribute("aria-hidden", "true");
}

/**
 * ========================================================
 * Fonction : showPrevious
 * Description : Affiche l'élément précédent dans la lightbox.
 * ========================================================
 */

/**
 * Affiche l'élément précédent dans la lightbox.
 */
function showPrevious() {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length; // Gestion circulaire
    openLightbox(currentIndex);
}

/**
 * ========================================================
 * Fonction : showNext
 * Description : Affiche l'élément suivant dans la lightbox.
 * ========================================================
 */

/**
 * Affiche l'élément suivant dans la lightbox.
 */
function showNext() {
    currentIndex = (currentIndex + 1) % mediaItems.length; // Gestion circulaire
    openLightbox(currentIndex);
}

/**
 * ========================================================
 * Fonction : initializeLightbox
 * Description : Initialise la lightbox avec les médias et les événements.
 * ========================================================
 */

/**
 * Initialise la lightbox avec des éléments multimédias.
 * @param {Array} items - Tableau d'éléments multimédias.
 * Chaque élément doit contenir les propriétés :
 * - `type` : Le type de média ("image" ou "video").
 * - `src` : L'URL du fichier multimédia.
 * - `title` : Le titre ou la légende du média.
 */
export function initializeLightbox(items) {
    mediaItems = items;

    // Ajout des événements pour les boutons de la lightbox
    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", showPrevious);
    nextButton.addEventListener("click", showNext);

    // Gestion des événements clavier
    document.addEventListener("keydown", (e) => {
        if (lightbox.getAttribute("aria-hidden") === "false") {
            if (e.key === "Escape") {
                closeLightbox();
            }
            if (e.key === "ArrowLeft") {
                showPrevious();
            }
            if (e.key === "ArrowRight") {
                showNext();
            }
        }
    });

    // Ajout des événements pour les éléments de la galerie
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => openLightbox(index));
        item.addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                openLightbox(index);
            }
        });
    });
}
