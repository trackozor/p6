// ========================================================
// Nom du fichier : index.js
// Description    : Initialisation de l'application Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.1.1 (Documentation et gestion améliorées)
// ========================================================

/**
 * Ce fichier constitue le point d'entrée principal de l'application.
 * Il gère les étapes clés suivantes :
 * 1. Initialisation des logs pour le suivi des opérations.
 * 2. Récupération des données dynamiques des photographes depuis une source externe.
 * 3. Affichage dynamique des photographes sur la page d'accueil.
 * 4. Gestion centralisée des erreurs pour garantir la robustesse de l'application.
 */

// === Importation des modules nécessaires ===
import {
  getPhotographers,
  displayData,
} from "../components/photographer/photographerManager.js"; // Gestion des photographes
import { logEvent } from "../utils/utils.js"; // Utilitaire pour journaliser les événements
import domSelectors from "../config/domSelectors.js"; // Sélecteurs DOM centralisés

// =============================
// FONCTION PRINCIPALE D'INITIALISATION
// =============================

/**
 * Fonction d'initialisation principale.
 * Cette fonction s'assure que toutes les dépendances critiques sont chargées
 * et que l'application démarre dans un état stable.
 *
 * Étapes :
 * - Logue le démarrage de l'initialisation.
 * - Récupère les données dynamiques des photographes via une API ou un fichier JSON.
 * - Génère dynamiquement les cartes des photographes dans le DOM.
 * - Capture et journalise toute erreur critique pour assurer la stabilité.
 *
 * @async
 * @function init
 * @returns {Promise<void>} Rien.
 */
export async function init() {
  try {
    // === Étape 1 : Log du début de l'initialisation ===
    logEvent("test_start", "Début de l'initialisation de l'application");

    // === Étape 2 : Récupération des données des photographes ===
    logEvent(
      "info",
      "Tentative de récupération des données des photographes...",
    );
    const photographers = await getPhotographers();

    // Vérification que les données reçues sont valides
    if (!Array.isArray(photographers)) {
      throw new Error(
        "Les données récupérées ne sont pas valides ou ne sont pas un tableau.",
      );
    }
    logEvent("info", "Données des photographes récupérées avec succès.", {
      count: photographers.length,
    });

    // === Étape 3 : Affichage des photographes dans le DOM ===
    logEvent("info", "Affichage des photographes dans le DOM...");
    displayData(photographers, domSelectors.indexPage.photographersContainer);

    // === Étape 4 : Fin de l'initialisation ===
    logEvent("success", "L'application a été initialisée avec succès.");
    logEvent("test_end", "Fin de l'initialisation de l'application");
  } catch (error) {
    // === Gestion des erreurs critiques ===
    logEvent(
      "error",
      "Erreur critique lors de l'initialisation de l'application.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
    logEvent("test_end", "Initialisation échouée");
  }
}

// =============================
// ÉCOUTEUR DOMContentLoaded
// =============================

/**
 * Ajout d'un écouteur pour lancer l'initialisation une fois le DOM chargé.
 * Cela garantit que toutes les dépendances du DOM sont prêtes avant l'exécution.
 */
document.addEventListener("DOMContentLoaded", init);
