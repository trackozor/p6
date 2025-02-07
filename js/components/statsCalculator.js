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
import { getPhotographerIdFromUrl } from "../pages/photographer-page.js"
const API_BASE_URL = "http://localhost:3000"; // <-- Vérifie bien cette ligne

/*==============================================*/
/*         Gestion des données principales      */
/*=============================================*/

/**
 * Récupère les données du photographe actuel et ses médias.
 * 
 * ### **Fonctionnement :**
 * - Récupère les données JSON contenant la liste des photographes et leurs médias via `fetchMedia()`.
 * - Vérifie que les données JSON sont bien structurées (`photographers`, `media`).
 * - Récupère l'ID du photographe courant depuis l'URL.
 * - Filtre les données pour obtenir **les informations du photographe** et **sa liste de médias**.
 * - Retourne un objet contenant **`photographerData`** et **`mediaList`**.
 * - Journalise chaque étape du processus (`logEvent()`).
 * 
 * ### **Gestion des erreurs :**
 * - Capture les erreurs de récupération des données JSON.
 * - Vérifie que **les tableaux `photographers` et `media` existent et sont valides**.
 * - Vérifie que **l'ID du photographe est bien récupéré depuis l'URL**.
 * - Vérifie que **le photographe et ses médias sont bien trouvés**.
 * - Journalise et relance les erreurs pour un débogage optimal.
 * 
 * @async
 * @function getPhotographerDataAndMedia
 * @returns {Promise<{photographerData: Object, mediaList: Array}>} 
 * Un objet contenant les informations du photographe et la liste de ses médias.
 * @throws {Error} Lève une erreur si les données ne peuvent pas être récupérées ou sont mal formatées.
 */

async function getPhotographerDataAndMedia() {
  // Journalisation de début d'exécution
  logEvent("test_start", "Début de la récupération des données du photographe.");

  try {
    // Étape 1 : Récupération des données JSON depuis `fetchMedia()`
    logEvent("info", "Tentative de récupération des données JSON...");
    const data = await fetchMedia();

    // Vérification de l'existence des données JSON
    if (!data) {
      throw new Error("Données JSON introuvables ou non récupérées.");
    }

    // Journalisation du succès de la récupération des données
    logEvent("success", "Données JSON récupérées avec succès.", data);

    // Étape 2 : Vérification de la structure des données JSON
    const { photographers, media } = data;

    if (!photographers || !Array.isArray(photographers)) {
      throw new Error("Les données des photographes sont manquantes ou invalides.");
    }

    if (!media || !Array.isArray(media)) {
      throw new Error("Les données des médias sont manquantes ou invalides.");
    }

    // Étape 3 : Récupération de l'ID du photographe depuis l'URL
    const photographerId = getPhotographerIdFromUrl();

    // Vérification de l'ID du photographe
    if (!photographerId || isNaN(photographerId)) {
      throw new Error("ID du photographe invalide ou introuvable dans l'URL.");
    }

    // Journalisation de l'ID récupéré
    logEvent("info", `Photographer ID récupéré : ${photographerId}`);

    // Étape 4 : Filtrage des données pour récupérer le photographe et ses médias
    const photographerData = photographers.find((p) => p.id === photographerId);
    const mediaList = media.filter((m) => m.photographerId === photographerId);

    // Vérification de la présence du photographe dans les données
    if (!photographerData) {
      throw new Error(`Photographe non trouvé avec l'ID : ${photographerId}`);
    }

    // Vérification des médias associés au photographe
    if (!mediaList || mediaList.length === 0) {
      logEvent("warn", `Aucun média trouvé pour le photographe ID : ${photographerId}`);
    }

    // Étape 5 : Journalisation du succès du filtrage des données
    logEvent("success", "Données du photographe et médias filtrées avec succès.", {
      photographerData,
      mediaList,
    });

    // Journalisation de fin d'exécution
    logEvent("test_end", "Fin de la récupération des données du photographe.");

    // Retourne les données du photographe et ses médias
    return { photographerData, mediaList };

  } catch (error) {
    // Journalisation détaillée de l'erreur
    logEvent("error", "Erreur lors de la récupération des données du photographe.", {
      message: error.message,
      stack: error.stack,
    });

    // Relance l'erreur pour permettre au gestionnaire d'erreur parent de la traiter
    throw error;
  }
}


/*==============================================*/
/*           Calcul des statistiques            */
/*=============================================*/
/**
 * Calcule le nombre total de likes d'une liste de médias.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `mediaList` est bien un tableau valide et non vide.
 * - Utilise la méthode `reduce()` pour additionner les valeurs `likes` de chaque média.
 * - Retourne le nombre total de likes.
 * - Journalise chaque étape du processus avec `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `mediaList` est bien un **tableau** avant d'effectuer l'addition.
 * - Retourne `0` si la liste est **vide ou invalide** (évite les erreurs inattendues).
 * - Capture et journalise toute erreur rencontrée avec `logEvent("error", ...)`.
 * - Relance l'erreur (`throw error`) pour un débogage optimal si un problème survient dans `reduce()`.
 * 
 * @async
 * @function calculateTotalLikes
 * @param {Array} mediaList - Liste des médias contenant des objets avec une propriété `likes`.
 * @returns {Promise<number>} - Nombre total de likes de tous les médias.
 * @throws {Error} Génère une erreur si `reduce()` échoue ou si la liste est invalide.
 */

