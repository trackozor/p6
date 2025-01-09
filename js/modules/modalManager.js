// ========================================================
// Nom du fichier : modal.manager.js
// Description    : Gestion de la modale dans l'application Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.1.1
// ========================================================

/*==============================================*/
/*              Imports                        */
/*=============================================*/
import { logEvent } from '../utils/utils.js';
import { CONFIGLOG } from "../modules/constants.js";
import domSelectors from '../modules/domSelectors.js';

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
 * Étapes principales :
 * 1. Vérifie l'existence des éléments DOM requis.
 * 2. Ajoute la classe CSS pour afficher la modale.
 * 3. Désactive le défilement de la page en arrière-plan.
 * 4. Met à jour l'état global de la modale (`modalOpen`).
 * 5. Journalise chaque étape pour le suivi.
 * 
 * @returns {void}
 */
export function launchModal() {
    try {
        logEvent('info', 'Tentative d\'ouverture de la modale...');

        // Étape 1 : Vérifie l'existence des éléments DOM requis
        if (!domSelectors.modal.contactOverlay || !domSelectors.modal.contactModal) {
            throw new Error("Les éléments DOM de la modale sont introuvables.");
        }

        // Étape 2 : Ajoute la classe pour afficher la modale
        domSelectors.modal.contactOverlay.classList.add(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
        domSelectors.modal.contactModal.classList.add(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
        logEvent('success', 'Modale affichée avec succès.', {
            overlayState: domSelectors.modal.contactOverlay.classList.value,
            modalState: domSelectors.modal.contactModal.classList.value,
        });

        // Étape 3 : Désactive le défilement de l'arrière-plan
        document.body.classList.add(CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('success', 'Défilement de l\'arrière-plan désactivé.', {
            bodyClasses: document.body.classList.value,
        });

        // Étape 4 : Met à jour l'état global
        modalOpen = true;
        logEvent('info', 'État global mis à jour à "ouvert".', { modalOpen });

    } catch (error) {
        // Étape 5 : Gestion des erreurs
        logEvent('error', 'Erreur lors de l\'ouverture de la modale.', { error: error.message });
    }
}

/*==============================================*/
/*              Fermeture modale                */
/*=============================================*/

/**
 * Ferme la modale et réactive le défilement de la page.
 * 
 * Étapes principales :
 * 1. Vérifie si la modale est active.
 * 2. Supprime les classes CSS utilisées pour afficher la modale.
 * 3. Réactive le défilement de la page.
 * 4. Met à jour l'état global de la modale (`modalOpen`).
 * 5. Journalise chaque étape pour le suivi.
 * 
 * @returns {void}
 */
export function closeModal() {
    try {
        logEvent('info', 'Tentative de fermeture de la modale...');

        // Étape 1 : Vérifie si la modale est active
        if (!modalOpen || !domSelectors.modal.contactModal.classList.contains(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'Tentative de fermeture d\'une modale déjà fermée ou état incohérent.', {
                modalOpen,
                modalState: domSelectors.modal.contactModal.classList.value,
            });
            return;
        }

        // Étape 2 : Supprime les classes pour masquer la modale
        domSelectors.modal.contactOverlay.classList.remove(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
        domSelectors.modal.contactModal.classList.remove(CONFIGLOG.CSS_CLASSES.MODAL_ACTIVE);
        logEvent('success', 'Modale masquée avec succès.', {
            overlayState: domSelectors.modal.contactOverlay.classList.value,
            modalState: domSelectors.modal.contactModal.classList.value,
        });

        // Étape 3 : Réactive le défilement de la page
        document.body.classList.remove(CONFIGLOG.CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('success', 'Défilement de l\'arrière-plan réactivé.', {
            bodyClasses: document.body.classList.value,
        });

        // Étape 4 : Met à jour l'état global
        modalOpen = false;
        logEvent('info', 'État global mis à jour à "fermé".', { modalOpen });

    } catch (error) {
        // Étape 5 : Gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale.', { error: error.message });
    }
}
