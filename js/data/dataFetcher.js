// ========================================================
// Nom du fichier : fetchJSON.js
// Description    : Utilitaires pour la récupération des données JSON
//                  avec gestion des timeouts et des erreurs.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.1.0
// ========================================================

import { logEvent } from '../utils/utils.js';

/**
 * ========================================================
 * Fonction : fetchWithTimeout
 * Description : Effectue une requête réseau avec gestion d'un délai d'expiration.
 * ========================================================
 * @async
 * @function fetchWithTimeout
 * @param {string} path - Chemin ou URL à requêter.
 * @param {number} [timeout=5000] - Temps maximum d'attente avant d'annuler la requête (en ms).
 * @returns {Promise<Response>} La réponse HTTP ou une erreur en cas d'échec/timeout.
 * @throws {AbortError} Si le délai est dépassé ou que la requête est annulée.
 * @throws {Error} Si une erreur réseau survient.
 * 
 * @example
 * fetchWithTimeout('https://api.example.com/data', 5000)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
async function fetchWithTimeout(path, timeout = 5000) {
    const controller = new AbortController(); // Contrôleur pour annuler la requête
    const id = setTimeout(() => controller.abort(), timeout); // Annule après le délai

    try {
        const response = await fetch(path, { signal: controller.signal });
        clearTimeout(id); // Nettoie le timeout si la requête réussit
        return response; // Retourne la réponse HTTP
    } catch (error) {
        clearTimeout(id); // Nettoie le timeout en cas d'erreur
        throw error; // Propagation de l'erreur
    }
}

/**
 * ========================================================
 * Fonction : fetchJSON
 * Description : Récupère et valide des données JSON depuis une URL donnée.
 * ========================================================
 * @async
 * @function fetchJSON
 * @param {string} path - Chemin ou URL du fichier JSON.
 * @param {number} [timeout=10000] - Timeout personnalisé pour la requête (en ms).
 * @returns {Promise<Object|null>} Données JSON récupérées, ou `null` en cas d'échec.
 * 
 * @throws {AbortError} Si le délai est dépassé.
 * @throws {Error} Si une erreur réseau ou d'analyse JSON survient.
 * 
 * @example
 * fetchJSON('https://api.example.com/data.json', 10000)
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
export async function fetchJSON(path, timeout = 10000) {
    try {
        // Vérifie que le chemin est valide
        if (typeof path !== 'string' || !path.trim()) {
            logEvent('error', "Chemin fourni invalide ou vide.");
            return null;
        }

        // Nettoie le chemin pour éviter les doublons de `/`
        const cleanPath = path.replace(/\/+/g, '/');

        logEvent('test_start', `Début de la récupération JSON depuis ${cleanPath}`);

        // Récupère la réponse via fetchWithTimeout
        const response = await fetchWithTimeout(cleanPath, timeout);

        // Vérifie l'état HTTP
        if (!response.ok) {
            const logType = response.status === 404 ? 'error' : 'warn';
            logEvent(logType, `Erreur HTTP (${response.status}) pour ${cleanPath}`, { statusText: response.statusText });
            return null;
        }

        // Parse les données en JSON
        const jsonData = await response.json();

        // Vérifie la validité des données JSON
        if (typeof jsonData !== 'object' || jsonData === null) {
            logEvent('error', "Données récupérées non valides ou non formatées en JSON.");
            return null;
        }

        // Succès
        logEvent('success', `JSON récupéré avec succès depuis ${cleanPath}`, { data: jsonData });
        logEvent('test_end', `Fin de la récupération JSON depuis ${cleanPath}`);
        return jsonData;
    } catch (error) {
        // Gestion des erreurs de timeout ou autres
        if (error.name === 'AbortError') {
            logEvent('error', "Timeout dépassé lors de la récupération des données JSON.", { path });
        } else {
            logEvent('error', "Erreur inattendue lors de la récupération JSON.", { message: error.message });
        }

        logEvent('test_end', `Fin de la récupération JSON avec erreur.`);
        return null;
    }
}

