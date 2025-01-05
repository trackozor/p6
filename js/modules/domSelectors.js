/**
 * ===============================================================
 * Nom du fichier : domSelectors.js
 * Description    : Centralisation des sélecteurs DOM pour l'application Fisheye.
 * Auteur         : [Votre nom ou équipe]
 * Date           : [Date de création ou mise à jour]
 * Version        : 1.0.0
 * ===============================================================
 * Ce fichier contient tous les sélecteurs DOM utilisés dans l'application.
 * En centralisant ces éléments, on facilite la maintenance et la réutilisation,
 * tout en améliorant la lisibilité du code.
 * ===============================================================
 */

const domSelectors = {
    // === Sélecteurs spécifiques à la page index.html ===
    indexPage: {
        header: document.querySelector('header'), // En-tête principal
        logoLink: document.querySelector('.logo-link'), // Logo avec le lien de retour à l'accueil
        mainContent: document.querySelector('#main'), // Contenu principal
        photographersSection: document.querySelector('.photographer-section'), // Section principale des photographes
        photographersContainer: document.querySelector('#photographers-container'), // Conteneur des photographes
        photographerTemplate: document.querySelector('#photographer-template'), // Template pour un photographe
        footer: document.querySelector('footer'), // Pied de page
    },

    // === Sélecteurs spécifiques à la page photographer.html ===
    photographerPage: {
        photographerTitle: document.querySelector('#photograph-title'),
        photographerLocation: document.querySelector('.photographer-card-location'),
        photographerTagline: document.querySelector('.photographer-card-tagline'),
        photographerProfileImage: document.querySelector('.photographer-card-portrait'),
        galleryContainer: document.getElementById('gallery')
    },

    // === Sélecteurs pour les templates ===
    templates: {
        photographerTemplate: document.querySelector('#photographer-template'), // Template pour un photographe
        galleryItemTemplate: document.querySelector('#gallery-item-template'), // Template pour un élément de galerie
        portraitWrapperTemplate: document.querySelector('#photographer-card-portrait-wrapper'), // Template pour le portrait
    },
};

// === Export des sélecteurs ===
// Ce module est utilisé dans d'autres fichiers JS pour accéder aux éléments DOM.
export default domSelectors;
