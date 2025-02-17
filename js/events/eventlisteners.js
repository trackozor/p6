// ========================================================
// Fichier : eventListeners.js
// Description : Gestion centralisée des événements pour la modale,
//               la lightbox et le tri des médias dans l'application.
// Auteur : Trackozor
// Date : 08/01/2025
// Version : 3.1 (Optimisation, tests et refactorisation complète)
// ========================================================

/*==============================================*/
/*                   IMPORTS                    */
/*==============================================*/

// Sélecteurs DOM
import domSelectors from "../config/domSelectors.js";

// Gestionnaires d'événements
import {
    handleModalOpen, 
    handleModalClose,
    handleFormSubmit,
    handleLightboxClose,
    handleLightboxPrev,
    handleLightboxNext,
    handleLightboxOpen,
    handleSortChange,
    handleModalConfirm,
    handleLikeClick,
} from "./eventHandler.js";

// Gestion des interactions clavier
import { handleKeyboardEvent } from "./keyboardHandler.js"

// Utilitaire de logs
import { logEvent } from "../utils/utils.js";



/*=======================================================*/
// UTILITAIRE : ATTACHER DES ÉVÉNEMENTS DE MANIÈRE SÉCURISÉE
/*=======================================================*/

/**
 * =============================================================================
 * Fonction : attachEvent
 * =============================================================================
 * Attache un événement à un ou plusieurs éléments de manière sécurisée.
 *
 * - Supporte un seul élément ou une liste de nœuds (`NodeList` ou `HTMLElement`).
 * - Convertit un `NodeList` en tableau pour itération sécurisée.
 * - Gère les erreurs d'attachement et capture les exceptions dans le callback.
 * - Permet l'exécution unique d'un événement via `{ once }`.
 * - Fournit des logs détaillés pour le suivi des événements attachés.
 *
 * @param {NodeList|HTMLElement} elements - Élément(s) cible(s) pour l'événement.
 * @param {string} eventType - Type d'événement à écouter (ex: "click").
 * @param {Function} callback - Fonction à exécuter lors de l'événement.
 * @param {boolean} [once=false] - Si `true`, l'événement ne s'exécute qu'une seule fois.
 * @returns {boolean} - Retourne `true` si au moins un événement a été attaché, `false` sinon.
 */
export function attachEvent(elements, eventType, callback, once = false) {
    try {
        // Vérification des paramètres
        if (!elements) {
            logEvent("error", `attachEvent : Aucun élément trouvé pour l'événement "${eventType}".`);
            return false;
        }
        if (typeof eventType !== "string" || !eventType.trim()) {
            logEvent("error", `attachEvent : Type d'événement invalide "${eventType}".`);
            return false;
        }
        if (typeof callback !== "function") {
            logEvent("error", `attachEvent : Callback fourni invalide pour l'événement "${eventType}".`);
            return false;
        }

        // Normalisation de `elements` en tableau pour itération sécurisée
        const elementList = elements instanceof NodeList ? Array.from(elements) : [elements];

        // Vérification : au moins un élément valide
        if (!elementList.length) {
            logEvent("warn", `attachEvent : Aucun élément valide pour attacher l'événement "${eventType}".`);
            return false;
        }

        // Itération sur les éléments valides
        elementList.forEach((element) => {
            if (!(element instanceof HTMLElement)) {
                logEvent("warn", `attachEvent : Élément ignoré car non valide.`, { element });
                return;
            }

            try {
                // Attachement de l'événement avec gestion asynchrone sécurisée
                element.addEventListener(eventType, async (event) => {
                    try {
                        await callback(event);
                        logEvent("info", `attachEvent : Callback exécuté avec succès pour "${eventType}".`);
                    } catch (callbackError) {
                        logEvent("error", `attachEvent : Erreur dans le callback de "${eventType}".`, { callbackError });
                    }
                }, { once });

                logEvent("success", `attachEvent : Événement "${eventType}" attaché à ${element.className || element.id || "un élément inconnu"}.`);

            } catch (error) {
                logEvent("error", `attachEvent : Impossible d'attacher l'événement "${eventType}" à un élément valide.`, { error });
            }
        });

        return true;

    } catch (error) {
        logEvent("error", "attachEvent : Erreur inattendue lors de l'attachement des événements.", { error });
        return false;
    }
}

