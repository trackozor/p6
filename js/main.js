/**
 * =============================================================================
 * Projet      : Fisheye
 * Fichier     : main.js
 * Auteur      : Trackozor
 * Date        : 21/01/2025
 * Version     : 1.3.0 (Optimisée)
 * Description : Point d'entrée principal de l'application.
 *               Gère :
 *               - L'initialisation de l'application.
 *               - Le chargement des composants principaux.
 *               - La gestion des erreurs critiques au lancement.
 * =============================================================================
 */

import { logEvent } from "./utils/utils.js";
import { init } from "./pages/index.js";

/**
 * =====================================================================
 * Fonction utilitaire : timeoutPromise
 * =====================================================================
 * @function
 * @description
 *   Ajoute un timeout pour éviter un chargement bloquant de `init()`.
 * @param {Promise} promise - Promesse à surveiller.
 * @param {number} ms - Temps max en millisecondes.
 * @returns {Promise} - Résout la promesse ou rejette après expiration.
 */
const timeoutPromise = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Temps d'attente dépassé")), ms),
    ),
  ]);
};

/**
 * =====================================================================
 * Fonction : initializeComponents
 * =====================================================================
 * @async
 * @function
 * @description
 *   Initialise les composants de l'application de manière asynchrone.
 *   Gère les erreurs critiques et logue les événements importants.
 * @throws {Error} - Si un composant critique échoue.
 * @returns {Promise<void>}
 */
const initializeComponents = async () => {
  logEvent("info", "Initialisation des composants principaux...");

  try {
    logEvent("info", "Initialisation de la page d'accueil...");
    await timeoutPromise(init(), 5000);
    logEvent("success", "Page d'accueil initialisée.");
  } catch (error) {
    logEvent("error", "Échec de l'initialisation de la page d'accueil.", {
      message: error.message,
      stack: error.stack,
    });
    displayError("Une erreur est survenue lors du chargement de la page.");
    throw error;
  }
};

/**
 * =====================================================================
 * Fonction : displayError
 * =====================================================================
 * @function
 * @description
 *   Affiche un message d'erreur utilisateur.
 * @param {string} message - Message à afficher.
 */
const displayError = (message) => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  errorContainer.textContent = message;
  document.body.prepend(errorContainer);
};

/**
 * =====================================================================
 * Fonction : main
 * =====================================================================
 * @async
 * @function
 * @description
 *   Fonction principale orchestrant l'initialisation.
 *   Capture les erreurs critiques et logue les événements.
 * @returns {Promise<void>}
 */
const main = async () => {
  logEvent("info", "Lancement de l'application...");

  try {
    await initializeComponents();
    logEvent("success", "Application lancée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur critique au lancement.", {
      message: error.message,
      stack: error.stack,
    });
    displayError("Impossible de charger l'application.");
  }
};

/**
 * =====================================================================
 * Événement : DOMContentLoaded
 * =====================================================================
 * @description
 *   Lance `main()` une fois le DOM chargé, après nettoyage des événements.
 */
document.removeEventListener("DOMContentLoaded", main);
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[INFO] DOM chargé, appel de main()...");
  await main();
});
