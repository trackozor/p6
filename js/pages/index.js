// ----------------------------------------
// Variables globales
// ----------------------------------------

// Liste d'articles (exemple de données locales)
const articles = [
    { title: "Article 1", content: "Contenu du premier article." },
    { title: "Article 2", content: "Contenu du deuxième article." },
    { title: "Article 3", content: "Contenu du troisième article." },
    { title: "Article 4", content: "Contenu du quatrième article." },
    { title: "Article 5", content: "Contenu du cinquième article." },
    { title: "Article 6", content: "Contenu du sixième article." }
];

// Sélecteurs DOM
const photographersSection = document.querySelector(".photographer_section");

// Chemin vers le fichier JSON des photographes
const PHOTOGRAPHERS_JSON_PATH = "/assets/data/photographers.json";
const PHOTO_BASE_PATH = "/assets/images/photographers/"; // Dossier contenant les photos des photographes 
// ----------------------------------------
// Fonctions
// ----------------------------------------

/**
 * Récupère les données des photographes depuis un fichier JSON
 * @returns {Promise<Object>} Les données des photographes
 */
async function getPhotographers() {
    try {
        const response = await fetch(PHOTOGRAPHERS_JSON_PATH);

        // Vérifie si la réponse est valide
        if (!response.ok) {
            LogEvent('info', `Données récupérées avec succès depuis ${PHOTOGRAPHERS_JSON_PATH}`, { status: response.status });
        }

        // Parse le fichier JSON et retourne les données
        return await response.json();
    } catch (error) {
        // Log de l'erreur pour le débogage
        LogEvent('error', "Erreur lors du chargement des photographes", { message: error.message, stack: error.stack });

        // Retourne une structure vide par défaut
        return { photographers: [] };
    }
}

/**
 * Affiche les données des photographes dans la section correspondante
 * @param {Array} photographers - Liste des photographes à afficher
 */
async function displayData(photographers) {
    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

/**
 * Fonction d'initialisation principale
 */
async function init() {
    // Récupère les données des photographes
    const { photographers } = await getPhotographers();
    console.log(photographers)
    // Affiche les données dans le DOM
    displayData(photographers);
}

// ----------------------------------------
// Exécution
// ----------------------------------------
init();
