/* =============================================================================
    Projet      : Fisheye
    Fichier     : main.js
    Auteur      : [Votre nom ou équipe]
    Date        : [Date de création ou mise à jour]
    Version     : 1.1.0
    Description : Point d'entrée principal de l'application, avec gestion
                  améliorée des dépendances et des composants.
============================================================================= */

// Import des modules nécessaires
import { logEvent } from "./utils/utils.js";
import { init } from "./pages/index.js";

/**
 * Initialisation de chaque composant ou module principal de l'application.
 * Ajoutez ici toutes les fonctions nécessaires à d'autres modules.
 */
const initializeComponents = async () => {
  try {
    logEvent("info", "Initialisation des composants principaux...");

    // Initialisation de la page d'accueil
    await init();

    logEvent("success", "Composants principaux initialisés avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'initialisation des composants.", {
      message: error.message,
      stack: error.stack,
    });
    throw error; // Propagation de l'erreur critique
  }
};

/**
 * Fonction principale de l'application.
 */
async function main() {
  try {
    logEvent("info", "Lancement de l'application...");

    // Initialisation principale
    await initializeComponents();

    logEvent("success", "Application lancée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur critique lors du lancement de l'application.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

// Exécution de la fonction principale lorsque le DOM est prêt
document.addEventListener("DOMContentLoaded", main);
