// ========================================================
// Nom du fichier : modal.manager.js
// Description    : Gestion de la modale dans l'application Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.3.0 (Ajout de logs enrichis pour toutes les étapes)
// ========================================================

/*==============================================*/
/*              Imports                        */
/*=============================================*/
import { logEvent } from "../../utils/utils.js";

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
    logEvent("info", "Vérification des éléments DOM nécessaires...");
    const contactOverlay = document.getElementById("modal-overlay");
    const contactModal = document.getElementById("contact-modal");

    if (!contactOverlay || !contactModal) {
      logEvent("error", "Éléments DOM requis pour la modale introuvables.", {
        contactOverlay,
        contactModal,
      });
      throw new Error("Éléments DOM requis pour la modale introuvables.");
    }

    logEvent("info", "Ajout des classes pour afficher la modale...");
    contactOverlay.classList.add("modal-active");
    contactModal.classList.add("modal-active");

    logEvent("success", "Modale affichée avec succès.", {
      overlayClasses: contactOverlay.classList.value,
      modalClasses: contactModal.classList.value,
    });

    logEvent("info", "Désactivation du défilement de l'arrière-plan...");
    if (!document.body.classList.contains("no-scroll")) {
      document.body.classList.add("no-scroll");
      logEvent("success", "Défilement désactivé.", {
        bodyClasses: document.body.classList.value,
      });
    }

    modalOpen = true;
    logEvent("info", 'État global de la modale mis à jour : "ouvert".', {
      modalOpen,
    });
  } catch (error) {
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
    logEvent("info", "Vérification de l'état de la modale...");
    const contactOverlay = document.getElementById("modal-overlay");
    const contactModal = document.getElementById("contact-modal");

    if (!modalOpen || !contactModal?.classList.contains("modal-active")) {
      logEvent("warn", "Modale déjà fermée ou état incohérent.", {
        modalOpen,
        modalClasses: contactModal?.classList.value || "Inexistant",
      });
      return;
    }

    logEvent("info", "Suppression des classes pour masquer la modale...");
    contactOverlay.classList.remove("modal-active");
    contactModal.classList.remove("modal-active");

    logEvent("success", "Modale masquée avec succès.", {
      overlayClasses: contactOverlay.classList.value,
      modalClasses: contactModal.classList.value,
    });

    logEvent("info", "Réactivation du défilement de l'arrière-plan...");
    if (document.body.classList.contains("no-scroll")) {
      document.body.classList.remove("no-scroll");
      logEvent("success", "Défilement réactivé.", {
        bodyClasses: document.body.classList.value,
      });
    }

    modalOpen = false;
    logEvent("info", 'État global de la modale mis à jour : "fermé".', {
      modalOpen,
    });
  } catch (error) {
    logEvent("error", "Erreur lors de la fermeture de la modale.", {
      message: error.message,
      stack: error.stack,
    });
  }

  logEvent("test_end_modal", "Fin de la tentative de fermeture de la modale.");
}

/*==============================================*/
/*              Modale de confirmation          */
/*=============================================*/
/**
 * Ouvre la modale de confirmation.
 *
 * @returns {void}
 */
export function openConfirmationModal() {
  logEvent(
    "test_start_modal",
    "Début de l'ouverture de la modale de confirmation.",
  );

  try {
    const confirmationModal = document.getElementById("confirmation-modal");

    if (!confirmationModal) {
      logEvent(
        "error",
        "Élément DOM de la modale de confirmation introuvable.",
      );
      throw new Error("Élément DOM introuvable.");
    }

    if (confirmationModal.classList.contains("modal-active")) {
      logEvent("warn", "La modale de confirmation est déjà ouverte.");
      return;
    }

    confirmationModal.classList.add("modal-active");
    confirmationModal.setAttribute("aria-hidden", "false");

    logEvent("success", "Modale de confirmation affichée avec succès.", {
      modalClasses: confirmationModal.classList.value,
    });
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de l'ouverture de la modale de confirmation.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
  }

  logEvent(
    "test_end_modal",
    "Fin de l'ouverture de la modale de confirmation.",
  );
}

/**
 * Ferme la modale de confirmation.
 *
 * @returns {void}
 */
export function closeConfirmationModal() {
  logEvent(
    "test_start_modal",
    "Début de la fermeture de la modale de confirmation.",
  );

  try {
    const confirmationModal = document.getElementById("confirmation-modal");

    if (
      !confirmationModal ||
      !confirmationModal.classList.contains("modal-active")
    ) {
      logEvent(
        "warn",
        "La modale de confirmation est déjà fermée ou introuvable.",
      );
      return;
    }

    confirmationModal.classList.remove("modal-active");
    confirmationModal.setAttribute("aria-hidden", "true");

    logEvent("success", "Modale de confirmation masquée avec succès.", {
      modalClasses: confirmationModal.classList.value,
    });
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de la fermeture de la modale de confirmation.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
  }

  logEvent(
    "test_end_modal",
    "Fin de la fermeture de la modale de confirmation.",
  );
}
