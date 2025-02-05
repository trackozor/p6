// ========================================================
// Nom du fichier : media-template-logic.js
// Description    : Gestion des médias et opérations associées pour un photographe.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.1.0 (Ajout de logs enrichis, tests et gestion des exceptions)
// ========================================================

import { fetchJSON } from "../data/dataFetcher.js";
import { logEvent } from "../utils/utils.js";

/* ===================== Fonction : Chargement des Médias ===================== */

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

    if (!data || !Array.isArray(data.media)) {
      logEvent("error", "Structure de données JSON incorrecte ou manquante.", {
        data,
      });
      throw new Error("Les données JSON sont mal structurées ou absentes.");
    }

    logEvent(
      "info",
      `Chargement des médias depuis JSON. Total : ${data.media.length}`,
      {
        photographerId,
      },
    );

    const isValidMedia = (media) => {
      return (
        typeof media.id === "number" &&
        typeof media.photographerId === "number" &&
        (typeof media.image === "string" || typeof media.video === "string") &&
        typeof media.title === "string"
      );
    };

    const photographerMedia = data.media.filter(
      (media) => media.photographerId === photographerId && isValidMedia(media),
    );

    if (photographerMedia.length === 0) {
      logEvent("warn", "Aucun média trouvé pour ce photographe.", {
        photographerId,
      });
      return [];
    }

    logEvent("info", `${photographerMedia.length} médias valides trouvés.`, {
      photographerMedia,
    });

    return photographerMedia;
  } catch (error) {
    logEvent("error", "Erreur lors du chargement des médias.", { error });
    return []; // Fallback : retour d'un tableau vide en cas d'erreur
  }
}

/* ===================== Fonction : Création d'un Média ===================== */

/**
 * Crée un élément HTML représentant un média (image ou vidéo) avec ses métadonnées.
 *
 * @function createMediaItem
 * @param {Object} media - Objet représentant les données d'un média.
 * @param {string} folderName - Nom du dossier contenant les fichiers du photographe.
 * @param {number} position - Position du média dans la liste (optionnel).
 * @returns {HTMLElement|null} Un élément HTML `<article>` pour le média ou `null` en cas d'erreur.
 */
export function createMediaItem(media, folderName, position) {
  logEvent("info", "Création d'un élément média.", {
    media,
    folderName,
    position,
  });

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

    // Ajouter les attributs data-id et data-position
    mediaItem.setAttribute("data-id", media.id); // ID unique du média
    mediaItem.setAttribute("data-position", position || 0); // Position dans la liste

    let mediaElement;

    if (media.image) {
      mediaElement = document.createElement("img");
      mediaElement.src = `../../assets/photographers/${folderName}/${media.image}`;
      mediaElement.alt = media.title || "Image sans titre.";
      mediaElement.loading = "lazy";
      logEvent("info", `Image créée : ${media.image}`, { mediaElement });
    } else if (media.video) {
      mediaElement = document.createElement("video");
      mediaElement.src = `../../assets/photographers/${folderName}/${media.video}`;
      mediaElement.controls = true;
      mediaElement.alt = media.title || "Vidéo sans titre.";
      logEvent("info", `Vidéo créée : ${media.video}`, { mediaElement });
    }

    if (!mediaElement) {
      logEvent("warn", `Élément média non valide pour l'ID ${media.id}.`, {
        media,
      });
      return null;
    }

    mediaElement.className = "media";
    mediaItem.appendChild(mediaElement);

    // Création du conteneur de la légende
    const caption = document.createElement("div");
    caption.className = "media-caption";

    // Création du titre
    const title = document.createElement("h3");
    title.textContent = media.title;

    // Création du conteneur des likes
    const likeContainer = document.createElement("p");

    // Création du nombre de likes
    const likesSpan = document.createElement("span");
    likesSpan.className = "media-likes";
    likesSpan.textContent = media.likes;

    // Création du bouton de like
    const likeButton = document.createElement("button");
    likeButton.className = "like-icon";
    likeButton.setAttribute("data-action", "like");
    likeButton.setAttribute("aria-label", "Ajouter un like");

    // Icône de like (font-awesome)
    const likeIcon = document.createElement("i");
    likeIcon.className = "fas fa-heart";
    likeIcon.setAttribute("aria-hidden", "true");

    // Ajout des éléments au bouton
    likeButton.appendChild(likeIcon);

    // Ajout des éléments au conteneur des likes
    likeContainer.appendChild(likesSpan);
    likeContainer.appendChild(likeButton);

    // Ajout des éléments dans la légende
    caption.appendChild(title);
    caption.appendChild(likeContainer);

    mediaItem.appendChild(caption);

    logEvent("success", "Élément média créé avec succès.", { mediaItem });
    return mediaItem;
  } catch (error) {
    logEvent("error", "Erreur lors de la création d'un élément média.", {
      error,
    });
    return null;
  }
}


/* ===================== Fonction : Rendu de la Galerie ===================== */

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

  if (!galleryContainer || !(galleryContainer instanceof HTMLElement)) {
    logEvent("error", "Conteneur de galerie invalide ou manquant.", {
      galleryContainer,
    });
    return null; // Retourner null en cas d'erreur
  }

  if (!Array.isArray(mediaList)) {
    logEvent("error", "Liste de médias invalide ou manquante.", { mediaList });
    return null;
  }

  if (!folderName || typeof folderName !== "string") {
    logEvent("error", "Nom du dossier invalide ou manquant.", { folderName });
    return null;
  }

  try {
    galleryContainer.innerHTML = ""; // Vide le conteneur
    mediaList.forEach((media, index) => {
      const mediaItem = createMediaItem(media, folderName, index);
      if (mediaItem) {
        mediaItem.setAttribute("data-index", index); // Ajoute un index unique
        mediaItem.classList.add("gallery-item"); // Ajoute une classe spécifique
        galleryContainer.appendChild(mediaItem);
      }
    });

    logEvent("success", "Galerie média affichée avec succès.");
    return folderName; // Retourner le folderName
  } catch (error) {
    logEvent("error", "Erreur lors de l'affichage de la galerie média.", {
      error,
    });
    return null; // Retourner null en cas d'erreur
  }
}