/*=======================================================*/
// INITIALISATION DES ÉVÉNEMENTS
/*=======================================================*/

/**
 * =============================================================================
 * Fonction : initModal
 * =============================================================================
 * Initialise la modale de contact et assure la gestion des événements associés.
 *
 * - Vérifie que les éléments DOM de la modale existent avant d’attacher les événements.
 * - Attache les événements nécessaires pour ouvrir et fermer la modale.
 * - Active un **MutationObserver** si le bouton de contact n'est pas immédiatement disponible.
 * - Capture les erreurs potentielles et assure la robustesse du processus.
 */
export function initModal() {
    try {
        logEvent("info", "➡ Initialisation de la modale de contact...");

        // Vérification immédiate de la présence du bouton de contact
        const contactButton = document.querySelector(".contact-button");

        if (contactButton) {
            logEvent("info", " Bouton de contact trouvé immédiatement.");
            attachModalEvents(); // Attache directement les événements si le bouton est présent
        } else {
            logEvent("warning", " Bouton de contact non trouvé. Activation de l'observation DOM...");
            observeDOMForContactButton(); // Lance un observateur pour détecter son apparition
        }

    } catch (error) {
        logEvent("error", " initModal : Erreur lors de l'initialisation de la modale.", { error });
        throw new Error(`Erreur critique dans initModal : ${error.message}`);
    }
}



/**
 * =============================================================================
 * Fonction : attachModalEvents
 * =============================================================================
 * Attache tous les événements nécessaires pour gérer la modale de contact.
 *
 * - Gère l'ouverture et la fermeture de la modale.
 * - Vérifie l'existence des éléments DOM avant d'attacher les événements.
 * - Ajoute un mécanisme pour éviter les attachements multiples.
 * - Capture les entrées utilisateur dans les champs du formulaire.
 * - Gère la soumission du formulaire et les modales associées.
 *
 * @throws {Error} Enregistre et remonte toute erreur critique dans les logs.
 */
export function attachModalEvents() {
    try {
        logEvent("info", "Attachement des événements de la modale...");

        // Récupération dynamique du bouton de contact
        const contactButton = document.querySelector(".contact-button");

        if (!contactButton) {
            logEvent("error", "Bouton de contact introuvable.");
            return;
        }

        // Empêche l'attachement multiple
        if (!contactButton.dataset.eventAttached) {
            contactButton.dataset.eventAttached = "true";
            contactButton.addEventListener("click", () => {
                logEvent("info", "Clic sur le bouton Contact.");
                handleModalOpen();
            });
            logEvent("success", "Événement attaché au bouton Contact.");
        }

        // Récupération des éléments principaux de la modale
        const { modalOverlay, contactForm, closeButton, form, confirmationModal, spamModal } = domSelectors.modal;

        if (!modalOverlay || !contactForm || !closeButton || !form) {
            logEvent("error", "Certains éléments de la modale sont introuvables.");
            return;
        }

        // Attachement des événements de fermeture de la modale
        attachEvent(closeButton, "click", handleModalClose);
        attachEvent(modalOverlay, "click", handleModalClose);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                logEvent("info", "Touche Échap détectée, fermeture de la modale.");
                handleModalClose();
            }
        });

        // Attachement des événements au formulaire de contact
        if (form) {
            // Bouton d'envoi du formulaire
            if (form.submitButton && !form.submitButton.dataset.eventAttached) {
                form.submitButton.dataset.eventAttached = "true";
                attachEvent(form.submitButton, "click", (event) => {
                    event.preventDefault();
                    logEvent("info", "Formulaire soumis.");
                    handleFormSubmit();
                });
                logEvent("success", "Événement attaché au bouton d'envoi du formulaire.");
            }

            // Gestion des champs du formulaire avec logs de saisie
            const formFields = [
                { element: form.firstName, logMessage: "Saisie du prénom." },
                { element: form.lastName, logMessage: "Saisie du nom." },
                { element: form.email, logMessage: "Saisie de l'email." },
                { element: form.messageField, logMessage: "Saisie du message." },
            ];

            formFields.forEach(({ element, logMessage }) => {
                if (element && !element.dataset.eventAttached) {
                    element.dataset.eventAttached = "true";
                    attachEvent(element, "input", () => logEvent("info", logMessage));
                }
            });
        }

        // Gestion de la confirmation après soumission du formulaire
        if (confirmationModal?.confirmButton) {
            attachEvent(confirmationModal.confirmButton, "click", handleModalClose);
        }

        // Gestion de la modale de détection de spam
        if (spamModal?.closeButton) {
            attachEvent(spamModal.closeButton, "click", handleModalClose);
        }

        logEvent("success", "Tous les événements de la modale sont attachés avec succès.");
    
    } catch (error) {
        logEvent("error", "Une erreur est survenue lors de l'attachement des événements de la modale.", { error });
        throw new Error(`Erreur critique dans attachModalEvents : ${error.message}`);
    }
}

