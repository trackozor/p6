// =================================================================================
// Nom du fichier : media-template-logic.js
// Description    : Gestion des médias et opérations associées pour un photographe.
// Auteur         : Trackozor
// Date           : 08/01/2025
// Version        : 2.1.0 (Ajout de logs enrichis, tests et gestion des exceptions)
// =================================================================================

import { fetchJSON } from "../data/dataFetcher.js";
import { logEvent } from "../utils/utils.js";

/* ===================== Fonction : Chargement des Médias ===================== */

/**
 * =============================================================================
 * Fonction : loadPhotographerMedia
 * =============================================================================
 * Récupère et filtre les médias pour un photographe spécifique à partir des données JSON.
 *
 * - Vérifie la validité des paramètres `photographerId` et `mediaDataUrl`.
 * - Charge les données médias depuis un fichier JSON distant.
 * - Filtre les médias appartenant au photographe spécifié.
 * - Valide chaque média pour s'assurer qu'il contient les informations requises.
 * - Gère les erreurs en retournant un tableau vide en cas de problème.
 *
 * @async
 * @function loadPhotographerMedia
 * @param {number} photographerId - ID unique du photographe.
 * @param {string} mediaDataUrl - URL du fichier JSON contenant les données des médias.
 * @returns {Promise<Array>} Une liste des médias filtrés et valides pour le photographe.
 */
export async function loadPhotographerMedia(photographerId, mediaDataUrl) {
    logEvent("info", "loadPhotographerMedia : Début du chargement des médias.", {
        photographerId,
        mediaDataUrl,
    });

    try {
         // Étape 1 : Validation des paramètres
         validatePhotographerMediaParams(photographerId, mediaDataUrl);

        // Étape 2 : Récupération des données JSON
        const data = await fetchJSON(mediaDataUrl);

        if (!data || !Array.isArray(data.media)) {
            throw new Error("Structure JSON invalide ou absente.");
        }

        logEvent("info", `loadPhotographerMedia : ${data.media.length} médias détectés dans le JSON.`);

        // Étape 3 : Filtrage et validation des médias
        const photographerMedia = data.media
            .filter(media => media.photographerId === photographerId) // Filtre par photographe
            .filter(isValidMedia); // Vérifie si les médias sont valides

        // Étape 4 : Gestion des résultats
        if (photographerMedia.length === 0) {
            logEvent("warning", "loadPhotographerMedia : Aucun média trouvé pour ce photographe.", { photographerId });
            return [];
        }

        logEvent("success", `loadPhotographerMedia : ${photographerMedia.length} médias valides chargés.`);
        return photographerMedia;

    } catch (error) {
        logEvent("error", "loadPhotographerMedia : Erreur lors du chargement des médias.", { error: error.message });
        return []; // Fallback en cas d'échec
    }
}

/**
 * =============================================================================
 * Fonction : validatePhotographerMediaParams
 * =============================================================================
 * Vérifie la validité des paramètres de `loadPhotographerMedia` avant exécution.
 *
 * - Vérifie si `photographerId` est un nombre entier strictement positif.
 * - Vérifie si `mediaDataUrl` est une chaîne de caractères non vide.
 * - Génère des logs détaillés pour faciliter le débogage.
 *
 * @param {number} photographerId - ID du photographe à valider.
 * @param {string} mediaDataUrl - URL du fichier JSON à valider.
 * @throws {Error} Si l'un des paramètres est invalide.
 */
function validatePhotographerMediaParams(photographerId, mediaDataUrl) {
    // Vérification que `photographerId` est un nombre entier valide
    const isValidId = Number.isInteger(photographerId) && photographerId > 0;

    if (!isValidId) {
        logEvent("error", "validatePhotographerMediaParams : ID du photographe invalide.", { photographerId });
        throw new Error("L'ID du photographe doit être un entier strictement positif.");
    }

    // Vérification que `mediaDataUrl` est une chaîne non vide
    const isValidUrl = typeof mediaDataUrl === "string" && mediaDataUrl.trim().length > 0;

    if (!isValidUrl) {
        logEvent("error", "validatePhotographerMediaParams : URL des médias invalide.", { mediaDataUrl });
        throw new Error("L'URL des données médias doit être une chaîne de caractères valide.");
    }
}

