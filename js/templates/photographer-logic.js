/**
 * ========================================================
 * Nom du fichier : photographer-logic.js
 * Description    : Génère des structures DOM pour afficher
 *                  les données des photographes sur différentes pages.
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 2.2.1
 * ========================================================
 */

import { logEvent } from "../utils/utils.js";
import { initModal } from "../events/eventlisteners.js";

/**
 * Crée une structure pour afficher les données du photographe.
 *
 * @param {Object} data - Données du photographe.
 * @param {string} data.name - Nom du photographe.
 * @param {string} data.portrait - Nom du fichier portrait.
 * @param {number} data.id - Identifiant du photographe.
 * @param {string} data.city - Ville du photographe.
 * @param {string} data.country - Pays du photographe.
 * @param {string} [data.tagline=""] - Slogan du photographe.
 * @param {number} [data.price=0] - Prix journalier du photographe.
 * @returns {Object} Objet contenant les méthodes pour générer différents DOM.
 * @throws {Error} Si les données fournies sont invalides.
 */
export function photographerTemplate(data) {
    // =============================
    // VALIDATION DES DONNÉES
    // =============================
    if (!data || typeof data !== "object") {
        logEvent("error", "Les données du photographe doivent être un objet valide.", { data })
        throw new Error("Les données du photographe doivent être un objet valide.")
    }

    const requiredFields = ["name", "portrait", "id", "city", "country"]
    const missingFields = requiredFields.filter(field => !data[field])

    if (missingFields.length > 0) {
        const errorMessage = `Données du photographe invalides. Champs manquants : ${missingFields.join(", ")}.`
        logEvent("error", errorMessage, { data })
        throw new Error(errorMessage)
    }

// =============================
// EXTRACTION DES DONNÉES
// =============================
    const { name, portrait, id, city, country, tagline = "", price = 0 } = data
    const picture = `../../assets/photographers/Photographer/${portrait}`

/* ============================================================================= */
/* SECTION : FONCTIONS UTILITAIRES                                               */
/* ============================================================================= */

/**
 * Crée un élément DOM avec des classes CSS, du texte et des attributs personnalisés.
 *
 * - Valide les entrées pour éviter les erreurs inattendues.
 * - Permet l'ajout dynamique de classes et d'attributs.
 * - Gère les erreurs et logue les éventuels problèmes de création.
 *
 * @param {string} tagName - Nom de la balise HTML à créer.
 * @param {Object} [options={}] - Options de personnalisation.
 * @param {string} [options.className=""] - Classes CSS à ajouter (séparées par un espace).
 * @param {string} [options.textContent=""] - Contenu textuel de l'élément.
 * @param {Object} [options.attributes={}] - Attributs HTML supplémentaires à ajouter.
 * @returns {HTMLElement} - Élément DOM généré.
 * @throws {Error} - Génère une erreur en cas de problème lors de la création.
 */
function createElement(tagName, { className = "", textContent = "", attributes = {} } = {}) {
    try {
        // Validation du paramètre `tagName`
        if (typeof tagName !== "string" || !tagName.trim()) {
            throw new Error("Le paramètre 'tagName' doit être une chaîne de caractères valide.");
        }

        // Création de l'élément DOM
        const element = document.createElement(tagName);

        // Ajout des classes CSS si spécifiées
        if (className && typeof className === "string") {
            element.classList.add(...className.trim().split(/\s+/));
        }

        // Ajout du contenu textuel si spécifié
        if (textContent && typeof textContent === "string") {
            element.textContent = textContent;
        }

        // Ajout des attributs HTML si spécifiés
        if (attributes && typeof attributes === "object") {
            Object.entries(attributes).forEach(([key, value]) => {
                if (typeof key === "string" && key.trim() && value !== undefined) {
                    element.setAttribute(key, value);
                }
            });
        }

        return element;
    } catch (error) {
        logEvent("error", `Erreur lors de la création de l'élément <${tagName}>.`, { error });
        throw error; // Propagation de l'erreur pour gestion en amont
    }
}



/* ============================================================================= */
/* SECTION : MÉTHODES DE GÉNÉRATION DE DOM                                       */
/* ============================================================================= */

/**
 * Génère le DOM pour la carte du photographe (utilisée sur la page d'accueil).
 *
 * - Vérifie la validité des données avant exécution.
 * - Utilise `createElement()` pour garantir une structure modulaire et réutilisable.
 * - Applique un `try/catch` pour capturer et loguer toute erreur potentielle.
 *
 * @returns {HTMLElement | null} Élément DOM contenant la carte du photographe ou `null` en cas d'erreur.
 * @throws {Error} Si les données du photographe sont invalides.
 */
function getUserCardDOM() {
    try {
        // Validation des données requises
        if (!name || !picture || !id || !city || !country || !price) {
            throw new Error(`Données invalides pour la carte du photographe. Vérifiez les valeurs.`);
        }

        // Création de la structure principale de la carte
        const article = createElement("article", { className: "photographer-card" });

        // Création de l'image du photographe
        const img = createElement("img", {
            className: "photographer-card-portrait",
            attributes: {
                src: picture,
                alt: `Portrait de ${name}`,
                loading: "lazy", // Optimisation du chargement
            },
        });

        // Création du nom du photographe
        const h3 = createElement("h3", { 
            className: "photographer-card-name", 
            textContent: name 
        });

        // Création de l'emplacement (ville + pays)
        const location = createElement("p", { 
            className: "photographer-card-location", 
            textContent: `${city}, ${country}` 
        });

        // Création du slogan du photographe
        const taglineElement = createElement("p", { 
            className: "photographer-card-tagline", 
            textContent: tagline || "Photographe sans slogan." // Valeur par défaut
        });

        // Création du prix journalier
        const priceElement = createElement("p", { 
            className: "photographer-card-price", 
            textContent: `${price}€/jour` 
        });

        // Ajout des éléments à l'article
        article.append(img, h3, location, taglineElement, priceElement);

        // Création du lien vers la page du photographe
        const link = createElement("a", {
            attributes: {
                href: `../../html/photographer.html?id=${id}`,
                "aria-label": `Voir la page de ${name}`,
            },
        });

        link.appendChild(article);

        logEvent("success", `Carte du photographe ${name} générée avec succès.`);
        return link;

    } catch (error) {
        logEvent("error", `Erreur lors de la génération de la carte pour ${name || "Photographe inconnu"}.`, { error });
        return null; // Retourne `null` en cas d'erreur pour éviter un crash
    }
}



/* ============================================================================= */
/* SECTION : GÉNÉRATION DU DOM - BANNIÈRE DU PHOTOGRAPHE                          */
/* ============================================================================= */

/**
 * Génère la bannière du photographe affichée sur la page photographe.
 *
 * - Vérifie la validité des données avant la création du DOM.
 * - Crée dynamiquement les éléments HTML nécessaires (titre, localisation, slogan, image, bouton de contact).
 * - Assure l’accessibilité avec `aria-labelledby`, `aria-haspopup` et `aria-controls`.
 * - Utilise `loading="lazy"` sur l’image pour améliorer les performances.
 * - Gère les erreurs avec un `try/catch` pour éviter les plantages.
 *
 * @returns {HTMLElement | null} Élément DOM contenant la bannière du photographe ou `null` en cas d'erreur.
 */
function getBannerDOM() {
    try {
        // Validation des données obligatoires
        if (!name || !picture || !city || !country) {
            throw new Error(`Données incomplètes pour la bannière du photographe. Vérifiez les valeurs.`);
        }

        // Création de la section principale de la bannière
        const section = createElement("section", {
            className: "photographer-info",
            attributes: { "aria-labelledby": "photograph-title" },
        });

        // Conteneur du profil du photographe
        const article = createElement("article", { className: "photographer-profile" });

        // Titre du photographe
        const h2 = createElement("h2", { 
            id: "photograph-title", 
            textContent: name 
        });

        // Localisation du photographe
        const location = createElement("p", { 
            className: "photographer-card-location", 
            textContent: `${city}, ${country}` 
        });

        // Slogan du photographe avec une valeur par défaut
        const taglineElement = createElement("p", { 
            className: "photographer-card-tagline", 
            textContent: tagline || "Photographe professionnel." 
        });

        // Image du photographe avec chargement optimisé
        const img = createElement("img", {
            className: "photographer-card-portrait",
            attributes: {
                src: picture,
                alt: `Portrait de ${name}`,
                loading: "lazy",
            },
        });

        // Bouton de contact avec accessibilité renforcée
        const button = createElement("button", {
            className: "contact-button",
            textContent: "Contactez-moi",
            attributes: {
                type: "button",
                "aria-haspopup": "dialog",
                "aria-controls": "contact_modal",
            },
        });

        logEvent("info", "Bouton de contact créé sans attacher d'événement ici.");

        // Assemblage des éléments
        article.append(h2, location, taglineElement);
        section.append(article, button, img);

        logEvent("success", `Bannière du photographe ${name} générée avec succès.`);
        return section;

    } catch (error) {
        logEvent("error", `Erreur lors de la génération de la bannière pour ${name || "Photographe inconnu"}.`, { error });
        return null; // Évite un plantage en cas d'erreur
    }
}



    return { name, getUserCardDOM, getBannerDOM }
}