/**
 * =============================================================================
 * Fonction : observeDOMForContactButton
 * =============================================================================
 * Surveille le DOM pour détecter l'apparition dynamique du bouton de contact.
 *
 * - Utilise un **MutationObserver** pour surveiller les changements dans le `document.body`.
 * - Attache les événements de la modale dès que le bouton est détecté.
 * - Déconnecte l'observation après la première détection pour éviter les écoutes inutiles.
 * - Capture et logue toute erreur pouvant survenir.
 *
 * @throws {Error} Enregistre toute erreur critique lors de l'observation du DOM.
 */
function observeDOMForContactButton() {
    try {
        logEvent("info", "Initialisation de l'observation du DOM pour le bouton de contact...");

        // Création de l'observateur
        const observer = new MutationObserver((mutations, obs) => {
            try {
                // Recherche du bouton de contact dans le DOM
                const button = document.querySelector(".contact-button");

                if (button) {
                    logEvent("success", "Bouton de contact détecté par MutationObserver.");

                    // Attache les événements nécessaires à la modale
                    attachModalEvents();

                    // Arrête l'observation une fois que le bouton a été trouvé
                    obs.disconnect();
                    logEvent("info", "MutationObserver arrêté après détection du bouton.");
                }
            } catch (error) {
                logEvent("error", "Erreur lors de l'observation du DOM.", { error });
                obs.disconnect(); // Assure l'arrêt de l'observateur en cas d'erreur
                throw new Error(`Erreur critique dans observeDOMForContactButton : ${error.message}`);
            }
        });

        // Définition des paramètres d'observation
        observer.observe(document.body, {
            childList: true, // Surveille l'ajout/suppression d'éléments dans le body
            subtree: true, // Inclut tous les nœuds enfants
        });

        logEvent("info", "Observation du DOM activée pour détecter le bouton de contact.");

    } catch (error) {
        logEvent("error", "Échec de l'initialisation de l'observation du DOM.", { error });
        throw new Error(`Erreur critique lors du lancement de observeDOMForContactButton : ${error.message}`);
    }
}

/**
 * =============================================================================
 * Fonction : initModalConfirm
 * =============================================================================
 * Initialise l'événement de confirmation pour la modale.
 *
 * - Vérifie si le bouton de confirmation est présent dans le DOM.
 * - Attache un événement `click` pour gérer la validation.
 * - Capture et logue toute erreur pouvant survenir.
 * - Évite les attachements multiples en vérifiant les événements déjà liés.
 *
 * @throws {Error} Enregistre toute erreur critique lors de l'initialisation.
 */
export function initModalConfirm() {
    try {
        logEvent("info", "Initialisation de l'événement de confirmation...");

        // Sélectionne le bouton de confirmation dans le DOM
        const confirmButton = document.querySelector(".confirm-btn");

        // Vérification de l'existence du bouton
        if (!confirmButton) {
            logEvent("error", "Bouton de confirmation introuvable.");
            throw new Error("Le bouton de confirmation n'a pas été trouvé dans le DOM.");
        }

        // Empêche l'attachement multiple de l'événement
        if (confirmButton.dataset.eventAttached) {
            logEvent("warn", "L'événement de confirmation est déjà attaché.");
            return;
        }

        // Marque le bouton pour éviter les attachements multiples
        confirmButton.dataset.eventAttached = "true";

        // Attache l'événement "click" au bouton de confirmation
        attachEvent(confirmButton, "click", handleModalConfirm);

        logEvent("success", "Événement de confirmation attaché avec succès.");

    } catch (error) {
        logEvent("error", `Erreur critique dans initModalConfirm : ${error.message}`);
        throw new Error(`Erreur lors de l'initialisation de la confirmation : ${error.message}`);
    }
}



