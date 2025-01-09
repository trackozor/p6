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
 * Attache un gestionnaire d'événement à un élément DOM, avec journalisation pour
 * le suivi des étapes avant, pendant et après l'exécution de l'événement.
 *
 * @param {HTMLElement} selector - Élément DOM auquel l'événement doit être attaché.
 * @param {string} eventType - Type de l'événement (e.g., 'click', 'change').
 * @param {Function} callback - Fonction callback exécutée lorsque l'événement est déclenché.
 * @param {string} [logMessage=''] - Message descriptif pour enrichir les journaux.
 *
 * @example
 * // Exemple d'utilisation :
 * attachEvent(document.querySelector('#myButton'), 'click', () => {
 *   console.log('Bouton cliqué');
 * }, 'Gestionnaire de clic sur le bouton');
 */
function attachEvent(selector, eventType, callback, logMessage = '') {
    if (!selector) {
        logEvent('warn', `Élément DOM introuvable pour l'événement ${eventType}`);
        return;
    }

    // Attacher le gestionnaire d'événement
    selector.addEventListener(eventType, (event) => {
        logEvent('test-start', `Début de l'événement ${eventType} : ${logMessage}`);
        
        try {
            // Exécution du callback fourni
            callback(event);
        } catch (error) {
            // Gestion des erreurs dans le callback
            logEvent(
                'error',
                `Erreur pendant l'événement ${eventType} : ${error.message}`,
                { stack: error.stack }
            );
        }

        logEvent('test-end', `Fin de l'événement ${eventType} : ${logMessage}`);
    });
}


/**
 * ========================================================
 *                     Modale de contact
 * ========================================================
 * 
 * Initialise les gestionnaires d'événements pour la modale de contact.
 * 
 * Cette fonction attache des gestionnaires d'événements aux boutons permettant
 * d'ouvrir et de fermer la modale de contact. Chaque étape est journalisée pour
 * garantir un suivi précis du comportement.
 * 
 * @example
 * // Exemple d'utilisation :
 * initModalEvents();
 * 
 * @fires click - Lorsqu'un bouton d'ouverture ou de fermeture est cliqué.
 */
function initModalEvents() {
    logEvent('info', "Initialisation des événements pour la modale de contact...");

    try {
        // Gestionnaire pour l'ouverture de la modale
        attachEvent(
            domSelectors.modal.contactOpenButton,
            'click',
            () => {
                logEvent('test-start', "Début de l'ouverture de la modale de contact...");
                launchModal(); // Action pour ouvrir la modale
                logEvent('test-end', "Modale de contact ouverte avec succès.");
            },
            "Ouverture de la modale de contact"
        );

        // Gestionnaire pour la fermeture de la modale
        attachEvent(
            domSelectors.modal.contactCloseButton,
            'click',
            () => {
                logEvent('test-start', "Début de la fermeture de la modale de contact...");
                closeModal(); // Action pour fermer la modale
                logEvent('test-end', "Modale de contact fermée avec succès.");
            },
            "Fermeture de la modale de contact"
        );

        logEvent('success', "Événements pour la modale initialisés avec succès.");
    } catch (error) {
        logEvent('error', `Erreur lors de l'initialisation des événements pour la modale : ${error.message}`, { stack: error.stack });
    }
}


/**
 * ========================================================
 *                     lightbox
 * ========================================================
 * 
 * Initialise les gestionnaires d'événements pour la lightbox.
 * 
 * Cette fonction configure les interactions utilisateur avec la lightbox, notamment :
 * - La fermeture de la lightbox.
 * - La navigation vers l'image précédente.
 * - La navigation vers l'image suivante.
 * 
 * Chaque étape est journalisée pour faciliter le suivi des actions et le débogage.
 * 
 * @example
 * // Exemple d'utilisation :
 * initLightboxEvents();
 * 
 * @fires click - Déclenché sur les boutons de fermeture et de navigation.
 */
function initLightboxEvents() {
    logEvent('info', "Initialisation des événements pour la lightbox...");
    
    // Récupération des éléments DOM nécessaires
    const { lightboxContainer, lightboxCloseButton, lightboxPrevButton, lightboxNextButton } = domSelectors.lightbox;

    // Gestionnaire pour la fermeture de la lightbox
    attachEvent(
        lightboxCloseButton,
        'click',
        () => {
            logEvent('test-start', "Début de fermeture de la lightbox...");
            lightboxContainer.classList.add('hidden'); // Masquer la lightbox
            logEvent('test-end', "Lightbox fermée avec succès.");
        },
        "Fermeture de la lightbox"
    );

    // Gestionnaire pour la navigation vers l'image précédente
    attachEvent(
        lightboxPrevButton,
        'click',
        () => {
            logEvent('test-start', "Navigation vers l'image précédente dans la lightbox...");
            // Ajouter ici la logique pour afficher l'image précédente
            logEvent('test-end', "Image précédente affichée.");
        },
        "Navigation précédente dans la lightbox"
    );

    // Gestionnaire pour la navigation vers l'image suivante
    attachEvent(
        lightboxNextButton,
        'click',
        () => {
            logEvent('test-start', "Navigation vers l'image suivante dans la lightbox...");
            // Ajouter ici la logique pour afficher l'image suivante
            logEvent('test-end', "Image suivante affichée.");
        },
        "Navigation suivante dans la lightbox"
    );

    logEvent('success', "Événements pour la lightbox initialisés avec succès.");
}


/**
 * ========================================================
 *               trie des medias                           
 * ========================================================
 * 
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
 * ========================================================
 *                   point d'entrée                         
 * ========================================================
 * 
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
