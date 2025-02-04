// ========================================================
// Nom du fichier : lightbox.js
// Description    : Gestion de la lightbox pour afficher les médias (images ou vidéos) en plein écran.
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.4.1 (Optimisation de la gestion des animations et suppression des doublons)
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/
import { logEvent } from "../../utils/utils.js";
import domSelectors from "../../config/domSelectors.js";

let currentIndex = 0; // Index du média affiché
let mediaList = []; // Liste des médias
let globalFolderName = ""; // Nom du dossier global pour les médias

/**
 * Initialise la lightbox avec une liste de médias.
 * @param {Array} mediaArray - Tableau des médias à afficher dans la lightbox.
 * @param {string} folderName - Nom du dossier contenant les médias.
 */
export function initLightbox(mediaArray, folderName) {
    logEvent("init", "Début de l'initialisation de la lightbox.", { mediaArray });

    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
        logEvent("warn", "Le tableau de médias est vide.");
        mediaList = [];
        globalFolderName = folderName || "";
        return;
    }

    if (typeof folderName !== "string") {
        logEvent("error", "Nom du dossier (folderName) invalide ou manquant.", { folderName });
        throw new Error("Le nom du dossier doit être une chaîne valide.");
    }

    try {
        mediaList = [...mediaArray];
        globalFolderName = folderName;
        currentIndex = 0;
        logEvent("success", "Lightbox initialisée avec succès.", { mediaList });
    } catch (error) {
        logEvent("error", "Erreur lors de l'initialisation de la lightbox.", { error });
        throw new Error("Erreur d'initialisation de la lightbox : " + error.message);
    }
}

/**
 * Ouvre la lightbox pour afficher un média à l'index spécifié.
 * @param {number} index - Index du média à afficher.
 */

export function openLightbox(index, mediaArray, folderName) {
    logEvent("action", `Ouverture de la lightbox pour l'index ${index}.`, { index });

    try {
        const { lightboxContainer } = domSelectors.lightbox;

        if (!lightboxContainer) {
            throw new Error("Conteneur principal de la lightbox introuvable.");
        }

        if (Array.isArray(mediaArray) && mediaArray.length > 0 && mediaArray !== mediaList) {
            mediaList = [...mediaArray];
            globalFolderName = folderName;
        }

        if (index < 0 || index >= mediaList.length) {
            throw new Error(`Index ${index} hors limites.`);
        }

        currentIndex = index;
        updateLightboxContent(mediaList[currentIndex], globalFolderName, "right");

        lightboxContainer.classList.remove("hidden");
        lightboxContainer.setAttribute("aria-hidden", "false");

        logEvent("success", "Lightbox ouverte avec succès.");
    } catch (error) {
        logEvent("error", "Erreur lors de l'ouverture de la lightbox.", { error });
    }
}

/**
 * Ferme la lightbox.
 */
/**
 * Ferme la lightbox et réinitialise son état.
 */
