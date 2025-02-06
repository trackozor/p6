// ========================================================
// Nom du fichier : photographer-page.js
// Description    : Gestion de la page photographe, orchestration des médias,
//                  affichage dynamique et événements.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.4.0 (Ajout de logs enrichis, gestion renforcée des erreurs)
// ========================================================

import { logEvent } from "../utils/utils.js"; // Gestion des logs
import domSelectors from "../config/domSelectors.js"; // Sélecteurs centralisés
import {
  loadPhotographerMedia,
  renderMediaGallery,
} from "../templates/media-template-logic.js"; // Chargement et rendu des médias
import { photographerTemplate } from "../templates/photographer-logic.js"; // Template photographe
import { initEventListeners, attachModalEvents } from "../events/eventlisteners.js";
import { initstatscalculator } from "../components/statsCalculator.js";

// =============================
// CONFIGURATION ET VARIABLES
// =============================

/**
 * Chemin vers le fichier JSON contenant les données des photographes.
 * @constant {string}
 */
const mediaDataUrl = "../../../assets/data/photographers.json";

// =============================
// FONCTIONS UTILITAIRES
// =============================

/**
 * Récupère l'ID du photographe depuis l'URL de la page.
 *
 * @returns {number|null} L'ID du photographe ou `null` si invalide.
 */
export function getPhotographerIdFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);

    if (!id || isNaN(id)) {
      logEvent(
        "error",
        "Aucun ID de photographe valide trouvé dans l'URL. Vérifiez que l'URL contient un paramètre 'id'.",
        { params: window.location.search },
      );
      return null;
    }

    logEvent("info", `ID du photographe récupéré depuis l'URL : ${id}`);
    return id;
  } catch (error) {
    logEvent("error", "Erreur lors de la récupération de l'ID depuis l'URL.", {
      error,
    });
    return null;
  }
}

// =============================
// FONCTIONS PRINCIPALES
// =============================

/**
 * Affiche les informations du photographe dans la bannière.
 * Récupère les données JSON et génère dynamiquement la bannière.
 */
async function displayPhotographerBanner() {
  const photographerId = getPhotographerIdFromUrl();
  if (!photographerId) {
    logEvent("error", "Aucun ID de photographe trouvé dans l'URL.");
    return;
  }

  try {
    logEvent("info", "Chargement des données JSON pour la bannière...");

    const response = await fetch(mediaDataUrl);
    const data = await response.json();

    if (!data || !data.photographers) {
      throw new Error("Les données JSON sont invalides ou introuvables.");
    }

    logEvent("info", "Données JSON récupérées avec succès.", { data });

    // Recherche des données spécifiques au photographe
    const photographerData = data.photographers.find(
      (photographer) => photographer.id === photographerId,
    );

    if (!photographerData) {
      throw new Error(
        `Photographe avec l'ID ${photographerId} introuvable dans les données.`,
      );
    }

    logEvent("info", "Photographe trouvé dans les données.", {
      photographerData,
    });

    // Mise à jour de la bannière
    const bannerContainer = domSelectors.photographerPage.photographerHeader;
    if (!bannerContainer) {
        throw new Error("Conteneur de la bannière introuvable.");
    }

    const { getBannerDOM } = photographerTemplate(photographerData);
    const bannerDOM = getBannerDOM();

    bannerContainer.innerHTML = ""; // Nettoyer le contenu précédent
    bannerContainer.appendChild(bannerDOM);

    logEvent("success", "Bannière du photographe affichée avec succès.");
    attachModalEvents();
    logEvent("success", "Événements de la modale attachés après génération du bouton.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de l'affichage de la bannière : ${error.message}`,
      { error },
    );
    
  }
}

/**
 * Affiche la galerie de médias du photographe.
 * Charge les médias depuis un fichier JSON et les rend dynamiquement.
 */
async function displayMediaGallery() {
  const photographerId = getPhotographerIdFromUrl();
  if (!photographerId) {
    logEvent(
      "error",
      "Impossible de continuer : ID du photographe non valide.",
    );
    return { mediaArray: [], folderName: "" };
  }

  try {
    const { galleryContainer } = domSelectors.photographerPage;
    if (!galleryContainer) {
      throw new Error("Conteneur de galerie introuvable.");
    }

    // Afficher un indicateur de chargement
    galleryContainer.innerHTML = "<p>Chargement des médias...</p>";

    const response = await fetch(mediaDataUrl);
    const data = await response.json();

    if (!data || !data.photographers || !Array.isArray(data.media)) {
      throw new Error("Les données JSON sont mal structurées ou absentes.");
    }

    const photographerData = data.photographers.find(
      (photographer) => photographer.id === photographerId,
    );

    if (!photographerData || !photographerData.folderName) {
      throw new Error(
        `Impossible de trouver le folderName pour le photographe ID ${photographerId}.`,
      );
    }

    const { folderName } = photographerData;
    const mediaArray = await loadPhotographerMedia(
      photographerId,
      mediaDataUrl,
    );

    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      galleryContainer.innerHTML =
        "<p>Aucun média disponible pour ce photographe.</p>";
      logEvent(
        "warn",
        `Aucun média trouvé pour le photographe ID ${photographerId}.`,
      );
      return { mediaArray: [], folderName };
    }

    renderMediaGallery(mediaArray, folderName, galleryContainer);
    logEvent("success", "Galerie de médias affichée avec succès.", {
      mediaArray,
    });

    return { mediaArray, folderName };
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de l'affichage de la galerie : ${error.message}`,
      { error },
    );
    return { mediaArray: [], folderName: "" };
  }
}

/**
 * Initialise la page du photographe.
 * Orchestration des étapes : bannière, galerie, événements.
 */
async function initPhotographerPage() {
  logEvent("info", "Début de l'initialisation de la page photographe...");

  try {
    await displayPhotographerBanner(); // Affiche la bannière

    // Récupère les médias et le folderName
    const { mediaArray, folderName } = await displayMediaGallery();

    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Aucun média disponible pour l'initialisation des événements.");
    }

    await initstatscalculator(); // Initialise les statistiques

    // ✅ Ajoute un délai pour s'assurer que la galerie est bien chargée avant d'attacher les événements
    setTimeout(() => {
      initEventListeners(mediaArray, folderName);
    }, 500); // 500ms pour s'assurer que les éléments sont bien dans le DOM

    logEvent("success", "Page photographe initialisée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'initialisation de la page photographe.", { error });
  }
}



// =============================
// ÉVÉNEMENT DOM
// =============================

/**
 * Ajoute un événement DOM pour initialiser la page après chargement.
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    initPhotographerPage();
  } catch (error) {
    logEvent("error", "Erreur critique lors du chargement de la page.", {
      error,
    });
  }
});
