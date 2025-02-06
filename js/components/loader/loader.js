// ========================================================
// Nom du fichier : loader.js
// Description    : Gestion du loader
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.4.1 (Optimisation de la gestion des animations et suppression des doublons)
// ========================================================  
// 

import domSelectors from "../../config/domSelectors.js";
import { logEvent } from "../../utils/utils.js";

// Tableau de messages dynamiques pour l'affichage progressif
    const messages = [
      "Nous commençons la vérification...",
      "Contrôle du prénom...",
      "Contrôle du nom...",
      "Vérification de l'email...",
      "Analyse du message...",
      "Envoi en cours...",
    ];

    // Initialisation des valeurs
    let progress = 0;
    let messageIndex = 0;

/*==============================================*/
/*              Ouverture loader
/*==============================================*/

/**
 * Affiche un indicateur de chargement avec une barre de progression et des messages dynamiques.
 *
 * ### **Fonctionnement :**
 * - Récupère et vérifie les éléments du DOM nécessaires (`#loader`, `#loader-text`, `#progress-bar`, `#progress-percentage`).
 * - Affiche progressivement des messages dynamiques pour indiquer l'avancement du chargement.
 * - Met à jour la barre de progression en fonction du temps écoulé.
 * - **Utilise un intervalle (`setInterval`)** pour incrémenter progressivement la progression.
 * - **Une fois complété :**
 *    - Masque le loader (`hideLoader()`).
 *    - Réinitialise son état (`resetLoader()`).
 *
 * ### **Gestion des erreurs :**
 * - Vérifie que tous les éléments DOM nécessaires sont bien présents.
 * - Capture et journalise toute erreur inattendue via `logEvent("error", ...)`.
 * - Affiche un message d'erreur détaillé en cas de problème.
 *
 * @function showLoader
 * @throws {Error} Génère une erreur si l'un des éléments du DOM est introuvable ou si un problème survient pendant l'animation.
 */

export function showLoader() {
  try {
    // Récupération des éléments du DOM
    const {loader, loaderText, progressBar, progressPercentage} = domSelectors;

    // Vérification que tous les éléments existent
    if (!loader || !loaderText || !progressBar || !progressPercentage) {
      throw new Error("Un ou plusieurs éléments du loader sont introuvables.");
    }

  

    // Affichage du loader
    loader.classList.add("loader-active");

    // Mise à jour dynamique du texte et de la barre de progression
    const interval = setInterval(() => {
      try {
        // Mise à jour des messages
        if (messageIndex < messages.length) {
          loaderText.textContent = messages[messageIndex];
          messageIndex++;
        }

        // Mise à jour de la barre de progression
        progress += 100 / messages.length;
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}%`;

        // Fin du chargement
        if (progress >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            hideLoader(); // Masquer le loader
            resetLoader(); // Réinitialiser son état
          }, 500);
        }
      } catch (error) {
        logEvent("error", `Erreur lors de la mise à jour du loader : ${error.message}`, { error });
        clearInterval(interval);
      }
    }, 1000);

    logEvent("info", "Affichage du loader en cours...");
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de l'affichage du loader : ${error.message}`, { error });
  }
}

/*==============================================*/
/*              Fermeture loader
/*==============================================*/

/**
 * Cache l'indicateur de chargement (`#loader`) en supprimant la classe `loader-active`.
 *
 * ### **Fonctionnement :**
 * - Récupère l'élément `#loader` dans le DOM.
 * - Vérifie si l'élément existe avant d'appliquer les modifications.
 * - Supprime la classe `loader-active` pour masquer le loader.
 * - Journalise l'action pour suivi dans les logs (`logEvent`).
 *
 * ### **Gestion des erreurs :**
 * - Vérifie que l'élément `#loader` est présent avant de modifier sa classe.
 * - Capture et journalise toute erreur inattendue via `logEvent("error", ...)`.
 *
 * @function hideLoader
 * @throws {Error} Génère une erreur si l'élément `#loader` est introuvable.
 */

export function hideLoader() {
  try {
    // Récupération de l'élément du loader
    const {loader} = domSelectors;

    // Vérification de l'existence du loader
    if (!loader) {
      throw new Error("Élément `#loader` introuvable dans le DOM.");
    }

    // Suppression de la classe active pour cacher le loader
    loader.classList.remove("loader-active");

    // Journalisation du succès
    logEvent("success", "Loader caché avec succès.");
  } catch (error) {
    // Capture et journalisation des erreurs
    logEvent("error", `Erreur lors du masquage du loader : ${error.message}`, { error });
  }
}

/*==============================================*/
/*              Reset loader
/*==============================================*/
/**
 * Réinitialise l'affichage du loader pour préparer une prochaine utilisation.
 *
 * ### **Fonctionnement :**
 * - Récupère les éléments du DOM liés au texte, à la barre de progression et au pourcentage.
 * - Vérifie l'existence de chaque élément avant d'appliquer les modifications.
 * - Réinitialise :
 *   - Le texte du loader (`Nous commençons la vérification...`).
 *   - La largeur de la barre de progression (`0%`).
 *   - L'affichage du pourcentage (`0%`).
 * - Journalise l'action dans `logEvent` pour assurer un bon suivi.
 *
 * ### **Gestion des erreurs :**
 * - Vérifie que chaque élément (`loader-text`, `progress-bar`, `progress-percentage`) est bien présent dans le DOM.
 * - Capture et journalise toute erreur via `logEvent("error", ...)`.
 *
 * @function resetLoader
 * @throws {Error} Génère une erreur si un élément requis est introuvable.
 */

export function resetLoader() {
  try {
    // Récupération des éléments du DOM
    const {loaderText, progressBar, progressPercentage} = domSelectors;
    

    // Vérification de l'existence des éléments nécessaires
    if (!loaderText || !progressBar || !progressPercentage) {
      throw new Error("Un ou plusieurs éléments du loader sont introuvables.");
    }

    // Réinitialisation des valeurs par défaut
    loaderText.textContent = "Nous commençons la vérification...";
    progressBar.style.width = "0%";
    progressPercentage.textContent = "0%";

    // Journalisation du succès
    logEvent("success", "Loader réinitialisé avec succès.");
  } catch (error) {
    // Capture et journalisation des erreurs
    logEvent("error", `Erreur lors de la réinitialisation du loader : ${error.message}`, { error });
  }
}
