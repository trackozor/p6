/* ========================================================*/
/* Nom du fichier : eventHandler.js                         */
/* Description    : Gestion centralisée des événements pour la modale,
/*                  la lightbox et le tri des médias.
/* Auteur         : Trackozor
/* Date           : 08/01/2025
/* Version        : 2.4.1 
/* ========================================================*/

/*==============================================*/
/*               Imports                        */
/*==============================================*/
// Ce fichier regroupe les dépendances nécessaires pour gérer les fonctionnalités
// principales de l'application Fisheye, notamment les modales, le tri des médias,
// l'accessibilité, et la gestion des données.

/*------------------ Utilitaires ----------------*/
// Gestion des logs pour suivre les événements et faciliter le débogage
import { logEvent } from "../utils/utils.js";

// Sélecteurs DOM préconfigurés pour simplifier l'accès aux éléments HTML
import domSelectors from "../config/domSelectors.js";

/*------------------ Gestion des Modales ----------------*/
// Gestion de l'ouverture et de la fermeture des différentes modales
import {
  launchModal, // Ouvre la modale principale (contact ou autre)
  closeModal, // Ferme la modale principale
  closeConfirmationModal, // Ferme une modale de confirmation (ex : suppression)
} from "../components/modal/modalManager.js";

/*------------------ Fonctionnalités Médias ----------------*/
// Logique pour appliquer le tri des médias (par popularité, date, etc.)
import { handleMediaSort } from "../components/sort/sortlogic.js";

// Gestion de la lightbox : navigation et fermeture
import {
  openLightbox,
  showPreviousMedia,
  showNextMedia, // Initialise la lightbox pour les médias
  closeLightbox, // Ferme la lightbox active
} from "../components/lightbox/lightbox.js";

/*------------------ Gestion des Données ----------------*/
// Fonction pour récupérer les médias depuis une API ou un fichier JSON
import { fetchMedia } from "../data/dataFetcher.js";

/*------------------ Accessoires Visuels ----------------*/
// Affichage et masquage du loader (icône de chargement pendant les requêtes)
import { showLoader } from "../components/loader/loader.js";

// Accessibilité : gère la mise au point dans les modales et la lightbox
import { trapFocus } from "../utils/accessibility.js";

/*------------------ Validation de Formulaire ----------------*/
// Validation des champs dans le formulaire de contact et retour utilisateur
import { initvalidform } from "../utils/contactForm.js";

/*==============================================*/
/*         Gestion de la modale                 */
/*==============================================*/

/**
 * Fonction pour ouvrir une modale avec les données d'un photographe.
 * Cette fonction effectue plusieurs étapes :
 * 1. Affiche un indicateur de chargement pour informer l'utilisateur.
 * 2. Récupère les données des photographes à partir d'une source distante.
 * 3. Extrait l'ID du photographe depuis l'URL.
 * 4. Valide et recherche les données du photographe correspondant.
 * 5. Ouvre la modale avec les données récupérées.
 * 6. Logue chaque étape, y compris les erreurs.
 */
export async function handleModalOpen() {
  // Log initial indiquant que la procédure d'ouverture de la modale commence
  logEvent("info", "Appel à l'ouverture de la modale.");

  // Ajoute un indicateur de chargement pour signaler l'activité en cours
  document.body.classList.add("loading");

  try {
    // Étape 1 : Récupération des données depuis une API ou une source distante
    const mediaData = await fetchMedia();

    // Vérifie si les données récupérées sont valides
    if (!mediaData || !mediaData.photographers) {
      throw new Error("Données des photographes introuvables ou invalides.");
    }

    // Étape 2 : Extrait l'ID du photographe depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const photographerId = parseInt(params.get("id"), 10);

    // Vérifie que l'ID est valide et correctement extrait
    if (!photographerId || isNaN(photographerId)) {
      throw new Error("ID de photographe invalide ou manquant dans l'URL.");
    }

    // Étape 3 : Recherche des données correspondant à l'ID du photographe
    const photographerData = mediaData.photographers.find(
      (photographer) => photographer.id === photographerId,
    );

    // Vérifie si un photographe correspondant a été trouvé
    if (!photographerData) {
      throw new Error(`Photographe avec l'ID ${photographerId} introuvable.`);
    }

    // Vérifie si les données du photographe sont complètes
    if (!photographerData.name || !photographerData.id) {
      throw new Error("Les données du photographe sont incomplètes.");
    }

    // Étape 4 : Logue les données récupérées pour vérification
    logEvent("info", "Données du photographe récupérées avec succès.", {
      photographerData,
    });

    // Étape 5 : Ouvre la modale avec les données du photographe
    launchModal(photographerData);
    logEvent("success", "Modale ouverte avec succès.");
  } catch (error) {
    // Gestion des erreurs : logue l'erreur et affiche une alerte utilisateur
    logEvent("error", `Erreur dans handleModalOpen : ${error.message}`, {
      error,
    });
    alert(
      "Une erreur est survenue lors du chargement de la modale. Veuillez réessayer.",
    );
  } finally {
    // Étape 6 : Supprime l'indicateur de chargement (quelle que soit l'issue)
    document.body.classList.remove("loading");
  }
}

