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
      sortingSelect: safeQuerySelector("#sort-options"),
      contactButton: safeQuerySelector(".contact-button"), // Corrected
      photographerStatsTemplate: safeQuerySelector("#photographer-stats", true), // Nouveau sélecteur pour le template
      totalLikes: null, // Initialement `null` car il sera extrait du template
      dailyRate: null, // Idem
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
      container: safeQuerySelector(".modal"),
      closeButton: safeQuerySelector(".modal-close"),
      form: {
        formElement: safeQuerySelector(
          "form[aria-label='Formulaire de contact']",
        ),
        firstName: safeQuerySelector("#first-name"),
        lastName: safeQuerySelector("#last-name"),
        email: safeQuerySelector("#email"),
        message: safeQuerySelector("#message"),
        submitButton: safeQuerySelector(".contact-button[type='submit']"),
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

    const checkSelectors = (obj, parentKey = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          checkSelectors(value, `${parentKey}${key}.`);
        } else if (!value) {
          missingSelectors.push(`${parentKey}${key}`);
        }
      });
    };

    checkSelectors(selectors);

    if (missingSelectors.length > 0) {
      logEvent(
        "error",
        `⚠️ Les sélecteurs suivants sont manquants : ${missingSelectors.join(
          ", ",
        )}.`,
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
