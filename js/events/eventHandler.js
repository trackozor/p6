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
  initLightbox, // Initialise la lightbox pour les médias
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
export function updateCharCount(event) {
  const field = event.target; // Champ textarea déclencheur
  const charCount = document.getElementById("char-count"); // Élément pour afficher le compteur
  const maxLength = field.getAttribute("maxlength"); // Longueur max autorisée
  const currentLength = field.value.length; // Longueur actuelle

  // Mettre à jour le texte du compteur
  charCount.textContent = `${currentLength}/${maxLength}`;
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
 * Ajoute un gestionnaire d'événements pour ouvrir la lightbox
 * lorsque l'utilisateur clique sur un élément déclencheur.
 *
 * @param {string} triggerSelector - Sélecteur CSS des éléments déclencheurs.
 */
export function setupLightboxEventHandlers(triggerSelector, mediaArray) {
  logEvent("info", "Ajout des gestionnaires d'événements pour la lightbox.");

  try {
    // === Validation des paramètres ===
    if (typeof triggerSelector !== "string" || !Array.isArray(mediaArray)) {
      throw new Error(
        "Paramètres invalides : le sélecteur doit être une chaîne et mediaArray un tableau.",
      );
    }

    // === Recherche des éléments déclencheurs ===
    const triggers = document.querySelectorAll(triggerSelector);

    if (!triggers.length) {
      throw new Error("Aucun élément déclencheur trouvé pour la lightbox.");
    }

    logEvent(
      "info",
      `Nombre d'éléments déclencheurs trouvés : ${triggers.length}.`,
      {
        selector: triggerSelector,
      },
    );

    // === Ajout des gestionnaires d'événements ===
    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => {
        logEvent("info", `Élément déclencheur cliqué, index : ${index}.`, {
          media: mediaArray[index],
        });

        // Ouvre la lightbox à l'index correspondant
        initLightbox(index, mediaArray); // Passez l'index et le tableau des médias
      });
    });

    logEvent(
      "success",
      "Gestionnaires d'événements ajoutés avec succès pour la lightbox.",
    );
  } catch (error) {
    logEvent(
      "error",
      `Erreur lors de l'ajout des gestionnaires : ${error.message}`,
      {
        triggerSelector,
        mediaArray,
      },
    );
  }
}

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

/*================================================================*/
/*             Gestion des interactions clavier                  */
/*================================================================*/

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    // Gestion des modales ouvertes
    const activeModal = document.querySelector(".modal.modal-active");
    if (activeModal) {
      trapFocus(activeModal);
    }
  } else if (e.key === "Escape") {
    // Fermer la modale ou la lightbox
    const activeModal = document.querySelector(".modal.modal-active");
    if (activeModal) {
      closeModal(); // Fonction pour fermer la modale
    }

    const activeLightbox = document.querySelector(
      ".lightbox[aria-hidden='false']",
    );
    if (activeLightbox) {
      closeLightbox(); // Fonction pour fermer la lightbox
    }
  }
});