/**
 * =============================================================================
 * Fonction : isValidMedia
 * =============================================================================
 * Vérifie si un objet média contient toutes les propriétés requises.
 *
 * - Un média doit contenir un `id`, un `photographerId`, un `title` et
 *   soit une `image`, soit une `video`.
 * - Vérifie que `id` et `photographerId` sont des nombres valides.
 * - Vérifie que `title` est une chaîne de caractères.
 * - Vérifie que `image` ou `video` est présent sous forme de chaîne.
 * - Logue un avertissement en cas de média invalide.
 *
 * @param {Object} media - Objet représentant un média à valider.
 * @returns {boolean} `true` si le média est valide, sinon `false`.
 */
function isValidMedia(media) {
    // Vérification de l'existence de l'objet
    if (!media || typeof media !== "object") {
        logEvent("warn", "isValidMedia : Objet média invalide ou manquant.", { media });
        return false;
    }

    // Vérification des propriétés obligatoires
    const hasValidId = typeof media.id === "number";
    const hasValidPhotographerId = typeof media.photographerId === "number";
    const hasValidTitle = typeof media.title === "string" && media.title.trim().length > 0;
    const hasValidMediaFile = typeof media.image === "string" || typeof media.video === "string";

    // Si une des conditions est fausse, journaliser l'erreur et retourner false
    if (!hasValidId || !hasValidPhotographerId || !hasValidTitle || !hasValidMediaFile) {
        logEvent("warn", "isValidMedia : Média non valide détecté.", { media });
        return false;
    }

    // Si toutes les conditions sont respectées, le média est valide
    return true;
}


/**
 * =============================================================================
 * Fonction : createMediaItem
 * =============================================================================
 * Crée un élément média (image ou vidéo) sous forme d'un article HTML.
 *
 * - Vérifie la validité des paramètres reçus via `validateMediaParams()`.
 * - Génère un `<article>` contenant :
 *   - Une image ou une vidéo selon le type du média.
 *   - Un titre descriptif.
 *   - Un compteur de likes avec un bouton interactif.
 * - Retourne `null` en cas d'erreur et journalise chaque étape.
 *
 * @param {Object} media - Objet contenant les données du média.
 * @param {string} folderName - Nom du dossier où se trouve le média.
 * @param {number} position - Position du média dans la liste.
 * @returns {HTMLElement|null} Élément HTML `article` contenant le média, ou `null` en cas d'erreur.
 */
export function createMediaItem(media, folderName, position) {
    logEvent("info", "createMediaItem : Début de la création d'un élément média.", { media, folderName, position });

    try {
        // Étape 1 : Vérification des paramètres
        validateMediaParams(media, folderName);

        // Étape 2 : Création du conteneur principal `<article>`
        const mediaItem = document.createElement("article");
        mediaItem.className = "media-item";
        mediaItem.setAttribute("data-id", media.id);
        mediaItem.setAttribute("data-position", position || 0);

        // Étape 3 : Génération de l'élément média (image ou vidéo)
        const mediaElement = media.image
            ? createImageElement(media, folderName)
            : createVideoElement(media, folderName);

        if (!mediaElement) {
            logEvent("warn", `createMediaItem : Échec de la création du média pour l'ID ${media.id}.`, { media });
            return null;
        }

        // Étape 4 : Ajout du média et de sa légende
        mediaItem.appendChild(mediaElement);
        mediaItem.appendChild(createMediaCaption(media));

        logEvent("success", "createMediaItem : Élément média créé avec succès.", { mediaItem });

        return mediaItem;
    } catch (error) {
        logEvent("error", "createMediaItem : Erreur lors de la création du média.", { error: error.message });
        return null;
    }
}


/**
 * =============================================================================
 * Fonction : validateMediaParams
 * =============================================================================
 * Vérifie la validité des paramètres avant la création du média.
 *
 * - Vérifie si `media` est un objet non vide.
 * - Vérifie si `folderName` est une chaîne valide.
 * - Vérifie si `media` possède au moins un des champs attendus (`image` ou `video`).
 * - Génère des logs d'erreur détaillés en cas de problème.
 *
 * @param {Object} media - Objet média à valider.
 * @param {string} folderName - Nom du dossier contenant les fichiers médias.
 * @throws {Error} Si les paramètres sont invalides.
 */
