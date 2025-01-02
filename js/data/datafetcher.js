
import { logEvent } from '/js/utils/utils.js'; // Utilitaire de logging
/**
 * Récupère les données JSON depuis un chemin donné.
 * @param {string} path - Chemin vers le fichier JSON.
 * @returns {Promise<Object>} Les données JSON.
 */
export async function fetchJSON(path) {
    try {
        logEvent('test_start', `Début de la récupération des données depuis ${path}`);
        const response = await fetch(path);

        if (!response.ok) {
            logEvent('warn', `Erreur lors de la récupération de ${path}`, { status: response.status });
            return null;
        }

        logEvent('success', `Données récupérées avec succès depuis ${path}`);
        return await response.json();
    } catch (error) {
        logEvent('error', "Erreur lors du fetch JSON", { message: error.message, stack: error.stack });
        return null;
    }
}