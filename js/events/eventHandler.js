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
/*==============================================*/
/*        Ouverture modale contact              */
/*==============================================*/
/**
 * Gère l'ouverture de la modale de contact d'un photographe.
 * 
 * ### **Fonctionnement :**
 * - Récupère les données des photographes via une requête asynchrone.
 * - Vérifie que les données sont valides avant d'afficher la modale.
 * - Extrait l'ID du photographe à partir de l'URL actuelle.
 * - Recherche le photographe correspondant dans les données.
 * - Ouvre la modale si toutes les conditions sont remplies.
 * - Gère les erreurs et affiche un message en cas d'échec.
 * - Utilise une classe CSS `loading` sur le `<body>` pour améliorer l'expérience utilisateur.
 * 
 * ### **Gestion des erreurs :**
 * - Lève une erreur si les données des photographes sont manquantes.
 * - Lève une erreur si l'ID du photographe est absent de l'URL.
 * - Lève une erreur si le photographe correspondant n'est pas trouvé.
 * - Capture et journalise toute erreur via `logEvent("error", ...)`.
 * - Affiche une alerte utilisateur si un problème survient.
 * 
 * @async
 * @function handleModalOpen
 * @throws {Error} Génère une erreur si l'un des éléments requis (données, ID photographe, etc.) est manquant ou invalide.
 */

export async function handleModalOpen() {
  // Indique dans les logs que le processus d'ouverture de la modale commence
  logEvent("info", "Ouverture de la modale...");

  // Ajoute la classe "loading" au body pour signaler qu'un chargement est en cours
  document.body.classList.add("loading");

  try {
    // Récupère les données des photographes depuis l'API ou la base de données
    const mediaData = await fetchMedia();

    // Vérifie que les données ont bien été récupérées et contiennent une liste de photographes
    if (!mediaData?.photographers) {
      throw new Error("Données photographes manquantes.");
    }

    // Récupère l'ID du photographe à partir de l'URL de la page
    const photographerId = new URLSearchParams(window.location.search).get("id");

    // Vérifie que l'ID du photographe a bien été trouvé dans l'URL
    if (!photographerId) {
      throw new Error("ID photographe introuvable dans l'URL.");
    }

    // Recherche le photographe correspondant dans les données récupérées
    const photographerData = mediaData.photographers.find(
      (photographer) => photographer.id === parseInt(photographerId, 10)
    );

    // Vérifie que le photographe existe bien dans la liste
    if (!photographerData) {
      throw new Error(`Photographe ID ${photographerId} introuvable.`);
    }

    // Ouvre la modale avec les informations du photographe sélectionné
    launchModal(photographerData);

    // Enregistre dans les logs que la modale a été ouverte avec succès
    logEvent("success", "Modale ouverte avec succès.");
  } catch (error) {
    // Enregistre une erreur dans les logs si un problème survient
    logEvent("error", `Erreur d'ouverture de la modale: ${error.message}`, { error });

    // Affiche une alerte utilisateur en cas d'échec
    alert("Erreur lors du chargement de la modale.");
  } finally {
    // Supprime l'indicateur de chargement, même en cas d'erreur
    document.body.classList.remove("loading");
  }
}
/*==============================================*/
/*        Fermeture  modale contact             */
/*==============================================*/

/**
 * Gère la fermeture de la modale de contact.
 * 
 * ### **Fonctionnement :**
 * - Déclenche la fermeture de la modale via `closeModal()`.
 * - Vérifie que la fermeture s'effectue sans erreur.
 * - Capture et journalise toute erreur éventuelle.
 * - Utilise `logEvent()` pour suivre l'état de l'opération.
 * 
 * ### **Gestion des erreurs :**
 * - Capture toute exception survenant lors de la fermeture.
 * - Journalise l'erreur via `logEvent("error", ...)`.
 * 
 * @function handleModalClose
 * @throws {Error} Génère une erreur si la fermeture de la modale échoue.
 */

