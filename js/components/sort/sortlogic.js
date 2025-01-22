// ========================================================
// Nom du fichier : sortlogic.js
// Description    : Gestion des médias et tri pour le projet Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.4.0 (Synchronisation renforcée et logs améliorés)
// ========================================================

import { logEvent } from "../../utils/utils.js";
import { getPhotographerIdFromUrl } from "../../pages/photographer-page.js";

/*==============================================*/
/*              Fonctions de tri                */
/*==============================================*/

const validateMediaList = (mediaList) => {
  if (!Array.isArray(mediaList)) {
    throw new TypeError("La liste des médias doit être un tableau.");
  }
};

export const sortByLikes = (mediaList) => {
  validateMediaList(mediaList);
  return [...mediaList].sort((a, b) => b.likes - a.likes);
};

export const sortByTitle = (mediaList) => {
  validateMediaList(mediaList);
  return [...mediaList].sort((a, b) => a.title.localeCompare(b.title));
};

export const sortByDate = (mediaList) => {
  validateMediaList(mediaList);
  return [...mediaList].sort((a, b) => new Date(b.date) - new Date(a.date));
};

/*==============================================*/
/* Gestion des IDs et Positions des Médias      */
/*==============================================*/

export async function associateMediaIds(mediaList) {
  try {
    validateMediaList(mediaList);
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      throw new Error("Galerie introuvable dans le DOM.");
    }

    const mediaItems = gallery.querySelectorAll(".media-item");
    if (!mediaItems.length) {
      throw new Error("Aucun média trouvé dans le DOM.");
    }

    Array.from(mediaItems).forEach((mediaItem) => {
      const title = mediaItem.getAttribute("data-title");
      const matchingMedia = mediaList.find((media) => media.title === title);

      if (matchingMedia) {
        mediaItem.setAttribute("data-id", matchingMedia.id);
      } else {
        logEvent(
          "warn",
          `Aucun média correspondant trouvé pour : "${title}".`,
          {
            element: mediaItem,
          },
        );
      }
    });

    logEvent("success", "Association des IDs terminée.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de l'association des IDs : ${error.message}`,
    );
  }
}

export async function captureGalleryState() {
  try {
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      throw new Error("Galerie introuvable dans le DOM.");
    }

    const mediaItems = gallery.querySelectorAll(".media-item");
    return Array.from(mediaItems)
      .map((mediaItem, index) => {
        const id = parseInt(mediaItem.getAttribute("data-id"), 10);
        if (isNaN(id)) {
          logEvent("warn", `ID invalide détecté à la position ${index}`, {
            element: mediaItem,
          });
          return null;
        }
        return { id, position: index, element: mediaItem };
      })
      .filter(Boolean); // Supprime les éléments invalides
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la capture de la galerie : ${error.message}`,
    );
    return [];
  }
}

/*==============================================*/
/* Fonction Principale : Gérer le Tri des Médias*/
/*==============================================*/

export async function handleMediaSort(sortOption) {
  logEvent("test_start", "Début du processus de tri des médias.", {
    sortOption,
  });

  try {
    const photographerId = getPhotographerIdFromUrl();
    if (!photographerId) {
      throw new Error("ID du photographe introuvable.");
    }

    const response = await fetch("../../assets/data/photographers.json");
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    const photographerMedia = data.media.filter(
      (media) => media.photographerId === parseInt(photographerId, 10),
    );

    if (!photographerMedia.length) {
      logEvent(
        "warn",
        `Aucun média trouvé pour le photographe ID ${photographerId}.`,
      );
      return;
    }

    let sortedMedia;
    switch (sortOption) {
      case "popularity":
        sortedMedia = sortByLikes(photographerMedia);
        break;
      case "title":
        sortedMedia = sortByTitle(photographerMedia);
        break;
      case "date":
        sortedMedia = sortByDate(photographerMedia);
        break;
      default:
        throw new Error(`Option de tri inconnue : ${sortOption}`);
    }

    logEvent("info", "Médias triés avec succès.", { sortedMedia });

    const currentPositions = await captureGalleryState();
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      throw new Error("Galerie introuvable dans le DOM.");
    }

    sortedMedia.forEach((media, index) => {
      const matchingMedia = currentPositions.find(
        (item) => item.id === media.id,
      );
      if (matchingMedia) {
        gallery.insertBefore(matchingMedia.element, gallery.children[index]);
      } else {
        logEvent("warn", `Aucun élément DOM pour l'ID : ${media.id}`, {
          media,
        });
      }
    });

    logEvent("success", "Tri des médias terminé avec succès.");
  } catch (error) {
    logEvent("error", `Erreur lors du tri des médias : ${error.message}`, {
      stack: error.stack,
    });
  } finally {
    logEvent("test_end", "Fin du processus de tri des médias.");
  }
}
