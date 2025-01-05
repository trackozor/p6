// ========================================================
// Nom du fichier : dataFetcher.js
// Description    : Utilitaires pour la récupération des données JSON avec gestion des timeouts
// Auteur         : Trackozor
// Date           : 05/01/2025
// Version        : 1.0.0
// ========================================================

import { logEvent } from '/js/utils/utils.js'; // Utilitaire de logging

/**
 * ========================================================
 * Fonction : fetchWithTimeout
 * Description : Effectue une requête réseau avec un délai d'expiration (timeout).
 * ========================================================
 */

/**
 * Effectue une requête réseau avec un délai d'expiration.
 * @async
 * @function fetchWithTimeout
 * @param {string} path - URL ou chemin vers la ressource à récupérer.
 * @param {number} [timeout=5000] - Temps maximum d'attente pour la réponse, en millisecondes.
 * @returns {Promise<Response>} La réponse de la requête fetch ou une erreur si le timeout est dépassé.
 * @throws {AbortError} Si le délai est dépassé ou que la requête est annulée.
 * @throws {Error} Si une erreur réseau survient.
 */
async function fetchWithTimeout(path, timeout = 5000) {
    const controller = new AbortController(); // Contrôleur pour gérer l'annulation
    const id = setTimeout(() => controller.abort(), timeout); // Déclenche l'annulation après le délai spécifié

    try {
        // Envoie la requête avec gestion d'annulation
        const response = await fetch(path, { signal: controller.signal });
        clearTimeout(id); // Annule le timeout si la requête réussit
        return response; // Retourne la réponse HTTP
    } catch (error) {
        clearTimeout(id); // Nettoie le timeout en cas d'erreur
        throw error; // Propagation de l'erreur pour gestion par l'appelant
    }
}

/**
 * ========================================================
 * Fonction : fetchJSON
 * Description : Récupère et valide des données JSON depuis un chemin ou une URL.
 * ========================================================
 */

/**
 * Récupère et valide des données JSON depuis une URL donnée.
 * @async
 * @function fetchJSON
 * @param {string} path - Chemin ou URL vers le fichier JSON à récupérer.
 * @returns {Promise<Object|null>} Les données JSON en cas de succès, ou `null` en cas d'erreur.
 * @throws {AbortError} Si la requête dépasse le délai spécifié.
 * @throws {Error} Si une erreur réseau ou d'analyse JSON survient.
 */
export async function fetchJSON(path) {
    try {
        // Validation du paramètre `path`
        if (typeof path !== 'string' || !path.trim()) {
            logEvent('error', "Le chemin fourni est invalide ou vide.");
            return null;
        }

        // Début de la récupération des données
        logEvent('test_start', `Début de la récupération des données depuis ${path}`);

        // Effectue la requête avec un timeout de 10 secondes
        const response = await fetchWithTimeout(path, 10000);

        // Vérification de l'état HTTP
        if (!response.ok) {
            logEvent('warn', `Erreur HTTP lors de la récupération de ${path}`, { status: response.status });
            return null;
        }

        // Analyse des données JSON
        const jsonData = await response.json();

        // Validation des données JSON
        if (typeof jsonData !== 'object' || jsonData === null) {
            logEvent('error', "Les données récupérées ne sont pas un objet JSON valide.");
            return null;
        }

        // Succès
        logEvent('success', `Données récupérées avec succès depuis ${path}`, { data: jsonData });
        return jsonData;
    } catch (error) {
        if (error.name === 'AbortError') {
            // Gestion des erreurs de timeout
            logEvent('error', "La requête a expiré (timeout).", { path });
        } else {
            // Gestion des erreurs réseau ou d'analyse JSON
            logEvent('error', "Erreur lors de la récupération des données JSON.", {
                message: error.message,
                stack: error.stack,
            });
        }
        return null; // Retourne `null` en cas d'erreur
    }
}

