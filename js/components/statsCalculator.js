// ========================================================
// Nom du fichier : photographerData.js
// Description    : Gestion des données et des statistiques du photographe.
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.0.0 (Amélioration des logs, gestion des exceptions et validations)
// ========================================================

/*==============================================*/
/*                Imports                       */
/*=============================================*/
import { fetchMedia } from "../data/dataFetcher.js";
import { logEvent } from "../utils/utils.js";
import domSelectors from "../config/domSelectors.js"; // Sélecteurs centralisés
import { getPhotographerIdFromUrl } from "../pages/photographer-page.js";

/*==============================================*/
/*         Gestion des données principales      */
/*=============================================*/

/**
 * Récupère les données du photographe actuel.
 * @async
 * @returns {Promise<{photographerData: Object, mediaList: Array}>}
 * @throws {Error} En cas d'erreur lors de la récupération ou du filtrage.
 */
async function getPhotographerDataAndMedia() {
  logEvent(
    "test_start",
    "Début de la récupération des données du photographe.",
  );

  try {
    logEvent("info", "Tentative de récupération des données JSON...");
    const data = await fetchMedia();

    if (!data) {
      throw new Error("Données JSON introuvables ou non récupérées.");
    }

    logEvent("success", "Données JSON récupérées avec succès.", data);

    // Vérification des données JSON
    const { photographers, media } = data;
    if (!photographers || !Array.isArray(photographers)) {
      throw new Error(
        "Les données des photographes sont manquantes ou invalides.",
      );
    }
    if (!media || !Array.isArray(media)) {
      throw new Error("Les données des médias sont manquantes ou invalides.");
    }

    // Extrait l'ID du photographe courant depuis l'URL
    const photographerId = getPhotographerIdFromUrl();
    if (!photographerId || isNaN(photographerId)) {
      throw new Error("ID du photographe invalide ou introuvable dans l'URL.");
    }
    logEvent("info", `Photographer ID récupéré : ${photographerId}`);

    // Filtre les données spécifiques au photographe
    const photographerData = photographers.find((p) => p.id === photographerId);
    const mediaList = media.filter((m) => m.photographerId === photographerId);

    if (!photographerData) {
      throw new Error(`Photographe non trouvé avec l'ID : ${photographerId}`);
    }
    if (!mediaList || mediaList.length === 0) {
      logEvent(
        "warn",
        `Aucun média trouvé pour le photographe ID : ${photographerId}`,
      );
    }

    logEvent(
      "success",
      "Données du photographe et médias filtrées avec succès.",
      {
        photographerData,
        mediaList,
      },
    );

    logEvent("test_end", "Fin de la récupération des données du photographe.");
    return { photographerData, mediaList };
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de la récupération des données du photographe.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
    throw error;
  }
}

/*==============================================*/
/*           Calcul des statistiques            */
/*=============================================*/

/**
 * Calcul des likes totaux d'une liste de médias.
 * @param {Array} mediaList - Liste des médias.
 * @returns {number} Total des likes.
 */
async function calculateTotalLikes(mediaList) {
  logEvent("test_start", "Début du calcul des likes totaux.");

  // Vérifie si la liste des médias est valide
  if (!Array.isArray(mediaList) || mediaList.length === 0) {
    logEvent("warn", "Liste des médias vide ou invalide.", { mediaList });
    return 0; // Retourne 0 si la liste est invalide ou vide.
  }

  try {
    // Calcule la somme des likes
    const totalLikes = mediaList.reduce(
      (sum, media) => sum + (media.likes || 0),
      0,
    );

    logEvent(
      "success",
      `Calcul des likes terminé. Total des likes : ${totalLikes}.`,
      { totalLikes, mediaList },
    );

    logEvent("test_end", "Fin du calcul des likes totaux.");
    return totalLikes;
  } catch (error) {
    logEvent("error", "Erreur lors du calcul des likes totaux.", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/*==============================================*/
/*           Mise à jour du DOM                 */
/*=============================================*/

/**
 * Met à jour les statistiques dans le DOM.
 * @param {Object} photographerData - Données du photographe.
 * @param {number} totalLikes - Nombre total de likes.
 */
async function updatePhotographerStatsDOM(photographerData, totalLikes) {
  logEvent(
    "test_start",
    "Début de la mise à jour des statistiques dans le DOM.",
  );

  try {
    // Sélectionne le template pour insérer les statistiques
    const template = domSelectors.photographerPage.photographerStatsTemplate;

    if (!template) {
      logEvent("error", "Template `#photographer-stats` introuvable.");
      throw new Error("Template non trouvé.");
    }

    const statsContainer = domSelectors.photographerPage.photographerHeader;
    if (!statsContainer) {
      logEvent("error", "Conteneur des statistiques introuvable dans le DOM.");
      throw new Error("Conteneur DOM non trouvé.");
    }

    // Clone et insère le template
    const clone = template.content.cloneNode(true);
    statsContainer.appendChild(clone);

    // Met à jour dynamiquement les sélecteurs
    domSelectors.photographerPage.totalLikes =
      document.querySelector("#total-likes");
    domSelectors.photographerPage.dailyRate =
      document.querySelector("#daily-rate");

    // Met à jour les valeurs des éléments
    if (domSelectors.photographerPage.totalLikes) {
      domSelectors.photographerPage.totalLikes.textContent = totalLikes;
      logEvent("success", "Nombre total de likes mis à jour dans le DOM.", {
        totalLikes,
      });
    } else {
      logEvent("error", "Impossible de mettre à jour `#total-likes`.");
    }

    if (domSelectors.photographerPage.dailyRate && photographerData.price) {
      domSelectors.photographerPage.dailyRate.textContent = `${photographerData.price}€/jour`;
      logEvent("success", "Tarif journalier mis à jour dans le DOM.", {
        price: photographerData.price,
      });
    } else {
      logEvent("error", "Impossible de mettre à jour `#daily-rate`.");
    }

    logEvent("test_end", "Fin de la mise à jour des statistiques dans le DOM.");
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de la mise à jour des statistiques dans le DOM.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
    throw error;
  }
}

/*==============================================*/
/*        Initialisation et exportation         */
/*=============================================*/

export async function initstatscalculator() {
  logEvent(
    "info",
    "Début de l'initialisation des statistiques du photographe.",
  );

  try {
    const { photographerData, mediaList } = await getPhotographerDataAndMedia();
    const totalLikes = await calculateTotalLikes(mediaList);
    await updatePhotographerStatsDOM(photographerData, totalLikes);

    logEvent(
      "success",
      "Statistiques du photographe initialisées avec succès.",
    );
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de l'initialisation des statistiques du photographe.",
      { error },
    );
  }
}