/*==============================================*/
/**
 * Fonction pour fermer la modale.
 * Cette fonction effectue les actions suivantes :
 * 1. Logue l'intention de fermer la modale.
 * 2. Appelle une fonction centralisée pour gérer la fermeture de la modale.
 * 3. Logue le succès de l'opération si tout se passe bien.
 * 4. Capture et logue toute erreur survenue pendant le processus.
 */
export function handleModalClose() {
  // Log initial : intention de fermer la modale
  logEvent("info", "Appel à la fermeture de la modale.");

  try {
    // Étape 1 : Ferme la modale en utilisant une fonction dédiée
    closeModal();

    // Étape 2 : Logue le succès de l'opération
    logEvent("success", "Modale fermée avec succès.");
  } catch (error) {
    // Étape 3 : Gestion des erreurs
    // Logue l'erreur avec un message explicite et l'affiche dans la console
    logEvent("error", `Erreur dans handleModalClose : ${error.message}`, {
      stack: error.stack,
    });
    console.error("Erreur lors de la fermeture de la modale :", error);
  }
}
/**
 * Met à jour le compteur de caractères pour un champ textarea donné.
 *
 * @param {Event} event - L'événement "input" déclenché par le champ textarea.
 */
/**
 * Met à jour le compteur de caractères pour un champ textarea donné.
 *
 * @param {Event} event - L'événement "input" déclenché par le champ textarea.
 */
export function updateCharCount(event) {
  const field = event.target; // Champ textarea déclencheur
  const charCount = document.getElementById("message-counter"); // Élément du compteur

  if (!charCount) {
    logEvent("error", "Élément 'message-counter' introuvable dans le DOM.");
    return; // Arrêter la fonction pour éviter l'erreur
  }

  const maxLength = field.getAttribute("maxlength") || 500; // Longueur max (ou défaut à 500)
  const currentLength = field.value.length; // Longueur actuelle

  // Mise à jour du compteur
  charCount.textContent = `${currentLength} / ${maxLength} caractères`;

  // Ajout d'un log pour vérifier si la mise à jour fonctionne
  logEvent("info", "Mise à jour du compteur de caractères.", {
    currentLength,
    maxLength,
  });
}

/*==============================================*/
/**
 * Fonction pour soumettre le formulaire de contact.
 * Cette fonction effectue les actions suivantes :
 * 1. Empêche le rechargement automatique de la page lors de la soumission.
 * 2. Logue l'intention de soumettre le formulaire.
 * 3. Récupère les données du formulaire de manière structurée.
 * 4. Affiche un indicateur de chargement pendant le traitement.
 * 5. Logue les données collectées avec succès.
 * 6. Capture et logue toute erreur éventuelle.
 *
 * @param {Event} event - Événement de soumission déclenché par le formulaire.
 */