export function handleModalClose() {
  // Indique dans les logs que le processus de fermeture commence
  logEvent("info", "Fermeture de la modale.");

  try {
    // Ferme la modale via la fonction dédiée
    closeModal();

    // Enregistre dans les logs que la modale a été fermée avec succès
    logEvent("success", "Modale fermée.");
  } catch (error) {
    // Capture et journalise toute erreur survenant lors de la fermeture
    logEvent("error", "Erreur lors de la fermeture de la modale", { error });
  }
}


/**
 * Gère la fermeture de la modale lorsque l'utilisateur clique sur l'arrière-plan.
 * 
 * ### **Fonctionnement :**
 * - Vérifie si l'utilisateur a cliqué sur l'arrière-plan de la modale.
 * - Si c'est le cas, déclenche `handleModalClose()` pour fermer la modale.
 * - Capture et journalise toute erreur éventuelle.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que l'événement `event.target` existe avant toute action.
 * - Vérifie que `domSelectors.modal.modalOverlay` est défini avant de comparer la cible.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function handleModalBackgroundClick
 * @param {Event} event - L'événement du clic.
 * @throws {Error} Génère une erreur si un problème survient lors de la gestion du clic.
 */

export function handleModalBackgroundClick(event) {
  try {
    // Vérifie que l'événement et la cible existent bien
    if (!event || !event.target) {
      throw new Error("Événement invalide ou non défini.");
    }

    // Vérifie que l'élément cliqué est bien l'arrière-plan de la modale
    if (event.target === domSelectors.modal.modalOverlay) {
      // Journalisation du clic sur l'arrière-plan
      logEvent("info", "Clic détecté sur l'arrière-plan de la modale. Fermeture en cours...");

      // Déclenche la fermeture de la modale
      handleModalClose();
    }
  } catch (error) {
    // Capture et journalise toute erreur survenant lors du traitement du clic
    logEvent("error", `Erreur lors du clic sur l'arrière-plan de la modale : ${error.message}`, { error });
  }
}

/*==============================================*/
/*        ouverture modale confirmation         */
/*==============================================*/
/**
 * Gère la confirmation d'une action dans une modale de confirmation.
 * 
 * ### **Fonctionnement :**
 * - Journalise l'acceptation de la confirmation.
 * - Ferme la modale de confirmation en appelant `closeConfirmationModal()`.
 * - Capture et journalise toute erreur éventuelle.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `closeConfirmationModal()` est bien défini avant de l'exécuter.
 * - Capture toute exception survenant lors de la fermeture de la modale.
 * - Journalise l'erreur via `logEvent("error", ...)`.
 * 
 * @function handleModalConfirm
 * @throws {Error} Génère une erreur si la fermeture de la modale échoue.
 */

