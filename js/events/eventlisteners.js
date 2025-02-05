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
import { showLikeDislikeModal, hideLikeDislikeModal } from "./eventHandler.js";
import { handleLikeDislike } from "../components/statsCalculator.js";

// Utilitaire de logs
import { logEvent } from "../utils/utils.js";



/*=======================================================*/
// UTILITAIRE : ATTACHER DES ÉVÉNEMENTS
/*=======================================================*/

/**
 * Attache un gestionnaire d'événement à un ou plusieurs éléments DOM.
 * 
 * - Vérifie si l'élément existe avant d'attacher l'événement.
 * - Supprime les anciens événements avant d'en ajouter un nouveau pour éviter les doublons.
 * - Peut être configuré pour exécuter l'événement une seule fois.
 *
 * @param {HTMLElement | NodeListOf<HTMLElement>} elements - Élément(s) cible(s) du DOM.
 * @param {string} eventType - Type d'événement à écouter (ex: "click", "mouseover").
 * @param {Function} callback - Fonction exécutée lorsqu'un événement est déclenché.
 * @param {boolean} [once=false] - Indique si l'événement doit être exécuté une seule fois.
 * @returns {boolean} - Retourne `true` si un ou plusieurs événements ont été attachés, sinon `false`.
 */
function attachEvent(elements, eventType, callback, once = false) {
  // Vérifie si l'élément cible existe avant d'ajouter un événement
  if (!elements) {
    logEvent("error", `Échec d'attachement : Aucun élément trouvé pour "${eventType}".`);
    return false; // Arrête la fonction si l'élément est invalide
  }

  // Convertit NodeList en tableau si plusieurs éléments sont sélectionnés
  const elementList = elements instanceof NodeList ? Array.from(elements) : [elements];

  // Parcourt la liste des éléments pour attacher l'événement à chacun d'eux
  elementList.forEach((element) => {
    if (element instanceof HTMLElement) {
      // Supprime tout événement existant pour éviter les doublons
      element.removeEventListener(eventType, callback);

      // Ajoute un nouvel écouteur d'événement avec gestion d'erreur
      element.addEventListener(eventType, async (event) => {
        try {
          await callback(event); // Exécute la fonction fournie en paramètre
        } catch (error) {
          logEvent("error", `Erreur lors de l'exécution de "${eventType}".`);
        }
      }, { once }); // Option "once" pour exécuter l'événement une seule fois si nécessaire

      // Journalise l'ajout réussi de l'événement pour faciliter le débogage
      logEvent("success", `Événement "${eventType}" attaché à ${element.className || element.id || "un élément inconnu"}.`);
    }
  });

  // Retourne "true" si au moins un élément a été traité
  return elementList.length > 0;
}


/*=======================================================*/
// INITIALISATION DES ÉVÉNEMENTS
/*=======================================================*/


/*========================*/
//    1.Modale
/*========================*/

/**
 * Initialise les événements liés à la gestion des modales.
 * 
 * - Ouvre la modale lorsqu'on clique sur le bouton "Contact".
 * - Ferme la modale lorsqu'on clique sur le bouton de fermeture ou l'overlay.
 * - Gère la soumission du formulaire de contact.
 * - Vérifie que tous les éléments requis existent avant d'attacher les événements.
 * - Journalise les erreurs si un élément est manquant.
 * 
 * @function initModalEvents
 */
