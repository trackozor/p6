// ----------------------------------------
// Fonctions de Logging
// ----------------------------------------

/**
 * Log un message avec horodatage et niveau de gravité.
 * @param {string} level - Le niveau de gravité (INFO, WARNING, ERROR).
 * @param {string} message - Le message à afficher.
 */
export function log(level, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
}

/**
 * Log une erreur avec stack trace.
 * @param {Error} error - L'objet erreur à logger.
 */
export function logError(error) {
    console.error(`[${new Date().toISOString()}] [ERROR] ${error.message}`, error.stack);
}

// ----------------------------------------
// Validation et Vérifications
// ----------------------------------------

/**
 * Vérifie si une valeur est un nombre valide.
 * @param {any} value - La valeur à tester.
 * @returns {boolean} - `true` si c'est un nombre, `false` sinon.
 */
export function isValidNumber(value) {
    return typeof value === "number" && !isNaN(value);
}

/**
 * Vérifie si une chaîne de caractères est un email valide.
 * @param {string} email - L'email à valider.
 * @returns {boolean} - `true` si c'est valide, `false` sinon.
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Vérifie si un tableau est vide ou invalide.
 * @param {Array} array - Le tableau à vérifier.
 * @returns {boolean} - `true` si c'est vide ou invalide.
 */
export function isEmptyArray(array) {
    return !Array.isArray(array) || array.length === 0;
}

// ----------------------------------------
// Manipulation de Données
// ----------------------------------------

/**
 * Regroupe un tableau d'objets par une clé.
 * @param {Array} array - Le tableau à regrouper.
 * @param {string} key - La clé sur laquelle regrouper.
 * @returns {Object} - Un objet regroupé par la clé.
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Tri un tableau d'objets par une clé.
 * @param {Array} array - Le tableau à trier.
 * @param {string} key - La clé utilisée pour le tri.
 * @param {boolean} [ascending=true] - `true` pour un tri croissant, `false` pour décroissant.
 * @returns {Array} - Le tableau trié.
 */
export function sortBy(array, key, ascending = true) {
    return array.sort((a, b) => {
        if (a[key] < b[key]) return ascending ? -1 : 1;
        if (a[key] > b[key]) return ascending ? 1 : -1;
        return 0;
    });
}

// ----------------------------------------
// Gestion de Temps
// ----------------------------------------

/**
 * Retourne une date formatée en chaîne de caractères.
 * @param {Date} date - La date à formater.
 * @param {string} locale - La locale (ex: "fr-FR").
 * @returns {string} - La date formatée.
 */
export function formatDate(date, locale = "fr-FR") {
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Différence entre deux dates en jours.
 * @param {Date|string} date1 - Première date.
 * @param {Date|string} date2 - Deuxième date.
 * @returns {number} - La différence en jours.
 */
export function daysBetween(date1, date2) {
    const diff = Math.abs(new Date(date1) - new Date(date2));
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ----------------------------------------
// Tests et Débogage
// ----------------------------------------

/**
 * Exécute un test avec une description et un résultat.
 * @param {string} description - Description du test.
 * @param {Function} testFn - Fonction contenant le test.
 */
export function runTest(description, testFn) {
    try {
        testFn();
        log("INFO", `✅ Test réussi : ${description}`);
    } catch (error) {
        logError(new Error(`❌ Test échoué : ${description} - ${error.message}`));
    }
}

// ----------------------------------------
// Générateurs de Strings
// ----------------------------------------

/**
 * Génère un ID unique.
 * @returns {string} - Un identifiant unique.
 */
export function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Capitalise la première lettre d'une chaîne.
 * @param {string} str - La chaîne à capitaliser.
 * @returns {string} - La chaîne avec la première lettre en majuscule.
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ----------------------------------------
// Fonction Utilitaire pour Fetch
// ----------------------------------------

/**
 * Effectue une requête HTTP GET avec gestion des erreurs.
 * @param {string} url - L'URL de la requête.
 * @returns {Promise<any>} - Les données de la réponse.
 */
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        logError(error);
        throw error; // Rejette l'erreur pour la gestion en aval.
    }
}
