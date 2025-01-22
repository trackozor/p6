// ========================================================
// Nom du fichier : sortlogic.js
// Description    : Gestion des médias et tri pour le projet Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.1.0
// ========================================================

/*==============================================*/
/*              Imports                         */
/*==============================================*/
import { logEvent } from "../../utils/utils.js";
import { getPhotographerIdFromUrl } from "../../pages/photographer-page.js";

/*==============================================*/
/*              Fonctions de tri                */
/*==============================================*/

/**
 * Trie un tableau par le nombre de likes (descendant).
 * @param {Array} mediaList - Liste des médias.
 * @returns {Array} Liste triée.
 */
export const sortByLikes = (mediaList) => {
  try {
    logEvent("info", "Tri des médias par likes en cours.");
    if (!Array.isArray(mediaList)) {
      throw new TypeError("mediaList doit être un tableau.");
    }

    return [...mediaList].sort((a, b) => b.likes - a.likes);
  } catch (error) {
    logEvent("error", `Erreur lors du tri par likes : ${error.message}`);
    return mediaList; // Retourne la liste originale en cas d'erreur
  }
};

/**
 * Trie un tableau par ordre alphabétique (A -> Z) sur la propriété `title`.
 * @param {Array} mediaList - Liste des médias.
 * @returns {Array} Liste triée.
 */
export const sortByTitle = (mediaList) => {
  try {
    logEvent("info", "Tri des médias par titre en cours.");
    if (!Array.isArray(mediaList)) {
      throw new TypeError("mediaList doit être un tableau.");
    }

    return [...mediaList].sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    logEvent("error", `Erreur lors du tri par titre : ${error.message}`);
    return mediaList; // Retourne la liste originale en cas d'erreur
  }
};

/**
 * Trie un tableau par date (récente -> ancienne).
 * @param {Array} mediaList - Liste des médias.
 * @returns {Array} Liste triée.
 */
export const sortByDate = (mediaList) => {
  try {
    logEvent("info", "Tri des médias par date en cours.");
    if (!Array.isArray(mediaList)) {
      throw new TypeError("mediaList doit être un tableau.");
    }

    return [...mediaList].sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    logEvent("error", `Erreur lors du tri par date : ${error.message}`);
    return mediaList; // Retourne la liste originale en cas d'erreur
  }
};

/*==============================================*/
/* Gestion des IDs et Positions des Médias      */
/*==============================================*/

/**
 * Associe les IDs des médias aux éléments DOM existants.
 * @param {Array} mediaList - Liste des médias récupérés.
 */
export async function associateMediaIds(mediaList) {
  try {
    logEvent("info", "Association des IDs aux éléments DOM en cours.");
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      throw new Error("Galerie introuvable.");
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
        logEvent("warn", `Aucun média trouvé pour le titre : "${title}"`);
      }
    });

    logEvent("success", "Association des IDs réussie.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de l'association des IDs : ${error.message}`,
    );
  }
}

/**
 * Capture l'état actuel de la galerie en enregistrant les ID et positions.
 * @returns {Array} Liste des états des médias.
 */
export async function captureGalleryState() {
  try {
    logEvent("info", "Capture de l'état actuel de la galerie.");
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      throw new Error("Galerie introuvable.");
    }

    const mediaItems = gallery.querySelectorAll(".media-item");
    return Array.from(mediaItems).map((mediaItem, index) => {
      const id = parseInt(mediaItem.getAttribute("data-id"), 10);
      if (isNaN(id)) {
        throw new Error(`ID invalide détecté à la position ${index}`);
      }
      return { id, position: index, element: mediaItem };
    });
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la capture de l'état de la galerie : ${error.message}`,
    );
    return [];
  }
}

/*==============================================*/
/* Fonction Principale : Gérer le Tri des Médias*/
/*==============================================*/

/**
 * Gère le tri des médias en fonction d'une option sélectionnée.
 * @param {string} sortOption - Option de tri sélectionnée (popularity, title, date).
 */
export async function handleMediaSort(sortOption) {
  logEvent("info", "Début du tri des médias.", { sortOption });

  try {
    // Récupérer l'ID du photographe
    const photographerId = getPhotographerIdFromUrl();
    if (!photographerId) {
      throw new Error("ID du photographe introuvable.");
    }

    // Charger les données JSON des photographes
    const response = await fetch("../../assets/data/photographers.json");
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    const photographer = data.photographers.find(
      (p) => p.id === parseInt(photographerId, 10),
    );

    if (!photographer || !Array.isArray(photographer.media)) {
      throw new Error(
        `Médias introuvables pour le photographe ID : ${photographerId}`,
      );
    }

    // Trier les médias
    let sortedMedia;
    switch (sortOption) {
      case "popularity":
        sortedMedia = sortByLikes(photographer.media);
        break;
      case "title":
        sortedMedia = sortByTitle(photographer.media);
        break;
      case "date":
        sortedMedia = sortByDate(photographer.media);
        break;
      default:
        throw new Error(`Option de tri inconnue : ${sortOption}`);
    }

    logEvent("info", "Médias triés avec succès.", { sortedMedia });

    // Capturer l'état actuel de la galerie
    const currentPositions = await captureGalleryState();

    // Réorganiser les éléments dans le DOM
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
