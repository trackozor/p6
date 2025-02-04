// ========================================================
// Fichier : eventListeners.js
// Description : Gestion centralisée des événements pour la modale,
//               la lightbox et le tri des médias dans l'application.
// Auteur : Trackozor
// Date : 08/01/2025
// Version : 3.1 (Optimisation, tests et refactorisation complète)
// ========================================================

/*==============================================*/
/*                   IMPORTS                    */
/*==============================================*/

// Sélecteurs DOM
import domSelectors from "../config/domSelectors.js";

// Gestionnaires d'événements
import {
  handleModalOpen,
  handleModalClose,
  handleFormSubmit,
  handleLightboxClose,
  handleLightboxPrev,
  handleLightboxNext,
  handleLightboxOpen,
  handleSortChange,
  handleModalConfirm,
  updateCharCount,
} from "./eventHandler.js";

// Gestion des interactions clavier
import { handleKeyboardEvent } from "./keyboardHandler.js";

// Utilitaire de logs
import { logEvent } from "../utils/utils.js";

/*=======================================================*/
// UTILITAIRE : ATTACHER DES ÉVÉNEMENTS
/*=======================================================*/

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 * Évite les doublons en supprimant les anciens événements.
 * Vérifie si l'élément existe avant d'attacher l'événement.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement>} elements - Élément(s) DOM cible(s).
 * @param {string} eventType - Type d'événement (ex: "click").
 * @param {Function} callback - Fonction gestionnaire.
 * @param {boolean} [once=false] - Si true, l'événement est déclenché une seule fois.
 * @returns {boolean} - `true` si des événements ont été attachés, sinon `false`.
 */
function attachEvent(elements, eventType, callback, once = false) {
  if (!elements) {
    logEvent("error", `Échec d'attachement : Élément introuvable pour "${eventType}".`);
    return false;
  }

  const elementList = elements instanceof NodeList ? Array.from(elements) : [elements];

  elementList.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.removeEventListener(eventType, callback);
      element.addEventListener(eventType, async (event) => {
        try {
          await callback(event);
        } catch (error) {
          console.error(`Erreur dans ${eventType} :`, error);
        }
      }, { once });
      logEvent("success", `Événement "${eventType}" attaché à ${element.className || element.id}.`);
    }
  });

  return elementList.length > 0;
}

/*=======================================================*/
// INITIALISATION DES ÉVÉNEMENTS
/*=======================================================*/

/**
 * Initialise les événements pour la gestion des modales (formulaire de contact).
 */
export function initModalEvents() {
  logEvent("info", "Initialisation des événements pour la modale...");

  attachEvent(document.querySelector(".contact_button"), "click", handleModalOpen);
  attachEvent(document.querySelector(".modal-close"), "click", handleModalClose);
  attachEvent(document.querySelector("#modal-overlay"), "click", handleModalClose);
  attachEvent(document.querySelector("#contact-modal form"), "submit", handleFormSubmit);

  logEvent("success", "Événements pour la modale initialisés avec succès.");
}

/**
 * Initialise l'événement pour la confirmation de la modale.
 */
export function initModalConfirm() {
  logEvent("info", "Initialisation de l'événement de confirmation...");

  attachEvent(document.querySelector(".confirm-btn"), "click", handleModalConfirm);

  logEvent("success", "Événement de confirmation initialisé avec succès.");
}

/**
 * Gère les événements du formulaire de contact (mise à jour du compteur de caractères).
 */
export function setupContactFormEvents() {
  attachEvent(document.getElementById("message"), "input", updateCharCount);
}

/**
 * Initialise les événements pour la lightbox (affichage des médias en plein écran).
 * @param {Array} mediaArray - Liste des médias disponibles.
 * @param {string} folderName - Nom du dossier contenant les médias.
 */
export function initLightboxEvents(mediaArray, folderName) {
  logEvent("info", "Initialisation des événements pour la lightbox...");

  if (!Array.isArray(mediaArray) || mediaArray.length === 0 || typeof folderName !== "string") {
    logEvent("error", "Données de la lightbox invalides.");
    return;
  }

  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!galleryItems.length) {
    logEvent("error", "Aucun élément '.gallery-item' trouvé.");
    return;
  }

  galleryItems.forEach((item) => {
    attachEvent(item, "click", (event) => handleLightboxOpen(event, mediaArray, folderName));
  });

  attachEvent(domSelectors.lightbox.lightboxCloseButton, "click", handleLightboxClose);
  attachEvent(domSelectors.lightbox.lightboxPrevButton, "click", () => handleLightboxPrev());
  attachEvent(domSelectors.lightbox.lightboxNextButton, "click", () => handleLightboxNext());

  logEvent("success", "Événements de la lightbox initialisés avec succès.");
}

/**
 * Initialise les événements pour le tri des médias.
 */
function initSortingEvents() {
  logEvent("info", "Initialisation des événements pour le tri des médias...");

  attachEvent(domSelectors.sorting.sortOptions, "change", handleSortChange);

  logEvent("success", "Événements pour le tri des médias initialisés.");
}

/**
 * Enregistre les interactions clavier pour la navigation et l'accessibilité.
 */
function initKeyboardEvents() {
  document.addEventListener("keydown", handleKeyboardEvent);
}

/*=======================================================*/
// INITIALISATION GLOBALE DES ÉVÉNEMENTS
/*=======================================================*/

/**
 * Initialise tous les événements nécessaires à l'application.
 * Vérifie et attache tous les événements critiques.
 */
export function initEventListeners(mediaArray, folderName) {
  logEvent("info", "Début de l'initialisation globale des événements...");

  try {
    initModalEvents();
    initModalConfirm();
    setupContactFormEvents();
    initLightboxEvents(mediaArray, folderName);
    initSortingEvents();
    initKeyboardEvents();

    logEvent("success", "Tous les événements ont été initialisés avec succès.");
  } catch (error) {
    logEvent("error", "Erreur critique lors de l'initialisation des événements.", { error });
  }

  logEvent("info", "Fin de l'initialisation globale des événements.");
}
