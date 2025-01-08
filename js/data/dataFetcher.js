// ========================================================
// Nom du fichier : fetchJSON.js
// Description    : Utilitaires pour la récupération des données JSON
// avec gestion des timeouts et des erreurs
// ========================================================

import { logEvent } from '../utils/utils.js';

/**
 * Effectue une requête réseau avec gestion d'un délai d'expiration.
 * @param {string} path - Chemin ou URL à requêter.
 * @param {number} [timeout=5000] - Temps maximum d'attente avant d'annuler la requête (ms).
 * @returns {Promise<Response>} La réponse HTTP ou une erreur en cas d'échec/timeout.
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

/**
 * Récupère et valide des données JSON depuis une URL donnée.
 * @param {string} path - Chemin ou URL du fichier JSON.
 * @param {number} [timeout=10000] - Timeout personnalisé pour la requête (en ms).
 * @returns {Promise<Object|null>} Données JSON récupérées, ou `null` en cas d'échec.
 */
export async function fetchJSON(path, timeout = 10000) {
    try {
        if (typeof path !== 'string' || !path.trim()) {
            logEvent('error', "Chemin fourni invalide ou vide.");
            return null;
        }

        // Nettoie le chemin pour éviter les doublons de `/`
        const cleanPath = path.replace(/\/+/g, '/');

        logEvent('test_start', `Début de la récupération JSON depuis ${cleanPath}`);

        const response = await fetchWithTimeout(cleanPath, timeout);

        if (!response.ok) {
            const logType = response.status === 404 ? 'error' : 'warn';
            logEvent(logType, `Erreur HTTP (${response.status}) pour ${cleanPath}`, { statusText: response.statusText });
            return null;
        }

        const jsonData = await response.json();

        if (typeof jsonData !== 'object' || jsonData === null) {
            logEvent('error', "Données récupérées non valides ou non formatées en JSON.");
            return null;
        }

        logEvent('success', `JSON récupéré avec succès depuis ${cleanPath}`, { data: jsonData });
        logEvent('test_end', `Fin de la récupération JSON depuis ${cleanPath}`);
        return jsonData;
    } catch (error) {
        if (error.name === 'AbortError') {
            logEvent('error', "Timeout dépassé lors de la récupération des données JSON.", { path });
        } else {
            logEvent('error', "Erreur inattendue lors de la récupération JSON.", { message: error.message });
        }
        return null;
    }
}
