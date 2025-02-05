/**
 * ===============================================================
 * Nom du fichier : domSelectors.js
 * Description    : Centralisation des sélecteurs DOM pour l'application Fisheye.
 * Auteur         : Trackozor
 * Date           : 05/01/2025
 * Version        : 1.7.0 (Réorganisation des fonctions et optimisation)
 * ===============================================================
 *
 * Objectifs :
 * - Charger dynamiquement les sélecteurs selon la page en cours.
 * - Vérifier la présence des sélecteurs essentiels au bon fonctionnement.
 * - Ajouter des logs détaillés pour chaque élément trouvé ou manquant.
 * ===============================================================
 */
/*==============================================*/
/*                 Import                       */
/*==============================================*/
import { logEvent } from "../utils/utils.js";

/*==============================================*/
/*          Récupération éléments DOM           */
/*==============================================*/
/**
 * Récupère un élément DOM en toute sécurité, avec gestion des erreurs et option de journalisation.
 * 
 * @param {string} selector - Sélecteur CSS de l'élément.
 * @param {boolean} [isOptional=false] - Si true, ne génère pas d'erreur si l'élément est introuvable.
 * @returns {Element|null} Élément DOM trouvé ou `null` si introuvable.
 */
export function safeQuerySelector(selector, isOptional = false) {
    const element = document.querySelector(selector);

    if (!element && !isOptional) {
        logEvent("error", `Élément non trouvé : ${selector}`);
    } else if (element) {
        logEvent("info", `Élément trouvé : ${selector}`);
    }

    return element;
}
/**
 * Récupère tous les éléments DOM correspondant à un sélecteur, avec gestion des erreurs.
 * 
 * @param {string} selector - Sélecteur CSS des éléments.
 * @returns {NodeList} Liste des éléments trouvés (peut être vide).
 */
export function safeQuerySelectorAll(selector) {
    const elements = document.querySelectorAll(selector);

    if (!elements.length) {
        logEvent("warn", `Aucun élément trouvé pour : ${selector}`);
    } else {
        logEvent("info", `Éléments trouvés pour : ${selector}, total : ${elements.length}`);
    }

    return elements;
}

/*==============================================*/
/*            designation page                  */
/*==============================================*/
/**
 * Détermine la page actuelle en fonction de l'URL.
 * 
 * @returns {string} - Nom de la page détectée (`"index"`, `"photographer"` ou `"unknown"`).
 */
export function getCurrentPage() {
    const url = window.location.pathname.toLowerCase();

    if (url.includes("photographer")) {
        return "photographer";
    }
    if (url.includes("index") || url === "/") {
        return "index";
    }
    return "unknown";
}

/*==============================================*/
/*       definition sélecteurs page index       */
/*==============================================*/
/**
 * Définit les sélecteurs spécifiques pour la page `index.html`.
 * 
 * @returns {Object} Sélecteurs pour la page d'accueil.
 */
export function getIndexSelectors() {
    return {
        indexPage: {
            header: safeQuerySelector("header"),
            logoLink: safeQuerySelector(".logo-link"),
            mainContent: safeQuerySelector("#main"),
            photographersSection: safeQuerySelector(".photographer-section"),
            photographersContainer: safeQuerySelector("#photographers-container"),
            photographerTemplate: safeQuerySelector("#photographer-template", true),
            footer: safeQuerySelector("footer"),
        },
        templates: {
            photographerTemplate: safeQuerySelector("#photographer-template"),
        },
    };
}

/*==============================================*/
/*    definition sélecteurs page photographe    */
/*==============================================*/
/**
 * Définit les sélecteurs spécifiques pour la page `photographer.html`.
 * 
 * @returns {Object} Sélecteurs pour la page photographe.
 */
