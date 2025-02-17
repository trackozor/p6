/**
 * =============================================================================
 * Nom du fichier : keyboard-manager.js
 * Description    : Gère les interactions clavier globales pour la navigation,
 *                  les modales, la lightbox et les actions interactives.
 * Auteur         : Trackozor
 * Date           : 10/02/2025
 * Version        : 2.5.0 (Correction gestion des flèches + lecture vidéo)
 * =============================================================================
 */

import { logEvent } from "../utils/utils.js";
import { closeModal } from "../components/modal/modalManager.js";
import {
    closeLightbox,
    showNextMedia,
    showPreviousMedia,
} from "../components/lightbox/lightbox.js";
import { KEY_CODES } from "../config/constants.js";
import { handleGalleryNavigation } from "./eventHandler.js";    
/** =============================================================================
 *                      PROTECTION ANTI-SPAM CLAVIER
 * ============================================================================= */

/** 
 * Indique si une touche est temporairement bloquée pour éviter le spam.
 * Empêche la répétition excessive des touches en appliquant un délai.
 * @type {boolean} 
 */
let isKeyBlocked = false;

/** 
 * Stocke l'identifiant du timeout en cours pour gérer le déblocage.
 * @type {number | null} 
 */
let keyBlockTimeout = null;

/** 
 * Délai (en millisecondes) avant d'autoriser à nouveau une entrée clavier.
 * @constant {number}
 */
const KEY_BLOCK_DELAY = 300;

/**
 * =============================================================================
 * Fonction : blockKeyInput
 * =============================================================================
 * Empêche temporairement la répétition excessive des touches clavier.
 *
 * - Vérifie si un blocage est déjà actif pour éviter des appels superflus.
 * - Réinitialise tout timeout actif pour éviter des délais empilés.
 * - Utilise `setTimeout` pour appliquer un délai avant réactivation des entrées.
 * - Ajoute une journalisation détaillée pour assurer le suivi de l'exécution.
 *
 * @throws {Error} Capture et log toute erreur critique dans la gestion du blocage.
 */
function blockKeyInput() {
    try {
        // Vérifie si une touche est déjà bloquée afin d'éviter un double blocage inutile.
        if (isKeyBlocked) {
            logEvent("debug", "blockKeyInput : Blocage déjà actif, aucune action supplémentaire.");
            return;
        }

        // Active le blocage des entrées clavier.
        isKeyBlocked = true;
        logEvent("info", `blockKeyInput : Entrées clavier bloquées pour ${KEY_BLOCK_DELAY}ms.`);

        // Si un timeout de déblocage est déjà en cours, le réinitialiser.
        if (keyBlockTimeout) {
            clearTimeout(keyBlockTimeout);
            logEvent("debug", "blockKeyInput : Timeout précédent annulé et réinitialisé.");
        }

        // Déclenche un déblocage après l'expiration du délai défini.
        keyBlockTimeout = setTimeout(() => {
            isKeyBlocked = false;
            keyBlockTimeout = null;
            logEvent("info", "blockKeyInput : Entrées clavier débloquées.");
        }, KEY_BLOCK_DELAY);
        
    } catch (error) {
        // Capture toute erreur inattendue et logue une alerte critique.
        logEvent("error", "blockKeyInput : Erreur lors de la gestion du blocage clavier.", { error });

        // Relance l'erreur pour permettre une gestion plus globale en amont si nécessaire.
        throw new Error(`Erreur critique dans blockKeyInput : ${error.message}`);
    }
}


/** =============================================================================
 *                      GESTION DES ÉVÉNEMENTS CLAVIER
 * ============================================================================= */

/**
 * Gère les événements clavier globaux et applique les actions correspondantes.
 *
 * - `Tab` et `Shift + Tab` : Maintien du focus dans une modale active.
 * - `Escape` : Ferme les modales et la lightbox.
 * - `Flèche gauche/droite` : Navigation dans la lightbox.
 * - `Espace` :
 *    - Active un bouton (like, modal...).
 *    - Met en pause ou joue un média (vidéo).
 * - `Entrée` : Activation d’un élément interactif.
 *
 * @param {KeyboardEvent} event - Événement clavier détecté.
 * @throws {Error} Capture et logue toute erreur durant la gestion des touches.
 */

