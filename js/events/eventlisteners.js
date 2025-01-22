// ========================================================
// Nom du fichier : eventlisteners.js
// Description    : Gestion centralisée des événements pour la modale,
//                  la lightbox et le tri des médias dans l'application.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.5.0 (Logs enrichis et TEST_START/END ajoutés)
// ========================================================

import domSelectors from "../config/domSelectors.js";
import {
  handleModalOpen,
  handleModalClose,
  handleFormSubmit,
  handleLightboxClose,
  handleLightboxPrev,
  handleLightboxNext,
  handleSortChange,
} from "./eventHandler.js";
import { logEvent } from "../utils/utils.js";

// ========================================================
// UTILITAIRE : ATTACHER DES ÉVÉNEMENTS
// ========================================================

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement>} selectors - Élément(s) DOM cible(s).
 * @param {string} eventType - Type d'événement (ex: "click").
 * @param {Function} callback - Fonction gestionnaire.
 * @param {string} logMessage - Message descriptif pour les logs.
 * @returns {boolean} - `true` si des événements ont été attachés, sinon `false`.
 */
function attachEvent(selectors, eventType, callback, logMessage = "") {
  logEvent("test_start", `Attachement de l'événement "${eventType}"`);

  // Vérifie les sélecteurs
  if (!selectors) {
    logEvent("error", `Aucun élément trouvé pour l'événement "${eventType}".`);
    logEvent("test_end", `Échec de l'attachement pour "${eventType}"`);
    return false;
  }

  const elements =
    selectors instanceof NodeList ? Array.from(selectors) : [selectors];
  let attachedCount = 0;

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.addEventListener(eventType, callback);
      logEvent("info", `Événement "${eventType}" attaché.`, { logMessage });
      attachedCount++;
    }
  });

  logEvent(
    attachedCount > 0 ? "success" : "error",
    `${attachedCount} événement(s) attaché(s) pour "${eventType}".`,
  );

  logEvent("test_end", `Fin de l'attachement pour "${eventType}"`);
  return attachedCount > 0;
}

// ========================================================
// INITIALISATION DES ÉVÉNEMENTS
// ========================================================

/**
 * Initialise les événements pour la modale.
 */
export function initModalEvents() {
  logEvent("test_start", "Initialisation des événements pour la modale...");
  const { contactButton } = domSelectors.photographerPage;
  const {
    closeButton,
    form: { formElement },
  } = domSelectors.modal;

  if (!contactButton || !closeButton || !formElement) {
    logEvent(
      "error",
      "Certains éléments DOM pour la modale sont introuvables.",
    );
    logEvent("test_end", "Échec de l'initialisation pour la modale.");
    return;
  }

  attachEvent(
    contactButton,
    "click",
    handleModalOpen,
    "Ouverture de la modale",
  );
  attachEvent(closeButton, "click", handleModalClose, "Fermeture de la modale");
  attachEvent(
    formElement,
    "submit",
    handleFormSubmit,
    "Soumission du formulaire",
  );
  logEvent("test_end", "Événements pour la modale initialisés avec succès.");
}

/**
 * Initialise les événements pour la lightbox.
 */
function initLightboxEvents() {
  logEvent("test_start", "Initialisation des événements pour la lightbox...");
  const { lightboxCloseButton, lightboxPrevButton, lightboxNextButton } =
    domSelectors.lightbox;

  attachEvent(
    lightboxCloseButton,
    "click",
    handleLightboxClose,
    "Fermeture de la lightbox",
  );
  attachEvent(
    lightboxPrevButton,
    "click",
    handleLightboxPrev,
    "Image précédente dans la lightbox",
  );
  attachEvent(
    lightboxNextButton,
    "click",
    handleLightboxNext,
    "Image suivante dans la lightbox",
  );
  logEvent("test_end", "Événements pour la lightbox initialisés avec succès.");
}

/**
 * Initialise les événements pour le tri des médias.
 */
function initSortingEvents() {
  logEvent(
    "test_start",
    "Initialisation des événements pour le tri des médias...",
  );
  const { sortOptions } = domSelectors.sorting;

  if (!sortOptions) {
    logEvent("error", "Élément de tri introuvable.");
    logEvent("test_end", "Échec de l'initialisation pour le tri des médias.");
    return;
  }

  attachEvent(sortOptions, "change", handleSortChange, "Changement de tri");
  logEvent("test_end", "Événements pour le tri des médias initialisés.");
}

/**
 * Initialise tous les événements nécessaires à l'application.
 */
export function initEventListeners() {
  logEvent("test_start", "Initialisation globale des événements...");
  try {
    initModalEvents();
    initLightboxEvents();
    initSortingEvents();
    logEvent("success", "Tous les événements ont été initialisés avec succès.");
  } catch (error) {
    logEvent(
      "error",
      "Erreur critique lors de l'initialisation des événements.",
      {
        error,
      },
    );
  }
  logEvent("test_end", "Fin de l'initialisation globale des événements.");
}