function validateMediaParams(media, folderName) {
    try {
        // Vérification que `media` est un objet non vide
        if (!media || typeof media !== "object" || Object.keys(media).length === 0) {
            logEvent("error", "validateMediaParams : Objet média invalide ou vide.", { media });
            throw new Error("L'objet média est invalide ou ne contient aucune donnée.");
        }

        // Vérification que `folderName` est une chaîne valide
        if (!folderName || typeof folderName !== "string" || folderName.trim().length === 0) {
            logEvent("error", "validateMediaParams : Nom du dossier invalide ou manquant.", { folderName });
            throw new Error("Le nom du dossier doit être une chaîne non vide.");
        }

        // Vérification que le média possède une source valide (`image` ou `video`)
        const hasValidMedia = typeof media.image === "string" || typeof media.video === "string";

        if (!hasValidMedia) {
            logEvent("error", "validateMediaParams : Le média ne contient ni image ni vidéo.", { media });
            throw new Error("Le média doit contenir soit une image, soit une vidéo.");
        }

        logEvent("success", "validateMediaParams : Paramètres de média validés avec succès.", { media, folderName });

    } catch (error) {
        logEvent("error", "validateMediaParams : Erreur de validation des paramètres.", { error });
        throw error; // Propagation de l'erreur pour gestion en amont
    }
}


/**
 * =============================================================================
 * Fonction : createImageElement
 * =============================================================================
 * Génère un élément `<img>` avec des attributs optimisés pour la performance et l'accessibilité.
 *
 * - Vérifie la validité des paramètres avant la création.
 * - Utilise `loading="lazy"` et `decoding="async"` pour améliorer les performances.
 * - Associe un texte alternatif (`alt`) et un `aria-label` pour l'accessibilité.
 *
 * @param {Object} media - Objet contenant les informations de l'image.
 * @param {string} folderName - Nom du dossier contenant l'image.
 * @returns {HTMLImageElement|null} Élément `<img>` généré, ou `null` en cas d'erreur.
 */
function createImageElement(media, folderName) {
    try {
        // Vérification des paramètres
        if (!media || typeof media !== "object" || !media.image) {
            logEvent("error", "createImageElement : Données image invalides ou manquantes.", { media });
            return null;
        }

        if (!folderName || typeof folderName !== "string") {
            logEvent("error", "createImageElement : Nom du dossier invalide.", { folderName });
            return null;
        }

        // Création de l'élément `<img>`
        const img = document.createElement("img");
        img.src = `../../assets/photographers/${folderName}/${media.image}`;
        img.className = "media";
        img.alt = media.title || "Image sans titre";
        img.setAttribute("aria-label", `Image : ${media.title || "Sans titre"}`);
        img.loading = "lazy"; // Charge l'image uniquement quand elle entre dans le viewport
        img.decoding = "async"; // Décode l'image de manière asynchrone pour réduire le blocage du rendu
        img.width = 300; // Taille fixe pour améliorer le layout (modifiable selon le design)
        img.height = 200; // Idem

        logEvent("success", `createImageElement : Image générée avec succès (${media.image}).`, { img });

        return img;
    } catch (error) {
        logEvent("error", "createImageElement : Erreur lors de la création de l'image.", { error });
        return null;
    }
}


/**
 * =============================================================================
 * Fonction : createVideoElement
 * =============================================================================
 * Génère un élément `<video>` avec les contrôles activés.
 *
 * - Vérifie la validité des paramètres avant la création.
 * - Ajoute `controls` pour permettre la lecture.
 * - Définit un attribut `aria-label` pour l'accessibilité.
 * - Utilise `preload="metadata"` pour améliorer les performances.
 *
 * @param {Object} media - Objet contenant les informations de la vidéo.
 * @param {string} folderName - Nom du dossier contenant la vidéo.
 * @returns {HTMLVideoElement|null} Élément `<video>` généré, ou `null` en cas d'erreur.
 */
