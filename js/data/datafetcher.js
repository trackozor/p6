import { logEvent } from '/js/utils/utils.js'; // Utilitaire de logging

/**
 * Récupère les données JSON depuis un chemin donné avec timeout.
 * @param {string} path - Chemin vers le fichier JSON.
 * @param {number} timeout - Temps maximum d'attente en millisecondes.
 * @returns {Promise<Object|null>} Les données JSON ou null en cas d'erreur.
 */
async function fetchWithTimeout(path, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(path, { signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export async function fetchJSON(path) {
    try {
        // Validation du chemin
        if (typeof path !== 'string' || !path.trim()) {
            logEvent('error', "Le chemin fourni est invalide ou vide.");
            return null;
        }

        logEvent('test_start', `Début de la récupération des données depuis ${path}`);
        const response = await fetchWithTimeout(path, 10000); // Timeout de 10 secondes

        // Vérifie si la réponse est valide
        if (!response.ok) {
            logEvent('warn', `Erreur lors de la récupération de ${path}`, { status: response.status });
            return null;
        }

        const jsonData = await response.json();

        // Validation du contenu JSON
        if (typeof jsonData !== 'object' || jsonData === null) {
            logEvent('error', "Les données récupérées ne sont pas un objet JSON valide.");
            return null;
        }

        logEvent('success', `Données récupérées avec succès depuis ${path}`, { data: jsonData });
        return jsonData;
    } catch (error) {
        if (error.name === 'AbortError') {
            logEvent('error', "La requête a expiré (timeout).", { path });
        } else {
            logEvent('error', "Erreur lors du fetch JSON", { message: error.message, stack: error.stack });
        }
        return null;
    }
}