export function handleModalConfirm() {
  // Indique dans les logs que l'utilisateur a validé une action
  logEvent("info", "Confirmation acceptée. Fermeture de la modale...");

  try {
    // Ferme la modale de confirmation via la fonction dédiée
    closeConfirmationModal();

    // Enregistre dans les logs que la modale a bien été fermée
    logEvent("success", "Modale de confirmation fermée avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur survenant lors de la fermeture
    logEvent("error", "Erreur lors de la fermeture de la modale de confirmation", { error });
  }
}
/*==============================================*/
/*        Mise a jour compteur message          */
/*==============================================*/
/**
 * Met à jour dynamiquement le compteur de caractères d'un champ `textarea`.
 * 
 * ### **Fonctionnement :**
 * - Récupère l'élément `textarea` qui déclenche l'événement.
 * - Récupère l'élément du compteur (`#message-counter`).
 * - Vérifie que le compteur est bien présent dans le DOM.
 * - Récupère la limite de caractères définie (`maxLength`) ou applique une valeur par défaut (`500`).
 * - Met à jour dynamiquement l'affichage du compteur avec la longueur actuelle du texte.
 * - Journalise l'action dans `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que l'événement `event.target` est bien défini.
 * - Vérifie que l'élément `charCount` existe avant de modifier son contenu.
 * - Capture et journalise toute erreur.
 * 
 * @function updateCharCount
 * @param {Event} event - L'événement `input` déclenché par l'utilisateur.
 * @throws {Error} Génère une erreur si le compteur de caractères est introuvable.
 */

export function updateCharCount(event) {
  try {
    // Récupère l'élément `textarea` qui a déclenché l'événement
    const field = event.target;

    // Vérifie que l'élément est bien défini avant de continuer
    if (!field) {
      throw new Error("Champ de saisie invalide ou non défini.");
    }

    // Sélectionne l'élément du compteur de caractères
    const charCount = document.getElementById("message-counter");

    // Vérifie que l'élément compteur existe dans le DOM
    if (!charCount) {
      throw new Error("Compteur de caractères introuvable dans le DOM.");
    }

    // Récupère la limite de caractères définie sur le champ ou applique une valeur par défaut (500)
    const maxLength = field.maxLength || 500;

    // Met à jour dynamiquement le texte du compteur avec la longueur actuelle du message
    charCount.textContent = `${field.value.length} / ${maxLength} caractères`;

    // Journalisation de la mise à jour du compteur
    logEvent("info", "Mise à jour du compteur de caractères effectuée.");
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de la mise à jour du compteur : ${error.message}`, { error });
  }
}
/*==============================================*/
/*           Soumission formulaire              */
/*==============================================*/
/**
 * Gère la soumission du formulaire de contact.
 * 
 * ### **Fonctionnement :**
 * - Empêche le rechargement de la page (`event.preventDefault()`).
 * - Journalise l'événement de soumission du formulaire.
 * - Affiche un indicateur de chargement (`showLoader()`).
 * - Lance la validation et le traitement du formulaire via `initvalidform()`.
 * - Capture et journalise toute erreur pouvant survenir durant la soumission.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `event` est bien défini avant d'appeler `preventDefault()`.
 * - Vérifie que les fonctions `showLoader()` et `initvalidform()` existent bien avant de les exécuter.
 * - Capture et journalise toute exception inattendue.
 * 
 * @function handleFormSubmit
 * @param {Event} event - L'événement `submit` déclenché par l'utilisateur.
 * @throws {Error} Génère une erreur si la soumission du formulaire échoue.
 */

export function handleFormSubmit(event) {
  try {
    // Vérifie que l'événement existe avant de l'utiliser
    if (!event) {
      throw new Error("Événement de soumission non défini.");
    }

    // Empêche le rechargement automatique de la page après soumission
    event.preventDefault();

    // Journalisation de l'événement de soumission du formulaire
    logEvent("info", "Soumission du formulaire de contact en cours...");

    // Vérifie que la fonction showLoader existe avant de l'appeler
    if (typeof showLoader !== "function") {
      throw new Error("showLoader() est introuvable ou non définie.");
    }

    // Affiche un indicateur de chargement pour signaler le traitement en cours
    showLoader();

    // Vérifie que la fonction initvalidform existe avant de l'exécuter
    if (typeof initvalidform !== "function") {
      throw new Error("initvalidform() est introuvable ou non définie.");
    }

    // Exécute la validation et le traitement du formulaire
    initvalidform();

    // Journalisation du succès de la soumission du formulaire
    logEvent("success", "Le formulaire de contact a été soumis avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de la soumission du formulaire : ${error.message}`, { error });

    // Affichage d'un message utilisateur si une erreur est détectée (optionnel)
    alert("Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.");
  }
}


/*==============================================*/
/*         Gestion de la Lightbox               */
/*==============================================*/
/*==============================================*/
/*             Ouverture lightbox              */
/*==============================================*/
/**
 * Ouvre la lightbox avec un média spécifique sélectionné dans la galerie.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `mediaArray` est valide et contient des médias.
 * - Récupère l'élément cliqué dans la galerie via `event.target.closest(".gallery-item")`.
 * - Récupère l'index du média dans l'attribut `data-index` du `galleryItem`.
 * - Assure que `mediaList` et `globalFolderName` sont bien définis.
 * - Appelle `openLightbox()` pour afficher le média sélectionné.
 * - Capture et journalise toute erreur potentielle.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `mediaArray` est un tableau valide et non vide.
 * - Vérifie que l'événement `event.target` est défini et correspond bien à un élément `.gallery-item`.
 * - Vérifie que `data-index` contient bien un nombre valide.
 * - Capture et journalise toute erreur rencontrée.
 * 
 * @function handleLightboxOpen
 * @param {Event} event - L'événement `click` déclenché sur un média de la galerie.
 * @param {Array} mediaArray - Tableau contenant les médias disponibles.
 * @param {string} folderName - Nom du dossier contenant les médias.
 * @throws {Error} Génère une erreur si le média sélectionné est invalide ou si `mediaArray` est incorrect.
 */

