/**
 * ========================================================
 * Nom du fichier : photographer-logic.js
 * Description    : Génère des structures DOM pour afficher
 *                  les données des photographes sur différentes pages.
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 2.2.0
 * ========================================================
 */

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
    throw new Error("Les données du photographe doivent être un objet valide.");
  }

  const requiredFields = ["name", "portrait", "id", "city", "country"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Données du photographe invalides. Champs manquants : ${missingFields.join(
        ", ",
      )}.`,
    );
  }

  // =============================
  // EXTRACTION DES DONNÉES
  // =============================
  const { name, portrait, id, city, country, tagline = "", price = 0 } = data;
  const picture = `../../assets/photographers/Photographer/${portrait}`;

  // =============================
  // FONCTIONS UTILITAIRES
  // =============================

  /**
   * Crée un élément DOM avec des classes, du contenu textuel et des attributs supplémentaires.
   *
   * @param {string} tagName - Nom de la balise HTML.
   * @param {Object} [options] - Options pour personnaliser l'élément.
   * @param {string} [options.className] - Classe CSS à ajouter.
   * @param {string} [options.textContent] - Contenu textuel de l'élément.
   * @param {Object} [options.attributes] - Attributs supplémentaires à ajouter.
   * @returns {HTMLElement} Élément DOM créé.
   */
  const createElement = (
    tagName,
    { className, textContent, attributes } = {},
  ) => {
    const element = document.createElement(tagName);
    if (className) {
      element.classList.add(className);
    }
    if (textContent) {
      element.textContent = textContent;
    }
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) =>
        element.setAttribute(key, value),
      );
    }
    return element;
  };

  // =============================
  // MÉTHODES DE GÉNÉRATION DE DOM
  // =============================

  /**
   * Génère le DOM pour la carte du photographe (utilisée sur la page d'accueil).
   *
   * @returns {HTMLElement} Élément DOM contenant la carte du photographe.
   */
  const getUserCardDOM = () => {
    const article = createElement("article", {
      className: "photographer-card",
    });

    const img = createElement("img", {
      attributes: {
        src: picture,
        alt: `Portrait de ${name}`,
      },
      className: "photographer-card-portrait",
    });

    const h3 = createElement("h3", {
      className: "photographer-card-name",
      textContent: name,
    });

    const location = createElement("p", {
      className: "photographer-card-location",
      textContent: `${city}, ${country}`,
    });

    const taglineElement = createElement("p", {
      className: "photographer-card-tagline",
      textContent: tagline,
    });

    const priceElement = createElement("p", {
      className: "photographer-card-price",
      textContent: `${price}€/jour`,
    });

    article.append(img, h3, location, taglineElement, priceElement);

    const link = createElement("a", {
      attributes: {
        href: `../../html/photographer.html?id=${id}`,
        "aria-label": `Voir la page de ${name}`,
      },
    });

    link.appendChild(article);
    return link;
  };

  /**
   * Génère le DOM pour la bannière du photographe (utilisée sur la page photographe).
   *
   * @returns {HTMLElement} Élément DOM contenant la bannière du photographe.
   */
  const getBannerDOM = () => {
    const section = createElement("section", {
      className: "photographer-info",
      attributes: { "aria-labelledby": "photograph-title" },
    });

    const article = createElement("article", {
      className: "photographer-profile",
    });

    const h2 = createElement("h2", {
      id: "photograph-title",
      textContent: name,
    });

    const location = createElement("p", {
      className: "photographer-card-location",
      textContent: `${city}, ${country}`,
    });

    const taglineElement = createElement("p", {
      className: "photographer-card-tagline",
      textContent: tagline,
    });

    const img = createElement("img", {
      attributes: {
        src: picture,
        alt: `Portrait de ${name}`,
        loading: "lazy",
      },
      className: "photographer-card-portrait",
    });

    const button = createElement("button", {
      className: "contact_button",
      textContent: "Contactez-moi",
      attributes: {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-controls": "contact_modal",
      },
    });

    article.append(h2, location, taglineElement);
    section.append(article, button, img);

    return section;
  };

  // =============================
  // RETOUR DES MÉTHODES
  // =============================

  return { name, picture, getUserCardDOM, getBannerDOM };
}
