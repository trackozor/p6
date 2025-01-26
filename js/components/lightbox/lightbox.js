// ========================================================
// Nom du fichier : lightbox.js
// Description    : Gestion de la lightbox pour afficher les médias
//                  (images ou vidéos) en plein écran.
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.1.0 (Ajout de logs détaillés)
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/
import { logEvent } from "../../utils/utils.js";
import domSelectors from "../../config/domSelectors.js";

let currentIndex = 0;
let mediaList = [];

/**
 * Initialise la lightbox avec une liste de médias.
 * @param {Array} mediaArray - Tableau des médias.
 */
export function initLightbox(mediaArray) {
  logEvent("info", "Initialisation de la lightbox.", { mediaArray });

  if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
    logEvent("error", "Le tableau des médias est invalide ou vide.");
    return;
  }

  mediaList = mediaArray;
}

/**
 * Ouvre la lightbox pour afficher un média à l'index spécifié.
 * @param {number} index - Index du média à afficher.
 */
export function openLightbox(index, mediaArray, folderName) {
  logEvent("info", `Ouverture de la lightbox pour l'index ${index}.`);

  try {
    const { lightboxContainer, lightboxMediaContainer, lightboxCaption } =
      domSelectors.lightbox;

    if (!lightboxContainer || !lightboxMediaContainer || !lightboxCaption) {
      throw new Error(
        "Conteneur principal, média ou légende de la lightbox introuvable."
      );
    }

    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Tableau de médias invalide ou vide.");
    }

    if (!folderName || typeof folderName !== "string") {
      throw new Error("Nom du dossier (folderName) invalide ou manquant.");
    }

    if (index < 0 || index >= mediaArray.length) {
      throw new Error(`Index ${index} hors limites pour le tableau de médias.`);
    }

    // Vérification du média correspondant à l'index
    const media = mediaArray[index];
    if (!media) {
      throw new Error(`Aucun média trouvé à l'index ${index}.`);
    }
    logEvent("info", "Média trouvé pour la lightbox.", { media });

    // Mise à jour du contenu de la lightbox (image ou vidéo)
    if (media.image) {
      lightboxMediaContainer.innerHTML = `<img src="../../../assets/photographers/${folderName}/${media.image}" alt="${media.title}" />`;
      logEvent("info", `Image chargée : ${media.image}`);
    } else if (media.video) {
      lightboxMediaContainer.innerHTML = `<video controls src="../../../assets/photographers/${folderName}/${media.video}"></video>`;
      logEvent("info", `Vidéo chargée : ${media.video}`);
    } else {
      lightboxMediaContainer.innerHTML =
        "<p>Le média sélectionné est introuvable.</p>";
      logEvent("warn", "Le média est invalide ou introuvable.", { media });
    }

    // Mise à jour de la légende
    lightboxCaption.textContent = media.title || "Aucune légende disponible.";

    // Affichage de la lightbox
    lightboxContainer.classList.remove("hidden");
    lightboxContainer.setAttribute("aria-hidden", "false");

    // Stocker l'index actuel dans le conteneur
    lightboxContainer.setAttribute("data-current-index", index);

    logEvent("success", "Lightbox ouverte avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'ouverture de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  }
}


/**
 * Ferme la lightbox.
 */
export function closeLightbox() {
  logEvent("info", "Fermeture de la lightbox.");

  const { lightboxContainer } = domSelectors.lightbox;
  if (!lightboxContainer) {
    logEvent("error", "Conteneur de la lightbox introuvable.");
    return;
  }

  lightboxContainer.classList.add("hidden");
  lightboxContainer.setAttribute("aria-hidden", "true");
}

/**
 * Affiche le média précédent dans la lightbox.
 */
export function showPreviousMedia() {
  currentIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
  displayMedia(currentIndex);
}

/**
 * Affiche le média suivant dans la lightbox.
 */
export function showNextMedia() {
  currentIndex = (currentIndex + 1) % mediaList.length;
  displayMedia(currentIndex);
}

/**
 * Affiche un média dans la lightbox à l'index donné.
 * @param {number} index - Index du média à afficher.
 */
function displayMedia(index) {
  const { lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;
  const media = mediaList[index];

  if (!lightboxMediaContainer || !media) {
    logEvent("error", "Média ou conteneur introuvable pour la lightbox.");
    return;
  }

  lightboxMediaContainer.innerHTML = "";

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

  if (mediaElement) {
    lightboxMediaContainer.appendChild(mediaElement);
    lightboxCaption.textContent = media.title || "Sans titre";
    logEvent("info", `Affichage du média à l'index ${index}.`);
  } else {
    logEvent("error", "Type de média non reconnu.");
  }
}
