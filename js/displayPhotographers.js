// 📌 Récupère les photographes depuis JSON Server
async function fetchPhotographers() {
    try {
        const response = await fetch("http://localhost:3001/photographers");
        const photographers = await response.json();

        if (!Array.isArray(photographers)) {
            throw new Error("Données invalides reçues de l'API.");
        }

        console.log("📸 Photographers récupérés :", photographers);
        return photographers;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des photographes :", error);
        return [];
    }
}

// 📌 Affiche les photographes dans la galerie
async function displayPhotographers() {
    const photographersContainer = document.getElementById("photographers-container");
    if (!photographersContainer) {
        console.error("❌ Le conteneur des photographes est introuvable.");
        return;
    }

    const photographers = await fetchPhotographers();
    
    if (photographers.length === 0) {
        photographersContainer.innerHTML = "<p>Aucun photographe trouvé.</p>";
        return;
    }

    photographersContainer.innerHTML = ""; // Vide le contenu actuel

    photographers.forEach(photographer => {
        const photographerCard = document.createElement("article");
        photographerCard.classList.add("photographer-card");

        photographerCard.innerHTML = `
            <img src="./assets/photographers/${photographer.portrait}" alt="${photographer.name}" class="photographer-card-portrait">
            <h3>${photographer.name}</h3>
            <p class="location">${photographer.city}, ${photographer.country}</p>
            <p class="tagline">${photographer.tagline}</p>
            <p class="price">${photographer.price}€/jour</p>
            <a href="./photographer.html?id=${photographer.id}" class="view-profile">Voir le portfolio</a>
        `;

        photographersContainer.appendChild(photographerCard);
    });

    console.log("✅ Photographers affichés !");
}

// 📌 Lance l'affichage quand la page charge
document.addEventListener("DOMContentLoaded", displayPhotographers);
