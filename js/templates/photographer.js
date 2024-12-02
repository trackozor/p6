function photographerTemplate(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/Photographer/${portrait}`;

    function getUserCardDOM() {
        // Conteneur principal (article)
        const article = document.createElement('article');
        article.classList.add('photographer-card');

        // Image circulaire
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Portrait de ${name}`);
        img.classList.add('photographer-card-portrait');

        // Nom du photographe
        const h3 = document.createElement('h3');
        h3.textContent = name;
        h3.classList.add('photographer-card-name');

        // Localisation (Ville, Pays)
        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        location.classList.add('photographer-card-location');

        // Slogan ou tagline
        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        taglineElement.classList.add('photographer-card-tagline');

        // Prix journalier
        const priceElement = document.createElement('p');
        priceElement.textContent = `${price}€/jour`;
        priceElement.classList.add('photographer-card-price');

        // Ajouter tous les éléments dans l'article
        article.appendChild(img);
        article.appendChild(h3);
        article.appendChild(location);
        article.appendChild(taglineElement);
        article.appendChild(priceElement);

        // Ajouter un lien qui encapsule l'article
        const link = document.createElement('a');
        link.setAttribute("href", `/html/photographer.html?id=${id}`);
        link.setAttribute("aria-label", `Voir la page de ${name}`);
        link.appendChild(article); // L'article est à l'intérieur du lien

        return link; // Retourne le lien complet
    }

    return { name, picture, getUserCardDOM };
}