function createVideoElement(media, folderName) {
    try {
        // Vérification des paramètres
        if (!media || typeof media !== "object" || !media.video) {
            logEvent("error", "createVideoElement : Données vidéo invalides ou manquantes.", { media });
            return null;
        }

        if (!folderName || typeof folderName !== "string") {
            logEvent("error", "createVideoElement : Nom du dossier invalide.", { folderName });
            return null;
        }

        // Création de l'élément `<video>`
        const video = document.createElement("video");
        video.src = `../../assets/photographers/${folderName}/${media.video}`;
        video.className = "media";
        video.controls = true;
        video.preload = "metadata"; // Charge uniquement les métadonnées pour éviter un chargement excessif
        video.setAttribute("aria-label", `Vidéo : ${media.title || "Sans titre"}`);
        video.setAttribute("tabindex", "0"); // Rend le focus possible via clavier

        logEvent("success", `createVideoElement : Vidéo générée avec succès (${media.video}).`, { video });

        return video;
    } catch (error) {
        logEvent("error", "createVideoElement : Erreur lors de la création de la vidéo.", { error });
        return null;
    }
}


/**
 * =============================================================================
 * Fonction : createMediaCaption
 * =============================================================================
 * Crée la légende associée au média contenant :
 * - Un titre `<h3>`.
 * - Un compteur de likes avec un bouton interactif.
 *
 * - Vérifie la validité de l'objet `media` avant la création.
 * - Utilise un `DocumentFragment` pour améliorer les performances.
 * - Ajoute des attributs d'accessibilité (`aria-label`).
 *
 * @param {Object} media - Objet contenant les informations du média.
 * @returns {HTMLElement|null} Élément `<div>` contenant la légende du média, ou `null` en cas d'erreur.
 */
function createMediaCaption(media) {
    try {
        // Vérification des paramètres
        if (!media || typeof media !== "object" || !media.title) {
            logEvent("error", "createMediaCaption : Média invalide ou mal structuré.", { media });
            return null;
        }

        // Création du conteneur principal de la légende
        const caption = document.createElement("div");
        caption.className = "media-caption";

        // Création d'un fragment pour optimiser l'insertion
        const fragment = document.createDocumentFragment();

        // Création du titre du média
        const title = document.createElement("h3");
        title.textContent = media.title;
        title.setAttribute("aria-label", `Titre du média : ${media.title}`);

        // Création du système de likes
        const likeContainer = createLikeButton(media);
        if (!likeContainer) {
            logEvent("warn", "createMediaCaption : Impossible de générer le bouton de like.", { media });
        }

        // Ajout des éléments dans le fragment
        fragment.appendChild(title);
        if (likeContainer) {
            fragment.appendChild(likeContainer);
        }

        // Ajout du fragment au conteneur principal
        caption.appendChild(fragment);

        logEvent("success", "createMediaCaption : Légende créée avec succès.", { media });

        return caption;
    } catch (error) {
        logEvent("error", "createMediaCaption : Erreur lors de la création de la légende du média.", { error });
        return null;
    }
}


/**
 * =============================================================================
 * Fonction : createLikeButton
 * =============================================================================
 * Génère un bouton de like contenant :
 * - Un compteur de likes `<span>`.
 * - Un bouton `<button>` cliquable avec une icône.
 *
 * - Vérifie que l'objet `media` est valide avant la création.
 * - Améliore l'accessibilité avec `aria-label` et `aria-live`.
 * - Utilise une structure optimisée pour un meilleur rendu.
 *
 * @param {Object} media - Objet contenant les informations du média.
 * @returns {HTMLElement|null} Élément `<p>` contenant le système de likes, ou `null` en cas d'erreur.
 */
