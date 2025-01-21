import { fetchJSON } from "../../data/dataFetcher.js";
import { photographerTemplate } from "../../templates/photographer-logic.js"; // Modèle pour les cartes
import { logEvent } from "../../utils/utils.js";

// Chemin des données JSON
const PHOTOGRAPHERS_JSON_PATH = "./assets/data/photographers.json";

/**
 * Récupère les données des photographes depuis un fichier JSON.
 * @returns {Promise<Array>} Liste des photographes.
 */
export async function getPhotographers() {
  try {
    logEvent("test_start", "Début de la récupération des photographes");
    const data = await fetchJSON(PHOTOGRAPHERS_JSON_PATH);

    if (!data || !data.photographers) {
      logEvent("warn", "Aucune donnée de photographes trouvée dans le JSON");
      return [];
    }

    logEvent("success", "Données des photographes récupérées avec succès");
    return data.photographers;
  } catch (error) {
    logEvent("error", "Erreur lors de la récupération des photographes", {
      message: error.message,
    });
    return [];
  }
}

/**
 * Valide les données d’un photographe.
 * @param {Object} photographer - Objet représentant un photographe.
 * @returns {boolean} Vrai si les données sont valides.
 */
function isValidPhotographer(photographer) {
  return (
    photographer &&
    typeof photographer.id === "number" &&
    typeof photographer.name === "string"
  );
}

/**
 * Affiche les données des photographes dans la section correspondante.
 * @param {Array} photographers - Liste des photographes à afficher.
 * @param {HTMLElement} photographersSection - Élément DOM pour afficher les photographes.
 */
export function displayData(photographers, photographersSection) {
  try {
    logEvent("test_start", "Début de l'affichage des photographes");

    // Vider le conteneur avant d'ajouter les nouveaux photographes
    photographersSection.innerHTML = "";

    if (!photographers || photographers.length === 0) {
      logEvent("warn", "Aucun photographe à afficher");
      photographersSection.innerHTML = `<p>Aucun photographe trouvé.</p>`;
      return;
    }

    const validPhotographers = photographers.filter(isValidPhotographer);
    if (validPhotographers.length !== photographers.length) {
      logEvent(
        "warn",
        "Certains photographes ont été ignorés à cause de données invalides.",
      );
    }

    const fragment = document.createDocumentFragment();
    validPhotographers.forEach((photographer) => {
      const photographerModel = photographerTemplate(photographer);
      fragment.appendChild(photographerModel.getUserCardDOM());
    });

    photographersSection.appendChild(fragment);
    logEvent("success", `${validPhotographers.length} photographes affichés.`, {
      photographers: validPhotographers,
    });
  } catch (error) {
    logEvent("error", "Erreur lors de l'affichage des photographes", {
      message: error.message,
    });
  }
}
