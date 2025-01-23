// ========================================================
// Nom du fichier : eventlisteners.js
// Description    : Gestion centralisée des événements pour la modale,
//                  la lightbox et le tri des médias dans l'application.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.6.0 (Ajout de logs détaillés pour chaque action)
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
  setupLightboxEventHandlers,
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
 * @param {string} _logMessage - Message descriptif pour les logs.
 * @returns {boolean} - `true` si des événements ont été attachés, sinon `false`.
 */
function attachEvent(selectors, eventType, callback) {
  logEvent(
    "test_start",
    `Tentative d'attachement de l'événement "${eventType}"`,
  );

  if (!selectors) {
    logEvent(
      "error",
      `Échec : Aucun élément DOM trouvé pour l'événement "${eventType}".`,
    );
    logEvent("test_end", `Attachement échoué pour "${eventType}".`);
    return false;
  }

  const elements =
    selectors instanceof NodeList ? Array.from(selectors) : [selectors];
  let attachedCount = 0;

  elements.forEach((element, index) => {
    if (element instanceof HTMLElement) {
      logEvent(
        "info",
        `Attachement en cours pour "${eventType}" à l'élément index: ${index}`,
        { element },
      );
      element.addEventListener(eventType, (event) => {
        logEvent(
          "info",
          `Événement "${eventType}" déclenché sur l'élément index: ${index}`,
          { event, element },
        );
        callback(event);
      });
      attachedCount++;
    } else {
      logEvent(
        "warn",
        `Élément non valide détecté pour l'événement "${eventType}".`,
        { element },
      );
    }
  });

  logEvent(
    attachedCount > 0 ? "success" : "error",
    `${attachedCount} événement(s) attaché(s) pour "${eventType}".`,
  );

  logEvent("test_end", `Fin de l'attachement pour "${eventType}".`);
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

  // Observer pour surveiller les changements dans le DOM
  const observer = new MutationObserver(() => {
    const contactButton = document.querySelector(".contact_button");
    if (contactButton) {
      contactButton.addEventListener("click", () => {
        logEvent("info", "Bouton 'Contactez-moi' cliqué.");
        handleModalOpen(); // Appelle la fonction d'ouverture de la modale
      });
      logEvent("success", "Événement attaché au bouton 'Contactez-moi'.");
      observer.disconnect(); // Stopper l'observation une fois l'élément trouvé
    }
  });

  // Démarrer l'observation du DOM pour surveiller les ajouts d'enfants
  observer.observe(document.body, { childList: true, subtree: true });

  // Sélection des autres éléments pour la modale
  const {
    closeButton,
    form: { formElement },
  } = domSelectors.modal;
  const overlayContainer = document.querySelector("#modal-overlay");

  if (!closeButton || !formElement || !overlayContainer) {
    logEvent(
      "error",
      "Certains éléments DOM pour la modale sont introuvables.",
      { closeButton, formElement, overlayContainer },
    );
    logEvent(
      "test_end",
      "Échec de l'initialisation des événements pour la modale.",
    );
    return;
  }

  // Gestionnaires pour fermer la modale et soumettre le formulaire
  attachEvent(
    closeButton,
    "click",
    handleModalClose,
    "Fermeture de la modale via le bouton close",
  );

  // Gestionnaire pour fermer la modale via l'overlay
  overlayContainer.addEventListener("click", () => {
    logEvent("info", "Clic détecté sur l'overlay pour fermer la modale.");
    handleModalClose();
  });

  attachEvent(
    formElement,
    "submit",
    handleFormSubmit,
    "Soumission du formulaire de contact",
  );

  logEvent("test_end", "Événements pour la modale initialisés avec succès.");
}

/**
 * Initialise les événements pour la lightbox.
 */
/**
 * Initialise les événements pour la lightbox.
 */
function initLightboxEvents() {
  logEvent("test_start", "Initialisation des événements pour la lightbox...");

  const { lightboxCloseButton, lightboxPrevButton, lightboxNextButton } =
    domSelectors.lightbox;

  // Vérification des éléments DOM nécessaires
  if (!lightboxCloseButton || !lightboxPrevButton || !lightboxNextButton) {
    logEvent(
      "error",
      "Certains éléments DOM pour la lightbox sont introuvables.",
      { lightboxCloseButton, lightboxPrevButton, lightboxNextButton },
    );
    logEvent("test_end", "Échec de l'initialisation pour la lightbox.");
    return;
  }

  // Gestion des boutons de la lightbox
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
    "Passage à l'image précédente dans la lightbox",
  );

  attachEvent(
    lightboxNextButton,
    "click",
    handleLightboxNext,
    "Passage à l'image suivante dans la lightbox",
  );

  // Ajout des gestionnaires d'événements pour la galerie via `setupLightboxEventHandlers`
  setupLightboxEventHandlers(".gallery-item"); // Classe des médias dans la galerie

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
    logEvent("error", "Élément de tri introuvable.", { sortOptions });
    logEvent(
      "test_end",
      "Échec de l'initialisation des événements pour le tri des médias.",
    );
    return;
  }

  attachEvent(
    sortOptions,
    "change",
    handleSortChange,
    "Changement de tri des médias",
  );

  logEvent(
    "test_end",
    "Événements pour le tri des médias initialisés avec succès.",
  );
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
      { error },
    );
  }

  logEvent("test_end", "Fin de l'initialisation globale des événements.");
}