function createLikeButton(media) {
    try {
        // Vérification de la validité de `media`
        if (!media || typeof media !== "object" || typeof media.likes !== "number") {
            logEvent("error", "createLikeButton : Média invalide ou mal structuré.", { media });
            return null;
        }

        // Création du conteneur principal
        const likeContainer = document.createElement("p");
        likeContainer.className = "like-container";

        // Création du compteur de likes
        const likesSpan = document.createElement("span");
        likesSpan.className = "media-likes";
        likesSpan.textContent = media.likes;
        likesSpan.setAttribute("aria-live", "polite"); // Accessibilité : mise à jour du texte en temps réel

        // Création du bouton de like
        const likeButton = document.createElement("button");
        likeButton.className = "like-icon";
        likeButton.setAttribute("data-action", "like");
        likeButton.setAttribute("aria-label", `Ajouter un like à ${media.title || "ce média"}`);

        // Création de l'icône FontAwesome
        const likeIcon = document.createElement("i");
        likeIcon.className = "fas fa-heart";
        likeIcon.setAttribute("aria-hidden", "true");

        // Assemblage des éléments
        likeButton.appendChild(likeIcon);
        likeContainer.appendChild(likesSpan);
        likeContainer.appendChild(likeButton);

        logEvent("success", "createLikeButton : Bouton de like généré avec succès.", { media });

        return likeContainer;
    } catch (error) {
        logEvent("error", "createLikeButton : Erreur lors de la génération du bouton de like.", { error });
        return null;
    }
}




/**
 * =============================================================================
 * Fonction : renderMediaGallery
 * =============================================================================
 * Génère et affiche une galerie de médias dans un conteneur HTML.
 *
 * - Vérifie les paramètres d'entrée avant l'exécution.
 * - Utilise `createGalleryItem()` pour générer chaque élément média.
 * - Insère les médias dans un `DocumentFragment` pour optimiser les performances.
 * - Affiche un message si aucun média n'est disponible.
 * - Logue chaque étape pour un suivi précis des erreurs et du processus.
 *
 * @function renderMediaGallery
 * @param {Array} mediaList - Liste des médias à afficher.
 * @param {string} folderName - Nom du dossier contenant les fichiers.
 * @param {HTMLElement} galleryContainer - Conteneur HTML où afficher la galerie.
 * @returns {boolean} `true` si la galerie est générée avec succès, sinon `false`.
 */
export function renderMediaGallery(mediaList, folderName, galleryContainer) {
    logEvent("info", "renderMediaGallery : Début du rendu de la galerie média.", { mediaList, folderName });

    try {
        // Vérification stricte des paramètres avant exécution
        validateGalleryParams(mediaList, folderName, galleryContainer);

        // Réinitialisation du conteneur
        galleryContainer.innerHTML = "";

        // Vérification de la présence de médias
        if (mediaList.length === 0) {
            displayEmptyGalleryMessage(galleryContainer);
            logEvent("warn", "renderMediaGallery : Aucun média disponible.");
            return false;
        }

        // Optimisation de l'insertion avec un `DocumentFragment`
        const fragment = document.createDocumentFragment();

        mediaList.forEach((media, index) => {
            const mediaItem = createGalleryItem(media, folderName, index);
            if (mediaItem) {
                fragment.appendChild(mediaItem);
            }
        });

        // Ajout de la galerie complète dans le conteneur principal
        galleryContainer.appendChild(fragment);

        logEvent("success", "renderMediaGallery : Galerie média affichée avec succès.");
        return true;
    } catch (error) {
        logEvent("error", "renderMediaGallery : Erreur lors du rendu de la galerie.", { error });
        return false;
    }
}


/**
 * =============================================================================
 * Fonction : validateGalleryParams
 * =============================================================================
 * Vérifie la validité des paramètres avant de générer la galerie.
 *
 * - Vérifie si `mediaList` est un tableau non vide.
 * - Vérifie si `folderName` est une chaîne de caractères valide.
 * - Vérifie si `galleryContainer` est un élément HTML valide.
 *
 * @param {Array} mediaList - Liste des médias à afficher.
 * @param {string} folderName - Nom du dossier contenant les fichiers.
 * @param {HTMLElement} galleryContainer - Conteneur de la galerie.
 * @throws {Error} Si un paramètre est invalide.
 */
