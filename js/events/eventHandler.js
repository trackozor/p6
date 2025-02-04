// ========================================================
// Fichier : eventHandler.js
// Description : Gestion centralisée des événements pour la modale,
//               la lightbox et le tri des médias.
// Auteur : Trackozor
// Date : 08/01/2025
// Version : 3.0 (Optimisation, Robustesse, Sécurité)
// ========================================================

/*==============================================*/
/*               IMPORTS                        */
/*==============================================*/

import { logEvent } from "../utils/utils.js";
import domSelectors from "../config/domSelectors.js";

/*------------------ Modales ------------------*/
import {
  launchModal,
  closeModal,
  closeConfirmationModal,
} from "../components/modal/modalManager.js";

/*------------------ Médias ------------------*/
import { handleMediaSort } from "../components/sort/sortlogic.js";
import {
  openLightbox,
  showPreviousMedia,
  showNextMedia,
  closeLightbox,
} from "../components/lightbox/lightbox.js";

/*------------------ Données ------------------*/
import { fetchMedia } from "../data/dataFetcher.js";

/*------------------ UI & Accessibilité ------------------*/
import { showLoader } from "../components/loader/loader.js";
import { trapFocus } from "../utils/accessibility.js";
import { initvalidform } from "../utils/contactForm.js";

/*------------------ Clavier ------------------*/
import { KEY_CODES } from "../config/constants.js";
import {
  handleEscapeKey,
  handleLightboxNavigation,
} from "./keyboardHandler.js";

/*==============================================*/
/*         Gestion des Modales                  */
/*==============================================*/

/**
 * Ouvre la modale de contact avec les données du photographe.
 */
export async function handleModalOpen() {
  logEvent("info", "Ouverture de la modale...");

  document.body.classList.add("loading");

  try {
    const mediaData = await fetchMedia();

    if (!mediaData?.photographers) {
      throw new Error("Données photographes manquantes.");
    }

    const photographerId = new URLSearchParams(window.location.search).get("id");
    if (!photographerId) {
      throw new Error("ID photographe introuvable dans l'URL.");
    }

    const photographerData = mediaData.photographers.find(
      (photographer) => photographer.id === parseInt(photographerId, 10),
    );

    if (!photographerData) {
      throw new Error(`Photographe ID ${photographerId} introuvable.`);
    }

    launchModal(photographerData);
    logEvent("success", "Modale ouverte avec succès.");
  } catch (error) {
    logEvent("error", `Erreur d'ouverture de la modale: ${error.message}`, { error });
    alert("Erreur lors du chargement de la modale.");
  } finally {
    document.body.classList.remove("loading");
  }
}

/**
 * Ferme la modale.
 */
export function handleModalClose() {
  logEvent("info", "Fermeture de la modale.");
  try {
    closeModal();
    logEvent("success", "Modale fermée.");
  } catch (error) {
    logEvent("error", "Erreur fermeture modale", { error });
  }
}

/**
 * Ferme la modale si clic sur l'arrière-plan.
 */
export function handleModalBackgroundClick(event) {
  if (event.target === domSelectors.modalBackground) {
    logEvent("info", "Clic sur l'arrière-plan de la modale.");
    handleModalClose();
  }
}

/**
 * Gère la confirmation d'une action dans une modale.
 */
export function handleModalConfirm() {
  logEvent("info", "Confirmation acceptée.");
  try {
    closeConfirmationModal();
    logEvent("success", "Modale de confirmation fermée.");
  } catch (error) {
    logEvent("error", "Erreur fermeture confirmation modale", { error });
  }
}

/**
 * Met à jour le compteur de caractères d'un champ textarea.
 */
export function updateCharCount(event) {
  const field = event.target;
  const charCount = document.getElementById("message-counter");

  if (!charCount) {
    return logEvent("error", "Compteur caractères introuvable.");
  }

  const maxLength = field.maxLength || 500;
  charCount.textContent = `${field.value.length} / ${maxLength} caractères`;

  logEvent("info", "Mise à jour compteur caractères.");
}