/** =============================================================================
 * Fonction : setupContactFormEvents
 * =============================================================================
 * Initialise et gère les événements du formulaire de contact.
 *
 * - Surveille l'entrée utilisateur dans le champ "message".
 * - Met à jour dynamiquement le compteur de caractères en temps réel.
 * - Empêche le dépassement de la limite de caractères définie.
 * - Vérifie la présence des éléments requis avant d'attacher les événements.
 * - Capture et logue toute erreur pouvant survenir.
 *
 * @throws {Error} Si un élément requis est introuvable dans le DOM.
 */
export function setupContactFormEvents() {
    try {
        logEvent("info", "Initialisation des événements du formulaire de contact...");

        // Récupération sécurisée de l'élément du champ message
        const { messageField, charCounter } = domSelectors.modal.form;

        // Vérification de l'existence du champ "message"
        if (!messageField) {
            logEvent("error", "Champ 'message' introuvable. Vérifiez la structure du DOM.");
            throw new Error("Le champ 'message' est introuvable dans le DOM.");
        }

        // Vérification de l'existence du compteur de caractères
        if (!charCounter) {
            logEvent("warn", "Compteur de caractères introuvable. La mise à jour dynamique sera désactivée.");
        }

        // Empêche l'attachement multiple de l'événement
        if (messageField.dataset.eventAttached) {
            logEvent("warn", "L'événement 'input' sur le champ message est déjà attaché.");
            return;
        }

        // Marque l'élément comme ayant un événement déjà attaché
        messageField.dataset.eventAttached = "true";

        // Attache un événement "input" au champ "message" pour suivre la saisie en temps réel
        attachEvent(messageField, "input", (event) => updateCharCount(event, charCounter));

        logEvent("success", "Événement 'input' attaché au champ message avec succès.");

    } catch (error) {
        logEvent("error", `Erreur dans setupContactFormEvents : ${error.message}`);
        throw new Error(`Erreur lors de l'initialisation du formulaire de contact : ${error.message}`);
    }
}


/** =============================================================================
 * Fonction : initLightboxEvents
 * =============================================================================
 * Initialise et gère les événements pour la lightbox (affichage des médias en plein écran).
 *
 * - Vérifie la validité des paramètres (`mediaArray`, `folderName`).
 * - Attache un événement "click" à chaque élément `.media` pour ouvrir la lightbox.
 * - Gère les événements de navigation (suivant/précédent) et de fermeture.
 * - Capture et logue les erreurs en cas de données invalides ou d'éléments manquants.
 *
 * @param {Array} mediaArray - Liste des médias disponibles.
 * @param {string} folderName - Nom du dossier contenant les médias.
 * @throws {Error} En cas d'incohérence des paramètres ou d'éléments DOM introuvables.
 */
export function initLightboxEvents(mediaArray, folderName) {
    try {
        logEvent("info", "Initialisation des événements pour la lightbox...");

        // Vérification des paramètres avant exécution
        validateLightboxParams(mediaArray, folderName);

        // Sélection des éléments de la galerie
        const galleryItems = document.querySelectorAll(".media");
        if (!galleryItems.length) {
            throw new Error("Aucun élément '.media' trouvé dans la galerie.");
        }

        // Attache l'événement "click" pour chaque média de la galerie
        galleryItems.forEach((item) => {
            attachEvent(item, "click", (event) => handleLightboxOpen(event, mediaArray, folderName));
        });

        // Gestion des boutons de navigation et de fermeture
        attachLightboxControls();
         // Attacher l'événement de fermeture au clic sur l'overlay
        

        logEvent("success", "Événements de la lightbox initialisés avec succès.");
    } catch (error) {
        logEvent("error", `Erreur dans initLightboxEvents : ${error.message}`);
    }
}

