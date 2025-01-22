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
import { logEvent, addClass, removeClass } from "../../utils/utils.js";
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
  logEvent(
    "test_start_modal",
    "Début de la tentative d'ouverture de la modale.",
  );

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

    // Étape 3 : Désactive le défilement de l'arrière-plan
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

  logEvent("test_end_modal", "Fin de la tentative d'ouverture de la modale.");
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
  logEvent(
    "test_start_modal",
    "Début de la tentative de fermeture de la modale.",
  );

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

    // Étape 3 : Réactive le défilement de l'arrière-plan
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

  logEvent("test_end_modal", "Fin de la tentative de fermeture de la modale.");
}

/*===============================================================================================*/
/*                                 ======= Modal de confirmation =======                         */
/*===============================================================================================*/

/* ============ Fonction pour ouvrir la modale de confirmation ============*/
/**
 * Ouvre la modale de confirmation.
 *
 * Étapes principales :
 * 1. Vérifie si la modale de confirmation est déjà active pour éviter les duplications.
 * 2. Ajoute les classes nécessaires pour afficher la modale et désactiver le défilement.
 * 3. Enregistre chaque action importante dans les logs pour le suivi.
 * 4. Gère les éventuelles erreurs et les journalise dans la console.
 *
 * @returns {void}
 */
export function openConfirmationModal() {
  try {
    // Étape 2 : Vérifie si la modale est déjà active
    if (
      domSelectors.confirmationModal.classList.contains(
        CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE,
      )
    ) {
      logEvent("warn", "La modale de confirmation est déjà ouverte.", {
        modalState: "active",
      });
      return; // Sortie anticipée si la modale est déjà active
    }

    // Étape 3 : Affiche la modale de confirmation
    addClass(
      domSelectors.confirmationModal,
      CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE,
    ); // Ajoute la classe CSS pour rendre la modale visible
    domSelectors.confirmationModal.setAttribute("aria-hidden", "false"); // Met à jour l'accessibilité
    logEvent("success", "Modale de confirmation affichée avec succès.", {
      modalState: "active",
    });

    // Étape 4 : Place le focus sur un élément de la modale
    const firstFocusableElement = domSelectors.confirmationModal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (firstFocusableElement) {
      firstFocusableElement.focus(); // Place le focus sur le premier élément interactif
      logEvent(
        "info",
        "Focus placé sur le premier élément interactif de la modale.",
      );
    }
  } catch (error) {
    // Étape 5 : Gestion des erreurs
    logEvent(
      "error",
      "Erreur lors de l'ouverture de la modale de confirmation.",
      { error: error.message },
    );
    console.error(
      "Erreur lors de l'ouverture de la modale de confirmation :",
      error,
    );
  }
}

/* ============ Fonction pour fermer la modale de confirmation ============ */
/**
 * Ferme la modale et réactive le défilement de la page.
 *
 * Étapes principales :
 * 1. Vérifie si la modale est active ou si l'état global indique qu'elle est déjà fermée.
 * 2. Supprime les classes CSS utilisées pour afficher la modale.
 * 3. Réactive le défilement de la page.
 * 4. Met à jour l'état global de la modale (`modalOpen`).
 * 5. Journalise chaque étape pour le suivi.
 *
 * @returns {void}
 */
export function closeConfirmationModal() {
  try {
    // Étape 1 : Validation - Vérifie si la modale existe et est active
    if (!domSelectors.confirmationModal) {
      logEvent(
        "error",
        "Élément modaloverlay introuvable. Impossible de fermer la modale.",
      );
      return;
    }

    if (
      !modalOpen ||
      !domSelectors.confirmationModal.classList.contains(
        CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE,
      )
    ) {
      logEvent(
        "warn",
        "Tentative de fermeture d'une modale déjà fermée ou état incohérent.",
        {
          modalOpen,
          modalState: domSelectors.confirmationModal.classList.value,
        },
      );
      return; // Sortie anticipée si la modale est déjà fermée
    }

    // Étape 2 : Masque la modale
    removeClass(
      domSelectors.confirmationModal,
      CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE,
    );
    domSelectors.confirmationModal.setAttribute("aria-hidden", "true"); // Rend la modale invisible pour les technologies d'assistance
    logEvent("success", "Modale masquée avec succès.", {
      modalState: domSelectors.confirmationModal.classList.value,
    });

    // Étape 3 : Réactive le défilement de la page
    removeClass(document.body, CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL);
    logEvent("success", "Défilement de l'arrière-plan réactivé.", {
      bodyClasses: document.body.classList.value,
    });

    // Étape 4 : Met à jour l'état global
    modalOpen = true;
    resetForm();
  } catch (error) {
    // Étape 7 : Gestion des erreurs
    logEvent("error", "Erreur lors de la fermeture de la modale.", {
      error: error.message,
    });
    console.error("Erreur dans closeModal :", error);
  }
}
