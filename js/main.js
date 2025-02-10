/**
 * =============================================================================
 * Projet      : Fisheye
 * Fichier     : main.js
 * Auteur      : Trackozor
 * Date        : 21/01/2025
 * Version     : 1.3.2 (Optimisée avec déclarations explicites)
 * Description : Point d'entrée principal de l'application.
 *               - Gère l'initialisation et le chargement des composants.
 *               - Ajoute un système robuste de gestion des erreurs et timeouts.
 * =============================================================================
 */

import { logEvent } from "./utils/utils.js";
import { init } from "./pages/index.js";

/**
 * =====================================================================
 * Fonction utilitaire : timeoutPromise
 * =====================================================================
 * Définit un délai maximal pour l'exécution d'une promesse afin d'éviter
 * un chargement bloqué. Ajoute un identifiant pour faciliter le diagnostic.
 *
 * - Utilise `Promise.race()` pour gérer la concurrence entre la promesse et le timeout.
 * - Empêche un timeout inutile grâce à `clearTimeout()`.
 * - Capture proprement les erreurs de la promesse ou du délai dépassé.
 *
 * @param {Promise<any>} promise - La promesse à surveiller.
 * @param {number} [ms=5000] - Temps maximal d'exécution en millisecondes.
 * @param {string} [taskName="Opération"] - Nom de la tâche pour le log.
 * @returns {Promise<any>} - Résout la promesse si elle est terminée à temps,
 *                           sinon la rejette avec un message détaillé.
 */
function timeoutPromise(promise, ms = 5000, taskName = "Opération") {
    return new Promise((resolve, reject) => {
        let timeoutId;

        // Création d'un timeout avec un rejet après `ms` millisecondes
        const timeout = new Promise((_, timeoutReject) => {
            timeoutId = setTimeout(() => {
                logEvent("error", `timeoutPromise : Temps dépassé pour ${taskName} (${ms} ms).`);
                timeoutReject(new Error(`Temps dépassé pour ${taskName} (${ms} ms)`));
            }, ms);
        });

        // Exécute la promesse d'origine et annule le timeout si elle est plus rapide
        Promise.race([promise, timeout])
            .then((result) => {
                clearTimeout(timeoutId); // Empêche le timeout de s'exécuter si la promesse est résolue avant
                logEvent("success", `timeoutPromise : ${taskName} terminé en moins de ${ms} ms.`);
                resolve(result);
            })
            .catch((error) => {
                clearTimeout(timeoutId); // Nettoyage en cas d'erreur
                reject(error);
            });
    });
}

/**=============================================================================
 * Fonction : initializeComponents
 * =============================================================================
 * Initialise les composants principaux de l'application de manière asynchrone.
 * Capture et journalise les erreurs critiques pour éviter un blocage total.
 *
 * - Utilise `timeoutPromise()` pour garantir une exécution limitée dans le temps.
 * - Enregistre les logs détaillés pour faciliter le diagnostic en cas d'échec.
 * - Affiche un message d'erreur dans l'interface utilisateur en cas de problème.
 *
 * @async
 * @throws {Error} - Propage une erreur en cas d'échec critique d'initialisation.
 * @returns {Promise<void>}
 */
async function initializeComponents() {
    logEvent("info", "initializeComponents : Début de l'initialisation...");

    try {
        logEvent("info", "initializeComponents : Chargement de la page d'accueil...");

        // Exécute `init()` avec une limite de 5000ms
        await timeoutPromise(init(), 5000, "Chargement de la page d'accueil");

        logEvent("success", "initializeComponents : Page d'accueil chargée avec succès.");
    } catch (error) {
        // Différenciation entre un timeout et une autre erreur
        const isTimeout = error.message.includes("Temps dépassé");

        logEvent("error", `initializeComponents : Échec du chargement (${isTimeout ? "timeout" : "erreur interne"}).`, {
            message: error.message,
            stack: error.stack,
        });

        // Affichage d'un message d'erreur adapté
        const errorMessage = isTimeout 
            ? "Le chargement prend trop de temps. Vérifiez votre connexion et réessayez." 
            : "Une erreur interne est survenue. Veuillez rafraîchir la page.";
        
        displayError(errorMessage);
        throw error; // Propage l'erreur pour une meilleure gestion en amont.
    }
}


