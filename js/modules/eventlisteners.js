// ========================================================
// Nom du fichier : eventListener.js
// Description    : Gestion centralisée des événements dans l'application Fisheye.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.4.0
// ========================================================

import domSelectors from './domSelectors.js';
import { launchModal, closeModal } from './modalManager.js';
import { logEvent } from '../utils/utils.js';

/**
 * Attache un gestionnaire d'événement à un élément DOM, 
 * avec journalisation des étapes pour le suivi des actions.
 *
 * @param {HTMLElement} selector - Élément DOM auquel l'événement est attaché.
 * @param {string} eventType - Type de l'événement (e.g., 'click', 'change').
 * @param {Function} callback - Fonction à exécuter lorsque l'événement est déclenché.
 * @param {string} [logMessage=''] - Message descriptif à inclure dans les logs.
 */



function attachEvent(selector, eventType, callback, logMessage = '') {
    if (!selector) {
        logEvent('warn', `Élément DOM introuvable pour l'événement ${eventType}`);
        return;
    }
    selector.addEventListener(eventType, (event) => {
        logEvent('test-start', `Début de l'événement ${eventType} : ${logMessage}`);
        try {
            callback(event);
        } catch (error) {
            logEvent('error', `Erreur pendant l'événement ${eventType} : ${error.message}`, { stack: error.stack });
        }
        logEvent('test-end', `Fin de l'événement ${eventType} : ${logMessage}`);
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
 * Initialise les gestionnaires d'événements pour le tri des médias.
 * 
 * Cette fonction attache un événement "change" au menu déroulant de tri,
 * permettant de détecter et de gérer les modifications des options de tri.
 * Chaque action est journalisée pour suivre l'état des modifications et
 * garantir le bon fonctionnement du tri.
 * 
 * @example
 * // Exemple d'utilisation :
 * initSortingEvents();
 * 
 * @fires change - Lorsqu'une option de tri est sélectionnée.
 */
function initSortingEvents() {
    logEvent('info', "Initialisation des événements pour le tri des médias...");

    // Attacher l'événement au menu déroulant de tri des médias
    attachEvent(domSelectors.sorting.sortOptions, 'change', (event) => {
        logEvent('test-start', "Début du tri des médias...");
        
        try {
            const selectedOption = event.target.value; // Récupération de l'option sélectionnée
            logEvent('info', `Option de tri sélectionnée : ${selectedOption}`);
            
            // Simulation de l'action de tri
            // Ici, ajoutez la logique spécifique pour appliquer le tri selon `selectedOption`
            
            logEvent('test-end', `Tri effectué avec succès pour l'option : ${selectedOption}`);
        } catch (error) {
            logEvent('error', `Erreur lors du tri des médias : ${error.message}`, { stack: error.stack });
        }
    }, "Modification de l'option de tri");

    logEvent('success', "Événements pour le tri des médias initialisés avec succès.");
}







/**
 * Initialise les gestionnaires d'événements pour le tri des médias.
 */
function initSortingEvents() {
    logEvent('info', "Initialisation des événements pour le tri des médias...");
    attachEvent(domSelectors.sorting.sortOptions, 'change', (event) => {
        logEvent('test-start', "Début du tri des médias...");
        const selectedOption = event.target.value;
        logEvent('info', `Option de tri sélectionnée : ${selectedOption}`);
        logEvent('test-end', `Tri effectué avec succès pour l'option : ${selectedOption}`);
    }, "Modification de l'option de tri");
    logEvent('success', "Événements pour le tri des médias initialisés avec succès.");
}





/**
 * Initialise tous les gestionnaires d'événements de la page.
 * 
 * Cette fonction agit comme point d'entrée pour enregistrer les gestionnaires d'événements
 * dans différentes parties de l'application, incluant :
 * - La modale de contact.
 * - La lightbox.
 * - Les options de tri des médias.
 * 
 * Des journaux d'événements détaillés sont générés pour suivre l'état 
 * de l'initialisation, et détecter d'éventuels problèmes lors de l'exécution.
 */
function initEventListeners() {
    logEvent('info', "Début de l'initialisation des gestionnaires d'événements...");
    
    try {
        // Initialisation des événements de la modale
        initModalEvents();
        logEvent('test-start', "Test des événements de la modale commencé...");
        logEvent('test-end', "Test des événements de la modale terminé avec succès.");
        
        // Initialisation des événements de la lightbox
        initLightboxEvents();
        logEvent('test-start', "Test des événements de la lightbox commencé...");
        logEvent('test-end', "Test des événements de la lightbox terminé avec succès.");
        
        // Initialisation des événements de tri des médias
        initSortingEvents();
        logEvent('test-start', "Test des événements de tri des médias commencé...");
        logEvent('test-end', "Test des événements de tri des médias terminé avec succès.");
        
        logEvent('success', "Tous les gestionnaires d'événements ont été initialisés avec succès.");
    } catch (error) {
        logEvent('error', `Erreur lors de l'initialisation des gestionnaires d'événements : ${error.message}`, { stack: error.stack });
    }
}


export default initEventListeners;
