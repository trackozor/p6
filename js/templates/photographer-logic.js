/**
 * Crée une carte de photographe à partir des données fournies
 * @param {Object} data - Données du photographe
 * @param {string} data.name - Nom du photographe
 * @param {string} data.portrait - Nom du fichier portrait
 * @param {number} data.id - Identifiant du photographe
 * @param {string} data.city - Ville du photographe
 * @param {string} data.country - Pays du photographe
 * @param {string} data.tagline - Slogan du photographe
 * @param {number} data.price - Prix journalier du photographe
 * @returns {Object} Objet contenant les données et une méthode pour générer le DOM
 */
export function photographerTemplate(data) {
    // Validation des données fournies
    if (!data || !data.name || !data.portrait || !data.id) {
        throw new Error("Données du photographe invalides ou incomplètes.");
    }

    const { name, portrait, id, city, country, tagline, price } = data;

    // Générer le chemin complet de l'image du photographe
    const picture = `../../assets/photographers/Photographer/${portrait}`;

    // Crée un élément DOM avec une classe et un contenu textuel
    const createElement = (tagName, className, textContent) => {
        const element = document.createElement(tagName);
        if (className) {
            element.classList.add(className);
        }
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    };

    // Génère le DOM de la carte du photographe
    const getUserCardDOM = () => {
        // Conteneur principal (article)
        const article = document.createElement('article');
        article.classList.add('photographer-card');

        // Image circulaire
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Portrait de ${name}`);
        img.classList.add('photographer-card-portrait');

        // Crée les autres éléments
        const h3 = createElement('h3', 'photographer-card-name', name);
        const location = createElement('p', 'photographer-card-location', `${city}, ${country}`);
        const taglineElement = createElement('p', 'photographer-card-tagline', tagline);
        const priceElement = createElement('p', 'photographer-card-price', `${price}€/jour`);

        // Ajouter les éléments dans l'article
        article.append(img, h3, location, taglineElement, priceElement);

        // Ajouter un lien qui encapsule l'article
        const link = document.createElement('a');
        link.setAttribute("href", `../../html/photographer.html?id=${id}`);
        link.setAttribute("aria-label", `Voir la page de ${name}`);
        link.appendChild(article); // L'article est à l'intérieur du lien

        return link; // Retourne le lien complet
    };

    // Retourne les données du photographe et la méthode pour générer le DOM
    return { name, picture, getUserCardDOM };
}
