// ========================================================
// Nom du fichier : media-template-logic.js
// Description    : Gestion des médias et opérations associées pour un photographe.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.0.0 (Documentation enrichie, code optimisé)
// ========================================================

import { fetchJSON } from "../data/datafetcher.js";
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
  const data = await fetchJSON(mediaDataUrl);
  if (!data) {
    logEvent("error", "Impossible de charger les données JSON.");
    return null;
  }

  const photographerMedia = data.media.filter(
    (media) => media.photographerId === photographerId,
  );

  logEvent(
    "info",
    `${photographerMedia.length} médias trouvés pour le photographe ID ${photographerId}.`,
  );

  return photographerMedia;
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
  if (!folderName) {
    logEvent(
      "error",
      "Erreur critique : Le dossier du photographe est introuvable.",
    );
    return null;
  }

  // Création de l'élément article principal
  const mediaItem = document.createElement("article");
  mediaItem.className = "media-item";

  let mediaElement;

  // Création de l'élément image ou vidéo
  if (media.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `../../assets/images/photographers/${folderName}/${media.image
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\-.]/g, "")}`;
    mediaElement.alt = media.title || "Image sans titre.";
    mediaElement.loading = "lazy";
    logEvent("info", `Image ajoutée au DOM : ${media.image}`);
  } else if (media.video) {
    mediaElement = document.createElement("video");
    mediaElement.src = `../../assets/images/photographers/${folderName}/${media.video
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\-.]/g, "")}`;
    mediaElement.controls = true;
    mediaElement.alt = media.title || "Vidéo sans titre.";
    logEvent("info", `Vidéo ajoutée au DOM : ${media.video}`);
  }

  // Vérification de la validité de l'élément média
  if (!mediaElement) {
    logEvent(
      "warn",
      `Élément média non valide pour le fichier ${media.id}. Ignoré.`,
    );
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

  return mediaItem;
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
  if (!galleryContainer) {
    logEvent("error", "Conteneur de galerie introuvable.");
    return;
  }

  // Nettoyage du conteneur avant de remplir la galerie
  galleryContainer.innerHTML = "";

  mediaList.forEach((media) => {
    const mediaItem = createMediaItem(media, folderName);
    if (mediaItem) {
      galleryContainer.appendChild(mediaItem);
    }
  });

  logEvent("success", "Galerie média affichée avec succès.");
}
