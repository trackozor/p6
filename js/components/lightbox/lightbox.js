// ========================================================
// Nom du fichier : lightbox.js
// Description    : Gestion de la lightbox pour afficher les médias
//                  (images ou vidéos) en plein écran.
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.0.0
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/
import { logEvent } from "../utils/utils.js";
import domSelectors from "../config/domSelectors.js";

/*==============================================*/
/*              Variables Globales             */
/*==============================================*/
let currentIndex = 0; // Index du média actuellement affiché
let mediaList = []; // Liste des médias à afficher dans la lightbox

/*==============================================*/
/*              Initialisation                 */
/*==============================================*/

/**
 * Initialise la lightbox avec une liste de médias.
 *
 * @param {Array} mediaArray - Tableau des médias (images ou vidéos).
 */
export function initLightbox(mediaArray) {
  logEvent("test_start_lightbox", "Initialisation de la lightbox...");
  mediaList = mediaArray;

  // Vérification des éléments DOM requis
  const { lightboxContainer } = domSelectors.lightbox;
  if (!lightboxContainer) {
    logEvent("error", "Le conteneur de la lightbox est introuvable.");
    return;
  }

  attachLightboxEvents();
  logEvent("success", "Lightbox initialisée avec succès.");
  logEvent("test_end_lightbox", "Fin de l'initialisation de la lightbox.");
}

/*==============================================*/
/*              Affichage Média                */
/*==============================================*/

/**
 * Affiche un média dans la lightbox à un index donné.
 *
 * @param {number} index - Index du média à afficher.
 */
function displayMedia(index) {
  logEvent("info", `Affichage du média à l'index ${index}.`);

  const { lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;

  if (index < 0 || index >= mediaList.length) {
    logEvent("warn", "Index de média hors limites.", { index });
    return;
  }

  currentIndex = index;
  const media = mediaList[index];

  // Nettoyage du conteneur
  lightboxMediaContainer.innerHTML = "";

  // Création de l'élément média (image ou vidéo)
  let mediaElement;
  if (media.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = media.image;
    mediaElement.alt = media.title || "Image sans titre";
  } else if (media.video) {
    mediaElement = document.createElement("video");
    mediaElement.src = media.video;
    mediaElement.controls = true;
  }

  lightboxMediaContainer.appendChild(mediaElement);

  // Mise à jour de la légende
  lightboxCaption.textContent = media.title || "Sans titre";

  logEvent("success", `Média affiché : ${media.title || "Inconnu"}`, {
    media,
  });
}

/*==============================================*/
/*              Navigation Médias              */
/*==============================================*/

/**
 * Affiche le média précédent dans la lightbox.
 */
function showPreviousMedia() {
  logEvent("info", "Navigation vers le média précédent.");
  const newIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
  displayMedia(newIndex);
}

/**
 * Affiche le média suivant dans la lightbox.
 */
function showNextMedia() {
  logEvent("info", "Navigation vers le média suivant.");
  const newIndex = (currentIndex + 1) % mediaList.length;
  displayMedia(newIndex);
}

/*==============================================*/
/*              Gestion Événements             */
/*==============================================*/

/**
 * Ouvre la lightbox pour afficher un média.
 *
 * @param {number} index - Index initial du média à afficher.
 */
export function openLightbox(index) {
  logEvent("test_start_lightbox", "Ouverture de la lightbox...");
  const { lightboxContainer } = domSelectors.lightbox;

  if (!lightboxContainer) {
    logEvent("error", "Le conteneur de la lightbox est introuvable.");
    return;
  }

  lightboxContainer.classList.remove("hidden");
  lightboxContainer.setAttribute("aria-hidden", "false");

  displayMedia(index);
  logEvent("success", "Lightbox ouverte.");
  logEvent("test_end_lightbox", "Fin de l'ouverture de la lightbox.");
}

/**
 * Ferme la lightbox.
 */
function closeLightbox() {
  logEvent("test_start_lightbox", "Fermeture de la lightbox...");
  const { lightboxContainer } = domSelectors.lightbox;

  lightboxContainer.classList.add("hidden");
  lightboxContainer.setAttribute("aria-hidden", "true");

  logEvent("success", "Lightbox fermée.");
  logEvent("test_end_lightbox", "Fin de la fermeture de la lightbox.");
}

/**
 * Attache les événements liés à la lightbox.
 */
function attachLightboxEvents() {
  const {
    lightboxCloseButton,
    lightboxPrevButton,
    lightboxNextButton,
    lightboxContainer,
  } = domSelectors.lightbox;

  lightboxCloseButton.addEventListener("click", closeLightbox);
  lightboxPrevButton.addEventListener("click", showPreviousMedia);
  lightboxNextButton.addEventListener("click", showNextMedia);

  // Fermeture de la lightbox avec la touche Escape
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !lightboxContainer.classList.contains("hidden")
    ) {
      closeLightbox();
    }
  });

  // Navigation avec les touches gauche/droite
  document.addEventListener("keydown", (event) => {
    if (!lightboxContainer.classList.contains("hidden")) {
      if (event.key === "ArrowLeft") {
        showPreviousMedia();
      }
      if (event.key === "ArrowRight") {
        showNextMedia();
      }
    }
  });

  logEvent("info", "Événements pour la lightbox attachés.");
}

/*==============================================*/
/*              Export des Fonctions           */
/*==============================================*/
export default {
  initLightbox,
  openLightbox,
};
