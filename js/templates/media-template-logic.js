// ========================================================
// Nom du fichier : media-template-logic.js
// Description    : Gestion des médias et opérations associées pour un photographe.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.1.0 (Ajout de logs enrichis, tests et gestion des exceptions)
// ========================================================

import { fetchJSON } from "../data/dataFetcher.js";
import { logEvent } from "../utils/utils.js";
/**
 * Récupère et filtre les médias pour un photographe spécifique à partir des données JSON.
 *
 * @async
 * @function loadPhotographerMedia
 * @param {number} photographerId - ID unique du photographe.
 * @param {string} mediaDataUrl - URL du fichier JSON contenant les données des médias.
 * @returns {Promise<Array>} Une liste des médias filtrés pour le photographe spécifié.
 * @throws {Error} En cas de problème de récupération des données ou si aucun média n'est trouvé.
 */
export async function loadPhotographerMedia(photographerId, mediaDataUrl) {
  logEvent("info", "Début du chargement des médias pour le photographe.", {
    photographerId,
    mediaDataUrl,
  });

  // Validation des paramètres d'entrée
  if (!photographerId || typeof photographerId !== "number") {
    logEvent("error", "ID du photographe invalide ou manquant.", {
      photographerId,
    });
    throw new Error("L'ID du photographe est invalide.");
  }
  if (!mediaDataUrl || typeof mediaDataUrl !== "string") {
    logEvent("error", "URL des données médias invalide ou manquante.", {
      mediaDataUrl,
    });
    throw new Error("L'URL des données médias est invalide.");
  }

  try {
    const data = await fetchJSON(mediaDataUrl);
    if (!data || !data.media || !Array.isArray(data.media)) {
      logEvent("error", "Structure de données JSON incorrecte ou manquante.", {
        data,
      });
      throw new Error("Les données JSON sont mal structurées ou absentes.");
    }

    const photographerMedia = data.media.filter(
      (media) => media.photographerId === photographerId,
    );

    if (photographerMedia.length === 0) {
      logEvent("warn", "Aucun média trouvé pour ce photographe.", {
        photographerId,
      });
    } else {
      logEvent("info", `${photographerMedia.length} médias trouvés.`, {
        photographerMedia,
      });
    }

    return photographerMedia;
  } catch (error) {
    logEvent("error", "Erreur lors du chargement des médias.", { error });
    throw new Error(`Échec du chargement des médias : ${error.message}`);
  }
}

/**
 * Crée un élément HTML représentant un média (image ou vidéo) avec ses métadonnées.
 *
 * @function createMediaItem
 * @param {Object} media - Objet représentant les données d'un média.
 * @param {string} folderName - Nom du dossier contenant les fichiers du photographe.
 * @returns {HTMLElement|null} Un élément HTML `<article>` pour le média ou `null` en cas d'erreur.
 */
export function createMediaItem(media, folderName) {
  logEvent("info", "Création d'un élément média.", { media, folderName });

  // Validation des paramètres d'entrée
  if (!media || typeof media !== "object") {
    logEvent("error", "Données de média invalides ou manquantes.", { media });
    return null;
  }
  if (!folderName || typeof folderName !== "string") {
    logEvent("error", "Nom du dossier invalide ou manquant.", { folderName });
    return null;
  }

  try {
    const mediaItem = document.createElement("article");
    mediaItem.className = "media-item";

    let mediaElement;

    // Création de l'élément image ou vidéo
    if (media.image) {
      mediaElement = document.createElement("img");
      mediaElement.src = `../../assets/photographers/${folderName}/${media.image
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w\-.]/g, "")}`;
      mediaElement.alt = media.title || "Image sans titre.";
      mediaElement.loading = "lazy";
      logEvent("info", `Image créée : ${media.image}`, { mediaElement });
    } else if (media.video) {
      mediaElement = document.createElement("video");
      mediaElement.src = `../../assets/photographers/${folderName}/${media.video
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w\-.]/g, "")}`;
      mediaElement.controls = true;
      mediaElement.alt = media.title || "Vidéo sans titre.";
      logEvent("info", `Vidéo créée : ${media.video}`, { mediaElement });
    }

    // Vérification de la validité de l'élément média
    if (!mediaElement) {
      logEvent("warn", `Élément média non valide pour l'ID ${media.id}.`, {
        media,
      });
      return null;
    }

    mediaElement.className = "media";
    mediaItem.appendChild(mediaElement);

    // Création de la légende du média
    const caption = document.createElement("div");
    caption.className = "media-caption";
    caption.innerHTML = `
      <h3>${media.title}</h3>
      <p>${media.likes} <i class="fas fa-heart" aria-hidden="true"></i></p>
    `;
    mediaItem.appendChild(caption);

    logEvent("success", "Élément média créé avec succès.", { mediaItem });
    return mediaItem;
  } catch (error) {
    logEvent("error", "Erreur lors de la création d'un élément média.", {
      error,
      media,
    });
    return null;
  }
}

/**
 * Récupère une liste de médias et les affiche dans un conteneur HTML spécifié.
 *
 * @function renderMediaGallery
 * @param {Array} mediaList - Liste des médias à afficher.
 * @param {string} folderName - Nom du dossier contenant les fichiers.
 * @param {HTMLElement} galleryContainer - Conteneur HTML où afficher la galerie.
 * @returns {void}
 */
export function renderMediaGallery(mediaList, folderName, galleryContainer) {
  logEvent("info", "Début de l'affichage de la galerie média.", {
    mediaList,
    folderName,
  });

  // Validation des paramètres d'entrée
  if (!galleryContainer || !(galleryContainer instanceof HTMLElement)) {
    logEvent("error", "Conteneur de galerie invalide ou manquant.", {
      galleryContainer,
    });
    return;
  }
  if (!Array.isArray(mediaList)) {
    logEvent("error", "Liste de médias invalide ou manquante.", { mediaList });
    return;
  }
  if (!folderName || typeof folderName !== "string") {
    logEvent("error", "Nom du dossier invalide ou manquant.", { folderName });
    return;
  }

  try {
    // Nettoyage du conteneur avant de remplir la galerie
    galleryContainer.innerHTML = "";
    mediaList.forEach((media) => {
      const mediaItem = createMediaItem(media, folderName);
      if (mediaItem) {
        galleryContainer.appendChild(mediaItem);
      }
    });

    logEvent("success", "Galerie média affichée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'affichage de la galerie média.", {
      error,
    });
  }
}
