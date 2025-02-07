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
 * @function timeoutPromise
 * @description
 *   Définit un délai maximal pour l'exécution d'une promesse afin d'éviter
 *   un chargement bloqué lors de l'initialisation des composants.
 * @param {Promise<any>} promise - La promesse à surveiller.
 * @param {number} [ms=5000] - Temps maximal d'exécution en millisecondes (défaut : 5000ms).
 * @returns {Promise<any>} - Résout la promesse si elle est terminée à temps, sinon la rejette.
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
 * @function initializeComponents
 * @description
 *   Initialise les composants principaux de l'application de manière asynchrone.
 *   Capture et journalise les erreurs critiques pour éviter un blocage total.
 * @throws {Error} - Propage une erreur en cas d'échec d'initialisation critique.
 * @returns {Promise<void>}
 */
const initializeComponents = async () => {
  logEvent("info", "Initialisation des composants principaux...");

  try {
    logEvent("info", "Chargement de la page d'accueil...");
    await timeoutPromise(init(), 5000);
    logEvent("success", "Page d'accueil chargée avec succès.");
  } catch (error) {
    logEvent("error", "Échec de l'initialisation de la page d'accueil.", {
      message: error.message,
      stack: error.stack,
    });

    displayError("Une erreur est survenue lors du chargement de la page.");
    throw error; // Propagation de l'erreur pour un meilleur suivi des échecs critiques.
  }
};

/**
 * =====================================================================
 * Fonction : displayError
 * =====================================================================
 * @function displayError
 * @description
 *   Affiche dynamiquement un message d'erreur dans l'interface utilisateur.
 *   Ce message est inséré en haut de la page pour une meilleure visibilité.
 * @param {string} message - Message d'erreur à afficher.
 */
const displayError = (message) => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  errorContainer.textContent = message;

  // Insertion du message d'erreur en haut de la page
  document.body.prepend(errorContainer);
};

/**
 * =====================================================================
 * Fonction : main
 * =====================================================================
 * @async
 * @function main
 * @description
 *   Fonction principale orchestrant l'initialisation de l'application.
 *   Capture les erreurs critiques et logue les événements liés au démarrage.
 * @returns {Promise<void>}
 */
const main = async () => {
  logEvent("info", "Lancement de l'application...");

  try {
    await initializeComponents();
    logEvent("success", "Application lancée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur critique au lancement de l'application.", {
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
 *   Exécute `main()` après le chargement complet du DOM.
 *   Supprime les anciens écouteurs pour éviter les doublons.
 */
document.removeEventListener("DOMContentLoaded", main);
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[INFO] DOM chargé, exécution de main()...");
  await main();
});
