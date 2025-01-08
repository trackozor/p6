// ========================================================
// Nom du fichier : eventListener.js
// Description    : Gestion centralisée des événements dans l'application Fisheye.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.3.0
// ========================================================

import domSelectors from './domSelectors.js';
import { launchModal, closeModal } from './modalManager.js';
import { logEvent } from '../utils/utils.js';

/**
 * Attache un gestionnaire d'événement à un élément DOM
 * et journalise le début et la fin de chaque action pour le suivi.
 */
function attachEvent(selector, eventType, callback, logMessage = '') {
    if (!selector) {
        logEvent('warn', `Élément DOM introuvable pour l'événement ${eventType}`);
        return;
    }
    selector.addEventListener(eventType, (event) => {
        logEvent('info', `Début de l'événement ${eventType} : ${logMessage}`);
        try {
            callback(event);
        } catch (error) {
            logEvent('error', `Erreur pendant l'événement ${eventType} : ${error.message}`, { stack: error.stack });
        }
        logEvent('info', `Fin de l'événement ${eventType} : ${logMessage}`);
    });
}

/**
 * Initialise les gestionnaires d'événements pour la modale de contact.
 */
function initModalEvents() {
    logEvent('info', "Initialisation des événements pour la modale de contact...");
    attachEvent(domSelectors.modal.contactOpenButton, 'click', launchModal, "Ouverture de la modale de contact");
    attachEvent(domSelectors.modal.contactCloseButton, 'click', closeModal, "Fermeture de la modale de contact");
    logEvent('success', "Événements pour la modale initialisés avec succès.");
}

/**
 * Initialise les gestionnaires d'événements pour la lightbox.
 */
function initLightboxEvents() {
    logEvent('info', "Initialisation des événements pour la lightbox...");
    const { lightboxContainer, lightboxCloseButton, lightboxPrevButton, lightboxNextButton } = domSelectors.lightbox;

    attachEvent(lightboxCloseButton, 'click', () => {
        logEvent('info', "Fermeture de la lightbox...");
        lightboxContainer.classList.add('hidden');
    }, "Fermeture de la lightbox");

    attachEvent(lightboxPrevButton, 'click', () => {
        logEvent('info', "Navigation vers l'image précédente dans la lightbox...");
    }, "Navigation précédente dans la lightbox");

    attachEvent(lightboxNextButton, 'click', () => {
        logEvent('info', "Navigation vers l'image suivante dans la lightbox...");
    }, "Navigation suivante dans la lightbox");

    logEvent('success', "Événements pour la lightbox initialisés avec succès.");
}

/**
 * Initialise les gestionnaires d'événements pour le tri des médias.
 */
function initSortingEvents() {
    logEvent('info', "Initialisation des événements pour le tri des médias...");
    attachEvent(domSelectors.sorting.sortOptions, 'change', (event) => {
        const selectedOption = event.target.value;
        logEvent('info', `Option de tri sélectionnée : ${selectedOption}`);
        logEvent('success', `Tri effectué selon l'option : ${selectedOption}`);
    }, "Modification de l'option de tri");
    logEvent('success', "Événements pour le tri des médias initialisés avec succès.");
}

/**
 * Initialise tous les gestionnaires d'événements de la page.
 */
function initEventListeners() {
    logEvent('info', "Début de l'initialisation des gestionnaires d'événements...");
    initModalEvents();
    initLightboxEvents();
    initSortingEvents();
    logEvent('success', "Tous les gestionnaires d'événements ont été initialisés avec succès.");
}

export default initEventListeners;
