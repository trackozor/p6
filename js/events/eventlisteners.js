// ========================================================
// Fichier : eventListeners.js
// Description : Gestion centralisée des événements pour la modale,
//                 la lightbox et le tri des médias dans l'application.
// Auteur : Trackozor
// Date : 08/01/2025
// Version : 3.0 (Optimisation, tests et refactorisation complète)
// ========================================================

/*==============================================*/
/*                   IMPORTS                 */
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

/*--------------------------------------------------------------------------*/
// ========================================================
// UTILITAIRE : ATTACHER DES ÉVÉNEMENTS
// ========================================================

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 * Évite les doublons en supprimant les anciens événements.
 * Vérifie si l'élément existe avant d'attacher l'événement.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement>} selectors - Élément(s) DOM cible(s).
 * @param {string} eventType - Type d'événement (ex: "click").
 * @param {Function} callback - Fonction gestionnaire.
 * @returns {boolean} - `true` si des événements ont été attachés, sinon `false`.
 */
function attachEvent(selectors, eventType, callback) {
  if (!selectors) {
    logEvent("error", `Échec d'attachement : Élément introuvable pour "${eventType}".`);
    return false;
  }

  const elements = selectors instanceof NodeList ? Array.from(selectors) : [selectors];

  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.removeEventListener(eventType, callback);
      element.addEventListener(eventType, async (event) => {
        try {
          await callback(event); // Ajoute await si callback est async
        } catch (error) {
          console.error(`Erreur dans ${eventType} :`, error);
        }
      });
      logEvent("success", `Événement "${eventType}" attaché à ${element.className || element.id}.`);
    }
  });

  return elements.length > 0;
}


/*----------------------------------------------------------------------------------------------------*/
// ========================================================
// INITIALISATION DES ÉVÉNEMENTS
// ========================================================

// ========================================================
// MODALE (Formulaire de contact)
// ========================================================

/**
 * Initialise les événements pour la gestion des modales.
 * Attache les événements aux boutons et au formulaire de contact.
 */
export function initModalEvents() {
  logEvent("test_start_modal", "Initialisation des événements pour la modale...");

  // Récupération des éléments avec vérification de leur existence
  const contactButton = document.querySelector(".contact_button");
  const closeButton = document.querySelector(".modal-close");
  const modalOverlay = document.querySelector("#modal-overlay");
  const contactForm = document.querySelector("#contact-modal form");

  // Vérification avant d'attacher les événements
  if (contactButton) {
    attachEvent(contactButton, "click", handleModalOpen);
  } else {
    logEvent("error","Erreur : Bouton de contact introuvable !");
  }

  if (closeButton) {
    attachEvent(closeButton, "click", handleModalClose);
  } else {
    logEvent("error","Erreur : Bouton de fermeture de la modale introuvable !");
  }

  if (modalOverlay) {
    attachEvent(modalOverlay, "click", handleModalClose);
  } else {
    logEvent("error","Erreur : Overlay de la modale introuvable !");
  }

  if (contactForm) {
    attachEvent(contactForm, "submit", handleFormSubmit);
  } else {
    logEvent("error","Erreur : Formulaire de la modale introuvable !");
  }

  logEvent("test_end_modal", "Événements pour la modale initialisés avec succès.");
}


/**
 * Initialise l'événement pour la confirmation de la modale.
 * Attache l'événement au bouton de confirmation.
 */
export function initModalConfirm() {
  logEvent(
    "test_start_modal",
    "Initialisation de l'événement de confirmation...",
  );

  const confirmButton = document.querySelector(".confirm-btn");

  if (!confirmButton) {
    logEvent("error", "Échec d'attachement : Élément confirm-btn introuvable.");
    return;
  }

  attachEvent(confirmButton, "click", handleModalConfirm);

  logEvent(
    "test_end_modal",
    "Événement de confirmation initialisé avec succès.",
  );
}

/**
 * Gère les événements du formulaire de contact.
 * Mise à jour dynamique du compteur de caractères.
 */
export function setupContactFormEvents() {
  const messageField = document.getElementById("message");
  attachEvent(messageField, "input", updateCharCount);
}

// ========================================================
// LIGHTBOX (Affichage des médias en plein écran)
// ========================================================

/**
 * Initialise les événements pour la lightbox.
 *  Gère l'ouverture, la navigation et la fermeture de la lightbox.
 */
