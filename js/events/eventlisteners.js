// ========================================================
// 📂 Fichier : eventListeners.js
// 📝 Description : Gestion centralisée des événements pour la modale,
//                 la lightbox et le tri des médias dans l'application.
// 🏗 Auteur : Trackozor
// 📅 Date : 08/01/2025
// 🔄 Version : 3.0 (Optimisation, tests et refactorisation complète)
// ========================================================

/*==============================================*/
/*                   📌 IMPORTS                 */
/*==============================================*/

// 🎯 Sélecteurs DOM
import domSelectors from "../config/domSelectors.js";

// 🎯 Gestionnaires d'événements
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

// 🎯 Gestion des interactions clavier
import { handleKeyboardEvent } from "./keyboardHandler.js";

// 🎯 Utilitaire de logs
import { logEvent } from "../utils/utils.js";

/*--------------------------------------------------------------------------*/
// ========================================================
// 🛠️ UTILITAIRE : ATTACHER DES ÉVÉNEMENTS
// ========================================================

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 * ✅ Évite les doublons en supprimant les anciens événements.
 * ✅ Vérifie si l'élément existe avant d'attacher l'événement.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement>} selectors - Élément(s) DOM cible(s).
 * @param {string} eventType - Type d'événement (ex: "click").
 * @param {Function} callback - Fonction gestionnaire.
 * @returns {boolean} - `true` si des événements ont été attachés, sinon `false`.
 */
function attachEvent(selectors, eventType, callback) {
  if (!selectors) {
    logEvent(
      "error",
      `❌ Échec d'attachement : Élément introuvable pour "${eventType}".`,
    );
    return false;
  }

  const elements =
    selectors instanceof NodeList ? Array.from(selectors) : [selectors];

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.removeEventListener(eventType, callback); // Supprime les anciens événements
      element.addEventListener(eventType, callback);
      logEvent(
        "success",
        `✅ Événement "${eventType}" attaché à ${element.className || element.id}.`,
      );
    }
  });

  return elements.length > 0;
}

/*--------------------------------------------------------------------------------------------------------*/
// ========================================================
// 🎯 INITIALISATION DES ÉVÉNEMENTS
// ========================================================

// ========================================================
// 🔹 MODALE (Formulaire de contact)
// ========================================================

/**
 * Initialise les événements pour la gestion des modales.
 * 🛠️ Attache les événements aux boutons et au formulaire de contact.
 */
export function initModalEvents() {
  logEvent(
    "test_start_modal",
    "🛠️ Initialisation des événements pour la modale...",
  );

  const contactButton = document.querySelector(".contact_button");
  attachEvent(contactButton, "click", handleModalOpen);

  attachEvent(domSelectors.modal.closeButton, "click", handleModalClose);
  attachEvent(domSelectors.modal.overlay, "click", handleModalClose);
  attachEvent(domSelectors.modal.form.formElement, "submit", handleFormSubmit);

  logEvent(
    "test_end_modal",
    "✅ Événements pour la modale initialisés avec succès.",
  );
}

/**
 * Initialise l'événement pour la confirmation de la modale.
 * 🛠️ Attache l'événement au bouton de confirmation.
 */
export function initModalConfirm() {
  logEvent(
    "test_start_modal",
    "🛠️ Initialisation de l'événement de confirmation...",
  );

  attachEvent(
    document.querySelector(".confirm-btn"),
    "click",
    handleModalConfirm,
  );

  logEvent(
    "test_end_modal",
    "✅ Événement de confirmation initialisé avec succès.",
  );
}

/**
 * Gère les événements du formulaire de contact.
 * 🛠️ Mise à jour dynamique du compteur de caractères.
 */
export function setupContactFormEvents() {
  const messageField = document.getElementById("message");
  attachEvent(messageField, "input", updateCharCount);
}

// ========================================================
// 🔹 LIGHTBOX (Affichage des médias en plein écran)
// ========================================================

