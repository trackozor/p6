/* ========================================================
 * Nom du fichier : sortlogic.js
 * Description    : Fonctions de tri pour le projet Fisheye
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 1.1.0
 * ======================================================== */

// Import de la fonction logEvent
import { logEvent } from "../utils/utils.js";

/**
 * Trie un tableau par le nombre de likes (descendant).
 * @param {Array} mediaList - Liste des médias (objets contenant une propriété `likes`).
 * @returns {Array} Liste triée.
 * @throws {Error} Si `mediaList` n'est pas un tableau ou si `likes` est manquant.
 */
export const sortByLikes = (mediaList) => {
  try {
    // Validation de l'entrée
    if (!Array.isArray(mediaList)) {
      throw new Error("Le paramètre mediaList doit être un tableau.");
    }

    // Validation des propriétés `likes`
    mediaList.forEach((media) => {
      if (typeof media.likes !== "number") {
        throw new Error(
          `L'élément ${JSON.stringify(media)} ne contient pas de propriété 'likes' valide.`,
        );
      }
    });

    // Log avant le tri
    logEvent("info", "Tri par likes en cours...", { mediaList });

    // Tri par nombre de likes (descendant)
    const sortedList = [...mediaList].sort((a, b) => b.likes - a.likes);

    // Log après le tri
    logEvent("success", "Tri par likes effectué avec succès.", { sortedList });

    return sortedList;
  } catch (error) {
    // Gestion des erreurs via logEvent
    logEvent("error", "Erreur dans sortByLikes :", { message: error.message });
    return mediaList; // Retourne la liste originale en cas d'erreur
  }
};

/**
 * Trie un tableau par ordre alphabétique (A -> Z) sur la propriété `title`.
 * @param {Array} mediaList - Liste des médias (objets contenant une propriété `title`).
 * @returns {Array} Liste triée.
 * @throws {Error} Si `mediaList` n'est pas un tableau ou si `title` est manquant.
 */
export const sortByTitle = (mediaList) => {
  try {
    // Validation de l'entrée
    if (!Array.isArray(mediaList)) {
      throw new Error("Le paramètre mediaList doit être un tableau.");
    }

    // Validation des propriétés `title`
    mediaList.forEach((media) => {
      if (typeof media.title !== "string") {
        throw new Error(
          `L'élément ${JSON.stringify(media)} ne contient pas de propriété 'title' valide.`,
        );
      }
    });

    // Log avant le tri
    logEvent("info", "Tri par titre alphabétique en cours...", { mediaList });

    // Tri par ordre alphabétique
    const sortedList = [...mediaList].sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    // Log après le tri
    logEvent("success", "Tri par titre alphabétique effectué avec succès.", {
      sortedList,
    });

    return sortedList;
  } catch (error) {
    // Gestion des erreurs via logEvent
    logEvent("error", "Erreur dans sortByTitle :", { message: error.message });
    return mediaList; /* Retourne la liste originale en cas d'erreur*/
  }
};

/**
 * Trie un tableau par date (récente -> ancienne).
 * @param {Array} mediaList - Liste des médias (objets contenant une propriété `date` au format ISO ou autre).
 * @returns {Array} Liste triée.
 * @throws {Error} Si `mediaList` n'est pas un tableau ou si `date` est manquant ou invalide.
 */
export const sortByDate = (mediaList) => {
  try {
    // Validation de l'entrée
    if (!Array.isArray(mediaList)) {
      throw new Error("Le paramètre mediaList doit être un tableau.");
    }

    // Validation des propriétés `date`
    mediaList.forEach((media) => {
      if (isNaN(new Date(media.date).getTime())) {
        throw new Error(
          `L'élément ${JSON.stringify(media)} ne contient pas de propriété 'date' valide.`,
        );
      }
    });

    // Log avant le tri
    logEvent("info", "Tri par date en cours...", { mediaList });

    // Tri par date (récente -> ancienne)
    const sortedList = [...mediaList].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Log après le tri
    logEvent("success", "Tri par date effectué avec succès.", { sortedList });

    return sortedList;
  } catch (error) {
    // Gestion des erreurs via logEvent
    logEvent("error", "Erreur dans sortByDate :", { message: error.message });
    return mediaList; // Retourne la liste originale en cas d'erreur
  }
};
