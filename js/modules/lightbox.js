const lightbox = document.getElementById("lightbox");
const mediaContainer = document.querySelector(".lightbox-media-container");
const captionElement = document.getElementById("lightbox-caption");
const closeButton = document.querySelector("[data-action='close-lightbox']");
const prevButton = document.querySelector("[data-action='prev-lightbox']");
const nextButton = document.querySelector("[data-action='next-lightbox']");

let mediaItems = [];
let currentIndex = 0;

/**
 * Ouvre la lightbox pour un élément donné.
 * @param {number} index - Index de l'élément multimédia dans le tableau.
 */
function openLightbox(index) {
    currentIndex = index;
    const { type, src, title } = mediaItems[currentIndex];

    mediaContainer.innerHTML = ""; // Réinitialise le conteneur
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

    captionElement.textContent = title;
    lightbox.setAttribute("aria-hidden", "false");
    }

/**
 * Ferme la lightbox.
 */
function closeLightbox() {
    lightbox.setAttribute("aria-hidden", "true");
}

/**
 * Affiche l'élément précédent dans la lightbox.
 */
function showPrevious() {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    openLightbox(currentIndex);
}

/**
 * Affiche l'élément suivant dans la lightbox.
 */
function showNext() {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    openLightbox(currentIndex);
}

/**
 * Initialise la lightbox avec des éléments multimédias.
 * @param {Array} items - Tableau d'éléments multimédias.
 */
export function initializeLightbox(items) {
    mediaItems = items;

  // Ajout des événements pour les boutons
    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", showPrevious);
    nextButton.addEventListener("click", showNext);

  // Gestion du clavier
    document.addEventListener("keydown", (e) => {
        if (lightbox.getAttribute("aria-hidden") === "false") {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrevious();
        if (e.key === "ArrowRight") showNext();
    }
});

  // Gestion des clics sur les éléments de la galerie
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