export function initModalEvents() {
  try {
    // Journalisation de l'initialisation des événements
    logEvent("info", "Initialisation des événements pour la modale...");

    // Sélectionne les éléments nécessaires
    const contactButton = domSelectors.photographerPage;
    const { closeButton, modalOverlay, contactForm } = domSelectors.modal;

    // Vérifie si chaque élément existe avant d'attacher les événements
    if (!contactButton) {
      throw new Error("Bouton de contact '.contact_button' introuvable.");
    }
    if (!closeButton) {
      throw new Error("Bouton de fermeture '.modal-close' introuvable.");
    }
    if (!modalOverlay && !contactForm) {
          throw new Error("Formulaire de contact '#contact-modal form' introuvable.");
    }
    if (!contactForm) {
      throw new Error("Formulaire de contact '#contact-modal form' introuvable.");
    }

    // Ajoute un événement "click" au bouton de contact pour ouvrir la modale
    attachEvent(contactButton, "click", handleModalOpen);

    // Ajoute un événement "click" au bouton de fermeture pour fermer la modale
    attachEvent(closeButton, "click", handleModalClose);

    // Ajoute un événement "click" sur l'overlay pour fermer la modale si on clique en dehors
    attachEvent(modalOverlay, "click", handleModalClose);

    // Ajoute un événement "submit" sur le formulaire pour gérer la soumission du formulaire de contact
    attachEvent(contactForm, "submit", handleFormSubmit);

    // Journalisation de la réussite des événements
    logEvent("success", "Événements pour la modale initialisés avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur survenant lors de l'initialisation
    logEvent("error", `Erreur dans initModalEvents : ${error.message}`);
  }
}


/**
 * Initialise l'événement de confirmation pour la modale.
 * 
 * - Vérifie l'existence du bouton de confirmation avant d'attacher l'événement.
 * - Attache un événement "click" au bouton pour exécuter l'action de confirmation.
 * - Permet de fermer la modale après validation.
 * - Gère les erreurs si l'élément cible est introuvable.
 * 
 * @function initModalConfirm
 */
export function initModalConfirm() {
  try {
    // Journalisation du début de l'initialisation de l'événement
    logEvent("info", "Initialisation de l'événement de confirmation...");

    // Sélectionne le bouton de confirmation dans le DOM
    const confirmButton = domSelectors.modal;

    // Vérifie si le bouton existe avant d'attacher l'événement
    if (!confirmButton) {
      throw new Error("Bouton de confirmation '.confirm-btn' introuvable.");
    }

    // Attache un événement "click" pour gérer l'action de confirmation
    attachEvent(confirmButton, "click", handleModalConfirm);

    // Journalisation du succès de l'attachement de l'événement
    logEvent("success", "Événement de confirmation initialisé avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur survenant lors de l'initialisation
    logEvent("error", `Erreur dans initModalConfirm : ${error.message}`);
  }
}


/*=======================================================*/
//    2.formulaire
/*=======================================================*/
/**

/**
 * Initialise les événements du formulaire de contact.
 * 
 * - Surveille l'entrée utilisateur dans le champ "message".
 * - Met à jour dynamiquement le compteur de caractères en temps réel.
 * - Empêche le dépassement de la limite de caractères définie.
 * - Gère les erreurs si l'élément cible est introuvable.
 * 
 * @function setupContactFormEvents
 */
export function setupContactFormEvents() {
  try {
    // Récupération de l'élément du champ message
    const {messageField} = domSelectors.modal.form;

    // Vérifie si l'élément existe avant d'attacher l'événement
    if (!messageField) {
      throw new Error("Champ 'message' introuvable. Vérifiez l'ID dans le DOM.");
    }

    // Attache un événement "input" au champ "message" pour suivre la saisie en temps réel
    attachEvent(messageField, "input", updateCharCount);

    // Journalisation du succès de l'attachement de l'événement
    logEvent("success", "Événement 'input' attaché au champ message.");
  } catch (error) {
    // Capture et journalise toute erreur survenant lors de l'attachement de l'événement
    logEvent("error", `Erreur dans setupContactFormEvents : ${error.message}`);
  }
}

/*=======================================================*/
//    3. Lightbox
/*=======================================================*/
/**
 * Initialise les événements pour la lightbox (affichage des médias en plein écran).
 * 
 * - Vérifie que la liste des médias et le nom du dossier sont valides avant d'attacher les événements.
 * - Attache un événement "click" à chaque élément de la galerie pour ouvrir la lightbox.
 * - Ajoute les événements de navigation (suivant/précédent) et de fermeture de la lightbox.
 * - Gère les erreurs en cas de données invalides ou d'éléments manquants.
 * 
 * @param {Array} mediaArray - Liste des médias disponibles.
 * @param {string} folderName - Nom du dossier contenant les médias.
 * 
 * @function initLightboxEvents
 */
export function initLightboxEvents(mediaArray, folderName) {
  try {
    // Journalisation du début de l'initialisation des événements
    logEvent("info", "Initialisation des événements pour la lightbox...");

    // Vérification des paramètres pour éviter des erreurs
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Liste des médias invalide ou vide.");
    }
    if (typeof folderName !== "string" || folderName.trim() === "") {
      throw new Error("Nom du dossier invalide.");
    }

    // Sélection des éléments de la galerie qui déclenchent la lightbox
    const galleryItems = document.querySelectorAll(".media");

    // Vérification que des éléments existent bien dans la galerie
    if (!galleryItems.length) {
      throw new Error("Aucun élément '.gallery-item' trouvé dans la galerie.");
    }

    // Attache un événement "click" à chaque élément de la galerie pour ouvrir la lightbox
    galleryItems.forEach((item) => {
      attachEvent(item, "click", (event) => handleLightboxOpen(event, mediaArray, folderName));
    });

    // Attache un événement "click" au bouton de fermeture de la lightbox
    if (!domSelectors.lightbox.lightboxCloseButton) {
      throw new Error("Bouton de fermeture de la lightbox introuvable.");
    }
    attachEvent(domSelectors.lightbox.lightboxCloseButton, "click", handleLightboxClose);

    // Attache un événement "click" aux boutons de navigation (précédent/suivant)
    if (!domSelectors.lightbox.lightboxPrevButton) {
      throw new Error("Bouton précédent de la lightbox introuvable.");
    }
    attachEvent(domSelectors.lightbox.lightboxPrevButton, "click", handleLightboxPrev);

    if (!domSelectors.lightbox.lightboxNextButton) {
      throw new Error("Bouton suivant de la lightbox introuvable.");
    }
    attachEvent(domSelectors.lightbox.lightboxNextButton, "click", handleLightboxNext);

    // Journalisation du succès de l'initialisation des événements
    logEvent("success", "Événements de la lightbox initialisés avec succès.");
  } catch (error) {
    // Capture et journalisation des erreurs pour éviter les comportements inattendus
    logEvent("error", `Erreur dans initLightboxEvents : ${error.message}`);
  }
}


/*=======================================================*/
//    4.tri
/*=======================================================*/
/**
 * Initialise les événements pour le tri des médias.
 * 
 * - Ajoute un événement "change" à la liste déroulante du tri des médias.
 * - Permet de réorganiser dynamiquement les médias en fonction de l'option sélectionnée.
 * - Vérifie que l'élément de tri est bien présent avant d'attacher l'événement.
 * - Gère les erreurs si l'élément est introuvable.
 * 
 * @function initSortingEvents
 */
function initSortingEvents() {
  try {
    // Journalisation du début de l'initialisation des événements
    logEvent("info", "Initialisation des événements pour le tri des médias...");

    // Récupération de l'élément de tri dans le DOM
    const {sortOptions} = domSelectors.sorting;

    // Vérification que l'élément existe avant d'attacher un événement
    if (!sortOptions) {
      throw new Error("Élément de tri des médias introuvable.");
    }

    // Attache un événement "change" pour déclencher le tri lorsqu'une option est sélectionnée
    attachEvent(sortOptions, "change", handleSortChange);

    // Journalisation du succès de l'attachement de l'événement
    logEvent("success", "Événements pour le tri des médias initialisés avec succès.");
  } catch (error) {
    // Capture et journalisation des erreurs si l'élément est absent ou en cas de problème d'attachement
    logEvent("error", `Erreur dans initSortingEvents : ${error.message}`);
  }
}

/**
 * Initialise les écouteurs d'événements pour les likes et la modale de like/dislike.
 */
export async function setupEventListeners() {
  try {
    logEvent("info", "Vérification des icônes de like...");

    // Attendre un petit délai pour s'assurer que les médias sont bien chargés
    await new Promise((resolve) => setTimeout(resolve, 300));

    let likeIcons = document.querySelectorAll(".media-item .like-icon");
    const likeDislikeModal = document.querySelector("#like-dislike-modal");

    if (!likeIcons.length) {
      logEvent("warn", "Les icônes de like ne sont pas encore chargées. Activation du MutationObserver...");
      waitForLikesToBeLoaded();
      return;
    }

    if (!likeDislikeModal) {
      throw new Error("La modale de like/dislike est introuvable.");
    }

    logEvent("success", ` ${likeIcons.length} icônes de like trouvées ! Attachement des événements...`);

    let activeMedia = null; // Stocke l'élément actif pour la gestion des likes

    likeIcons.forEach(icon => {
      icon.addEventListener("click", (event) => {
        try {
          const mediaItem = event.target.closest(".media-item");
          if (!mediaItem) {
            throw new Error("Élément média introuvable.");
          }

          const mediaId = mediaItem.dataset.id;
          if (!mediaId) {
            throw new Error("ID média introuvable.");
          }

          activeMedia = mediaItem;
          showLikeDislikeModal(mediaItem);
          logEvent("success", `Modale ouverte pour média ID: ${mediaId}`);
        } catch (error) {
          logEvent("error", ` Erreur lors du clic sur un like: ${error.message}`, { error });
        }
      });
    });

    likeDislikeModal.addEventListener("click", (event) => {
      if (event.target.closest(".like-btn")) {
        handleLikeDislike("like", activeMedia);
      } else if (event.target.closest(".dislike-btn")) {
        handleLikeDislike("dislike", activeMedia);
      }
    });

    likeDislikeModal.addEventListener("mouseleave", () => {
      hideLikeDislikeModal();
    });

    logEvent("success", " Les événements de like ont été initialisés avec succès.");
  } catch (error) {
    logEvent("error", ` Erreur critique dans setupEventListeners: ${error.message}`, { error });
  }
}


/**
 * Attend dynamiquement que les médias et icônes de like soient chargés avant d'attacher les événements.
 */
function waitForLikesToBeLoaded() {
  let attempts = 0;
  const maxAttempts = 10; // Arrêter après 10 tentatives pour éviter une boucle infinie

  const observer = new MutationObserver((mutations, obs) => {
    const likeIcons = document.querySelectorAll(".media-item .like-icon");

    if (likeIcons.length) {
      logEvent("info", `Les icônes de like sont maintenant disponibles (${likeIcons.length} trouvées). Initialisation...`);

      setTimeout(() => {
        setupEventListeners(); // Relancer l'initialisation des événements après un petit délai
      }, 200); // On laisse le temps au DOM de finaliser son chargement

      obs.disconnect(); // Arrête l'observation une fois les éléments trouvés
    } else {
      attempts++;
      if (attempts >= maxAttempts) {
        logEvent("error", " Les icônes de like ne sont pas apparues après plusieurs tentatives.");
        obs.disconnect();
      }
    }
  });

  // Surveille les modifications dans #gallery
  const gallery = document.querySelector("#gallery");
  if (gallery) {
    observer.observe(gallery, { childList: true, subtree: true });
  } else {
    logEvent("error", " Le conteneur #gallery est introuvable. Impossible d'observer les ajouts.");
  }
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
    setupEventListeners();
    logEvent("success", "Tous les événements ont été initialisés avec succès.");
  } catch (error) {
    logEvent("error", "Erreur critique lors de l'initialisation des événements.", { error });
  }

  logEvent("info", "Fin de l'initialisation globale des événements.");
}