export function closeLightbox() {
    logEvent("action", "Fermeture de la lightbox et réinitialisation.");

    // Récupération des éléments de la lightbox
    const { lightboxContainer, lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;
    
    // Vérification que le conteneur principal existe bien
    if (!lightboxContainer) {
        logEvent("error", "Conteneur principal introuvable.");
        return;
    }

    // Suppression du média actuellement affiché dans la lightbox
    const currentMedia = lightboxMediaContainer.querySelector(".active-media");
    if (currentMedia) {
        currentMedia.remove();
    }

    // Réinitialisation du texte du titre/caption
    if (lightboxCaption) {
        lightboxCaption.textContent = "";
    }

    // Réinitialisation des variables globales
    currentIndex = 0;  // On remet l'index à 0
    mediaList = [];     // On vide la liste des médias
    globalFolderName = ""; // On remet le nom du dossier à une chaîne vide

    // Masquer la lightbox avec des classes CSS et un attribut d'accessibilité
    lightboxContainer.classList.add("hidden");
    lightboxContainer.setAttribute("aria-hidden", "true");

    logEvent("success", "Lightbox fermée et réinitialisée avec succès.");
}


function validateIndex(index) {
    if (index < 0) {
        return mediaList.length - 1; // 🔥 Si trop bas, revenir à la fin
    }
    if (index >= mediaList.length) {
        return 0; // 🔥 Si trop haut, revenir au début
    }
    return index;
}

/*==============================================*/
/*             Gestion des animations          */
/*==============================================*/

/**
 * Anime la sortie du média vers la gauche.
 */
function animateMediaExitLeft(mediaElement, callback) {
    mediaElement.classList.add("lightbox-exit-left");
    mediaElement.addEventListener("animationend", () => {
        callback();
    }, { once: true });
}

/**
 * Anime la sortie du média vers la droite.
 */
function animateMediaExitRight(mediaElement, callback) {
    mediaElement.classList.add("lightbox-exit-right");
    mediaElement.addEventListener("animationend", () => {
        callback();
    }, { once: true });
}

/**
 * Insère un nouveau média avec une animation d'entrée.
 */
function insertNewMedia(media, folderPath, direction) {
    const { lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;
    const newMedia = document.createElement(media.image ? "img" : "video");
    newMedia.classList.add("lightbox-media", "active-media");


    if (media.image) {
        newMedia.src = `${folderPath}${media.image}`;
        newMedia.alt = media.title || "Image sans titre";
        newMedia.loading = "lazy";
    } else if (media.video) {
        newMedia.src = `${folderPath}${media.video}`;
        newMedia.controls = true;
        newMedia.autoplay = true;
        newMedia.muted = false;
    }

    lightboxMediaContainer.appendChild(newMedia);
    lightboxCaption.textContent = media.title || "Sans titre";

    logEvent("success", "Média mis à jour avec effet de glissement.");
}

/**
 * Met à jour le contenu de la lightbox avec la bonne animation.
 */
function updateLightboxContent(media, folderName, direction) {
    logEvent("debug", `🔄 Mise à jour de la lightbox : ${currentIndex} / ${mediaList.length}`, {
        media, 
        currentIndex, 
        folderName, 
        direction
    });

    const { lightboxMediaContainer } = domSelectors.lightbox;
    const currentMedia = lightboxMediaContainer.querySelector(".active-media");

    if (!media || typeof folderName !== "string") {
        logEvent("error", "Média ou dossier invalide.", { media, folderName });
        return;
    }

    try {
        const folderPath = `../../../assets/photographers/${folderName}/`;

        if (currentMedia) {
            if (direction === "right") {
                animateMediaExitLeft(currentMedia, () => {
                    currentMedia.remove();
                    insertNewMedia(media, folderPath, direction);
                });
            } else {
                animateMediaExitRight(currentMedia, () => {
                    currentMedia.remove();
                    insertNewMedia(media, folderPath, direction);
                });
            }
        } else {
            insertNewMedia(media, folderPath, direction);
        }
    } catch (error) {
        logEvent("error", "Erreur lors de la mise à jour du média.", { error });
    }
}


/**
 * Gère la navigation vers l'image précédente.
 */
let isTransitioning = false;

export function showNextMedia() {
    if (isTransitioning || mediaList.length === 0) {
      return;
    }
    isTransitioning = true;

    currentIndex = (currentIndex + 1) % mediaList.length;
    updateLightboxContent(mediaList[currentIndex], globalFolderName, "right");

    setTimeout(() => { isTransitioning = false; }, 500); // Attente de la fin de l’animation
}

export function showPreviousMedia() {
    if (isTransitioning || mediaList.length === 0) {
      return;
    }
    isTransitioning = true;

    currentIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
    updateLightboxContent(mediaList[currentIndex], globalFolderName, "left");

    setTimeout(() => { isTransitioning = false; }, 500);
}
