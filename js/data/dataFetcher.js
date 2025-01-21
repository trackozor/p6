// ========================================================
// Nom du fichier : datafetcher.js
// Description    : Utilitaires pour la récupération des données JSON
//                  avec gestion des timeouts, des erreurs et des retries.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 1.4.0 (Optimisé avec documentation enrichie)
// ========================================================

import { logEvent } from "../utils/utils.js";
/**
 * Cache global pour éviter les appels réseau répétitifs.
 * @type {Object|null}
 */
let mediaDataCache = null;
/**
 * Effectue une requête réseau avec gestion d'un délai d'expiration.
 * @async
 * @function fetchWithTimeout
 * @param {string} url - URL à requêter.
 * @param {Object} [options={}] - Options pour la requête fetch.
 * @param {number} [timeout=5000] - Temps maximum d'attente avant annulation (en ms).
 * @returns {Promise<Response>} La réponse HTTP ou une erreur en cas d'échec ou de timeout.
 * @throws {Error} En cas de timeout ou d'erreur réseau.
 */
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Récupère et valide des données JSON depuis une URL donnée, avec gestion des retries.
 * @async
 * @function fetchJSON
 * @param {string} url - URL du fichier JSON à récupérer.
 * @param {Object} [options={}] - Options pour la requête fetch.
 * @param {number} [timeout=10000] - Timeout personnalisé pour la requête (en ms).
 * @param {number} [retries=3] - Nombre de tentatives en cas d'échec.
 * @param {number} [retryDelay=1000] - Temps d'attente entre deux tentatives (en ms).
 * @returns {Promise<Object|null>} Données JSON récupérées, ou `null` en cas d'échec.
 * @throws {Error} Si toutes les tentatives échouent.
 */
export async function fetchJSON(
  url,
  options = {},
  timeout = 10000,
  retries = 3,
  retryDelay = 1000,
) {
  const cleanUrl = url?.replace(/\/+/g, "/").trim();

  if (typeof cleanUrl !== "string" || cleanUrl === "") {
    logEvent("error", "fetchJSON: URL fourni invalide ou vide.");
    return null;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logEvent(
        "info",
        `Tentative ${attempt} de récupération JSON depuis ${cleanUrl}.`,
      );

      const response = await fetchWithTimeout(cleanUrl, options, timeout);

      if (!response.ok) {
        const logType = response.status === 404 ? "error" : "warn";
        logEvent(logType, `Erreur HTTP (${response.status}) pour ${cleanUrl}`, {
          statusText: response.statusText,
        });
        if (response.status === 404) {
          break;
        } // Pas de retry pour une erreur 404
      } else {
        const jsonData = await response.json();
        if (typeof jsonData === "object" && jsonData !== null) {
          logEvent("success", `JSON récupéré avec succès depuis ${cleanUrl}.`, {
            data: jsonData,
          });
          return jsonData;
        } else {
          throw new Error("Données non valides ou mal formatées.");
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        logEvent("error", `Timeout dépassé pour ${cleanUrl}.`, { attempt });
      } else {
        logEvent(
          "error",
          `Erreur lors de la récupération JSON : ${error.message}`,
          { attempt },
        );
      }

      if (attempt < retries) {
        logEvent(
          "info",
          `Nouvelle tentative pour ${cleanUrl} après ${retryDelay}ms.`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        logEvent(
          "error",
          `Échec de la récupération JSON après ${retries} tentatives.`,
        );
      }
    }
  }

  logEvent(
    "test_end",
    `Fin de la récupération JSON pour ${cleanUrl} avec échec.`,
  );
  return null;
}

/*
 * Récupère les données JSON pour les photographes et leurs médias.
 * Utilise un cache pour éviter les requêtes répétées.
 * @async
 * @function fetchMedia
 * @param {string} url - URL du fichier JSON contenant les données des médias.
 * @returns {Promise<Object|null>} Données JSON validées ou `null` en cas d'échec.
 * @throws {Error} Si les données récupérées ne respectent pas la structure attendue.
 */
export async function fetchMedia(
  url = "../../../assets/data/photographers.json",
) {
  if (mediaDataCache) {
    logEvent("info", "Données récupérées depuis le cache.");
    return mediaDataCache;
  }

  try {
    logEvent("info", `Début de la récupération des données depuis : ${url}`);
    const data = await fetchJSON(url);

    if (!data || !data.photographers || !data.media) {
      throw new Error(
        "Structure inattendue du fichier JSON. Assurez-vous que les clés 'photographers' et 'media' sont présentes.",
      );
    }

    logEvent("success", "Données récupérées et validées avec succès.");
    mediaDataCache = data; // Stocker dans le cache
    return data;
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de la récupération des données JSON. Vérifiez le chemin ou la structure du fichier.",
      { error },
    );
    return null;
  }
}