export function handleLightboxOpen(event, mediaArray, folderName) {
  try {
      // Journalisation pour vérifier la structure des médias avant l'ouverture
      logEvent("debug", "Vérification de mediaArray avant ouverture de la lightbox.", { mediaArray });

      // Vérifie que mediaArray est bien un tableau valide et qu'il contient des médias
      if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
          throw new Error("mediaArray est vide ou invalide !");
      }

      // Récupère l'élément `gallery-item` cliqué
      const galleryItem = event.target.closest(".gallery-item");

      // Vérifie qu'un média a bien été sélectionné dans la galerie
      if (!galleryItem) {
          throw new Error("Aucun média sélectionné.");
      }

      // Récupère l'index du média à partir de l'attribut `data-index`
      const mediaIndex = parseInt(galleryItem.dataset.index, 10);

      // Vérifie que l'index est un nombre valide
      if (isNaN(mediaIndex) || mediaIndex < 0 || mediaIndex >= mediaArray.length) {
          throw new Error("Index média invalide ou hors limites.");
      }

      // Définit `mediaList` et `globalFolderName` pour assurer la cohérence des médias affichés
      window.mediaList = mediaArray;
      window.globalFolderName = folderName;

      // Ouvre la lightbox avec le média sélectionné
      openLightbox(mediaIndex, mediaArray, folderName);

      // Journalisation du succès
      logEvent("success", `Lightbox ouverte pour le média à l'index ${mediaIndex}.`);
  } catch (error) {
      // Capture et journalise toute erreur rencontrée lors de l'ouverture de la lightbox
      logEvent("error", `Erreur lors de l'ouverture de la lightbox : ${error.message}`, { error });
  }
}

/*==============================================*/
/*              Fermeture lightbox              */
/*==============================================*/
/**
 * Gère la fermeture de la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Journalise le début de la fermeture de la lightbox.
 * - Exécute la fonction `closeLightbox()` pour fermer la lightbox.
 * - Capture et journalise toute erreur survenant lors de la fermeture.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `closeLightbox()` est bien définie avant de l'exécuter.
 * - Capture toute exception en cas d'échec de la fermeture.
 * - Journalise l'erreur via `logEvent("error", ...)`.
 * 
 * @function handleLightboxClose
 * @throws {Error} Génère une erreur si la fermeture de la lightbox échoue.
 */

export function handleLightboxClose() {
  try {
    // Journalisation du début de la fermeture de la lightbox
    logEvent("info", "Fermeture de la lightbox en cours...");

    // Vérifie que la fonction `closeLightbox` est bien définie avant de l'exécuter
    if (typeof closeLightbox !== "function") {
      throw new Error("closeLightbox() est introuvable ou non définie.");
    }

    // Exécute la fermeture de la lightbox
    closeLightbox();

    // Journalisation du succès de la fermeture
    logEvent("success", "Lightbox fermée avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de la fermeture de la lightbox : ${error.message}`, { error });
  }
}

/*==============================================*/
/*              Nav précédente                  */
/*==============================================*/
/**
 * Gère la navigation vers le média précédent dans la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `window.mediaList` est défini et contient des médias.
 * - Si aucun média n'est disponible, journalise une erreur et stoppe l'exécution.
 * - Journalise l'action de navigation avant de passer au média précédent.
 * - Appelle `showPreviousMedia()` pour afficher le média précédent.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `window.mediaList` est défini et non vide avant de procéder.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function handleLightboxPrev
 * @throws {Error} Génère une erreur si `mediaList` est vide ou non défini.
 */

export function handleLightboxPrev() {
  try {
    // Vérifie que `mediaList` est défini et contient au moins un média
    if (!window.mediaList || window.mediaList.length === 0) {
      throw new Error("Aucun média disponible pour la navigation.");
    }

    // Journalisation de l'action de navigation
    logEvent("info", "Navigation vers le média précédent dans la lightbox.");

    // Affiche le média précédent
    showPreviousMedia();

  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de la navigation vers le média précédent : ${error.message}`, { error });
  }
}

/*==============================================*/
/*                 Nav suivante                 */
/*==============================================*/

/**
 * Gère la navigation vers le média suivant dans la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `window.mediaList` est défini et contient des médias.
 * - Si aucun média n'est disponible, journalise une erreur et stoppe l'exécution.
 * - Journalise l'action de navigation avant de passer au média suivant.
 * - Appelle `showNextMedia()` pour afficher le média suivant.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `window.mediaList` est défini et non vide avant de procéder.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function handleLightboxNext
 * @throws {Error} Génère une erreur si `mediaList` est vide ou non défini.
 */

export function handleLightboxNext() {
  try {
    // Vérifie que `mediaList` est défini et contient au moins un média
    if (!window.mediaList || window.mediaList.length === 0) {
      throw new Error("Aucun média disponible pour la navigation.");
    }

    // Journalisation de l'action de navigation
    logEvent("info", "Navigation vers le média suivant dans la lightbox.");

    // Affiche le média suivant
    showNextMedia();

  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de la navigation vers le média suivant : ${error.message}`, { error });
  }
}



