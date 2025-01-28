/**
 * =============================================================================
 * Projet      : Fisheye
 * Fichier     : main.js
 * Auteur      : Trackozor
 * Date        : 21/01/2025
 * Version     : 1.2.1
 * Description : Point d'entrée principal de l'application.
 *               Ce fichier gère :
 *               - L'initialisation de l'application.
 *               - Le chargement des composants principaux.
 *               - La gestion des erreurs critiques au lancement.
 * =============================================================================
 */

import { logEvent } from "./utils/utils.js"; // Importation de la fonction de log personnalisée
import { init } from "./pages/index.js"; // Importation de la fonction d'initialisation de la page d'accueil

/**
 * =====================================================================
 * Fonction : initializeComponents
 * =====================================================================
 * @async
 * @function
 * @description
 *   Cette fonction initialise les composants principaux de l'application.
 *   Elle encapsule les processus asynchrones nécessaires et gère les erreurs
 *   qui peuvent se produire pendant l'initialisation.
 * @throws {Error}
 *   Si un composant critique échoue, l'erreur est propagée.
 * @example
 *   await initializeComponents();
 * @returns {Promise<void>}
 *   Aucune valeur n'est retournée, uniquement des effets de bord.
 */
const initializeComponents = async () => {
  try {
    // Début de l'initialisation, log pour suivi
    logEvent("test-start", "Initialisation des composants principaux...");

    // Initialisation de la page d'accueil
    try {
      logEvent("debug", "Initialisation de la page d'accueil...");
      await init(); // Appel de la fonction d'initialisation
      logEvent("success", "Page d'accueil initialisée avec succès."); // Log de succès
    } catch (error) {
      // Capture des erreurs spécifiques à la page d'accueil
      logEvent(
        "error",
        "Erreur lors de l'initialisation de la page d'accueil.",
        {
          message: error.message, // Message de l'erreur
          stack: error.stack, // Stack trace pour faciliter le débogage
        },
      );
    }
  } catch (error) {
    // Gestion globale des erreurs critiques
    logEvent(
      "error",
      "Erreur critique lors de l'initialisation des composants.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
    throw error; // Propagation de l'erreur pour gestion dans `main`
  }
};

/**
 * =====================================================================
 * Fonction : main
 * =====================================================================
 * @async
 * @function
 * @description
 *   Fonction principale de l'application. Elle orchestre le lancement,
 *   initialise les composants et capture les erreurs critiques.
 * @throws {Error}
 *   Les erreurs non gérées dans initializeComponents sont capturées ici.
 * @example
 *   await main();
 * @returns {Promise<void>}
 *   Aucune valeur n'est retournée, mais des logs sont produits.
 */
const main = async () => {
  try {
    // Début du processus principal, log pour suivi
    logEvent("info", "Lancement de l'application...");

    // Appel de l'initialisation principale
    await initializeComponents();

    // Log de succès si tout s'est déroulé correctement
    logEvent("success", "Application lancée avec succès.");
  } catch (error) {
    // Gestion des erreurs critiques
    logEvent("error", "Erreur critique lors du lancement de l'application.", {
      message: error.message, // Détails du message d'erreur
      stack: error.stack, // Stack trace complète
    });
  }
};

/**
 * =====================================================================
 * Événement : DOMContentLoaded
 * =====================================================================
 * @description
 *   Attache un gestionnaire d'événement pour exécuter `main()` une fois
 *   que le DOM est complètement chargé. Cela garantit que tous les éléments
 *   nécessaires à l'initialisation sont disponibles.
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Message de suivi dans la console du navigateur
  console.log("[TEST] DOM chargé, appel de main()...");

  // Exécution de la fonction principale
  await main();
});
