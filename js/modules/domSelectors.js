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
        header: document.querySelector('header'), // En-tête principal
        logoLink: document.querySelector('.logo'), // Logo de retour à la page d'accueil
        mainContent: document.querySelector('#main'), // Contenu principal

        // Section des informations du photographe
        photographerInfo: document.querySelector('#photograph-info'), // Section des infos du photographe
        photographerTitle: document.querySelector('#photograph-title'), // Titre du photographe
        photographersContainer: document.querySelector('#photographers-container'), // Conteneur des photographes
        photographerProfileImage: document.querySelector('.photographer-card-portrait'), // Image de profil

        // Section de tri
        sortingSection: document.querySelector('.sorting'), // Section de tri
        sortOptions: document.querySelector('#sort-options'), // Liste déroulante des options de tri

        // Section de la galerie
        gallerySection: document.querySelector('.photograph-gallery'), // Section de la galerie
        galleryContainer: document.querySelector('#gallery'), // Conteneur de la galerie

        // Lightbox
        lightbox: document.querySelector('#lightbox'), // Conteneur de la lightbox
        lightboxClose: document.querySelector('.lightbox-close'), // Bouton pour fermer la lightbox
        lightboxPrev: document.querySelector('.lightbox-prev'), // Bouton pour la photo précédente
        lightboxNext: document.querySelector('.lightbox-next'), // Bouton pour la photo suivante
        lightboxContent: document.querySelector('.lightbox-media-container'), // Conteneur des médias de la lightbox
        lightboxCaption: document.querySelector('#lightbox-caption'), // Légende de la lightbox

        // Modale de contact
        contactModal: document.querySelector('#contact_modal'), // Conteneur de la modale de contact
        modalClose: document.querySelector('.modal-close'), // Bouton pour fermer la modale
        contactForm: document.querySelector('form[aria-label="Formulaire de contact"]'), // Formulaire de contact

        // Pied de page
        footer: document.querySelector('footer'), // Pied de page
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
