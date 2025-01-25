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
  try {
    // Vérifie si le tableau de médias est valide
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Le tableau des médias est vide ou invalide.");
    }

    mediaList = mediaArray;
    logEvent("info", `Lightbox initialisée avec ${mediaArray.length} médias.`, {
      mediaArray,
    });

    // Vérifie si le conteneur de la lightbox existe
    const { lightboxContainer } = domSelectors.lightbox;
    if (!lightboxContainer) {
      throw new Error("Le conteneur de la lightbox est introuvable.");
    }

    logEvent("success", "Lightbox initialisée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'initialisation de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    logEvent("test_end_lightbox", "Fin de l'initialisation de la lightbox.");
  }
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

  try {
    const { lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;

    // Vérifie si le conteneur du média existe
    if (!lightboxMediaContainer || !lightboxCaption) {
      throw new Error(
        "Les éléments DOM nécessaires pour la lightbox sont introuvables.",
      );
    }

    // Vérifie si l'index est valide
    if (index < 0 || index >= mediaList.length) {
      throw new Error("Index de média hors limites.");
    }

    currentIndex = index;
    const media = mediaList[index];
    logEvent("info", `Média à afficher :`, { media });

    // Nettoyage du conteneur avant d'ajouter le nouveau média
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
    } else {
      throw new Error("Type de média inconnu.");
    }

    lightboxMediaContainer.appendChild(mediaElement);
    logEvent("info", "Média ajouté au conteneur de la lightbox.");

    // Mise à jour de la légende
    lightboxCaption.textContent = media.title || "Sans titre";
    logEvent("success", `Légende mise à jour : ${media.title || "Sans titre"}`);
  } catch (error) {
    logEvent("error", "Erreur lors de l'affichage du média.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/*==============================================*/
/*              Navigation Médias              */
/*==============================================*/

/**
 * Affiche le média précédent dans la lightbox.
 */
export function showPreviousMedia() {
  logEvent("info", "Navigation vers le média précédent.");
  try {
    if (mediaList.length === 0) {
      throw new Error("Aucun média disponible dans la lightbox.");
    }
    const newIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
    displayMedia(newIndex);
  } catch (error) {
    logEvent("error", "Erreur lors de la navigation vers le média précédent.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * Affiche le média suivant dans la lightbox.
 */
export function showNextMedia() {
  logEvent("info", "Navigation vers le média suivant.");
  try {
    if (mediaList.length === 0) {
      throw new Error("Aucun média disponible dans la lightbox.");
    }
    const newIndex = (currentIndex + 1) % mediaList.length;
    displayMedia(newIndex);
  } catch (error) {
    logEvent("error", "Erreur lors de la navigation vers le média suivant.", {
      message: error.message,
      stack: error.stack,
    });
  }
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
  try {
    const { lightboxContainer } = domSelectors.lightbox;

    if (!lightboxContainer) {
      throw new Error("Le conteneur de la lightbox est introuvable.");
    }

    lightboxContainer.classList.remove("hidden");
    lightboxContainer.setAttribute("aria-hidden", "false");

    displayMedia(index);
    logEvent("success", "Lightbox ouverte avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'ouverture de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    logEvent("test_end_lightbox", "Fin de l'ouverture de la lightbox.");
  }
}

/**
 * Ferme la lightbox.
 */
export function closeLightbox() {
  logEvent("test_start_lightbox", "Fermeture de la lightbox...");
  try {
    const { lightboxContainer } = domSelectors.lightbox;

    if (!lightboxContainer) {
      throw new Error("Le conteneur de la lightbox est introuvable.");
    }

    lightboxContainer.classList.add("hidden");
    lightboxContainer.setAttribute("aria-hidden", "true");

    logEvent("success", "Lightbox fermée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de la fermeture de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    logEvent("test_end_lightbox", "Fin de la fermeture de la lightbox.");
  }
}