function validateGalleryParams(mediaList, folderName, galleryContainer) {
    try {
        // Vérification que `mediaList` est bien un tableau et non vide
        if (!Array.isArray(mediaList) || mediaList.length === 0) {
            logEvent("error", "validateGalleryParams : Liste de médias invalide ou vide.", { mediaList });
            throw new Error("La liste des médias est invalide ou vide.");
        }

        // Vérification que `folderName` est une chaîne non vide
        if (typeof folderName !== "string" || folderName.trim() === "") {
            logEvent("error", "validateGalleryParams : Nom du dossier invalide.", { folderName });
            throw new Error("Le nom du dossier est invalide.");
        }

        // Vérification que `galleryContainer` est bien un élément HTML
        if (!(galleryContainer instanceof HTMLElement)) {
            logEvent("error", "validateGalleryParams : Conteneur de galerie invalide.", { galleryContainer });
            throw new Error("Le conteneur de galerie est invalide.");
        }

        logEvent("success", "validateGalleryParams : Tous les paramètres sont valides.");
    } catch (error) {
        logEvent("error", "validateGalleryParams : Erreur lors de la validation des paramètres.", { error });
        throw error;
    }
}


/**
 * =============================================================================
 * Fonction : createGalleryItem
 * =============================================================================
 * Génère un élément HTML `article` pour un média donné et l'ajoute à la galerie.
 *
 * - Vérifie si le média est valide avant création.
 * - Ajoute des attributs `data-index` et une classe CSS pour le style.
 * - Capture et journalise les erreurs pour éviter les blocages.
 *
 * @param {Object} media - Objet média contenant les informations.
 * @param {string} folderName - Nom du dossier contenant le média.
 * @param {number} index - Position du média dans la liste.
 * @returns {HTMLElement|null} Élément HTML `article` ou `null` en cas d'échec.
 */
function createGalleryItem(media, folderName, index) {
    try {
        // Vérification des paramètres avant traitement
        if (!media || typeof media !== "object") {
            logEvent("error", "createGalleryItem : Média invalide ou manquant.", { media });
            return null;
        }

        if (!folderName || typeof folderName !== "string") {
            logEvent("error", "createGalleryItem : Nom du dossier invalide.", { folderName });
            return null;
        }

        if (typeof index !== "number" || index < 0) {
            logEvent("error", "createGalleryItem : Index invalide.", { index });
            return null;
        }

        logEvent("info", `createGalleryItem : Création de l'élément média pour ID ${media.id}.`);

        // Création de l'élément média via la fonction dédiée
        const mediaItem = createMediaItem(media, folderName, index);
        
        if (!mediaItem) {
            logEvent("warn", `createGalleryItem : Échec de la création pour l'ID ${media.id}.`);
            return null;
        }

        // Ajout des attributs nécessaires
        mediaItem.setAttribute("data-index", index);
        mediaItem.classList.add("gallery-item");

        logEvent("success", `createGalleryItem : Élément média créé avec succès pour ID ${media.id}.`);
        return mediaItem;

    } catch (error) {
        logEvent("error", "createGalleryItem : Erreur lors de la création d'un élément média.", { error });
        return null;
    }
}


/**
 * =============================================================================
 * Fonction : displayEmptyGalleryMessage
 * =============================================================================
 * Affiche dynamiquement un message indiquant qu'aucun média n'est disponible.
 *
 * - Vérifie la validité du conteneur avant insertion.
 * - Supprime les anciens messages pour éviter les doublons.
 * - Utilise `role="alert"` pour améliorer l'accessibilité.
 * - Logue l'affichage pour le suivi des événements.
 *
 * @param {HTMLElement} galleryContainer - Conteneur HTML où afficher le message.
 */
function displayEmptyGalleryMessage(galleryContainer) {
    try {
        if (!galleryContainer || !(galleryContainer instanceof HTMLElement)) {
            logEvent("error", "displayEmptyGalleryMessage : Conteneur invalide ou manquant.", { galleryContainer });
            return;
        }

        // Vérifie s'il y a déjà un message pour éviter les doublons
        const existingMessage = galleryContainer.querySelector(".gallery-empty");
        if (existingMessage) {
            existingMessage.remove();
        }

        // Création du message d'alerte
        const message = document.createElement("p");
        message.className = "gallery-empty";
        message.textContent = "Aucun média disponible pour ce photographe.";
        message.setAttribute("role", "alert"); // Amélioration de l'accessibilité

        // Ajout du message dans le conteneur
        galleryContainer.appendChild(message);

        logEvent("info", "displayEmptyGalleryMessage : Message d'alerte affiché.");
    } catch (error) {
        logEvent("error", "displayEmptyGalleryMessage : Erreur lors de l'affichage du message.", { error });
    }
}


