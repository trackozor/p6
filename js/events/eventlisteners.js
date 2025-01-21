import domSelectors from "../config/domSelectors.js";
import {
  handleModalOpen,
  handleModalClose,
  handleLightboxClose,
  handleLightboxPrev,
  handleLightboxNext,
  handleSortChange,
} from "./eventHandler.js";
import { logEvent } from "../utils/utils.js";

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 * @param {HTMLElement | NodeListOf<HTMLElement>} selectors - Élément(s) DOM.
 * @param {string} eventType - Type d'événement.
 * @param {Function} callback - Fonction gestionnaire.
 * @param {string} logMessage - Message descriptif pour le log.
 * @returns {boolean} - `true` si réussi, sinon `false`.
 */
function attachEvent(selectors, eventType, callback, logMessage = "") {
  if (!selectors) {
    logEvent("warn", `Aucun élément trouvé pour "${eventType}".`, {
      eventType,
      logMessage,
    });
    return false;
  }

  const elements =
    selectors instanceof NodeList ? Array.from(selectors) : [selectors];

  let attachedCount = 0;
  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.addEventListener(eventType, callback);
      logEvent("info", `Événement "${eventType}" attaché. ${logMessage}`, {
        eventType,
        element,
      });
      attachedCount++;
    }
  });

  if (attachedCount > 0) {
    logEvent("success", `${attachedCount} gestionnaire(s) attaché(s).`, {
      eventType,
      logMessage,
    });
  } else {
    logEvent("error", `Aucun gestionnaire attaché pour "${eventType}".`);
  }

  return attachedCount > 0;
}

/**
 * Initialisation des événements pour la modale.
 */
function initModalEvents() {
  logEvent("info", "Initialisation des événements pour la modale...");

  const { contactButton } = domSelectors.photographerPage;
  const { closeButton } = domSelectors.modal;

  const isContactButtonAttached = attachEvent(
    contactButton,
    "click",
    handleModalOpen,
    "Ouverture de la modale.",
  );

  const isCloseButtonAttached = attachEvent(
    closeButton,
    "click",
    handleModalClose,
    "Fermeture de la modale.",
  );

  if (isContactButtonAttached && isCloseButtonAttached) {
    logEvent("success", "Événements pour la modale initialisés avec succès.");
  } else {
    logEvent(
      "error",
      "Un ou plusieurs événements pour la modale n'ont pas pu être attachés.",
    );
  }
}

/**
 * Initialisation des événements pour la lightbox.
 */
function initLightboxEvents() {
  logEvent("info", "Initialisation des événements pour la lightbox...");

  const { lightboxCloseButton, lightboxPrevButton, lightboxNextButton } =
    domSelectors.lightbox;

  const isCloseAttached = attachEvent(
    lightboxCloseButton,
    "click",
    handleLightboxClose,
    "Fermeture de la lightbox.",
  );

  const isPrevAttached = attachEvent(
    lightboxPrevButton,
    "click",
    handleLightboxPrev,
    "Image précédente.",
  );

  const isNextAttached = attachEvent(
    lightboxNextButton,
    "click",
    handleLightboxNext,
    "Image suivante.",
  );

  if (isCloseAttached && isPrevAttached && isNextAttached) {
    logEvent("success", "Événements pour la lightbox initialisés avec succès.");
  } else {
    logEvent(
      "error",
      "Un ou plusieurs événements pour la lightbox n'ont pas pu être attachés.",
    );
  }
}

/**
 * Initialisation des événements pour le tri des médias.
 */
function initSortingEvents() {
  logEvent("info", "Initialisation des événements pour le tri des médias...");

  const { sortOptions } = domSelectors.sorting;

  const isSortAttached = attachEvent(
    sortOptions,
    "change",
    handleSortChange,
    "Changement de tri.",
  );

  if (isSortAttached) {
    logEvent("success", "Événements pour le tri des médias initialisés.");
  } else {
    logEvent("error", "Événements pour le tri des médias non attachés.");
  }
}

/**
 * Initialisation globale des événements.
 */
export function initEventListeners() {
  logEvent("info", "Début de l'initialisation globale des événements.");

  try {
    initModalEvents();
    initLightboxEvents();
    initSortingEvents();
    logEvent("success", "Tous les événements ont été initialisés avec succès.");
  } catch (error) {
    logEvent(
      "error",
      "Erreur critique lors de l'initialisation des événements.",
      { error },
    );
  }
}
