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
        header: document.querySelector('header'), // En-tête principal de la page d'accueil (logo et titre).
        logoLink: document.querySelector('.logo-link'), // Logo avec lien de retour vers la page d'accueil.
        mainContent: document.querySelector('#main'), // Conteneur principal du contenu de la page.
        photographersSection: document.querySelector('.photographer-section'), // Section affichant la liste des photographes.
        photographersContainer: document.querySelector('#photographers-container'), // Conteneur dynamique des photographes (injectés via JS).
        photographerTemplate: document.querySelector('#photographer-template'), // Template utilisé pour afficher un photographe.
        footer: document.querySelector('footer'), // Pied de page de la page d'accueil.
    },

    /**
     * ===========================================================
     * Section : Sélecteurs spécifiques à la page photographer.html
     * Description : Ces sélecteurs permettent de manipuler les éléments
     * liés aux détails et à la galerie d'un photographe spécifique.
     * ===========================================================
     */
    photographerPage: {
        photographerTitle: document.querySelector('#photograph-title'), // Titre affichant le nom du photographe.
        photographerLocation: document.querySelector('.photographer-card-location'), // Localisation (ville, pays) du photographe.
        photographerTagline: document.querySelector('.photographer-card-tagline'), // Slogan ou description du photographe.
        photographerProfileImage: document.querySelector('.photographer-card-portrait'), // Image de profil du photographe.
        galleryContainer: document.getElementById('gallery'), // Conteneur dynamique pour afficher la galerie des médias.
    },

    /**
     * ===========================================================
     * Section : Sélecteurs pour les templates HTML
     * Description : Ces sélecteurs regroupent les éléments modèles (templates),
     * permettant la génération dynamique d'éléments réutilisables.
     * ===========================================================
     */
    templates: {
        photographerTemplate: document.querySelector('#photographer-template'), // Template pour un photographe (page d'accueil).
        galleryItemTemplate: document.querySelector('#gallery-item-template'), // Template pour un élément de la galerie (image/vidéo).
        portraitWrapperTemplate: document.querySelector('#photographer-card-portrait-wrapper'), // Template pour le conteneur du portrait.
    },
};

// ===============================================================
// Export des sélecteurs
// Ce module est utilisé dans tous les fichiers JS de l'application
// pour centraliser les interactions avec le DOM de manière propre et efficace.
// ===============================================================
export default domSelectors;