export function handleKeyboardEvent(event) {
    try {
        if (!event || !event.key) {
            throw new Error("Événement clavier invalide ou non défini.");
        }

        logEvent("debug", `handleKeyboardEvent : Touche détectée : ${event.key}`);

        // Vérifie si la lightbox est ouverte
        const activeLightbox = document.querySelector(".lightbox[aria-hidden='false']");
        const focusedElement = document.activeElement;

        // Gestion de `Escape` pour fermer la lightbox
        if (event.key === "Escape" && activeLightbox) {
            logEvent("info", "handleKeyboardEvent : Fermeture de la lightbox via Escape.");
            closeLightbox();
            return;
        }

        // Vérifie si une modale est active (Empêche navigation si c'est le cas)
        const activeModal = document.querySelector(".modal.modal-active");
        if (activeModal) {
            logEvent("warn", "handleKeyboardEvent : Modale active, désactivation de la navigation.");
            return;
        }

        // Correction du sélecteur pour la galerie
        let mediaGallery = document.querySelector("#media-container");  
        if (!mediaGallery) {
            logEvent("warn", "handleKeyboardEvent : Élément #media-container introuvable. Navigation désactivée.");
            return;
        }

        const mediaItems = Array.from(mediaGallery.querySelectorAll(".media-item"));
        const activeMedia = document.querySelector(".media-item.selected") || mediaItems[0];

        let currentIndex = mediaItems.findIndex(item => item === activeMedia);
        if (currentIndex === -1) {
            currentIndex = 0;  
        }

        const isVideo = activeMedia.querySelector("video");

        // Correction : `Enter` doit ouvrir la lightbox avec le bon index
        if ((event.key === "Enter" || event.key === " ") && !activeLightbox) {
            logEvent("info", `handleKeyboardEvent : Ouverture de la lightbox via ${event.key} sur l'index ${currentIndex}.`);

            // Vérification que `mediaList` et `globalFolderName` existent
            if (!window.mediaList || !window.globalFolderName) {
                logEvent("error", "handleKeyboardEvent : `mediaList` ou `globalFolderName` est invalide.");
                return;
            }

            // **⚠ On s'assure que l'index respecte le tri !**
            const sortedIndex = sorted ? sorted.findIndex(item => item.id === mediaList[currentIndex].id) : currentIndex;

            openLightbox(sortedIndex, window.mediaList, window.globalFolderName);
            event.preventDefault(); //  Empêche le comportement par défaut

            return;
        }

        // Dans la lightbox : contrôle vidéo avec `Espace` et `Flèches`**
        if (activeLightbox && isVideo) {
            if (event.key === " ") {
                logEvent("info", "handleKeyboardEvent : Lecture/Pause vidéo.");
                if (isVideo.paused) {
                    isVideo.play();
                    logEvent("success", "Vidéo en lecture.");
                } else {
                    isVideo.pause();
                    logEvent("success", "Vidéo en pause.");
                }
                event.preventDefault(); 
                return;
            }

            if (event.key === "ArrowRight") {
                isVideo.currentTime += 10;
                logEvent("info", "Avance rapide de 10 secondes.");
                return;
            }

            if (event.key === "ArrowLeft") {
                isVideo.currentTime -= 10;
                logEvent("info", "Retour arrière de 10 secondes.");
                return;
            }
        }

        // **Navigation dans la galerie si pas de lightbox active**
        if (!activeLightbox) {
            switch (event.key) {
                case "ArrowLeft":
                case "ArrowRight":
                    handleGalleryNavigation(event, "horizontal");
                    break;
                case "ArrowUp":
                case "ArrowDown":
                    handleGalleryNavigation(event, "vertical");
                    break;
                default:
                    logEvent("warn", `handleKeyboardEvent : Touche ${event.key} ignorée.`);
            }
        }

    } catch (error) {
        logEvent("error", `handleKeyboardEvent : Erreur critique : ${error.message}`, { error });
    }
}

// ⚡ Ajout de l'écouteur d'événements clavier au document
document.addEventListener("keydown", handleKeyboardEvent);
logEvent("success", "Gestionnaire de navigation clavier activé pour la galerie.");




/** =============================================================================
 *                      GESTION DES TOUCHES SPÉCIFIQUES
 * ============================================================================= */

/**
 * =============================================================================
 * Fonction : handleTabKey
 * =============================================================================
 * Gère la navigation au clavier avec `Tab` et `Shift + Tab` dans une modale active.
 *
 * - Empêche le focus de sortir de la modale si elle est active.
 * - Identifie les éléments interactifs (`input`, `button`, `a`, `textarea`, etc.).
 * - Gère correctement `Shift + Tab` pour naviguer en arrière.
 * - Logue chaque étape pour faciliter le débogage.
 *
 * @param {KeyboardEvent} event - Événement clavier détecté.
 * @param {HTMLElement|null} activeModal - Élément actif de la modale.
 */