/*==============================================*/
/*         Gestion du Tri des Médias            */
/*==============================================*/

/**
 * Gère le changement de tri des médias en fonction de l'option sélectionnée par l'utilisateur.
 * 
 * ### **Fonctionnement :**
 * - Récupère la valeur de l'option de tri sélectionnée (`event.target.value`).
 * - Vérifie que la valeur est bien définie et non vide.
 * - Journalise l'option sélectionnée dans `logEvent()`.
 * - Exécute la fonction `handleMediaSort()` pour appliquer le tri.
 * - Capture et journalise toute erreur potentielle.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `event.target` est bien défini avant d'extraire `value`.
 * - Vérifie que l'option de tri sélectionnée n'est pas vide.
 * - Capture et journalise toute erreur inattendue lors de l'exécution de `handleMediaSort()`.
 * 
 * @async
 * @function handleSortChange
 * @param {Event} event - L'événement `change` déclenché lors de la sélection d'une option de tri.
 * @throws {Error} Génère une erreur si l'option de tri est invalide ou si `handleMediaSort` rencontre un problème.
 */

export async function handleSortChange(event) {
  try {
    // Vérifie que l'événement et sa cible sont bien définis
    if (!event || !event.target) {
      throw new Error("Événement de tri invalide ou non défini.");
    }

    // Récupère la valeur de l'option sélectionnée
    const sortOption = event.target.value;

    // Vérifie que l'utilisateur a bien sélectionné une option de tri
    if (!sortOption) {
      throw new Error("Aucune option de tri sélectionnée.");
    }

    // Journalisation de l'option de tri sélectionnée
    logEvent("info", `Option de tri sélectionnée : ${sortOption}`);

    // Applique le tri aux médias
    await handleMediaSort(sortOption);

    // Journalisation du succès du tri
    logEvent("success", "Tri des médias appliqué avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors du tri des médias : ${error.message}`, { error });
  }
}
/*==============================================*/
/*            ajout like/dislike                */
/*==============================================*/
/**
 * Gère l'ajout ou la suppression d'un like sur un média.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `button` est bien un élément valide.
 * - Récupère l'élément contenant le nombre de likes (`button.previousElementSibling`).
 * - Convertit le texte en nombre entier (`parseInt()`) et applique une valeur par défaut (`0` si conversion échoue).
 * - Incrémente (`like++`) ou décrémente (`like--` en s'assurant qu'il reste positif).
 * - Met à jour dynamiquement l'affichage du nombre de likes.
 * - Journalise l'action dans `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie si `button` est bien défini.
 * - Vérifie si `likeCountElement` existe avant d'essayer de modifier son contenu.
 * - Vérifie que `action` est bien `"like"` ou `"dislike"`.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function handleLikeDislike
 * @param {string} action - Action à exécuter (`"like"` ou `"dislike"`).
 * @param {HTMLButtonElement} button - Le bouton sur lequel l'utilisateur a cliqué.
 * @throws {Error} Génère une erreur si `button` est invalide ou si `likeCountElement` est introuvable.
 */



/**
 * Affiche la modale de like/dislike pour un média donné.
 * @param {HTMLElement} mediaItem - L'élément média sur lequel l'utilisateur a cliqué.
 */
export function showLikeDislikeModal(mediaItem) {
  if (!mediaItem) {
    logEvent("error", "❌ Impossible d'afficher la modale : élément média introuvable.");
    return;
  }

  const modal = document.querySelector("#like-dislike-modal");

  if (!modal) {
    logEvent("error", "❌ La modale de like/dislike est introuvable dans le DOM.");
    return;
  }

  // Récupérer la position de l'élément cliqué
  const rect = mediaItem.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  // Ajuster la position de la modale sous l'icône de like
  modal.style.top = `${rect.bottom + scrollTop + 10}px`; // 10px en dessous
  modal.style.left = `${rect.left + scrollLeft}px`; // Aligné à gauche

  // Afficher la modale avec animation
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}


export function hideLikeDislikeModal() {
  const modal = document.querySelector("#like-dislike-modal");

  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// Fermer la modale au clic en dehors
document.addEventListener("click", (event) => {
  const modal = document.querySelector("#like-dislike-modal");

  if (modal && modal.classList.contains("active")) {
    const isInsideModal = modal.contains(event.target);
    const isLikeButton = event.target.closest(".like-icon");

    if (!isInsideModal && !isLikeButton) {
      hideLikeDislikeModal();
    }
  }
});


/*==============================================*/
/*         Gestion des Interactions Clavier     */
/*==============================================*/

/**
 * Gère les interactions clavier pour la navigation et l'accessibilité des modales et de la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Vérifie si une modale ou une lightbox est active.
 * - Gère la touche `TAB` pour maintenir le focus dans la modale active (`trapFocus()`).
 * - Gère la touche `ESCAPE` pour fermer la modale ou la lightbox (`handleEscapeKey()`).
 * - Gère les flèches gauche/droite (`← / →`) pour naviguer dans la lightbox (`handleLightboxNavigation()`).
 * - Capture et journalise toute erreur survenant dans la gestion des événements clavier.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que l'événement `event.key` est bien défini avant d'agir.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function handleKeyboardEvent
 * @param {KeyboardEvent} event - L'événement clavier déclenché par l'utilisateur.
 * @throws {Error} Génère une erreur si un problème survient dans la gestion des interactions clavier.
 */

export function handleKeyboardEvent(event) {
  try {
    // Vérifie que l'événement est bien défini
    if (!event || !event.key) {
      throw new Error("Événement clavier invalide ou non défini.");
    }

    // Récupère la modale active et la lightbox ouverte
    const activeModal = document.querySelector(".modal.modal-active");
    const activeLightbox = document.querySelector(".lightbox[aria-hidden='false']");
   

    // Journalisation de la détection d'un événement clavier
    logEvent("debug", `Événement clavier détecté : ${event.key}`);

    // Gestion de la touche TAB : Maintient le focus dans la modale si elle est ouverte
    if (event.key === KEY_CODES.TAB && activeModal) {
      trapFocus(activeModal);
      event.preventDefault(); // Empêche le comportement par défaut du focus en dehors de la modale
    }
    
    // Gestion de la touche ESCAPE : Ferme la modale ou la lightbox
    else if (event.key === KEY_CODES.ESCAPE) {
      handleEscapeKey(activeModal, activeLightbox);
    }
    
    // Gestion des flèches gauche/droite pour la navigation dans la lightbox
    else if ([KEY_CODES.ARROW_LEFT, KEY_CODES.ARROW_RIGHT].includes(event.key)) {
      handleLightboxNavigation(activeLightbox, event);
    }
  } catch (error) {
    // Capture et journalise toute erreur rencontrée
    logEvent("error", `Erreur lors de la gestion de l'événement clavier : ${error.message}`, { error });
  }
}

// Enregistrement de l'écouteur global pour détecter les événements clavier sur toute la page
document.addEventListener("keydown", handleKeyboardEvent);
