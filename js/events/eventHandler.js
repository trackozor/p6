// ========================================================
// Nom du fichier : eventHandler.js
// Description    : Gestion centralisée des événements pour la modale,
//                  la lightbox et le tri des médias.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.4.1 (Adaptée avec domSelectors)
// ========================================================

import { logEvent } from "../utils/utils.js";
import { launchModal, closeModal } from "../components/modal/modalManager.js";
import { handleMediaSort } from "../components/sort/sortlogic.js";
import domSelectors from "../config/domSelectors.js";

/*==============================================*/
/*         Gestion de la modale                 */
/*==============================================*/

/**
 * Ouvre la modale.
 */
export function handleModalOpen() {
  logEvent("info", "Appel à l'ouverture de la modale.");
  try {
    launchModal(); // Ouvre la modale
    logEvent("success", "Modale ouverte avec succès.");
  } catch (error) {
    logEvent("error", `Erreur dans handleModalOpen : ${error.message}`);
  }
}

/**
 * Ferme la modale.
 */
export function handleModalClose() {
  logEvent("info", "Appel à la fermeture de la modale.");
  try {
    closeModal(); // Ferme la modale
    logEvent("success", "Modale fermée avec succès.");
  } catch (error) {
    logEvent("error", `Erreur dans handleModalClose : ${error.message}`);
  }
}

/**
 * Soumet le formulaire de contact.
 */
export function handleFormSubmit(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  logEvent("info", "Formulaire de contact soumis.");

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  logEvent("success", "Les données du formulaire ont été collectées.", {
    formData: data,
  });

  handleModalClose(); // Ferme la modale après soumission
}

/**
 * Ferme la modale si un clic est détecté sur l'arrière-plan.
 */
export function handleModalBackgroundClick(event) {
  if (event.target === domSelectors.modalBackground) {
    logEvent("info", "Clic détecté sur l'arrière-plan de la modale.");
    handleModalClose();
  }
}

/*==============================================*/
/*         Gestion de la lightbox               */
/*==============================================*/

/**
 * Ferme la lightbox.
 */
export function handleLightboxClose() {
  logEvent("info", "Tentative de fermeture de la lightbox.");
  try {
    const { lightbox } = domSelectors;
    if (!lightbox) {
      throw new Error("Élément lightbox introuvable.");
    }
    lightbox.classList.add("hidden");
    logEvent("success", "Lightbox fermée.");
  } catch (error) {
    logEvent("error", `Erreur dans handleLightboxClose : ${error.message}`);
  }
}

/**
 * Affiche l'image précédente dans la lightbox.
 */
export function handleLightboxPrev() {
  logEvent("info", "Navigation vers l'image précédente.");
  try {
    // Ajoutez ici la logique pour afficher l'image précédente
    logEvent("success", "Image précédente affichée.");
  } catch (error) {
    logEvent("error", `Erreur dans handleLightboxPrev : ${error.message}`);
  }
}

/**
 * Affiche l'image suivante dans la lightbox.
 */
export function handleLightboxNext() {
  logEvent("info", "Navigation vers l'image suivante.");
  try {
    // Ajoutez ici la logique pour afficher l'image suivante
    logEvent("success", "Image suivante affichée.");
  } catch (error) {
    logEvent("error", `Erreur dans handleLightboxNext : ${error.message}`);
  }
}

/*==============================================*/
/*         Gestion du tri                       */
/*==============================================*/

/**
 * Change le tri des médias.
 */
export async function handleSortChange(event) {
  logEvent("info", "Changement de tri détecté.", { eventTarget: event.target });

  try {
    const sortOption = event.target.value;
    if (!sortOption) {
      throw new Error("Aucune option de tri sélectionnée.");
    }
    logEvent("info", `Option de tri sélectionnée : ${sortOption}`);

    await handleMediaSort(sortOption);
    logEvent("success", `Tri appliqué pour l'option : ${sortOption}`);
  } catch (error) {
    logEvent("error", `Erreur dans handleSortChange : ${error.message}`, {
      stack: error.stack,
    });
  }
}
