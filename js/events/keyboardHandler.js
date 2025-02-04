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

// 🔥 Protection contre le spam clavier
let isKeyBlocked = false;
const KEY_BLOCK_DELAY = 300;

/**
 * Fonction principale qui écoute les événements clavier et applique les actions correspondantes.
 * @param {KeyboardEvent} event - Événement clavier détecté.
 */
export function handleKeyboardEvent(event) {
    if (!event.key || isKeyBlocked) {
      return;
    }

    // Bloque temporairement les touches répétées trop rapidement
    isKeyBlocked = true;
    setTimeout(() => {
        isKeyBlocked = false;
    }, KEY_BLOCK_DELAY);

    logEvent("debug", "Événement clavier détecté.", { keyPressed: event.key });

    const activeModal = document.querySelector(".modal.modal-active");
    const activeLightbox = document.querySelector(".lightbox[aria-hidden='false']");
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
    logEvent("warn", `Touche ${event.key} détectée mais non prise en charge.`);
}

/**
 * Gère l'événement de la touche "Escape" pour fermer les modales et la lightbox.
 */
export function handleEscapeKey(activeModal, activeLightbox) {
    logEvent("info", "Touche Escape détectée.");

    if (activeModal) {
        logEvent("success", "Fermeture de la modale en cours...");
        closeModal();
        return;
    }

    if (activeLightbox) {
        logEvent("success", "Fermeture de la lightbox en cours...");
        closeLightbox();
        return;
    }

    logEvent("warn", "Aucune modale ou lightbox active à fermer.");
}

/**
 * Gère la navigation dans la lightbox avec les flèches gauche/droite.
 */
export function handleLightboxNavigation(event) {
    logEvent("info", `Touche ${event.key} détectée : navigation dans la lightbox.`);

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
document.addEventListener("keydown", handleKeyboardEvent);
logEvent("success", "Gestionnaire d'événements clavier initialisé.");