/**
 * Soumet le formulaire de contact.
 */
export function handleFormSubmit(event) {
  event.preventDefault();
  logEvent("info", "Soumission du formulaire de contact.");
  showLoader();
  initvalidform();
}

/*==============================================*/
/*         Gestion de la Lightbox               */
/*==============================================*/

/**
 * Ouvre la lightbox avec un média spécifique.
 */
export function handleLightboxOpen(event, mediaArray, folderName) {
  try {
      console.log("📢 Vérification de mediaArray avant ouverture :", mediaArray);
      
      if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
          throw new Error("⚠️ mediaArray est vide ou invalide !");
      }

      const galleryItem = event.target.closest(".gallery-item");
      if (!galleryItem) {
          throw new Error("Aucun média sélectionné.");
      }

      const mediaIndex = parseInt(galleryItem.dataset.index, 10);
      if (isNaN(mediaIndex)) {
          throw new Error("Index média invalide.");
      }

      // ✅ Assurer que `mediaList` est bien défini
      window.mediaList = mediaArray;
      window.globalFolderName = folderName;

      openLightbox(mediaIndex, mediaArray, folderName);
  } catch (error) {
      logEvent("error", "Erreur ouverture lightbox", { error });
  }
}




/**
 * Ferme la lightbox.
 */
export function handleLightboxClose() {
  try {
    logEvent("info", "Fermeture lightbox.");
    closeLightbox();
  } catch (error) {
    logEvent("error", "Erreur fermeture lightbox", { error });
  }
}

/**
 * Navigation vers le média précédent.
 */
export function handleLightboxPrev() {
  if (!window.mediaList?.length) {  // 🔥 Utilisation de mediaList globalement défini
    return logEvent("error", "Médias indisponibles.");
  }
  logEvent("info", "Navigation vers média précédent.");
  showPreviousMedia(); // ✅ Suppression des arguments inutiles
}

/**
 * Navigation vers le média suivant.
 */
export function handleLightboxNext() {
  if (!window.mediaList?.length) {  // 🔥 Utilisation de mediaList globalement défini
    return logEvent("error", "Médias indisponibles.");
  }
  logEvent("info", "Navigation vers média suivant.");
  showNextMedia(); // ✅ Suppression des arguments inutiles
}


/*==============================================*/
/*         Gestion du Tri des Médias            */
/*==============================================*/

/**
 * Gère le changement de tri des médias.
 */
export async function handleSortChange(event) {
  try {
    const sortOption = event.target.value;
    if (!sortOption) {
      throw new Error("Option de tri non sélectionnée.");
    }

    logEvent("info", `Tri sélectionné : ${sortOption}`);
    await handleMediaSort(sortOption);
  } catch (error) {
    logEvent("error", "Erreur tri médias", { error });
  }
}

/*==============================================*/
/*         Gestion des Interactions Clavier     */
/*==============================================*/

/**
 * Gère les événements clavier pour modales et lightbox.
 */
export function handleKeyboardEvent(event) {
  try {
    const activeModal = document.querySelector(".modal.modal-active");
    const activeLightbox = document.querySelector(".lightbox[aria-hidden='false']");
    const focusedElement = document.activeElement;

    logEvent("debug", "Événement clavier détecté.");

    if (event.key === KEY_CODES.TAB && activeModal) {
      trapFocus(activeModal);
      event.preventDefault();
    } else if (event.key === KEY_CODES.ESCAPE) {
      handleEscapeKey(activeModal, activeLightbox);
    } else if ([KEY_CODES.ARROW_LEFT, KEY_CODES.ARROW_RIGHT].includes(event.key)) {
      handleLightboxNavigation(activeLightbox, event);
    }
  } catch (error) {
    logEvent("error", "Erreur gestion clavier", { error });
  }
}

// Enregistrement de l'écouteur clavier global
document.addEventListener("keydown", handleKeyboardEvent);
