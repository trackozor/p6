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

// =============================
// FONCTIONS UTILITAIRES
// =============================

/**
 * Crée un élément DOM avec des classes, du contenu textuel et des attributs supplémentaires.
 *
 * @param {string} tagName - Nom de la balise HTML.
 * @param {Object} [options] - Options pour personnaliser l'élément.
 * @param {string} [options.className] - Classes CSS à ajouter (séparées par un espace).
 * @param {string} [options.textContent] - Contenu textuel de l'élément.
 * @param {Object} [options.attributes] - Attributs supplémentaires à ajouter.
 * @returns {HTMLElement} Élément DOM créé.
 */
function createElement(tagName, { className = "", textContent, attributes } = {}) {
    try {
        const element = document.createElement(tagName)
        if (className) {
            element.classList.add(...className.split(" ")) // Ajoute plusieurs classes CSS
        }
        if (textContent) {
            element.textContent = textContent
        }
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
        }
        return element
    } catch (error) {
        logEvent("error", `Erreur lors de la création de l'élément ${tagName}.`, { error })
        throw error
    }
}


// =============================
// MÉTHODES DE GÉNÉRATION DE DOM
// =============================


/**
 * Génère le DOM pour la carte du photographe (utilisée sur la page d'accueil).
 *
 * @returns {HTMLElement | null} Élément DOM contenant la carte du photographe ou null en cas d'erreur.
 */
function getUserCardDOM() {
    try {
        const article = createElement("article", { className: "photographer-card" })

        const img = createElement("img", {
            className: "photographer-card-portrait",
            attributes: { src: picture, alt: `Portrait de ${name}` },
        })

        const h3 = createElement("h3", { className: "photographer-card-name", textContent: name })
        const location = createElement("p", { className: "photographer-card-location", textContent: `${city}, ${country}` })
        const taglineElement = createElement("p", { className: "photographer-card-tagline", textContent: tagline })
        const priceElement = createElement("p", { className: "photographer-card-price", textContent: `${price}€/jour` })

        article.append(img, h3, location, taglineElement, priceElement)

        const link = createElement("a", {
            attributes: { href: `../../html/photographer.html?id=${id}`, "aria-label": `Voir la page de ${name}` },
        })

        link.appendChild(article)
        logEvent("success", `Carte du photographe ${name} générée avec succès.`)
        return link
    } catch (error) {
        logEvent("error", `Erreur lors de la génération de la carte pour ${name}.`, { error })
        return null // Retourne null en cas d'erreur pour éviter un plantage
    }
}

/**
 * Génère le DOM pour la bannière du photographe (utilisée sur la page photographe).
 *
 * @returns {HTMLElement} Élément DOM contenant la bannière du photographe.
 */
/**
 * Génère le DOM pour la bannière du photographe (utilisée sur la page photographe).
 *
 * @returns {HTMLElement} Élément DOM contenant la bannière du photographe.
 */
function getBannerDOM() {
    try {
        const section = createElement("section", {
            className: "photographer-info",
            attributes: { "aria-labelledby": "photograph-title" },
        })

        const article = createElement("article", { className: "photographer-profile" })
        const h2 = createElement("h2", { id: "photograph-title", textContent: name })
        const location = createElement("p", { className: "photographer-card-location", textContent: `${city}, ${country}` })
        const taglineElement = createElement("p", { className: "photographer-card-tagline", textContent: tagline })

        const img = createElement("img", {
            className: "photographer-card-portrait",
            attributes: { src: picture, alt: `Portrait de ${name}`, loading: "lazy" },
        })

        // Suppression de l'ajout de l'événement ici
        const button = createElement("button", {
            className: "contact-button",
            textContent: "Contactez-moi",
            attributes: { type: "button", "aria-haspopup": "dialog", "aria-controls": "contact_modal" },
        })

        logEvent("success", "✅ Bouton de contact créé sans attacher d'événement ici.")

        article.append(h2, location, taglineElement)
        section.append(article, button, img)

        logEvent("success", `Bannière du photographe ${name} générée avec succès.`)
        return section
    } catch (error) {
        logEvent("error", `Erreur lors de la génération de la bannière pour ${name}.`, { error })
        return null
    }
}


    return { name, getUserCardDOM, getBannerDOM }
}