/** =============================================================================
 * Fonction : validateLightboxParams
 * =============================================================================
 * Vérifie la validité des paramètres `mediaArray` et `folderName` avant 
 * d'initialiser la lightbox.
 *
 * - S'assure que `mediaArray` est un tableau non vide.
 * - Vérifie que `folderName` est une chaîne valide.
 * - Capture et logue les erreurs en cas d'incohérence des paramètres.
 *
 * @param {Array} mediaArray - Liste des médias disponibles.
 * @param {string} folderName - Nom du dossier contenant les médias.
 * @throws {Error} Si un des paramètres est invalide.
 */
function validateLightboxParams(mediaArray, folderName) {
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
        logEvent("error", "Liste des médias invalide ou vide.");
        throw new Error("La liste des médias est vide ou non valide.");
    }

    if (typeof folderName !== "string" || folderName.trim() === "") {
        logEvent("error", "Nom du dossier invalide.");
        throw new Error("Le nom du dossier est vide ou invalide.");
    }

    logEvent("success", "Paramètres de la lightbox validés.");
}

/** =============================================================================
 * Fonction : attachLightboxControls
 * =============================================================================
 * Attache les événements de fermeture et de navigation à la lightbox.
 *
 * - Associe "click" aux boutons Suivant / Précédent et Fermeture.
 * - Capture les erreurs si un élément DOM est manquant.
 * - Logue l'attachement réussi des événements.
 *
 * @throws {Error} Si un bouton de la lightbox est introuvable.
 */
export function attachLightboxControls() {
    logEvent("debug", "Vérification de l'existence des boutons avant attachement.");

    const prevButton = document.querySelector(".lightbox-prev");
    const nextButton = document.querySelector(".lightbox-next");
    const closeButton = document.querySelector(".lightbox-close");

    if (!prevButton || !nextButton || !closeButton) {
        logEvent("error", "Un ou plusieurs boutons de contrôle de la lightbox sont introuvables.", {
            prevButton,
            nextButton,
            closeButton
        });
        return; // Stoppe l'attachement des événements si les boutons n'existent pas
    }

    logEvent("success", "Boutons détectés, attachement des événements en cours.");

    prevButton.addEventListener("click", handleLightboxPrev);
    nextButton.addEventListener("click", handleLightboxNext);
    closeButton.addEventListener("click", handleLightboxClose);
}

/**=======================================================
//    4.tri
/*=======================================================

* =============================================================================
 * Fonction : initSortingEvents
 * =============================================================================
 * Initialise et gère les événements liés au tri des médias.
 *
 * - Vérifie que l'élément de tri est bien présent dans le DOM avant attachement.
 * - Attache un événement "change" pour trier dynamiquement les médias.
 * - Capture et logue les erreurs en cas d'élément introuvable ou d'échec.
 *
 * @throws {Error} Si l'élément du tri est introuvable ou mal défini.
 */
function initSortingEvents() {
    try {
        logEvent("info", "Initialisation des événements pour le tri des médias...");

        // Vérification et récupération de l'élément de tri
        const sortOptions = validateSortingElement();

        // Attache l'événement "change" pour déclencher le tri lors d'une sélection
        attachEvent(sortOptions, "change", handleSortChange);

        logEvent("success", "Événements pour le tri des médias initialisés avec succès.");
    } catch (error) {
        logEvent("error", `Erreur dans initSortingEvents : ${error.message}`);
    }
}

/** =============================================================================
 * Fonction : validateSortingElement
 * =============================================================================
 * Vérifie l'existence et la validité de l'élément de tri avant de l'utiliser.
 *
 * - Récupère l'élément de tri depuis `domSelectors.sorting`.
 * - Vérifie que l'élément est bien défini et présent dans le DOM.
 * - Capture et logue une erreur en cas d'élément introuvable.
 *
 * @returns {HTMLElement} Élément `<select>` de tri.
 * @throws {Error} Si l'élément de tri est introuvable ou non valide.
 */
function validateSortingElement() {
    try {
        const { sortOptions } = domSelectors.sorting;

        if (!sortOptions || !(sortOptions instanceof HTMLSelectElement)) {
            throw new Error("Élément de tri des médias introuvable ou invalide.");
        }

        logEvent("success", "Élément de tri validé avec succès.");
        return sortOptions;
    } catch (error) {
        logEvent("error", `Erreur dans validateSortingElement : ${error.message}`);
        throw error;
    }
}