export function handleTabKey(event, activeModal) {
    try {
        if (!activeModal) {
            logEvent("debug", "handleTabKey : Aucun focus trap nécessaire (pas de modale active).");
            return;
        }

        logEvent("info", "handleTabKey : Activation du focus trap dans la modale.");

        // Sélectionner TOUS les éléments interactifs, mais exclure ceux qui sont désactivés
        const focusableElements = Array.from(activeModal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));

        if (focusableElements.length === 0) {
            logEvent("warn", "handleTabKey : Aucun élément interactif trouvé dans la modale.");
            return;
        }

        const focusedElement = document.activeElement;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // **Gestion de la navigation circulaire avec Tab**
        if (!event.shiftKey && focusedElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        } else if (event.shiftKey && focusedElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
        }
    } catch (error) {
        logEvent("error", "handleTabKey : Erreur lors de la gestion du focus trap.", { error });
        throw new Error(`Erreur critique dans handleTabKey : ${error.message}`);
    }
}

// **Ajout de l'écouteur global des événements clavier**
document.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
        const activeModal = document.querySelector(".modal.modal-active");
        if (activeModal) {
            handleTabKey(event, activeModal);
        }
    }
});





/** =============================================================================
 *                          GESTION DE LA TOUCHE ESCAPE
 * ============================================================================= */

/**
 * =============================================================================
 * Fonction : handleEscapeKey
 * =============================================================================
 * Gère la fermeture des modales et de la lightbox lorsqu'on appuie sur `Escape`.
 *
 * - Ferme la modale si elle est active (`.modal.modal-active`).
 * - Ferme la lightbox si elle est ouverte (`.lightbox[aria-hidden='false']`).
 * - Priorise la fermeture de la modale si plusieurs éléments sont actifs.
 * - Logue chaque étape pour assurer un suivi précis des actions exécutées.
 *
 * @param {HTMLElement|null} activeModal - Élément actif de la modale.
 * @param {HTMLElement|null} activeLightbox - Élément actif de la lightbox.
 */
export function handleEscapeKey(activeModal, activeLightbox) {
    try {
        logEvent("info", "handleEscapeKey : Touche Escape détectée.");

        // Vérification de l'état des modales et de la lightbox
        const isModalActive = !!activeModal;
        const isLightboxActive = !!activeLightbox;

        logEvent("debug", "handleEscapeKey : Vérification des éléments actifs.", {
            isModalActive,
            isLightboxActive,
        });

        // Priorité 1 : Fermeture d'une modale active
        if (isModalActive) {
            logEvent("success", "handleEscapeKey : Fermeture de la modale en cours...");
            closeModal();
            return;
        }

        // Priorité 2 : Fermeture de la lightbox si aucune modale active
        if (isLightboxActive) {
            logEvent("success", "handleEscapeKey : Fermeture de la lightbox en cours...");
            closeLightbox();
            return;
        }

        // Aucun élément actif à fermer
        logEvent("warn", "handleEscapeKey : Aucune modale ou lightbox active à fermer.");
        
    } catch (error) {
        logEvent("error", "handleEscapeKey : Erreur lors de la gestion de la touche Escape.", { error });
        throw new Error(`Erreur critique dans handleEscapeKey : ${error.message}`);
    }
}


/** =============================================================================
 *                  GESTION DE LA NAVIGATION DANS LA LIGHTBOX
 * ============================================================================= */

/**
 * =============================================================================
 * Fonction : handleLightboxNavigation
 * =============================================================================
 * Gère la navigation entre les médias dans la lightbox avec `Flèche gauche/droite`.
 *
 * - Vérifie si un élément `<video>` est en focus pour empêcher la navigation.
 * - Permet uniquement la navigation si un élément autre qu'une vidéo est sélectionné.
 * - Prévient les comportements par défaut non souhaités sur certains navigateurs.
 * - Logue chaque action pour assurer un suivi détaillé.
 *
 * @param {KeyboardEvent} event - Événement clavier détecté.
 * @param {HTMLElement|null} focusedElement - Élément actuellement en focus.
 */
