/**
 * ===============================================================
 * Nom du fichier : domSelectors.js
 * Description    : Centralisation des sélecteurs DOM pour l'application Fisheye.
 * Auteur         : Trackozor
 * Date           : 05/01/2025
 * Version        : 1.1.0
 * ===============================================================
 * Ce fichier regroupe tous les sélecteurs DOM utilisés dans l'application.
 * 
 * Objectifs :
 * - Améliorer la lisibilité et la maintenabilité du code.
 * - Centraliser les sélecteurs pour éviter les redondances et les erreurs.
 * - Fournir une documentation claire et détaillée pour faciliter la compréhension.
 * ===============================================================
 */

const domSelectors = {
    /**
     * ===========================================================
     * Section : Sélecteurs spécifiques à la page index.html
     * Description : Ces sélecteurs permettent de manipuler les éléments
     * principaux de la page d'accueil (liste des photographes).
     * ===========================================================
     */
    indexPage: {
        header: document.querySelector('header'), // En-tête principal de la page (inclut le logo et le titre).
        logoLink: document.querySelector('.logo-link'), // Lien du logo pour revenir à la page d'accueil.
        mainContent: document.querySelector('#main'), // Conteneur principal de la page (contenu principal).
        photographersSection: document.querySelector('.photographer-section'), // Section contenant la liste des photographes.
        photographersContainer: document.querySelector('#photographers-container'), // Conteneur dynamique où les cartes des photographes sont injectées.
        photographerTemplate: document.querySelector('#photographer-template'), // Template HTML pour afficher chaque photographe.
        footer: document.querySelector('footer'), // Pied de page affiché en bas de la page.
    }, 

    /**
     * ===========================================================
     * Section : Sélecteurs spécifiques à la page photographer.html
     * Description : Ces sélecteurs permettent de manipuler les éléments
     * liés aux détails et à la galerie d'un photographe spécifique.
     * ===========================================================
     */
    photographerPage: {
        photographerTitle: document.querySelector('#photograph-title'), // Titre du photographe (nom complet affiché en haut de la page).
        photographerLocation: document.querySelector('.photographer-card-location'), // Localisation du photographe (ville et pays).
        photographerTagline: document.querySelector('.photographer-card-tagline'), // Slogan ou tagline du photographe.
        photographerProfileImage: document.querySelector('.photographer-card-portrait'), // Portrait du photographe affiché sur la page.
        galleryContainer: document.getElementById('gallery'), // Conteneur dynamique pour afficher la galerie des médias du photographe.
    },

    /**
     * ===========================================================
     * Section : Sélecteurs pour les templates HTML
     * Description : Ces sélecteurs regroupent les éléments modèles (templates),
     * permettant la génération dynamique d'éléments réutilisables.
     * ===========================================================
     */
    templates: {
        photographerTemplate: document.querySelector('#photographer-template'), // Template pour afficher un photographe sur la page d'accueil.
        galleryItemTemplate: document.querySelector('#gallery-item-template'), // Template pour un élément de galerie (image ou vidéo).
        portraitWrapperTemplate: document.querySelector('#photographer-card-portrait-wrapper'), // Template pour le conteneur du portrait d'un photographe.
    },

    /**
     * ===========================================================
     * Section : Sélecteurs pour la lightbox
     * Description : Ces sélecteurs permettent de manipuler la lightbox, 
     * qui est utilisée pour afficher les médias en plein écran.
     * ===========================================================
     */
    lightbox: {
        lightboxContainer: document.querySelector('#lightbox'), // Conteneur principal de la lightbox.
        lightboxCloseButton: document.querySelector('.lightbox-close'), // Bouton pour fermer la lightbox.
        lightboxPrevButton: document.querySelector('.lightbox-prev'), // Bouton pour naviguer vers le média précédent.
        lightboxNextButton: document.querySelector('.lightbox-next'), // Bouton pour naviguer vers le média suivant.
        lightboxMediaContainer: document.querySelector('.lightbox-media-container'), // Conteneur des médias affichés dans la lightbox.
        lightboxCaption: document.querySelector('#lightbox-caption'), // Légende descriptive des médias affichés dans la lightbox.
    },
    
    /**
     * ===========================================================
     * Section : Sélecteurs pour la modal de contact
     * Description : Ces sélecteurs permettent de gérer l'ouverture et
     * la fermeture de la modal de contact dans la page photographer.html.
     * ===========================================================
     */
    modal: {
        contactOverlay: document.querySelector('#contact-overlay'), // Overlay semi-transparent affiché derrière la modal.
        contactModal: document.querySelector('#contact-modal'), // Conteneur principal de la modal de contact.
        contactOpenButton: document.querySelector('.contact_button'), // Bouton pour ouvrir la modal (bouton "Contactez-moi").
        contactCloseButton: document.querySelector('.modal-close'), // Bouton pour fermer la modal.
    },

    /**
     * ===========================================================
     * Section : Sélecteurs pour le tri des médias
     * Description : Ces sélecteurs permettent de manipuler les 
     * options de tri pour la galerie des médias.
     * ===========================================================
     */
    sorting: {
        sortOptions: document.querySelector('#sort-options'), // Menu déroulant pour sélectionner les options de tri.
    },
};

// ===============================================================
// Export des sélecteurs
// Ce module est utilisé dans tous les fichiers JS de l'application
// pour centraliser les interactions avec le DOM de manière propre et efficace.
// ===============================================================
export default domSelectors;
