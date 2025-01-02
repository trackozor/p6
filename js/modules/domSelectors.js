/* ========================================================
 * Nom du fichier : domSelectors.js
 * Description    : Centralisation des sélecteurs DOM pour la page d'accueil
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 1.0.0
 * ======================================================== */

// Sélecteurs principaux
export const DOMSelectors = {
    // En-tête
    header: document.querySelector('header'),
    logoLink: document.querySelector('.logo-link'),
    logoImage: document.querySelector('.logo'),

    // Contenu principal
    main: document.querySelector('#main'),
    photographerSection: document.querySelector('.photographer-section'),
    photographerTemplate: document.querySelector('#photographer-template'),

    // Pied de page
    footer: document.querySelector('footer'),

    // Accessibilité
    skipToMainLink: document.querySelector('.sr-only'),
};