export function handleLightboxNavigation(event, focusedElement) {
    try {
        logEvent("info", `handleLightboxNavigation : Touche ${event.key} détectée.`);

        // Vérifier si l'élément focalisé est une vidéo en lecture
        if (focusedElement && focusedElement.tagName === "VIDEO") {
            logEvent("warn", "handleLightboxNavigation : Navigation bloquée, une vidéo est active.");
            event.preventDefault(); // Empêche la navigation involontaire
            return;
        }

        // Gestion de la navigation entre les médias (sans interaction avec les vidéos)
        if (event.key === KEY_CODES.ARROW_LEFT) {
            logEvent("info", "handleLightboxNavigation : Passage au média précédent.");
            showPreviousMedia();
        } else if (event.key === KEY_CODES.ARROW_RIGHT) {
            logEvent("info", "handleLightboxNavigation : Passage au média suivant.");
            showNextMedia();
        } else {
            logEvent("warn", `handleLightboxNavigation : Touche ${event.key} ignorée.`);
        }

    } catch (error) {
        logEvent("error", "handleLightboxNavigation : Erreur lors de la gestion de la navigation.", { error });
        throw new Error(`Erreur critique dans handleLightboxNavigation : ${error.message}`);
    }
}

/** =============================================================================
 *                      GESTION DE L’ACTIVATION DES ÉLÉMENTS
 * ============================================================================= */

/**
 * =============================================================================
 * Fonction : handleActivationKey
 * =============================================================================
 * Gère l’activation d’un élément interactif (`Espace` et `Entrée`).
 *
 * - `Espace` sur une vidéo → Lecture/Pause.
 * - `Espace` sur un bouton `.like-icon` → Simule un clic.
 * - `Entrée` → Activation générale.
 * - Ajoute une gestion avancée des erreurs et des logs détaillés.
 *
 * @param {KeyboardEvent} event - Événement clavier détecté.
 * @param {HTMLElement|null} focusedElement - Élément actuellement en focus.
 */
function handleActivationKey(event, focusedElement) {
    try {
        // Vérification : si aucun élément n'est ciblé, on sort de la fonction
        if (!focusedElement) {
            logEvent("warn", "handleActivationKey : Aucun élément focalisé pour activation.");
            return;
        }

        logEvent("info", `handleActivationKey : Touche ${event.key} détectée sur ${focusedElement.tagName}.`);

        /* ---------------------------------------------- */
        /*        Activation des boutons de like         */
        /* ---------------------------------------------- */
        if (focusedElement.classList.contains("like-icon") && event.key === KEY_CODES.SPACE) {
            logEvent("info", "handleActivationKey : Activation d'un bouton de like via Espace.");
            focusedElement.click();
            event.preventDefault(); // Empêche le scroll lors de l’appui sur Espace
            return;
        }

        /* ---------------------------------------------- */
        /*        Gestion de la lecture/pause vidéo      */
        /* ---------------------------------------------- */
        if (focusedElement.tagName === "VIDEO" && event.key === KEY_CODES.SPACE) {
            logEvent("info", "handleActivationKey : Lecture/Pause d'une vidéo via Espace.");
            
            if (focusedElement.paused) {
                focusedElement.play().then(() => {
                    logEvent("success", "handleActivationKey : Vidéo lancée avec succès.");
                }).catch(error => {
                    logEvent("error", "handleActivationKey : Impossible de lire la vidéo.", { error });
                });
            } else {
                focusedElement.pause();
                logEvent("success", "handleActivationKey : Vidéo mise en pause.");
            }
            
            event.preventDefault(); // Empêche le comportement par défaut de l'espace (scroll)
            return;
        }

        /* ---------------------------------------------- */
        /*          Activation générale des éléments     */
        /* ---------------------------------------------- */
        if (event.key === KEY_CODES.ENTER) {
            logEvent("info", `handleActivationKey : Activation de l'élément ${focusedElement.tagName} via Entrée.`);
            focusedElement.click();
            logEvent("success", "handleActivationKey : Élément activé avec succès.");
            return;
        }

        /* ---------------------------------------------- */
        /*         Cas non gérés (Touche ignorée)        */
        /* ---------------------------------------------- */
        logEvent("warn", `handleActivationKey : Touche ${event.key} détectée mais non prise en charge.`);

    } catch (error) {
        logEvent("error", "handleActivationKey : Erreur lors de la gestion de l'activation.", { error });
        throw new Error(`Erreur critique dans handleActivationKey : ${error.message}`);
    }
}


/** =============================================================================
 *                      ENREGISTREMENT DES ÉVÉNEMENTS CLAVIER
 * ============================================================================= */
// Active la navigation clavier uniquement après le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    const mediaGallery = document.querySelector("#media-container");

    if (!mediaGallery) {
        logEvent("warn", "Gestionnaire clavier désactivé : #media-container est introuvable.");
        return;
    }

    document.addEventListener("keydown", handleKeyboardEvent);
    logEvent("success", " Gestionnaire de navigation clavier activé pour la galerie.");
});

