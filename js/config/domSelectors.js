/**
 * ===============================================================
 * Nom du fichier : domSelectors.js
 * Description    : Centralisation des sélecteurs DOM pour l'application Fisheye.
 * Auteur         : Trackozor
 * Date           : 05/01/2025
 * Version        : 1.6.1 (Optimisée avec documentation enrichie)
 * ===============================================================
 *
 * Objectifs :
 * - Charger dynamiquement les sélecteurs selon la page en cours.
 * - Vérifier la présence des sélecteurs essentiels au bon fonctionnement.
 * - Ajouter des logs détaillés pour chaque élément trouvé ou manquant.
 * ===============================================================
 */

import { logEvent } from "../utils/utils.js";

/**
 * Centralisation des sélecteurs DOM et vérification dynamique.
 */
const domSelectors = (() => {
  /**
   * Récupère un élément DOM en toute sécurité, avec gestion des erreurs.
   * @param {string} selector - Sélecteur CSS de l'élément.
   * @param {boolean} [isOptional=false] - Si true, ne génère pas d'erreur si l'élément est introuvable.
   * @returns {Element|null} Élément DOM trouvé ou null si introuvable.
   */
  const safeQuerySelector = (selector, isOptional = false) => {
    const element = document.querySelector(selector);

    if (!element && !isOptional) {
      logEvent(
        "error",
        `❌ Élément non trouvé pour le sélecteur : ${selector}`,
      );
    } else if (element) {
      logEvent("info", `✅ Élément trouvé : ${selector}`);
    }

    return element;
  };

  /**
   * Identifie la page actuelle en se basant sur le chemin de l'URL.
   * @returns {string} Nom de la page (par exemple, "index" ou "photographer").
   */
  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path.includes("index.html")) {
      return "index";
    }
    if (path.includes("photographer.html")) {
      return "photographer";
    }
    return "unknown";
  };

  /**
   * Définit les sélecteurs spécifiques pour la page `index.html`.
   * @returns {Object} Sélecteurs pour la page d'accueil.
   */
  const getIndexSelectors = () => ({
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
  });

  /**
   * Définit les sélecteurs spécifiques pour la page `photographer.html`.
   * @returns {Object} Sélecteurs pour la page photographe.
   */
  const getPhotographerSelectors = () => ({
    photographerPage: {
      photographerHeader: safeQuerySelector(".photographer-info"),
      photographerTitle: safeQuerySelector("#photograph-title"),
      photographerLocation: safeQuerySelector(".photographer-card-location"),
      photographerTagline: safeQuerySelector(".photographer-card-tagline"),
      photographerProfileImage: safeQuerySelector(
        ".photographer-card-portrait",
      ),
      galleryContainer: safeQuerySelector("#gallery"),
      overlayContainer: safeQuerySelector("#modal-overlay"),
      sortingSelect: safeQuerySelector("#sort-options"),
      contactButton: document.querySelector("#contact-btn"),

      photographerStatsTemplate: safeQuerySelector("#photographer-stats", true), // Nouveau sélecteur pour le template
      totalLikes: null,
      dailyRate: null,
    },
    lightbox: {
      lightboxContainer: safeQuerySelector("#lightbox"),
      lightboxCloseButton: safeQuerySelector(".lightbox-close"),
      lightboxPrevButton: safeQuerySelector(".lightbox-prev"),
      lightboxNextButton: safeQuerySelector(".lightbox-next"),
      lightboxMediaContainer: safeQuerySelector(".lightbox-media"),
      lightboxCaption: safeQuerySelector("#lightbox-caption"),
    },
    modal: {
      contactOverlay: safeQuerySelector("#modal-overlay"),
      container: safeQuerySelector("#contact-modal"),
      closeButton: safeQuerySelector(".modal-close"),
      form: {
        formElement: safeQuerySelector(
          "form[aria-label='Formulaire de contact']",
        ),
        firstName: safeQuerySelector("#first-name"),
        lastName: safeQuerySelector("#last-name"),
        email: safeQuerySelector("#email"),
        message: safeQuerySelector("#message"),
        submitButton: safeQuerySelector(
          ".contact-submit-button[type='submit']",
        ),
      },
    },
    sorting: {
      sortOptions: safeQuerySelector("#sort-options"),
    },
  });

  /**
   * Vérifie la présence de tous les sélecteurs pour une page donnée.
   * @param {Object} selectors - Sélecteurs de la page en cours.
   * @returns {boolean} True si tous les sélecteurs sont présents, sinon False.
   */
  const verifySelectors = (selectors) => {
    const missingSelectors = [];

    /**
     * Vérifie récursivement les sélecteurs.
     * @param {Object} obj - Objet contenant les sélecteurs.
     * @param {string} parentKey - Chemin complet vers le sélecteur parent.
     */
    const checkSelectors = (obj, parentKey = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        // Concaténation du chemin complet du sélecteur
        const fullKey = `${parentKey}${key}`;

        // Exclusion des sélecteurs `.totalLikes` et `.dailyRate`
        if (
          fullKey === "photographerPage.totalLikes" ||
          fullKey === "photographerPage.dailyRate"
        ) {
          return; // Ignorer ces sélecteurs spécifiques
        }

        if (typeof value === "object" && value !== null) {
          // Vérification récursive pour les objets imbriqués
          checkSelectors(value, `${fullKey}.`);
        } else if (!value) {
          // Ajout du sélecteur manquant à la liste
          missingSelectors.push(fullKey);
        }
      });
    };

    // Lancer la vérification sur l'objet des sélecteurs
    checkSelectors(selectors);

    // Gestion des sélecteurs manquants
    if (missingSelectors.length > 0) {
      logEvent(
        "error",
        `⚠️ Les sélecteurs suivants sont manquants : ${missingSelectors.join(", ")}.`,
        {},
      );
      return false;
    }

    logEvent("success", "✅ Tous les sélecteurs nécessaires sont présents.");
    return true;
  };

  /**
   * Charge dynamiquement les sélecteurs pour la page actuelle et les vérifie.
   * @returns {Object} Sélecteurs spécifiques à la page.
   */
  const loadSelectorsForCurrentPage = () => {
    const currentPage = getCurrentPage();
    logEvent("info", `🔍 Page détectée : ${currentPage}`);

    if (currentPage === "index") {
      const selectors = getIndexSelectors();
      verifySelectors(selectors);
      return selectors;
    }

    if (currentPage === "photographer") {
      const selectors = getPhotographerSelectors();
      verifySelectors(selectors);
      return selectors;
    }

    logEvent("warn", "⚠️ Page inconnue, aucun sélecteur spécifique chargé.");
    return {}; // Objet vide si page inconnue
  };

  return {
    safeQuerySelector,
    getCurrentPage,
    ...loadSelectorsForCurrentPage(), // Charge dynamiquement les sélecteurs
  };
})();

// ===============================================================
// Export des sélecteurs
// ===============================================================
export default domSelectors;
