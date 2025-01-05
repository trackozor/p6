import { getPhotographerDetails, getPhotographerGallery } from '/js/modules/photographerManager.js';

async function initPhotographerPage() {
    const photographerId = getPhotographerIdFromURL();
    if (!photographerId) {
        console.error("ID du photographe manquant dans l'URL.");
        return;
    }

    // Récupérer les données du photographe
    const photographer = await getPhotographerDetails(photographerId);
    if (!photographer) return;

    // Injecter les informations du photographe dans le DOM
    document.querySelector('#photograph-title').textContent = photographer.name;
    document.querySelector('.photographer-card-portrait').src = `/assets/images/${photographer.portrait}`;
    document.querySelector('.photographer-card-portrait').alt = `Portrait ${photographer.name}`;
    document.querySelector('.photographer-card-location').textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector('.photographer-card-tagline').textContent = photographer.tagline;

    // Charger et afficher la galerie
    const gallery = await getPhotographerGallery(photographerId);
    displayGallery(gallery);
}

/**
 * Affiche les œuvres d'un photographe dans la galerie.
 * @param {Array} gallery - Liste des œuvres.
 */
function displayGallery(gallery) {
    const galleryContainer = document.getElementById('gallery');

    if (!gallery || gallery.length === 0) {
        galleryContainer.innerHTML = `<p>Aucune œuvre trouvée pour ce photographe.</p>`;
        return;
    }

    gallery.forEach((item, index) => {
        const template = document.getElementById('gallery-item-template').content.cloneNode(true);

        template.querySelector('.gallery-item').setAttribute('data-index', index + 1);
        template.querySelector('img').src = `/assets/images/${item.image}`;
        template.querySelector('img').alt = item.title || 'Œuvre sans titre';
        template.querySelector('figcaption').textContent = item.title;

        galleryContainer.appendChild(template);
    });
}

document.addEventListener('DOMContentLoaded', initPhotographerPage);
