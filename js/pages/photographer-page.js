// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe, orchestration des médias,
//                  affichage dynamique et événements.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.3.0
// ========================================================

import { logEvent } from "../utils/utils.js"; // Gestion des logs
import domSelectors from "../config/domSelectors.js"; // Sélecteurs centralisés
import {
  loadPhotographerMedia,
  renderMediaGallery,
} from "../templates/media-template-logic.js"; // Chargement et rendu des médias
import { photographerTemplate } from "../templates/photographer-logic.js"; // Template photographe
import initEventListeners from "../events/eventlisteners.js";

// =============================
// CONFIGURATION ET VARIABLES
// =============================

/** @constant {string} Chemin vers le fichier JSON contenant les données. */
const mediaDataUrl = "../../../assets/data/photographers.json";

// =============================
// FONCTIONS UTILITAIRES
// =============================

/**
 * Récupère l'ID du photographe depuis l'URL de la page.
 *
 * @returns {number|null} L'ID du photographe ou `null` si invalide.
 */
function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  if (!id || isNaN(id)) {
    logEvent(
      "error",
      "Aucun ID de photographe valide trouvé dans l'URL. Vérifiez que l'URL contient un paramètre 'id'.",
    );
    return null;
  }

  logEvent("info", `ID du photographe récupéré depuis l'URL : ${id}`);
  return id;
}

// =============================
// FONCTIONS PRINCIPALES
// =============================

/**
 * Affiche les informations du photographe dans la bannière.
 */
async function displayPhotographerBanner() {
  const photographerId = getPhotographerIdFromUrl();
  if (!photographerId) {
    logEvent("error", "Aucun ID de photographe trouvé dans l'URL.");
    return;
  }

  try {
    const response = await fetch(mediaDataUrl);
    const data = await response.json();

    if (!data || !data.photographers) {
      throw new Error("Les données JSON sont invalides ou introuvables.");
    }

    const photographerData = data.photographers.find(
      (photographer) => photographer.id === photographerId,
    );

    if (!photographerData) {
      throw new Error(
        `Photographe avec l'ID ${photographerId} introuvable dans les données.`,
      );
    }

    const bannerContainer = domSelectors.photographerPage.photographerHeader;
    if (!bannerContainer) {
      throw new Error("Conteneur de la bannière introuvable.");
    }

    const { getBannerDOM } = photographerTemplate(photographerData);
    const bannerDOM = getBannerDOM();

    bannerContainer.innerHTML = ""; // Nettoyer le contenu précédent
    bannerContainer.appendChild(bannerDOM);
    logEvent("success", "Bannière du photographe affichée avec succès.");
  } catch (error) {
    logEvent("error", `Erreur lors de l'affichage de la bannière : ${error}`);
  }
}

/**
 * Affiche la galerie de médias du photographe.
 */
async function displayMediaGallery() {
  const photographerId = getPhotographerIdFromUrl();
  if (!photographerId) {
    logEvent(
      "error",
      "Impossible de continuer : ID du photographe non valide.",
    );
    return;
  }

  try {
    const { galleryContainer } = domSelectors.photographerPage;
    if (!galleryContainer) {
      throw new Error("Conteneur de galerie introuvable.");
    }

    const mediaList = await loadPhotographerMedia(photographerId, mediaDataUrl);

    if (mediaList && mediaList.length > 0) {
      const folderName = `../../assets/photographers/${photographerId}`;
      renderMediaGallery(mediaList, folderName, galleryContainer);
      logEvent("success", "Galerie de médias affichée avec succès.");
    } else {
      galleryContainer.innerHTML =
        "<p>Aucun média disponible pour ce photographe.</p>";
      logEvent(
        "warn",
        `Aucun média trouvé pour le photographe ID ${photographerId}.`,
      );
    }
  } catch (error) {
    logEvent("error", `Erreur lors de l'affichage de la galerie : ${error}`);
  }
}

/**
 * Initialise la page du photographe.
 *
 * Cette fonction orchestre :
 * - L'affichage de la bannière du photographe.
 * - L'affichage de la galerie de médias.
 * - L'ajout des gestionnaires d'événements.
 */
async function initPhotographerPage() {
  logEvent("info", "Début de l'initialisation de la page photographe...");

  await displayPhotographerBanner(); // Affichage de la bannière
  await displayMediaGallery(); // Affichage de la galerie

  // Initialisation des gestionnaires d'événements
  initEventListeners();

  logEvent("success", "Page photographe initialisée avec succès.");
}

// =============================
// ÉVÉNEMENT DOM
// =============================

/**
 * Ajoute un événement DOM pour initialiser la page après chargement.
 */
document.addEventListener("DOMContentLoaded", initPhotographerPage);
