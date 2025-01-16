// ========================================================
// Nom du fichier : modal.manager.js
// Description    : Gestion de la modale dans l'application Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.2.0 (Optimisations et robustesse accrue)
// ========================================================

/*==============================================*/
/*              Imports                        */
/*=============================================*/
import { logEvent } from "../../utils/utils.js";
import { CONFIGLOG } from "../../config/constants.js";
import domSelectors from "../../config/domSelectors.js";

/*==============================================*/
/*              Variables                       */
/*=============================================*/
let modalOpen = false; // Variable globale pour suivre l'état de la modale

/*==============================================*/
/*              Ouverture modale                */
/*=============================================*/

/**
 * Affiche la modale et empêche le défilement en arrière-plan.
 *
 * @returns {void}
 */
export function launchModal() {
  try {
    logEvent("info", "Tentative d'ouverture de la modale...");

    // Étape 1 : Vérifie l'existence des éléments DOM requis
    const { contactOverlay, contactModal } = domSelectors.modal;
    if (!contactOverlay || !contactModal) {
      throw new Error(
        "Éléments DOM requis pour la modale introuvables. Vérifiez les sélecteurs.",
      );
    }

    // Étape 2 : Ajoute la classe pour afficher la modale
    contactOverlay.classList.add(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
    contactModal.classList.add(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
    logEvent("success", "Modale affichée avec succès.", {
      overlayClasses: contactOverlay.classList.value,
      modalClasses: contactModal.classList.value,
    });

    // Étape 3 : Désactive le défilement de l'arrière-plan (vérifie d'abord s'il est déjà désactivé)
    if (
      !document.body.classList.contains(CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL)
    ) {
      document.body.classList.add(CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL);
      logEvent("success", "Défilement désactivé pour l'arrière-plan.", {
        bodyClasses: document.body.classList.value,
      });
    }

    // Étape 4 : Met à jour l'état global
    modalOpen = true;
    logEvent("info", 'État global de la modale mis à jour : "ouvert".', {
      modalOpen,
    });
  } catch (error) {
    // Gestion des erreurs
    logEvent("error", "Erreur lors de l'ouverture de la modale.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/*==============================================*/
/*              Fermeture modale                */
/*=============================================*/

/**
 * Ferme la modale et réactive le défilement de la page.
 *
 * @returns {void}
 */
export function closeModal() {
  try {
    logEvent("info", "Tentative de fermeture de la modale...");

    // Étape 1 : Vérifie si la modale est ouverte
    const { contactOverlay, contactModal } = domSelectors.modal;
    if (
      !modalOpen ||
      !contactModal?.classList.contains(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE)
    ) {
      logEvent("warn", "Modale déjà fermée ou état incohérent.", {
        modalOpen,
        modalClasses: contactModal?.classList.value || "Inexistant",
      });
      return;
    }

    // Étape 2 : Supprime les classes pour masquer la modale
    contactOverlay.classList.remove(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
    contactModal.classList.remove(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
    logEvent("success", "Modale masquée avec succès.", {
      overlayClasses: contactOverlay.classList.value,
      modalClasses: contactModal.classList.value,
    });

    // Étape 3 : Réactive le défilement de l'arrière-plan (vérifie d'abord s'il est déjà activé)
    if (
      document.body.classList.contains(CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL)
    ) {
      document.body.classList.remove(CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL);
      logEvent("success", "Défilement de l'arrière-plan réactivé.", {
        bodyClasses: document.body.classList.value,
      });
    }

    // Étape 4 : Met à jour l'état global
    modalOpen = false;
    logEvent("info", 'État global de la modale mis à jour : "fermé".', {
      modalOpen,
    });
  } catch (error) {
    // Gestion des erreurs
    logEvent("error", "Erreur lors de la fermeture de la modale.", {
      message: error.message,
      stack: error.stack,
    });
  }
}
