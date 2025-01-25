/* =============================================================================
 * Projet      : Fisheye
 * Fichier     : main.js
 * Auteur      : Trackozor
 * Date        : 21/01/2025
 * Version     : 1.1.0
 * Description : Point d'entrée principal de l'application.
 *               Ce fichier gère :
 *               - L'initialisation de l'application.
 *               - Le chargement des composants principaux.
 *               - La gestion des erreurs critiques au lancement.
 * =============================================================================
 */

/**
 * ========================================================================
 * SECTION : IMPORTATIONS
 * ========================================================================
 * Importation des modules nécessaires pour l'initialisation et les logs.
 */
import { logEvent } from "./utils/utils.js"; // Gestion des logs
import { init } from "./pages/index.js"; // Initialisation de la page d'accueil

/**
 * ========================================================================
 * SECTION : FONCTIONS PRINCIPALES
 * ========================================================================
 */

/**
 * Initialisation de chaque composant ou module principal de l'application.
 * Ajoutez ici toutes les fonctions nécessaires à d'autres modules.
 *
 * @async
 * @returns {Promise<void>} - Aucune valeur retournée.
 * @throws {Error} - Propage une erreur en cas d'échec d'initialisation.
 */
const initializeComponents = async () => {
  try {
    logEvent("test-start", "Initialisation des composants principaux...");
    // Initialisation de la page d'accueil
    logEvent("info", " lancement de l'application");
    await init();

    logEvent("success", "Composants principaux initialisés avec succès.");
  } catch (error) {
    // Gestion des erreurs avec logEvent
    logEvent("error", "Erreur lors de l'initialisation des composants.", {
      message: error.message,
      stack: error.stack,
    });
    throw error; // Propagation de l'erreur critique
  }
};

/**
 * Fonction principale de l'application.
 * Cette fonction orchestre :
 * - Le lancement des logs.
 * - L'initialisation des composants principaux.
 * - La gestion des erreurs critiques.
 */
function main() {
  try {
    logEvent("info", "Lancement de l'application...");

    // Initialisation principale
    initializeComponents();

    logEvent("success", "Application lancée avec succès.");
  } catch (error) {
    // Gestion des erreurs critiques au lancement
    logEvent("error", "Erreur critique lors du lancement de l'application.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * ========================================================================
 * SECTION : ÉVÉNEMENTS DOM
 * ========================================================================
 * Exécute la fonction principale après le chargement complet du DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("[TEST] DOM chargé, appel de main()...");
  main();
});