/**=============================================================================
 * Fonction : displayError
 * =============================================================================
 * Affiche dynamiquement un message d'erreur dans l'interface utilisateur.
 *
 * - Vérifie si un message d'erreur est déjà présent pour éviter les doublons.
 * - Permet à l'utilisateur de fermer le message manuellement via un bouton.
 * - Supprime automatiquement le message après 10 secondes avec une animation.
 * - Logue chaque étape pour faciliter le suivi des erreurs.
 *
 * @param {string} message - Message d'erreur à afficher.
 */
function displayError(message) {
    try {
        // Vérifie si un message d'erreur est déjà affiché
        const existingError = document.querySelector(".error-message");
        if (existingError) {
            logEvent("warning", "displayError : Un message d'erreur est déjà affiché, remplacement en cours...");
            existingError.remove(); // Supprime l'ancien message pour éviter la superposition
        }

        // Création du conteneur de l'erreur
        const errorContainer = document.createElement("div");
        errorContainer.className = "error-message";
        errorContainer.textContent = message;

        // Ajout d'un bouton de fermeture
        const closeButton = document.createElement("button");
        closeButton.className = "error-close";
        closeButton.textContent = "✖";
        closeButton.setAttribute("aria-label", "Fermer le message d'erreur");
        closeButton.addEventListener("click", () => {
            removeError(errorContainer);
        });

        errorContainer.appendChild(closeButton);

        // Insertion en haut de la page
        document.body.prepend(errorContainer);
        logEvent("info", "displayError : Message d'erreur affiché.");

        // Suppression automatique après 10 secondes
        setTimeout(() => {
            removeError(errorContainer);
        }, 10000);
    } catch (error) {
        logEvent("error", "displayError : Erreur lors de l'affichage du message d'erreur.", { error: error.message });
    }
}

/**=============================================================================
 * Fonction : removeError
 * =============================================================================
 * Supprime le message d'erreur avec une animation fluide avant suppression.
 *
 * @param {HTMLElement} errorElement - Élément du message d'erreur à supprimer.
 */
function removeError(errorElement) {
    try {
        if (!errorElement) {
            logEvent("warning", "removeError : Aucun élément d'erreur à supprimer.");
            return;
        }

        // Ajoute une classe CSS pour une animation de disparition
        errorElement.classList.add("fade-out");

        // Attente de la fin de l'animation avant suppression
        setTimeout(() => {
            errorElement.remove();
            logEvent("info", "removeError : Message d'erreur supprimé.");
        }, 500);
    } catch (error) {
        logEvent("error", "removeError : Erreur lors de la suppression du message d'erreur.", { error: error.message });
    }
}


/**=============================================================================
 * Fonction : main
 * =============================================================================
 * Fonction principale orchestrant l'initialisation de l'application.
 * Capture les erreurs critiques et logue les événements liés au démarrage.
 *
 * @async
 * @returns {Promise<void>}
 */
async function main() {
    logEvent("info", "main : Lancement de l'application...");

    try {
        await initializeComponents();
        logEvent("success", "main : Application lancée avec succès.");
    } catch (error) {
        logEvent("error", "main : Erreur critique au lancement de l'application.", {
            message: error.message,
            stack: error.stack,
        });

        displayError("Impossible de charger l'application.");
    }
}

/**=============================================================================
 * Événement : DOMContentLoaded
 * =============================================================================
 * Exécute `main()` après le chargement complet du DOM.
 * Utilise `once: true` pour éviter l'accumulation des écouteurs d'événements.
 */
document.addEventListener("DOMContentLoaded", async function () {
    logEvent("info", "DOMContentLoaded : DOM chargé, exécution de main()...");
    await main();
}, { once: true });