/**
 * =============================================================================
 * Fonction : setupEventListeners
 * =============================================================================
 * Initialise les écouteurs d'événements pour les interactions de likes.
 *
 * - Vérifie la présence des icônes de like avant d’attacher les événements.
 * - Utilise un `MutationObserver` si les médias ne sont pas encore chargés.
 * - Attache les événements de clic sur chaque icône de like.
 * - Associe dynamiquement le compteur total des likes à chaque interaction.
 *
 * @throws {Error} Si une erreur critique survient lors de l'initialisation.
 */
export async function setupEventListeners() {
    try {
        logEvent("info", "Début de l'initialisation des événements de like...");

        // Pause pour garantir le chargement des éléments du DOM
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Sélection des éléments
        const likeIcons = validateLikeIcons();
        const totalLikesElement = validateTotalLikesElement();

        logEvent("success", `${likeIcons.length} icônes de like détectées. Attachement des événements...`);

        // Attachement des événements de like
        attachLikeEvents(likeIcons, totalLikesElement);

        logEvent("success", "Événements de like initialisés avec succès.");
    } catch (error) {
        logEvent("error", `Erreur critique dans setupEventListeners : ${error.message}`, { error });
    }
}

/** =============================================================================
 * Fonction : validateLikeIcons
 * =============================================================================
 * Vérifie et retourne la liste des icônes de like disponibles.
 *
 * - Vérifie que les éléments `.like-icon` existent et sont bien chargés.
 * - Active un `MutationObserver` si les icônes ne sont pas encore présentes.
 * - Retourne la liste des icônes si elles sont disponibles.
 *
 * @returns {NodeListOf<Element>} Liste des icônes de like.
 * @throws {Error} Si aucun élément n'est trouvé après tentative de chargement.
 */
function validateLikeIcons() {
    const likeIcons = document.querySelectorAll(".media-item .like-icon");

    if (!likeIcons.length) {
        logEvent("warn", "Aucune icône de like trouvée. Activation de l'observation DOM...");
        waitForLikesToBeLoaded();
        throw new Error("Les icônes de like ne sont pas encore chargées.");
    }

    return likeIcons;
}

/** =============================================================================
 * Fonction : validateTotalLikesElement
 * =============================================================================
 * Vérifie et retourne l'élément du DOM affichant le nombre total de likes.
 *
 * - Vérifie que l'élément `#total-likes` est bien présent dans le DOM.
 *
 * @returns {HTMLElement} Élément affichant le total des likes.
 * @throws {Error} Si l'élément `#total-likes` est introuvable.
 */
function validateTotalLikesElement() {
    const totalLikesElement = document.querySelector("#total-likes");

    if (!totalLikesElement) {
        logEvent("error", "L'élément affichant le total des likes (#total-likes) est introuvable.");
        throw new Error("Impossible de trouver l'élément `#total-likes`.");
    }

    return totalLikesElement;
}

/** =============================================================================
 * Fonction : attachLikeEvents
 * =============================================================================
 * Attache les événements de clic aux icônes de like.
 *
 * - Incrémente ou décrémente le compteur de likes localement.
 * - Met à jour dynamiquement le compteur total des likes.
 *
 * @param {NodeListOf<Element>} likeIcons - Liste des icônes de like.
 * @param {HTMLElement} totalLikesElement - Élément affichant le total des likes.
 */
function attachLikeEvents(likeIcons, totalLikesElement) {
    likeIcons.forEach((icon) => {
        icon.addEventListener("click", (event) => handleLikeClick(event, totalLikesElement));
    });

    logEvent("success", "Événements de like attachés à chaque icône.");
}


/**
 * Attend dynamiquement que les médias et icônes de like soient chargés avant d'attacher les événements.
 */
