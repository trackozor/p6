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
const domCache = new Map(); // Stocke les sélections DOM pour éviter les requêtes répétées

/**
 * Récupère un élément DOM avec cache et gestion des erreurs.
 * 
 * @param {string} selector - Sélecteur CSS.
 * @param {boolean} [isOptional=false] - Si true, ne log pas d'erreur si l'élément est introuvable.
 * @returns {Element|null} Élément trouvé ou `null`.
 */
export function safeQuerySelector(selector, isOptional = false) {
    // Vérifie si l'élément est dans le cache et toujours valide
    if (domCache.has(selector)) {
        const cachedElement = domCache.get(selector);
        if (document.body.contains(cachedElement)) {
            return cachedElement; // Retourne l'élément s'il est encore valide
        } else {
            domCache.delete(selector); // Supprime l'entrée invalide du cache
        }
    }

    // Recherche de l'élément si non présent ou invalide dans le cache
    const element = document.querySelector(selector);

    if (!element && !isOptional) {
        logEvent("error", `Élément non trouvé : ${selector}`);
    } else if (element) {
        logEvent("info", `Élément trouvé : ${selector}`);
        domCache.set(selector, element); // Stocke l'élément dans le cache
    }

    return element;
}

/**
 * Récupère tous les éléments DOM correspondant à un sélecteur, avec cache.
 * 
 * @param {string} selector - Sélecteur CSS.
 * @returns {NodeList} Liste des éléments trouvés.
 */
export function safeQuerySelectorAll(selector) {
    // Vérifie si la NodeList est encore valide dans le cache
    if (domCache.has(selector)) {
        const cachedNodeList = domCache.get(selector);
        if (cachedNodeList.length > 0 && document.body.contains(cachedNodeList[0])) {
            return cachedNodeList;
        } else {
            domCache.delete(selector); // Supprime la NodeList invalide du cache
        }
    }

    const elements = document.querySelectorAll(selector);

    if (!elements.length) {
        logEvent("warn", `Aucun élément trouvé pour : ${selector}`);
    } else {
        logEvent("info", `Éléments trouvés pour : ${selector}, total : ${elements.length}`);
        domCache.set(selector, elements); // Stocke la NodeList dans le cache
    }

    return elements;
}


/**
 * Vide le cache des sélections DOM pour permettre un rafraîchissement.
 */
export function clearDomCache() {
    domCache.clear();
    logEvent("info", "🔄 Cache des sélections DOM vidé !");
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
 * Fonction permettant de rafraîchir dynamiquement les sélecteurs en cas de modification du DOM.
 * Utile si certains éléments sont ajoutés après le chargement initial.
 */
/**
 * Met à jour dynamiquement les sélecteurs DOM après une modification du DOM.
 */
export function refreshSelectors() {
    logEvent("info", "Rafraîchissement des sélecteurs DOM...");

    // Vider le cache pour forcer une nouvelle récupération des éléments
    clearDomCache();

    // Mise à jour des sélecteurs selon la page actuelle
    Object.assign(domSelectors, loadSelectorsForCurrentPage());

    logEvent("success", "Sélecteurs DOM mis à jour.");
}


// Initialisation des sélecteurs au chargement
const domSelectors = {
    safeQuerySelector,
    getCurrentPage,
    refreshSelectors,  
    ...loadSelectorsForCurrentPage(),
};
/**
 * Surveille les changements du DOM et met à jour les sélecteurs dynamiquement.
 */
function observeDomChanges() {
    const observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;

        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Vérifie si c'est un élément HTML
                    // Vérifie si un élément surveillé a été ajouté
                    Object.values(domSelectors).forEach((selector) => {
                        if (selector instanceof Element && node.contains(selector)) {
                            shouldRefresh = true;
                        }
                    });
                }
            });
        });

        if (shouldRefresh) {
            logEvent("info", "Modification détectée dans le DOM, mise à jour des sélecteurs...");
            refreshSelectors();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    logEvent("success", "Observation des changements du DOM activée.");
}

/*==============================================*/
/*        Activation de l'Observation DOM       */
/*==============================================*/

// Active l'observation des changements du DOM après initialisation des sélecteurs
observeDomChanges();

export default domSelectors;
