/* ========================================================*/
// Nom du fichier : keyboardHandler.js
// Description    : Gestion des interactions clavier
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.6.2 (Ajout de fonctions manquantes + logs détaillés)
/* ========================================================*/

/*==============================================*/
/*                   Imports                    */
/*==============================================*/

import { logEvent } from "../utils/utils.js";
import { trapFocus } from "../utils/accessibility.js";
import { closeModal } from "../components/modal/modalManager.js";
import {
  closeLightbox,
  showNextMedia,
  showPreviousMedia,
} from "../components/lightbox/lightbox.js";
import { KEY_CODES } from "../config/constants.js";

/*==============================================*/
/*        Gestion des interactions clavier      */
/*==============================================*/

/**
 * Fonction principale qui écoute les événements clavier et applique les actions correspondantes.
 * @param {KeyboardEvent} event - Événement clavier détecté.
 */
export function handleKeyboardEvent(event) {
  logEvent("debug", "Événement clavier détecté.", { keyPressed: event.key });

  const activeModal = document.querySelector(".modal.modal-active");
  const activeLightbox = document.querySelector(
    ".lightbox[aria-hidden='false']",
  );
  const focusedElement = document.activeElement;

  logEvent("info", "Vérification des éléments actifs.", {
    activeModal: !!activeModal,
    activeLightbox: !!activeLightbox,
    focusedElement: focusedElement?.tagName || "Aucun",
  });

  /*----------------------------------------------*/
  /*           Gestion du Focus Trap (Tab)        */
  /*----------------------------------------------*/
  if (event.key === KEY_CODES.TAB && activeModal) {
    logEvent("info", "Focus trap détecté : maintien du focus dans la modale.");
    trapFocus(activeModal);
    event.preventDefault();
    return;
  }

  /*----------------------------------------------*/
  /*        Fermeture de la modale / lightbox (Escape) */
  /*----------------------------------------------*/
  if (event.key === KEY_CODES.ESCAPE) {
    handleEscapeKey(activeModal, activeLightbox);
    return;
  }

  /*----------------------------------------------*/
  /*        Navigation dans la lightbox          */
  /*----------------------------------------------*/
  if (
    activeLightbox &&
    [KEY_CODES.ARROW_LEFT, KEY_CODES.ARROW_RIGHT].includes(event.key)
  ) {
    handleLightboxNavigation(event);
    return;
  }

  /*----------------------------------------------*/
  /*        Activation des boutons / liens       */
  /*----------------------------------------------*/
  if ([KEY_CODES.ENTER, KEY_CODES.SPACE].includes(event.key)) {
    if (focusedElement) {
      logEvent("info", `Activation de l'élément : ${focusedElement.tagName}.`);
      focusedElement.click();
      logEvent("success", "Élément activé avec succès.");
    } else {
      logEvent("warn", "Aucun élément focalisé pour activation.");
    }
    return;
  }

  /*----------------------------------------------*/
  /*         Cas non gérés (Touche ignorée)      */
  /*----------------------------------------------*/
  logEvent("debug", `Touche ${event.key} détectée mais non prise en charge.`);
}

/*==============================================*/
/*     Fonctions secondaires pour le clavier   */
/*==============================================*/

/**
 * Gère l'événement de la touche "Escape" pour fermer les modales et la lightbox.
 * @param {HTMLElement} activeModal - Modale actuellement active (si présente).
 * @param {HTMLElement} activeLightbox - Lightbox actuellement active (si présente).
 */
export function handleEscapeKey(activeModal, activeLightbox) {
  logEvent("info", "Touche Escape détectée.");

  if (activeModal) {
    logEvent("success", "Fermeture de la modale en cours...");
    closeModal();
  } else {
    logEvent("warn", "Aucune modale active à fermer.");
  }

  if (activeLightbox) {
    logEvent("success", "Fermeture de la lightbox en cours...");
    closeLightbox();
  } else {
    logEvent("warn", "Aucune lightbox active à fermer.");
  }
}

/**
 * Gère la navigation dans la lightbox avec les flèches gauche/droite.
 * @param {KeyboardEvent} event - Événement clavier contenant la touche pressée.
 */
export function handleLightboxNavigation(event) {
  logEvent(
    "info",
    `Touche ${event.key} détectée : navigation dans la lightbox.`,
  );

  if (event.key === KEY_CODES.ARROW_LEFT) {
    logEvent("info", "Navigation vers l'image précédente.");
    showPreviousMedia();
  } else if (event.key === KEY_CODES.ARROW_RIGHT) {
    logEvent("info", "Navigation vers l'image suivante.");
    showNextMedia();
  }
}

/*==============================================*/
/*       Enregistrement des événements         */
/*==============================================*/

// Attache l'événement de gestion du clavier à la page entière
document.addEventListener("keydown", handleKeyboardEvent);
logEvent("success", "Gestionnaire d'événements clavier initialisé.");