function waitForLikesToBeLoaded() {
        let attempts = 0;
        const maxAttempts = 10; // Arrêter après 10 tentatives pour éviter une boucle infinie

    const observer = new MutationObserver((mutations, obs) => {
    const likeIcons = document.querySelectorAll(".media-item .like-icon");

    if (likeIcons.length) {
        logEvent("info", `Les icônes de like sont maintenant disponibles (${likeIcons.length} trouvées). Initialisation...`);

        setTimeout(() => {
            setupEventListeners(); // Relancer l'initialisation des événements après un petit délai
        }, 200); // On laisse le temps au DOM de finaliser son chargement

        obs.disconnect(); // Arrête l'observation une fois les éléments trouvés
        } else {
        attempts++;
        if (attempts >= maxAttempts) {
            logEvent("error", " Les icônes de like ne sont pas apparues après plusieurs tentatives.");
            obs.disconnect();
        }
        }
    });

     // Surveille les modifications dans #gallery
    const gallery = document.querySelector("#gallery");
    if (gallery) {
        observer.observe(gallery, { childList: true, subtree: true });
    } else {
        logEvent("error", " Le conteneur #gallery est introuvable. Impossible d'observer les ajouts.");
    }
}


/**
 * =============================================================================
 * Fonction : initKeyboardEvents
 * =============================================================================
 * Initialise la gestion des interactions clavier pour la navigation et l'accessibilité.
 *
 * - Écoute les événements `keydown` pour gérer :
 *   - La navigation au clavier dans la galerie et la lightbox.
 *   - Le focus management dans les modales (`Tab` et `Shift+Tab`).
 *   - L'activation des boutons et liens avec `Entrée` et `Espace`.
 *   - La fermeture des modales et de la lightbox avec `Échap`.
 *
 * - Vérifie que l'événement n'est pas déjà attaché pour éviter les doublons.
 * - Capture les erreurs et les journalise pour une meilleure traçabilité.
 *
 * @throws {Error} Si une erreur survient lors de l'attachement de l'événement.
 */
function initKeyboardEvents() {
    try {
        logEvent("info", "Initialisation des événements clavier...");

        // Vérifie si l'événement est déjà attaché pour éviter les doublons
        if (document.__keyboardEventsAttached) {
            logEvent("warn", "Les événements clavier sont déjà attachés. Aucune action requise.");
            return;
        }

        // Attache l'événement `keydown` pour capturer les interactions clavier
        document.addEventListener("keydown", handleKeyboardEvent);

        // Marqueur interne pour éviter les attachements multiples
        document.__keyboardEventsAttached = true;

        logEvent("success", "Écoute des événements clavier activée avec succès.");
    } catch (error) {
        logEvent("error", `Erreur critique dans initKeyboardEvents : ${error.message}`, { error });
    }
}


/*=======================================================*/
// INITIALISATION GLOBALE DES ÉVÉNEMENTS
/*=======================================================*/

/**
 * =============================================================================
 * Fonction : initEventListeners
 * =============================================================================
 * Initialise l’ensemble des événements nécessaires au bon fonctionnement de l’application.
 *
 * - Attache les événements critiques en vérifiant leur présence avant exécution.
 * - Gère :
 *   - L'initialisation des likes et interactions associées.
 *   - La configuration des modales de confirmation et du formulaire de contact.
 *   - La gestion de la lightbox et de la galerie.
 *   - L’activation des événements de tri des médias.
 *   - La prise en charge des interactions clavier pour l’accessibilité.
 * - Capture et journalise les erreurs pour un suivi détaillé.
 *
 * @param {Array} mediaArray - Liste des médias disponibles.
 * @param {string} folderName - Nom du dossier contenant les médias.
 * @throws {Error} Si une erreur survient lors de l’attachement des événements.
 */
export function initEventListeners(mediaArray, folderName) {
    logEvent("info", "Début de l'initialisation globale des événements...");

    try { 
        // Initialisation des événements critiques
        setupEventListeners();             // Gère les événements de like
        initModalConfirm();                // Gère l'événement de confirmation de la modale
        setupContactFormEvents();          // Attache les événements du formulaire de contact
        initLightboxEvents(mediaArray, folderName); // Initialise la lightbox et ses interactions
        initSortingEvents();               // Configure les événements de tri des médias
        initKeyboardEvents();              // Active la gestion des interactions clavier

        logEvent("success", "Tous les événements ont été initialisés avec succès.");
    } catch (error) {
        logEvent("error", "Erreur critique lors de l'initialisation des événements.", { error });
    }

    logEvent("info", "Fin de l'initialisation globale des événements.");
}

