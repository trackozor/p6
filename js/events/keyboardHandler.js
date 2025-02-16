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
import { trapFocus } from "../utils/accessibility.js";
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
        // Vérifie si l'événement est valide et empêche le spam de touches
        if (!event.key || isKeyBlocked) {
            return;
        }

        // Active le blocage temporaire des touches répétées
        blockKeyInput();
        
        // Logue la touche détectée pour le débogage
        logEvent("debug", "Événement clavier détecté.", { keyPressed: event.key });

        // Récupère les éléments actifs pouvant être affectés par l'événement clavier
        const activeModal = document.querySelector(".modal.modal-active"); // Modale active
        const activeLightbox = document.querySelector(".lightbox[aria-hidden='false']"); // Lightbox active
        const focusedElement = document.activeElement; // Élément actuellement focalisé

        // Logue les éléments actifs pour diagnostic
        logEvent("info", "Vérification des éléments actifs.", {
            activeModal: !!activeModal, // Booléen indiquant si une modale est ouverte
            activeLightbox: !!activeLightbox, // Booléen indiquant si la lightbox est ouverte
            focusedElement: focusedElement?.tagName || "Aucun", // Nom de l'élément actuellement en focus
        });

        // Utilisation d'un `switch` pour traiter les différentes touches détectées
        switch (event.key) {
            // Gère la touche `Tab` pour maintenir le focus dans une modale
            case KEY_CODES.TAB:
                handleTabKey(event, activeModal);
                break;

            // Gère la touche `Escape` pour fermer la modale ou la lightbox
            case KEY_CODES.ESCAPE:
                handleEscapeKey(activeModal, activeLightbox);
                break;

            // Gère `Entrée` et `Espace` pour activer un bouton ou contrôler un média
            case KEY_CODES.ENTER:
            case KEY_CODES.SPACE:
                handleActivationKey(event, focusedElement);
                break;

            // Gère la navigation avec `Flèche gauche` et `Flèche droite` dans la lightbox
            
            case KEY_CODES.ARROW_LEFT:
            case KEY_CODES.ARROW_RIGHT:
                if (activeLightbox) {
                    handleLightboxNavigation(event, focusedElement); // Navigation dans la lightbox
                } else if (mediaGallery) {
                    handleGalleryNavigation(event, "horizontal"); // Navigation horizontale dans la galerie
                }
                break;

            case KEY_CODES.ARROW_UP:
            case KEY_CODES.ARROW_DOWN:
                if (!activeLightbox && mediaGallery) {
                    handleGalleryNavigation(event, "vertical"); // Navigation verticale dans la galerie
                }
                break;

            // Capture les touches non gérées et logue un avertissement
            default:
                logEvent("warn", `Touche ${event.key} détectée mais non prise en charge.`);
        }
    } catch (error) {
        // Logue toute erreur imprévue lors du traitement des événements clavier
        logEvent("error", "handleKeyboardEvent : Erreur critique lors de la gestion clavier.", { error });

        // Relance une erreur pour la capturer en amont si nécessaire
        throw new Error(`Erreur dans handleKeyboardEvent : ${error.message}`);
    }
}

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
function handleTabKey(event, activeModal) {
    try {
        // Vérifie si une modale est active. Sinon, ne fait rien.
        if (!activeModal) {
            logEvent("debug", "handleTabKey : Aucun focus trap nécessaire (pas de modale active).");
            return;
        }

        logEvent("info", "handleTabKey : Focus trap activé dans la modale.");

        // Sélectionne tous les éléments interactifs pouvant recevoir le focus.
        const focusableElements = activeModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Convertir en tableau pour faciliter la manipulation.
        const focusable = Array.from(focusableElements);
        
        if (focusable.length === 0) {
            logEvent("warn", "handleTabKey : Aucun élément interactif trouvé dans la modale.");
            return;
        }

        // Détermine l'élément actuellement focalisé.
        const focusedElement = document.activeElement;
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        // Gestion du `Shift + Tab` (Navigation arrière)
        if (event.shiftKey && focusedElement === firstElement) {
            logEvent("info", "handleTabKey : Shift + Tab détecté, retour au dernier élément.");
            lastElement.focus();
            event.preventDefault();
            return;
        }

        // Gestion du `Tab` normal (Navigation avant)
        if (!event.shiftKey && focusedElement === lastElement) {
            logEvent("info", "handleTabKey : Tab détecté, retour au premier élément.");
            firstElement.focus();
            event.preventDefault();
            return;
        }

        // Si l'élément focalisé est en dehors de la modale, repositionne sur le premier élément.
        if (!focusable.includes(focusedElement)) {
            logEvent("warn", "handleTabKey : Focus échappé, repositionnement sur le premier élément.");
            firstElement.focus();
            event.preventDefault();
        }

    } catch (error) {
        logEvent("error", "handleTabKey : Erreur lors du focus trap.", { error });
        throw new Error(`Erreur critique dans handleTabKey : ${error.message}`);
    }
}


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

document.addEventListener("keydown", handleKeyboardEvent);
logEvent("success", "Gestionnaire d'événements clavier initialisé.");
