import { logEvent } from "../utils/utils.js";
import { launchModal, closeModal } from "../components/modal/modalManager.js";
/**
 * Gestion de l'ouverture de la modale.
 */
export function handleModalOpen() {
  logEvent("info", "Appel à l'ouverture de la modale via launchModal.");
  try {
    launchModal();
  } catch (error) {
    logEvent("error", `Erreur dans handleModalOpen : ${error.message}`);
  }
}

/**
 * Gestion de la fermeture de la modale.
 */

export function handleModalClose() {
  logEvent("info", "Appel à la fermeture de la modale via closeModal.");
  try {
    closeModal();
  } catch (error) {
    logEvent("error", `Erreur dans handleModalClose : ${error.message}`);
  }
}

/**
 * Gestion de la fermeture de la lightbox.
 */
export function handleLightboxClose() {
  logEvent("info", "Tentative de fermeture de la lightbox.");
  try {
    const lightbox = document.querySelector("#lightbox");

    if (!lightbox) {
      throw new Error("Élément lightbox introuvable.");
    }

    lightbox.classList.add("hidden");
    logEvent("success", "Lightbox fermée.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la fermeture de la lightbox : ${error.message}`,
    );
  }
}

/**
 * Gestion de la navigation vers l'image précédente.
 */
export function handleLightboxPrev() {
  logEvent("info", "Navigation vers l'image précédente.");
  try {
    // Ajouter ici la logique pour afficher l'image précédente
    logEvent("success", "Navigation précédente effectuée.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la navigation vers l'image précédente : ${error.message}`,
    );
  }
}

/**
 * Gestion de la navigation vers l'image suivante.
 */
export function handleLightboxNext() {
  logEvent("info", "Navigation vers l'image suivante.");
  try {
    // Ajouter ici la logique pour afficher l'image suivante
    logEvent("success", "Navigation suivante effectuée.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la navigation vers l'image suivante : ${error.message}`,
    );
  }
}

/**
 * Gestion du changement de tri des médias.
 */
export function handleSortChange(event) {
  logEvent("info", "Tentative de changement de tri des médias.");
  try {
    const selectedOption = event.target.value;

    if (!selectedOption) {
      throw new Error("Aucune option de tri sélectionnée.");
    }

    // Ajouter ici la logique de tri basée sur selectedOption
    logEvent("success", `Option de tri appliquée : ${selectedOption}`);
  } catch (error) {
    logEvent("error", `Erreur lors du changement de tri : ${error.message}`);
  }
}
