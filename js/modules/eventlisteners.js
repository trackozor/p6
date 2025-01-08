// ========================================================
// Nom du fichier : eventListener.js
// Description    : Gestion centralisée des événements
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.2.0
// ========================================================

import domSelectors from './domSelectors.js';
import { openModal, closeModal } from './modules/modalManager.js';
import { logEvent } from '../utils/utils.js';

/**
 * Attache un gestionnaire d'événement à un élément DOM.
 * @param {HTMLElement} selector - Élément DOM cible.
 * @param {string} eventType - Type d'événement (e.g., 'click').
 * @param {Function} callback - Fonction de rappel.
 * @param {string} logMessage - Message à enregistrer dans les logs.
 */
function attachEvent(selector, eventType, callback, logMessage = '') {
    if (!selector) {
        logEvent('warn', `Élément DOM introuvable pour l'événement ${eventType}`);
        return;
    }
    selector.addEventListener(eventType, (event) => {
        logEvent('info', `Début de l'événement ${eventType} : ${logMessage}`);
        callback(event);
        logEvent('info', `Fin de l'événement ${eventType} : ${logMessage}`);
    });
}

/**
 * Attache les gestionnaires pour la modale de contact.
 */
function initModalEvents() {
    logEvent('info', "Initialisation des événements pour la modale...");
    attachEvent(
        domSelectors.modal.contactOpenButton,
        'click',
        openModal,
        "Ouverture de la modale de contact"
    );
    attachEvent(
        domSelectors.modal.contactCloseButton,
        'click',
        closeModal,
        "Fermeture de la modale de contact"
    );
    logEvent('success', "Événements pour la modale initialisés avec succès.");
}

/**
 * Attache les gestionnaires pour la lightbox.
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
        // Logique de navigation précédente
    }, "Navigation précédente dans la lightbox");

    attachEvent(lightboxNextButton, 'click', () => {
        logEvent('info', "Navigation vers l'image suivante dans la lightbox...");
        // Logique de navigation suivante
    }, "Navigation suivante dans la lightbox");

    logEvent('success', "Événements pour la lightbox initialisés avec succès.");
}

/**
 * Attache les gestionnaires pour le tri des médias.
 */
function initSortingEvents() {
    logEvent('info', "Initialisation des événements pour le tri des médias...");
    attachEvent(domSelectors.sorting.sortOptions, 'change', (event) => {
        const selectedOption = event.target.value;
        logEvent('info', `Option de tri sélectionnée : ${selectedOption}`);
        // Implémentez ici la logique pour trier les médias
        logEvent('success', `Tri effectué selon l'option : ${selectedOption}`);
    }, "Modification de l'option de tri");
    logEvent('success', "Événements pour le tri des médias initialisés avec succès.");
}

/**
 * Initialise tous les événements de la page.
 */
function initEventListeners() {
    logEvent('info', "Début de l'initialisation des gestionnaires d'événements...");
    initModalEvents();
    initLightboxEvents();
    initSortingEvents();
    logEvent('success', "Gestionnaires d'événements initialisés avec succès.");
}

// Export de la fonction principale
export default initEventListeners;