export function getPhotographerSelectors() {
    return {
        photographerPage: {
            photographerHeader: safeQuerySelector(".photographer-info"),
            photographerTitle: safeQuerySelector("#photograph-title"),
            photographerLocation: safeQuerySelector(".photographer-card-location"),
            photographerTagline: safeQuerySelector(".photographer-card-tagline"),
            photographerProfileImage: safeQuerySelector(".photographer-card-portrait"),
            galleryContainer: safeQuerySelector("#gallery"),
            overlayContainer: safeQuerySelector("#modal-overlay"),
            sortingSelect: safeQuerySelector("#sort-options"),
            contactButton: safeQuerySelector(".contact-button"),
            photographerStatsTemplate: safeQuerySelector("#photographer-stats", true),
            likeIcons: safeQuerySelectorAll(".like-icon"),
            likeButtons: safeQuerySelectorAll(".like-btn"),
            dislikeButtons: safeQuerySelectorAll(".dislike-btn"),
            likeDislikeModal: safeQuerySelector("#like-dislike-modal"),
            likeDislikeContent: safeQuerySelector(".like-dislike-content"),

            totalLikes: null,
            dailyRate: null,
        },
        lightbox: {
            lightboxContainer: safeQuerySelector("#lightbox"),
            lightboxCloseButton: safeQuerySelector(".lightbox-close"),
            lightboxPrevButton: safeQuerySelector(".lightbox-prev"),
            lightboxNextButton: safeQuerySelector(".lightbox-next"),
            lightboxMediaContainer: safeQuerySelector(".lightbox-content"),
            lightboxCaption: safeQuerySelector("#lightbox-caption"),
        },
        modal: {
            modalOverlay: safeQuerySelector("#modal-overlay"),
            contactForm: safeQuerySelector("#contact-modal form"),
            closeButton: safeQuerySelector(".modal-close"),
            form: {
                formElement: safeQuerySelector("form[aria-label='Formulaire de contact']"),
                firstName: safeQuerySelector("#first-name"),
                lastName: safeQuerySelector("#last-name"),
                email: safeQuerySelector("#email"),
                messageField: safeQuerySelector("#message"),
                submitButton: safeQuerySelector(".contact-submit-button"),
                confirmButton: safeQuerySelector(".confirm-btn"),
            },
            confirmationModal: {
                container: safeQuerySelector("#confirmation-modal"),
                title: safeQuerySelector("#confirmation-title", true),
                confirmButton: safeQuerySelector(".confirm-btn"),
            },
            spamModal: {
                container: safeQuerySelector("#spam-error-modal"),
                title: safeQuerySelector("#spam-error-title"),
                body: safeQuerySelector(".modal-body"),
                footer: safeQuerySelector(".modal-footer"),
                closeButton: safeQuerySelector(".btn-close-error"),
            },
        },
        sorting: {
            sortOptions: safeQuerySelector("#sort-options"),
        },
        loader: {
            loader: safeQuerySelector("#loader"),
            loaderText: safeQuerySelector("#loader-text"),
            progressBar: safeQuerySelector("#progress-bar"),
            progressPercentage: safeQuerySelector("#progress-percentage"),
        },
    };
}
/*==============================================*/
/*    Verification présence sélecteurs   */
/*==============================================*/

/**
 * Vérifie récursivement la présence des sélecteurs dans un objet donné.
 * 
 * @param {Object} obj - Objet contenant les sélecteurs.
 * @param {string} [parentKey=""] - Clé parent pour générer le chemin complet.
 * @param {Array<string>} missingSelectors - Tableau des sélecteurs manquants.
 */
export function recursiveCheck(obj, parentKey = "", missingSelectors = []) {
    Object.entries(obj).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // Exclusion des sélecteurs non critiques
        if (fullKey === "photographerPage.totalLikes" || fullKey === "photographerPage.dailyRate") {
            return;
        }

    if (typeof value === "object" && value !== null) {
          // Vérification récursive pour les objets imbriqués
        recursiveCheck(value, fullKey, missingSelectors);
        } else if (!value) {
          // Ajout du sélecteur manquant à la liste
            missingSelectors.push(fullKey);
        }
    });

    return missingSelectors;
}

/**
* Vérifie la présence des sélecteurs nécessaires pour une page donnée.
* 
* @param {Object} selectors - Objet contenant les sélecteurs DOM.
* @returns {Array<string>} - Liste des sélecteurs manquants.
*/
export function checkSelectors(selectors) {
    return recursiveCheck(selectors);
}

/*==============================================*/
/*          Chargement sélecteurs               */
/*==============================================*/
/**
 * Charge dynamiquement les sélecteurs pour la page actuelle et les vérifie.
 * 
 * @returns {Object} Sélecteurs spécifiques à la page.
 */
export function loadSelectorsForCurrentPage() {
    const currentPage = getCurrentPage();
    logEvent("info", `Page détectée : ${currentPage}`);

    let selectors = {};

    if (currentPage === "index") {
        selectors = getIndexSelectors();
    } else if (currentPage === "photographer") {
        selectors = getPhotographerSelectors();
    }

    const missingSelectors = checkSelectors(selectors);
    if (missingSelectors.length > 0) {
        logEvent("error", "Sélecteurs manquants détectés.", { missingSelectors });
    }

    return selectors;
}

/*==============================================*/
/*           Initialisation sélecteurs          */
/*==============================================*/
/**
 * Initialise les sélecteurs de la page actuelle et les expose.
 */
const domSelectors = {
    safeQuerySelector,
    getCurrentPage,
    ...loadSelectorsForCurrentPage(),
};

export default domSelectors;