/**
 * Initialise les événements pour la lightbox.
 * 🛠️ Gère l'ouverture, la navigation et la fermeture de la lightbox.
 */

export function initLightboxEvents(mediaArray, folderName) {
  logEvent(
    "test_start_lightbox",
    "Initialisation des événements pour la lightbox.",
  );

  try {
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Le tableau des médias est invalide ou vide.");
    }

    if (!folderName || typeof folderName !== "string") {
      throw new Error(
        "Le nom du dossier (folderName) est invalide ou manquant.",
      );
    }

    // 🎯 Attachement des événements sur les images et vidéos de la galerie
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", (event) => {
        const clickedElement = event.target;

        // Vérifier si c'est une image ou une vidéo
        if (clickedElement.tagName === "IMG") {
          logEvent("info", `Ouverture de la lightbox pour une IMAGE.`, {
            mediaType: "IMAGE",
            mediaSrc: clickedElement.src,
          });

          handleLightboxOpen(event, mediaArray, folderName);
        } else if (clickedElement.tagName === "VIDEO") {
          logEvent("info", `Ouverture de la lightbox pour une VIDÉO.`, {
            mediaType: "VIDEO",
            mediaSrc: clickedElement.src,
          });

          event.preventDefault(); // Bloque le play/pause natif
          handleLightboxOpen(event, mediaArray, folderName);
        } else {
          logEvent("warn", "Clic sur un élément non valide pour la lightbox.", {
            clickedElement,
          });
        }
      });
    });

    // 🎯 Attachement des événements sur les boutons de navigation
    attachEvent(
      domSelectors.lightbox.lightboxCloseButton,
      "click",
      handleLightboxClose,
    );
    attachEvent(domSelectors.lightbox.lightboxPrevButton, "click", () =>
      handleLightboxPrev(mediaArray, folderName),
    );
    attachEvent(domSelectors.lightbox.lightboxNextButton, "click", () =>
      handleLightboxNext(mediaArray, folderName),
    );

    logEvent("success", "Événements de la lightbox initialisés avec succès.");
  } catch (error) {
    logEvent("error", "Erreur d'initialisation de la lightbox.", { error });
  }

  logEvent(
    "test_end_lightbox",
    "Fin de l'initialisation des événements pour la lightbox.",
  );
}

// ========================================================
// 🔹 TRI DES MÉDIAS (Options de tri)
// ========================================================

/**
 * Initialise les événements pour le tri des médias.
 * 🛠️ Attache un gestionnaire d'événement sur le changement d'option.
 */
function initSortingEvents() {
  logEvent(
    "test_start_sort",
    "🛠️ Initialisation des événements pour le tri des médias...",
  );

  attachEvent(domSelectors.sorting.sortOptions, "change", handleSortChange);

  logEvent(
    "test_end_sort",
    "✅ Événements pour le tri des médias initialisés avec succès.",
  );
}

// ========================================================
// 🔹 CLAVIER (Accessibilité & Navigation)
// ========================================================
// 🎯 Enregistrement global des événements clavier
document.addEventListener("keydown", handleKeyboardEvent);

// ========================================================
// 🚀 INITIALISATION GLOBALE
// ========================================================

/**
 * Initialise tous les événements nécessaires à l'application.
 * 🔥 Vérifie et attache tous les événements critiques.
 */
export function initEventListeners(mediaArray, folderName) {
  logEvent("test_start_events", "🚀 Initialisation globale des événements...");

  try {
    initModalEvents();
    initLightboxEvents(mediaArray, folderName);
    initSortingEvents();
    initModalConfirm();
    setupContactFormEvents();
    logEvent(
      "success",
      "🚀 Tous les événements ont été initialisés avec succès.",
    );
  } catch (error) {
    logEvent(
      "error",
      "❌ Erreur critique lors de l'initialisation des événements.",
      { error },
    );
  }

  logEvent(
    "test_end_events",
    "✅ Fin de l'initialisation globale des événements.",
  );
}
