// ========================================================
// Nom du fichier : photographerManager.js
// Description    : Gestion de la lightbox pour afficher les médias (images ou vidéos) en plein écran.
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.4.1 (Optimisation de la gestion des animations et suppression des doublons)
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/
import { fetchJSON } from "../../data/dataFetcher.js";
import { photographerTemplate } from "../../templates/photographer-logic.js"; // Modèle pour les cartes
import { logEvent } from "../../utils/utils.js";

// Chemin des données JSON
const PHOTOGRAPHERS_JSON_PATH = "./assets/data/photographers.json";

/*==============================================*/
/*              Récupération              */
/*==============================================*/
/**
 * Récupère la liste des photographes depuis un fichier JSON.
 *
 * ### **Fonctionnement :**
 * - Vérifie si les données sont déjà en cache (`sessionStorage`).
 * - Si non, effectue une requête pour récupérer les photographes.
 * - Vérifie que le JSON est bien structuré avant de retourner les données.
 *
 * ### **Gestion des erreurs :**
 * - Vérifie si `data` et `data.photographers` existent et sont valides.
 * - Capture toute erreur de requête et journalise les détails (`error.stack`).
 * - Stocke les données en cache (`sessionStorage`) pour éviter les requêtes répétées.
 *
 * @async
 * @function getPhotographers
 * @returns {Promise<Array>} Liste des photographes ou un tableau vide en cas d'erreur.
 */

export async function getPhotographers() {
  try {
    logEvent("test_start", "Début de la récupération des photographes...");

    // Vérifie si les données sont déjà présentes dans le cache session
    const cachedData = sessionStorage.getItem("photographersData");
    if (cachedData) {
      logEvent("info", "Données des photographes récupérées depuis le cache.");
      return JSON.parse(cachedData);
    }

    // Récupération des données depuis le fichier JSON
    logEvent("info", `Chargement du fichier JSON : ${PHOTOGRAPHERS_JSON_PATH}`);
    const data = await fetchJSON(PHOTOGRAPHERS_JSON_PATH);

    // Vérification stricte des données JSON
    if (!data || typeof data !== "object" || !Array.isArray(data.photographers)) {
      logEvent("warn", "Données des photographes invalides ou absentes.");
      throw new Error("Structure du fichier JSON incorrecte ou donnée absente.");
    }

    // Mise en cache des données pour optimiser les performances
    sessionStorage.setItem("photographersData", JSON.stringify(data.photographers));
    logEvent("success", "Données des photographes récupérées et mises en cache.");

    return data.photographers;

  } catch (error) {
    logEvent("error", "Erreur lors de la récupération des photographes.", {
      message: error.message,
      stack: error.stack,
    });
    return [];
  }
}


/*==============================================*/
/*             VALIDATION                       */
/*==============================================*/

/**
 * Vérifie si un objet représente un photographe valide.
 *
 * - Assure que l'objet **existe et est bien défini**.
 * - Vérifie que **l'identifiant (`id`) est un nombre valide**.
 * - Vérifie que **le nom (`name`) est une chaîne de caractères non vide**.
 * - Logue un avertissement si les données sont invalides.
 *
 * @param {Object} photographer - Objet représentant un photographe.
 * @returns {boolean} - `true` si les données sont valides, sinon `false`.
 */
function isValidPhotographer(photographer) {
  // Vérification que l'objet est bien défini
  if (!photographer || typeof photographer !== "object") {
      logEvent("warn", "Données du photographe invalides ou non définies.", { photographer });
      return false;
  }

  // Vérification de l'ID du photographe (doit être un nombre entier strictement positif)
  if (typeof photographer.id !== "number" || photographer.id <= 0 || !Number.isInteger(photographer.id)) {
      logEvent("warn", `ID du photographe invalide : ${photographer.id}`, { photographer });
      return false;
  }

  // Vérification du nom du photographe (doit être une chaîne de caractères non vide)
  if (typeof photographer.name !== "string" || photographer.name.trim().length === 0) {
      logEvent("warn", "Nom du photographe invalide ou vide.", { photographer });
      return false;
  }

  logEvent("info", `Photographe valide : ${photographer.name}`, { photographer });
  return true;
}


/*==============================================*/
/*              Affichage             */
/*==============================================*/
/**
 * Affiche les données des photographes dans la section correspondante.
 *
 * ### **Fonctionnement :**
 * - Vérifie que `photographers` est un tableau valide.
 * - Vérifie que `photographersSection` est un élément DOM valide.
 * - Vide la section avant d'afficher de nouveaux photographes.
 * - Filtre les photographes invalides avant affichage.
 * - Utilise `DocumentFragment` pour améliorer les performances.
 *
 * ### **Gestion des erreurs :**
 * - Log une erreur si `photographers` ou `photographersSection` est invalide.
 * - Log une alerte si des photographes sont ignorés à cause de données incorrectes.
 * - Si aucun photographe valide n'est trouvé, affiche un message "Aucun photographe trouvé."
 *
 * @param {Array} photographers - Liste des photographes à afficher.
 * @param {HTMLElement} photographersSection - Élément DOM où afficher les photographes.
 * @throws {Error} - En cas de problème lors de l'affichage.
 */

export function displayData(photographers, photographersSection) {
  try {
    logEvent("test_start", "Début de l'affichage des photographes");

    // Vérifie que `photographers` est bien un tableau
    if (!Array.isArray(photographers)) {
      throw new Error("Paramètre `photographers` invalide (doit être un tableau).");
    }

    // Vérifie que `photographersSection` est bien un élément DOM valide
    if (!(photographersSection instanceof HTMLElement)) {
      throw new Error("error", "photographersSection invalide (doit être un élément HTML).");
    }

    // Vider le conteneur avant d'ajouter les nouveaux photographes
    photographersSection.innerHTML = "";

    if (photographers.length === 0) {
      logEvent("warn", "Aucun photographe à afficher.");
      photographersSection.innerHTML = `<p>Aucun photographe trouvé.</p>`;
      return;
    }

    // Filtrer les photographes valides avant de les afficher
    const validPhotographers = photographers.filter(isValidPhotographer);
    
    if (validPhotographers.length === 0) {
      logEvent("warn", "Aucun photographe valide à afficher après filtrage.");
      photographersSection.innerHTML = `<p>Aucun photographe valide trouvé.</p>`;
      return;
    }

    // Affichage d'un avertissement si des photographes ont été exclus
    if (validPhotographers.length !== photographers.length) {
      logEvent(
        "warn",
        "Certains photographes ont été ignorés en raison de données invalides.",
        { ignoredPhotographers: photographers.length - validPhotographers.length }
      );
    }

    // Utilisation d'un fragment pour améliorer les performances
    const fragment = document.createDocumentFragment();
    validPhotographers.forEach((photographer) => {
      const photographerModel = photographerTemplate(photographer);
      fragment.appendChild(photographerModel.getUserCardDOM());
    });

    // Ajout des photographes au DOM en une seule opération
    photographersSection.appendChild(fragment);

    logEvent("success", `${validPhotographers.length} photographes affichés avec succès.`, {
      photographers: validPhotographers,
    });

  } catch (error) {
    logEvent("error", "Erreur lors de l'affichage des photographes.", {
      message: error.message,
      stack: error.stack,
    });
    photographersSection.innerHTML = `<p>Une erreur est survenue lors du chargement des photographes.</p>`;
  }
}