export function handleFormSubmit(event) {
  // Étape 1 : Empêche le comportement par défaut du formulaire (rechargement de la page)
  event.preventDefault();
  logEvent("info", "Soumission du formulaire de contact détectée.");

  // Étape 2 : Affiche un indicateur de chargement
  showLoader(); // Peut être une animation ou un spinner pour l'utilisateur
  initvalidform();
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
/**
 * Gère le clic sur le bouton de confirmation dans la modale de confirmation.
 * - Ferme toutes les modales actives.
 * - Réinitialise le formulaire de contact.
 */
export function handleModalConfirm() {
  logEvent("info", "Confirmation acceptée via le bouton 'OK'.");

  try {
    closeConfirmationModal(); // Ferme la modale de confirmation
    logEvent("success", "Modale de confirmation fermée avec succès.");
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de la fermeture de la modale de confirmation : ${error.message}`,
      { error },
    );
  }
}

/*==============================================*/
/*         Gestion de la lightbox               */
/*==============================================*/
/**
 * Gestionnaire pour ouvrir la lightbox.
 * @param {Event} event - Événement déclenché par l'utilisateur.
 */
export function handleLightboxOpen(event, mediaArray, folderName) {
  try {
    const galleryItem = event.target.closest(".gallery-item");

    if (!galleryItem) {
      throw new Error("Élément de galerie introuvable ou clic hors galerie.");
    }

    const mediaIndex = parseInt(galleryItem.dataset.index, 10);

    if (isNaN(mediaIndex)) {
      throw new Error(
        "Index de média invalide ou manquant dans les attributs data-index.",
      );
    }

    // Ouvre la lightbox en passant les données nécessaires
    openLightbox(mediaIndex, mediaArray, folderName);
  } catch (error) {
    logEvent("error", "Erreur lors de l'ouverture de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * Gestionnaire pour fermer la lightbox.
 */
/**
 * Gestionnaire pour fermer la lightbox.
 * S'assure que toutes les ressources liées à la lightbox sont correctement nettoyées.
 */
export function handleLightboxClose() {
  try {
    logEvent("info", "Tentative de fermeture de la lightbox.");
    closeLightbox();
    logEvent("success", "Lightbox fermée avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de la fermeture de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * Gestionnaire pour afficher le média précédent dans la lightbox.
 * Vérifie les conditions avant de naviguer au média précédent.
 */
export function handleLightboxPrev(mediaArray, folderName) {
  try {
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Tableau de médias invalide ou vide.");
    }
    if (!folderName || typeof folderName !== "string") {
      throw new Error("Nom du dossier (folderName) invalide ou manquant.");
    }

    logEvent("info", "Navigation vers le média précédent.");
    showPreviousMedia(mediaArray, folderName); // Appelle la fonction principale
    logEvent("success", "Navigation vers le média précédent réussie.");
  } catch (error) {
    logEvent("error", "Erreur lors de la navigation vers le média précédent.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

export function handleLightboxNext(mediaArray, folderName) {
  try {
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Tableau de médias invalide ou vide.");
    }
    if (!folderName || typeof folderName !== "string") {
      throw new Error("Nom du dossier (folderName) invalide ou manquant.");
    }

    logEvent("info", "Navigation vers le média suivant.");
    showNextMedia(mediaArray, folderName); // Appelle la fonction principale
    logEvent("success", "Navigation vers le média suivant réussie.");
  } catch (error) {
    logEvent("error", "Erreur lors de la navigation vers le média suivant.", {
      message: error.message,
      stack: error.stack,
    });
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

/*================================================================*/
/*             Gestion des interactions clavier                  */
/*================================================================*/

document.addEventListener("keydown", (e) => {
  try {
    const activeModal = document.querySelector(".modal.modal-active");
    const activeLightbox = document.querySelector(
      ".lightbox[aria-hidden='false']",
    );
    const focusedElement = document.activeElement;

    // Vérifie les éléments actifs
    logEvent("debug", "Vérification des éléments actifs.", {
      activeModal: !!activeModal,
      activeLightbox: !!activeLightbox,
      focusedElement: focusedElement?.tagName || null,
    });

    // Gestion du focus trap pour la modale
    if (e.key === "Tab" && activeModal) {
      trapFocus(activeModal);
      logEvent("info", "Focus trap activé pour la modale.");
      return;
    }

    // Fermer les modales ou la lightbox avec Escape
    if (e.key === "Escape") {
      if (activeModal) {
        if (typeof closeModal === "function") {
          closeModal();
          logEvent("info", "Modale fermée via la touche Escape.");
        } else {
          logEvent("warn", "closeModal n'est pas défini.");
        }
      }
      if (activeLightbox) {
        if (typeof closeLightbox === "function") {
          closeLightbox();
          logEvent("info", "Lightbox fermée via la touche Escape.");
        } else {
          logEvent("warn", "closeLightbox n'est pas défini.");
        }
      }
      return;
    }

    // Navigation dans la lightbox
    if (e.key === "ArrowLeft" && activeLightbox) {
      logEvent(
        "info",
        "Flèche gauche détectée. Navigation vers le média précédent.",
      );
      if (typeof handleLightboxPrev === "function") {
        handleLightboxPrev();
      } else {
        logEvent("warn", "handleLightboxPrev n'est pas défini.");
      }
      return;
    }

    if (e.key === "ArrowRight" && activeLightbox) {
      logEvent(
        "info",
        "Flèche droite détectée. Navigation vers le média suivant.",
      );
      if (typeof handleLightboxNext === "function") {
        handleLightboxNext();
      } else {
        logEvent("warn", "handleLightboxNext n'est pas défini.");
      }
      return;
    }

    // Navigation générale (exemple : sur des boutons ou liens)
    if (e.key === "Enter" || e.key === " ") {
      if (focusedElement) {
        if (focusedElement.tagName === "BUTTON") {
          focusedElement.click();
          logEvent(
            "info",
            "Activation d’un bouton via la touche Enter ou Espace.",
          );
        } else if (focusedElement.tagName === "A") {
          focusedElement.click();
          logEvent(
            "info",
            "Activation d’un lien via la touche Enter ou Espace.",
          );
        }
      } else {
        logEvent("warn", "Aucun élément focalisé pour l'activation.");
      }
      return;
    }
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de l'interprétation des événements clavier.",
      {
        message: error.message,
        stack: error.stack,
      },
    );
  }
});
