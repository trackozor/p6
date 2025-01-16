// ========================================================
// Nom du fichier : eventListener.js
// Description    : Gestion centralisée des événements dans l'application Fisheye.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.1.0 (Améliorations des logs et des feedbacks)
// ========================================================

import domSelectors from "../config/domSelectors.js";
import { launchModal, closeModal } from "../components/modal/modalManager.js";
import { logEvent } from "../utils/utils.js";

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement>} selectors - Élément(s) DOM auquel l'événement doit être attaché.
 * @param {string} eventType - Type de l'événement (e.g., 'click', 'change').
 * @param {Function} callback - Fonction callback exécutée lorsque l'événement est déclenché.
 * @param {string} [logMessage=''] - Message descriptif pour enrichir les journaux.
 */
function attachEvent(selectors, eventType, callback, logMessage = "") {
  if (!selectors) {
    logEvent(
      "warn",
      `Aucun élément DOM trouvé pour l'événement "${eventType}". Aucun gestionnaire attaché.`,
      { eventType, logMessage },
    );
    return;
  }

  const elements =
    selectors instanceof NodeList ? Array.from(selectors) : [selectors];

  elements.forEach((selector) => {
    if (selector instanceof HTMLElement) {
      selector.addEventListener(eventType, (event) => {
        logEvent(
          "test-start",
          `Début de l'événement "${eventType}". ${logMessage}`,
          { eventType, element: selector },
        );
        try {
          callback(event); // Exécution de la logique métier
          logEvent(
            "test-end",
            `Événement "${eventType}" terminé avec succès. ${logMessage}`,
            { eventType, element: selector },
          );
        } catch (error) {
          logEvent(
            "error",
            `Erreur lors de l'exécution de l'événement "${eventType}": ${error.message}`,
            { stack: error.stack, eventType, element: selector },
          );
        }
      });
    } else {
      logEvent(
        "warn",
        `Sélecteur non valide pour l'événement "${eventType}". Gestionnaire non attaché.`,
        { selector, eventType },
      );
    }
  });
}

/**
 * Initialise les gestionnaires d'événements pour la modale de contact.
 */
function initModalEvents() {
  logEvent(
    "info",
    "Initialisation des événements pour la modale de contact...",
  );

  try {
    attachEvent(
      domSelectors.photographerPage.contactButton,
      "click",
      () => {
        logEvent("test-start", "Ouverture de la modale de contact...");
        launchModal();
        logEvent("test-end", "Modale de contact ouverte avec succès.");
      },
      "Gestionnaire pour l'ouverture de la modale de contact",
    );

    attachEvent(
      domSelectors.modal.closeButton,
      "click",
      () => {
        logEvent("test-start", "Fermeture de la modale de contact...");
        closeModal();
        logEvent("test-end", "Modale de contact fermée avec succès.");
      },
      "Gestionnaire pour la fermeture de la modale de contact",
    );

    logEvent("success", "Événements pour la modale initialisés avec succès.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de l'initialisation des événements pour la modale : ${error.message}`,
      { stack: error.stack },
    );
  }
}

/**
 * Initialise les gestionnaires d'événements pour la lightbox.
 */
function initLightboxEvents() {
  logEvent("info", "Initialisation des événements pour la lightbox...");

  const {
    lightboxContainer,
    lightboxCloseButton,
    lightboxPrevButton,
    lightboxNextButton,
  } = domSelectors.lightbox;

  attachEvent(
    lightboxCloseButton,
    "click",
    () => {
      logEvent("test-start", "Début de fermeture de la lightbox...");
      lightboxContainer.classList.add("hidden");
      logEvent("test-end", "Lightbox fermée avec succès.");
    },
    "Gestionnaire pour la fermeture de la lightbox",
  );

  attachEvent(
    lightboxPrevButton,
    "click",
    () => {
      logEvent(
        "test-start",
        "Début de la navigation vers l'image précédente dans la lightbox...",
      );
      // Logique pour charger l'image précédente
      logEvent("test-end", "Image précédente affichée dans la lightbox.");
    },
    "Gestionnaire pour la navigation vers l'image précédente",
  );

  attachEvent(
    lightboxNextButton,
    "click",
    () => {
      logEvent(
        "test-start",
        "Début de la navigation vers l'image suivante dans la lightbox...",
      );
      // Logique pour charger l'image suivante
      logEvent("test-end", "Image suivante affichée dans la lightbox.");
    },
    "Gestionnaire pour la navigation vers l'image suivante",
  );

  logEvent("success", "Événements pour la lightbox initialisés avec succès.");
}

/**
 * Initialise les gestionnaires d'événements pour le tri des médias.
 */
function initSortingEvents() {
  logEvent("info", "Initialisation des événements pour le tri des médias...");

  attachEvent(
    domSelectors.sorting.sortOptions,
    "change",
    (event) => {
      logEvent("test-start", "Début du tri des médias...");
      const selectedOption = event.target.value;
      logEvent("info", `Option de tri sélectionnée : ${selectedOption}`);

      try {
        // Logique de tri ici
        logEvent("test-end", `Tri effectué avec succès : ${selectedOption}`);
      } catch (error) {
        logEvent("error", `Erreur lors du tri des médias : ${error.message}`, {
          stack: error.stack,
        });
      }
    },
    "Gestionnaire pour le tri des médias",
  );

  logEvent("success", "Événements pour le tri des médias initialisés.");
}

/**
 * Point d'entrée pour l'enregistrement des gestionnaires d'événements.
 */
function initEventListeners() {
  logEvent(
    "info",
    "Début de l'initialisation des gestionnaires d'événements...",
  );

  try {
    initModalEvents();
    initLightboxEvents();
    initSortingEvents();

    logEvent(
      "success",
      "Tous les gestionnaires d'événements ont été initialisés avec succès.",
    );
  } catch (error) {
    logEvent(
      "error",
      `Erreur critique lors de l'initialisation des gestionnaires d'événements : ${error.message}`,
      { stack: error.stack },
    );
  }
}

export default initEventListeners;
