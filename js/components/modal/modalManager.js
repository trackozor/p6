// ========================================================
// Nom du fichier : modal.manager.js
// Description    : Gestion de la modale dans l'application Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.4.0 (Corrections et logs enrichis)
// ========================================================

/*==============================================*/
/*              Imports                        */
/*=============================================*/
import { logEvent } from "../../utils/utils.js";
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
export async function launchModal(photographerData) {
  logEvent("test_start", "Début de l'ouverture de la modale.");

  try {
    if (!photographerData || !photographerData.name) {
      throw new Error("Données du photographe invalides ou manquantes.");
    }

    logEvent("info", "Données du photographe valides.", { photographerData });

    // Sélection des éléments DOM
    const contactOverlay = document.getElementById("modal-overlay");
    const contactModal = document.getElementById("contact-modal");

    if (!contactOverlay || !contactModal) {
      throw new Error("Éléments DOM requis pour la modale introuvables.");
    }

    // Insertion du nom dans la modale
    const modalTitle = contactModal.querySelector(".modal-photographer-name");
    if (modalTitle) {
      modalTitle.textContent = `${photographerData.name}`;
      logEvent("info", "Nom du photographe inséré dans la modale.");
    } else {
      logEvent("warn", "Impossible de trouver l'élément pour insérer le nom.");
    }

    // Affichage de la modale
    contactOverlay.classList.add("modal-active");
    contactModal.classList.add("modal-active");
    document.body.classList.add("no-scroll");

    logEvent("success", "Modale affichée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'ouverture de la modale.", {
      message: error.message,
      stack: error.stack,
    });
  }
  modalOpen = true;
  logEvent("test_end", "Fin de l'ouverture de la modale.");
}

/*==============================================*/
/*              Fermeture modale                */
/*=============================================*/
/**
 * Ferme la modale et réactive le défilement de la page.
 *
 * @returns {void}
 */
export async function closeModal() {
  logEvent("test_start", "Début de la tentative de fermeture de la modale.");

  try {
    logEvent("info", "Vérification de l'état de la modale...");
    const contactOverlay = document.getElementById("modal-overlay");
    const contactModal = document.getElementById("contact-modal");
    const confirmationModal = document.getElementById("confirmation-modal"); // Corrigé pour éviter le symbole '#'

    if (!modalOpen || !contactModal?.classList?.contains("modal-active")) {
      logEvent("warn", "Modale déjà fermée ou état incohérent.", {
        modalOpen,
        modalClasses: contactModal?.classList?.value || "Inexistant",
      });
      return;
    }

    // Suppression des classes pour masquer la modale
    if (contactOverlay && contactOverlay.classList) {
      contactOverlay.classList.remove("modal-active");
      logEvent("info", "Classe 'modal-active' supprimée de l'overlay.");
    } else {
      logEvent("warn", "Overlay introuvable ou invalide.");
    }

    if (contactModal && contactModal.classList) {
      contactModal.classList.remove("modal-active");
      logEvent("info", "Classe 'modal-active' supprimée de la modale.");
    } else {
      logEvent("warn", "Modale principale introuvable ou invalide.");
    }

    if (confirmationModal && confirmationModal.classList) {
      confirmationModal.classList.remove("modal-active");
      logEvent(
        "info",
        "Classe 'modal-active' supprimée de la modale de confirmation.",
      );
    } else {
      logEvent("warn", "Aucune modale de confirmation active à fermer.");
    }

    // Réactivation du défilement
    if (document.body.classList.contains("no-scroll")) {
      document.body.classList.remove("no-scroll");
      logEvent("success", "Défilement réactivé.");
    }

    modalOpen = false;
    logEvent("info", "État global de la modale mis à jour : 'fermé'.", {
      modalOpen,
    });
  } catch (error) {
    logEvent("error", "Erreur lors de la fermeture de la modale.", {
      message: error.message,
      stack: error.stack,
    });
  }

  logEvent("test_end", "Fin de la tentative de fermeture de la modale.");
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
  logEvent("test_start", "Début de l'ouverture de la modale de confirmation.");

  try {
    const confirmationModal = domSelectors.modal;

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

  logEvent("test_end", "Fin de l'ouverture de la modale de confirmation.");
}

/**
 * Ferme la modale de confirmation.
 *
 * @returns {void}
 */
export function closeConfirmationModal() {
  logEvent("test_start", "Début de la fermeture de la modale de confirmation.");

  try {
    const confirmationModal = document.getElementById("confirmation-modal"); // Correction ici pour éviter un sélecteur incorrect

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

  logEvent("test_end", "Fin de la fermeture de la modale de confirmation.");
}
