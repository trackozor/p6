// ========================================================
// Nom du fichier : eventlisteners.js
// Description    : Gestion centralisée des événements pour la modale,
//                  la lightbox et le tri des médias dans l'application.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.6.0 (Ajout de logs détaillés pour chaque action)
// ========================================================

/*==============================================*/
/*                   Imports                    */
/*=============================================*/

// Import des sélecteurs DOM préconfigurés pour simplifier l'accès aux éléments HTML
import domSelectors from "../config/domSelectors.js";

/*==============================================*/
/*               Gestionnaires d'événements    */
/*=============================================*/
// Import des fonctions pour gérer les interactions de l'utilisateur
import {
  handleModalOpen, // Ouvre la modale lorsqu'un utilisateur déclenche cet événement
  handleModalClose, // Ferme la modale
  handleFormSubmit, // Gère la soumission des formulaires (ex : contact)
  handleLightboxClose, // Ferme la lightbox
  handleLightboxPrev, // Navigue vers l'image précédente dans la lightbox
  handleLightboxNext, // Navigue vers l'image suivante dans la lightbox
  handleSortChange, // Applique les changements de tri (ex : par popularité ou date)
  setupLightboxEventHandlers, // Configure tous les gestionnaires nécessaires pour la lightbox
  handleModalConfirm, // Gère la confirmation dans une modale spécifique
  updateCharCount, // Gère le compteur de caractères pour le message
} from "./eventHandler.js";

/*==============================================*/
/*                  Utilitaires                 */
/*=============================================*/
// Import de la fonction de journalisation pour suivre les événements et déboguer
import { logEvent } from "../utils/utils.js";

/*--------------------------------------------------------------------------*/
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

/*--------------------------------------------------------------------------------------------------------*/
// ========================================================
// INITIALISATION DES ÉVÉNEMENTS
// ========================================================

// ========================================================
//     Modale
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

export function initModalConfirm() {
  logEvent(
    "test_start",
    "Initialisation de l'événement pour la confirmation...",
  );

  const confirmButton = document.querySelector(".confirm-btn");
  if (!confirmButton) {
    logEvent("error", "Bouton de confirmation introuvable.", { confirmButton });
    logEvent("test_end", "Échec de l'initialisation de la confirmation.");
    return;
  }

  attachEvent(
    confirmButton,
    "click",
    handleModalConfirm,
    "Confirmation via le bouton dans la modale",
  );

  logEvent(
    "test_end",
    "Événement pour le bouton de confirmation initialisé avec succès.",
  );
}
/**
 * Initialise les gestionnaires d'événements pour le formulaire de contact.
 */
export function setupContactFormEvents() {
  const messageField = document.getElementById("message");

  if (messageField) {
    // Ajout de l'event listener pour le champ "message"
    messageField.addEventListener("input", updateCharCount);
  }
}

// ========================================================
//     lightbox
// ========================================================
/**
 * Initialise les événements pour la lightbox.
 */
function initLightboxEvents(mediaArray) {
  logEvent("test_start", "Initialisation des événements pour la lightbox...");

  // Vérification des paramètres requis
  if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
    logEvent(
      "error",
      "Le tableau des médias (mediaArray) est invalide ou vide.",
      { mediaArray },
    );
    logEvent("test_end", "Échec de l'initialisation pour la lightbox.");
    return;
  }

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

  // ========================================================
  //     gallery
  // ========================================================
  // Vérification et ajout des gestionnaires pour les éléments de la galerie
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length === 0) {
    logEvent(
      "warn",
      "Aucun élément de galerie trouvé avec le sélecteur '.gallery-item'.",
    );
    logEvent(
      "test_end",
      "Événements de la lightbox partiellement initialisés.",
    );
    return;
  }

  // Ajout des gestionnaires d'événements pour chaque élément de la galerie
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      logEvent("info", `Élément de galerie cliqué. Index : ${index}`, { item });
      setupLightboxEventHandlers(mediaArray, index); // Transmet `mediaArray` et l'index au gestionnaire
    });
  });

  logEvent("success", "Événements pour la lightbox initialisés avec succès.");
  logEvent(
    "test_end",
    "Fin de l'initialisation des événements pour la lightbox.",
  );
}

// ========================================================
//     Trie
// ========================================================
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

// ========================================================
//     Initialisation des événements
// ========================================================
/**
 * Initialise tous les événements nécessaires à l'application.
 */
export function initEventListeners() {
  logEvent("test_start", "Initialisation globale des événements...");

  try {
    initModalEvents();
    initLightboxEvents();
    initSortingEvents();
    initModalConfirm();
    setupContactFormEvents();
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