async function calculateTotalLikes(mediaList) {
  // Journalisation du début du processus
  logEvent("test_start", "Début du calcul des likes totaux.");

  try {
    // Vérification que `mediaList` est bien un tableau valide
    if (!Array.isArray(mediaList)) {
      throw new Error("Paramètre `mediaList` invalide : attendu un tableau.");
    }

    // Si la liste est vide, retourne 0 avec un log de prévention
    if (mediaList.length === 0) {
      logEvent("warn", "Liste des médias vide, total des likes fixé à 0.");
      return 0;
    }

    // Calcule la somme des likes en s'assurant que chaque valeur `likes` est un nombre valide
    const totalLikes = mediaList.reduce((sum, media) => {
      const mediaLikes = Number(media.likes) || 0; // Assure que `likes` est bien un nombre
      return sum + mediaLikes;
    }, 0);

    // Journalisation du succès du calcul
    logEvent("success", `Calcul des likes terminé. Total : ${totalLikes}.`, {
      totalLikes,
      mediaList,
    });

    // Journalisation de fin du processus
    logEvent("test_end", "Fin du calcul des likes totaux.");
    
    // Retourne le total des likes
    return totalLikes;
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", "Erreur lors du calcul des likes totaux.", {
      message: error.message,
      stack: error.stack,
      mediaList,
    });

    // Relance l'erreur pour un traitement en amont
    throw error;
  }
}



/*==============================================*/
/*           Mise à jour du DOM                 */
/*=============================================*/

/**
 * Met à jour dynamiquement les statistiques du photographe dans le DOM.
 * 
 * ### **Fonctionnement :**
 * - Sélectionne et clone le template `#photographer-stats`.
 * - Insère dynamiquement les statistiques dans `photographerHeader`.
 * - Met à jour les **likes totaux** et le **tarif journalier**.
 * - Vérifie que chaque élément est bien sélectionné avant mise à jour.
 * - Journalise chaque étape du processus avec `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que **le template existe bien dans le DOM** avant de le cloner.
 * - Vérifie que **le conteneur des statistiques (`photographerHeader`) est disponible**.
 * - Vérifie que **`totalLikes` et `dailyRate` sont bien mis à jour**.
 * - Capture et journalise toute erreur rencontrée avec `logEvent("error", ...)`.
 * - Relance l'erreur (`throw error`) pour un débogage optimal en cas de problème.
 * 
 * @async
 * @function updatePhotographerStatsDOM
 * @param {Object} photographerData - Données du photographe, contenant notamment son tarif journalier.
 * @param {number} totalLikes - Nombre total de likes du photographe.
 * @throws {Error} Lève une erreur si le template ou le conteneur est introuvable, ou si les mises à jour échouent.
 */

async function updatePhotographerStatsDOM(photographerData, totalLikes) {
  // Journalisation du début du processus
  logEvent("test_start", "Début de la mise à jour des statistiques dans le DOM.");

  try {
    // Étape 1 : Sélection du template `#photographer-stats`
    const template = domSelectors.photographerPage.photographerStatsTemplate

    // Vérification que le template est bien trouvé dans le DOM
    if (!template) {
      logEvent("error", "Template `#photographer-stats` introuvable.");
      throw new Error("Template non trouvé.");
    }

    // Étape 2 : Sélection du conteneur des statistiques dans l'en-tête du photographe
    const statsContainer = domSelectors.photographerPage.photographerHeader;
    
    // Vérification que le conteneur est bien présent dans le DOM
    if (!statsContainer) {
      logEvent("error", "Conteneur des statistiques introuvable dans le DOM.");
      throw new Error("Conteneur DOM non trouvé.");
    }

    // Étape 3 : Clonage et insertion du template dans le conteneur
    const clone = template.content.cloneNode(true);
    statsContainer.appendChild(clone);

    // Étape 4 : Mise à jour des sélecteurs après insertion
    domSelectors.photographerPage.totalLikes = document.querySelector("#total-likes");
    domSelectors.photographerPage.dailyRate = document.querySelector("#daily-rate");

    // Étape 5 : Mise à jour dynamique du nombre total de likes
    if (domSelectors.photographerPage.totalLikes) {
      domSelectors.photographerPage.totalLikes.textContent = totalLikes;
      logEvent("success", "Nombre total de likes mis à jour dans le DOM.", {
        totalLikes,
      });
    } else {
      logEvent("error", "Impossible de mettre à jour `#total-likes`.");
    }

    // Étape 6 : Mise à jour dynamique du tarif journalier
    if (domSelectors.photographerPage.dailyRate && photographerData.price) {
      domSelectors.photographerPage.dailyRate.textContent = `${photographerData.price}€/jour`;
      logEvent("success", "Tarif journalier mis à jour dans le DOM.", {
        price: photographerData.price,
      });
    } else {
      logEvent("error", "Impossible de mettre à jour `#daily-rate`.");
    }

    // Journalisation de fin du processus
    logEvent("test_end", "Fin de la mise à jour des statistiques dans le DOM.");
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", "Erreur lors de la mise à jour des statistiques dans le DOM.", {
      message: error.message,
      stack: error.stack,
    });

    // Relance l'erreur pour un traitement en amont
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
