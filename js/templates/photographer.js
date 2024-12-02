function photographerTemplate(data) {
    const { name, portrait, id, } = data;

    const picture = `assets/photographers/Photographer/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        article.appendChild(img);
        article.appendChild(h2);
        

        // créer un lien qui va rediriger vers photographer.html
        // passer un identifiant à l'url
        // ex: /photographer.html?id=${id}


        return (article);
    }
    return { name, picture, getUserCardDOM }
}