export function initLightboxEvents(mediaArray, folderName) {
  logEvent(
    "test_start_lightbox",
    "Initialisation des événements pour la lightbox...",
  );

  try {
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error(" Le tableau des médias est invalide ou vide.");
    }

    if (!folderName || typeof folderName !== "string") {
      throw new Error(
        "Le nom du dossier (folderName) est invalide ou manquant.",
      );
    }

    //  Vérification des éléments de la galerie
    const galleryItems = document.querySelectorAll(".gallery-item");
    if (galleryItems.length === 0) {
      throw new Error("Aucun élément '.gallery-item' trouvé dans la galerie.");
    }

    //  Attachement des événements sur les images et vidéos via le parent `.gallery-item`
    galleryItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const clickedElement = event.target;
        const mediaElement = item.querySelector("img, video");

        // Vérifie que l'élément média existe
        if (!mediaElement) {
          logEvent("error", " Aucun média trouvé dans cet élément.");
          return;
        }

        if (mediaElement.tagName === "IMG") {
          logEvent("info", "Image cliquée, ouverture de la lightbox.", {
            mediaSrc: mediaElement.src,
          });
          handleLightboxOpen(event, mediaArray, folderName);
        } else if (mediaElement.tagName === "VIDEO") {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation(); // Empêche tout conflit

          mediaElement.pause(); // Stopper la lecture
          mediaElement.controls = false; // Désactiver temporairement les contrôles

          logEvent("info", "Vidéo cliquée, ouverture de la lightbox.", {
            mediaSrc: mediaElement.src,
          });

          handleLightboxOpen(event, mediaArray, folderName);

          setTimeout(() => {
            mediaElement.controls = true; // Réactiver après ouverture
          }, 500);
        } else {
          logEvent("warn", "Clic sur un élément non valide pour la lightbox.", {
            clickedElement,
          });
        }
      });
    });

    //  Vérification et attachement des événements pour la lightbox
    const closeButton = domSelectors.lightbox.lightboxCloseButton;
    const prevButton = domSelectors.lightbox.lightboxPrevButton;
    const nextButton = domSelectors.lightbox.lightboxNextButton;

    if (closeButton) {
      attachEvent(closeButton, "click", handleLightboxClose);
    } else {
      logEvent("error", "Bouton de fermeture de la lightbox introuvable.");
    }

    if (prevButton) {
      attachEvent(prevButton, "click", () =>
        handleLightboxPrev(mediaArray, folderName),
      );
    } else {
      logEvent("error", "Bouton précédent de la lightbox introuvable.");
    }

    if (nextButton) {
      attachEvent(nextButton, "click", () =>
        handleLightboxNext(mediaArray, folderName),
      );
    } else {
      logEvent("error", "Bouton suivant de la lightbox introuvable.");
    }

    logEvent("success", "Événements de la lightbox initialisés avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'initialisation de la lightbox.", {
      error,
    });
  }

  logEvent(
    "test_end_lightbox",
    "Fin de l'initialisation des événements pour la lightbox.",
  );
}

// ========================================================
// TRI DES MÉDIAS (Options de tri)
// ========================================================

/**
 * Initialise les événements pour le tri des médias.
 * Attache un gestionnaire d'événement sur le changement d'option.
 */
function initSortingEvents() {
  logEvent(
    "test_start_sort",
    "Initialisation des événements pour le tri des médias...",
  );

  attachEvent(domSelectors.sorting.sortOptions, "change", handleSortChange);

  logEvent(
    "test_end_sort",
    "Événements pour le tri des médias initialisés avec succès.",
  );
}

// ========================================================
//  CLAVIER (Accessibilité & Navigation)
// ========================================================
// Enregistrement global des événements clavier
document.addEventListener("keydown", handleKeyboardEvent);

// ========================================================
//  INITIALISATION GLOBALE
// ========================================================

/**
 * Initialise tous les événements nécessaires à l'application.
 *  Vérifie et attache tous les événements critiques.
 */
export function initEventListeners(mediaArray, folderName) {
  logEvent("test_start_events", "Initialisation globale des événements...");

  try {
    initModalEvents();
    initLightboxEvents(mediaArray, folderName);
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

  logEvent(
    "test_end_events",
    "Fin de l'initialisation globale des événements.",
  );
}
