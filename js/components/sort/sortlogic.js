// ========================================================
// Nom du fichier : sortlogic.js
// Description    : Gestion des médias et tri pour le projet Fisheye
// Auteur         : Trackozor
// Date           : 01/01/2025
// Version        : 2.4.0 (Synchronisation renforcée et logs améliorés)
// ========================================================

import { logEvent } from "../../utils/utils.js";
import { getPhotographerIdFromUrl } from "../../pages/photographer-page.js";
export let sorted = false; // Par défaut, pas de tri

/*==============================================*/
/*              Fonctions de tri                */
/*==============================================*/

/**
 * Vérifie si la liste des médias est valide.
 *
 * - Assure que `mediaList` est un tableau non vide.
 * - Vérifie que chaque média est un objet contenant `likes`, `title` et `date`.
 * - Génère une erreur détaillée en cas d’invalidité.
 *
 * @param {Array} mediaList - Liste des médias à vérifier.
 * @throws {TypeError} - Si `mediaList` n'est pas un tableau valide ou contient des objets invalides.
 */
const validateMediaList = (mediaList) => {
  try {
    // Vérification que mediaList est bien un tableau
    if (!Array.isArray(mediaList) || mediaList.length === 0) {
      throw new TypeError("La liste des médias doit être un tableau non vide.");
    }

    // Vérification de chaque média avec Array.every()
    const isValid = mediaList.every(
      (media) =>
        media &&
        typeof media === "object" &&
        "likes" in media &&
        "title" in media &&
        "date" in media
    );

    if (!isValid) {
      throw new TypeError(
        "Un ou plusieurs médias sont invalides. Chaque média doit contenir 'likes', 'title' et 'date'."
      );
    }

    logEvent("success", "Validation de la liste des médias réussie.");
  } catch (error) {
    logEvent("error", `Erreur dans validateMediaList : ${error.message}`, { error });
    throw error;
  }
};




/**---------------------------------------------------------------------------------------
 * Trie les médias en fonction du nombre de likes (du plus populaire au moins populaire).
 *----------------------------------------------------------------------------------------
 *
 * - Vérifie la validité de `mediaList` avant d'effectuer le tri.
 * - Utilise `.slice()` pour préserver l'originalité de `mediaList`.
 * - Applique `.sort()` avec une fonction de comparaison optimisée.
 * - Retourne un tableau trié de manière immuable (`Object.freeze`).
 * - Journalise le processus pour faciliter le suivi.
 *
 * @param {Array} mediaList - Liste des médias à trier.
 * @returns {Array} - Liste triée par nombre de likes décroissant.
 * @throws {TypeError} - En cas de données invalides.
 */
/**---------------------------------------------------------------------------------------
 * Trie les médias en fonction du nombre de likes (du plus populaire au moins populaire).
 *----------------------------------------------------------------------------------------
 *
 * - Vérifie la validité de `mediaList` avant d'effectuer le tri.
 * - Vérifie que chaque média contient bien une propriété `likes` de type `number`.
 * - Utilise `.slice()` pour préserver l'originalité de `mediaList`.
 * - Applique `.sort()` avec une fonction de comparaison robuste.
 * - Retourne un tableau trié de manière immuable (`Object.freeze`).
 * - Journalise le processus pour faciliter le suivi.
 *
 * @param {Array} mediaList - Liste des médias à trier.
 * @returns {Array} - Liste triée par nombre de likes décroissant.
 * @throws {TypeError} - En cas de données invalides.
 */
export function sortByLikes(mediaList) {
  try {
    // Validation de la liste des médias
    if (!Array.isArray(mediaList)) {
      throw new TypeError("Le paramètre 'mediaList' doit être un tableau.");
    }
    
    // Vérification des objets médias
    mediaList.forEach(media => {
      if (!media || typeof media !== "object") {
        throw new TypeError("Chaque élément de 'mediaList' doit être un objet.");
      }
      if (!("likes" in media) || typeof media.likes !== "number") {
        throw new TypeError(`L'objet ${JSON.stringify(media)} ne contient pas de 'likes' valide.`);
      }
    });

    logEvent("info", `Début du tri des médias par nombre de likes (${mediaList.length} éléments).`);

    // Tri décroissant (du plus grand au plus petit nombre de likes)
    const sortedMedia = Object.freeze(
      [...mediaList].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    );

    logEvent("success", `Tri terminé avec succès (${sortedMedia.length} médias triés).`);
    
    return sortedMedia;
  } catch (error) {
    logEvent("error", `Erreur dans sortByLikes : ${error.message}`, { error });
    return []; // Retourne une liste vide en cas d'erreur
  }
}


/*==============================================*/
/*  Comparaison et tri alphabétique (titres)    */
/*==============================================*/

/**
 * Instance de `Intl.Collator` pour comparer les titres en français.
 * 
 * - Sensibilité de tri définie à "base" pour ignorer la casse et les accents.
 * - Assure un tri correct en prenant en compte l'ordre alphabétique français.
 */
const collator = new Intl.Collator("fr", { sensitivity: "base" });

/**-------------------------------------------------------------------
 * Compare deux médias en fonction de leur titre (tri alphabétique).
 *---------------------------------------------------------------------
 *
 * - Vérifie la validité des titres avant comparaison.
 * - Utilise `Intl.Collator` pour un tri optimisé et adapté au français.
 * - Capture et journalise les erreurs en cas d'objets mal structurés.
 *
 * @param {Object} a - Premier média à comparer.
 * @param {Object} b - Second média à comparer.
 * @returns {number} - Résultat de la comparaison (`-1`, `0` ou `1`).
 * @throws {TypeError} - Si `title` est manquant ou invalide.
 */
export function compareByTitle(a, b) {
    try {
        // Vérification des paramètres
        if (!a || typeof a !== "object" || typeof a.title !== "string") {
            throw new TypeError("L'objet 'a' est invalide ou ne contient pas de titre.");
        }
        if (!b || typeof b !== "object" || typeof b.title !== "string") {
            throw new TypeError("L'objet 'b' est invalide ou ne contient pas de titre.");
        }

        // Comparaison alphabétique via `Intl.Collator`
        return collator.compare(a.title, b.title);
    } catch (error) {
        logEvent("error", `Erreur dans compareByTitle : ${error.message}`, { error });
        return 0; // Retourne 0 en cas d'erreur pour éviter un crash
    }
}



/**------------------------------------------------------------------
 * Trie les médias en fonction du titre alphabétique.
 *------------------------------------------------------------------

 * - Vérifie que la liste des médias est valide avant exécution.
 * - Utilise `compareByTitle()` pour un tri alphabétique précis.
 * - Empêche la modification accidentelle du tableau trié avec `Object.freeze()`.
 * - Capture et journalise toute erreur potentielle pour éviter un plantage.
 *
 * @param {Array} mediaList - Liste des médias à trier.
 * @returns {Array} - Liste triée par ordre alphabétique des titres, ou une liste vide en cas d'erreur.
 */
export function sortByTitle(mediaList) {
    try {
        // Vérification initiale des entrées
        if (!Array.isArray(mediaList)) {
            throw new TypeError("Le paramètre 'mediaList' doit être un tableau.");
        }

        // Validation approfondie des médias avant tri
        validateMediaList(mediaList);

        // Journalisation avant d'effectuer le tri
        logEvent("info", `Tri des médias par titre alphabétique (${mediaList.length} éléments).`);

        // Tri alphabétique des médias
        return Object.freeze([...mediaList].sort(compareByTitle));

    } catch (error) {
        logEvent("error", `Erreur dans sortByTitle : ${error.message}`, { error });
        return []; // Retourne une liste vide pour éviter tout plantage
    }
}



/*==============================================*/
/*           COMPARAISON ET TRI PAR DATE        */
/*==============================================*/

/**-------------------------------------------------------------------------------
 * Compare deux médias en fonction de leur date (du plus récent au plus ancien).
 *--------------------------------------------------------------------------------
 *
 * - Convertit les dates en **objet `Date`** avant la comparaison.
 * - Assure que chaque média possède une **date valide** avant comparaison.
 * - Gère les erreurs si une date est absente ou mal formatée.
 *
 * @param {Object} a - Premier média.
 * @param {Object} b - Second média.
 * @returns {number} - Résultat de la comparaison (`< 0` si `b` est plus récent, `> 0` si `a` est plus récent).
 * @throws {Error} - Lève une erreur si une des dates est invalide.
 */
export function compareByDate(a, b) {
  try {
      // Vérification et conversion des dates
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Vérification que les dates sont valides
      if (isNaN(dateA) || isNaN(dateB)) {
          throw new Error(`Date invalide détectée : ${a.date} ou ${b.date}`);
      }

      return dateB - dateA; // Tri décroissant (du plus récent au plus ancien)
  } catch (error) {
      logEvent("error", "Erreur dans compareByDate", { a, b, error });
      throw error; // Propagation de l'erreur pour gestion en amont
  }
}

/**---------------------------------------------------------------------------
* Trie les médias en fonction de leur date (du plus récent au plus ancien).
*------------------------------------------------------------------------------
*
* - Valide la liste des médias avant exécution.
* - Utilise un **tri optimisé** en conservant l'immutabilité (`Object.freeze`).
* - Capture les erreurs pour éviter un plantage en cas de problème de données.
*
* @param {Array} mediaList - Liste des médias à trier.
* @returns {Array} - Nouvelle liste triée par date décroissante.
* @throws {Error} - Lève une erreur si la liste contient des données invalides.
*/
export function sortByDate(mediaList) {
  try {
      // Validation de la liste des médias
      validateMediaList(mediaList);
      logEvent("info", "Tri des médias par date décroissante.");

      // Tri sécurisé et immuable
      return Object.freeze([...mediaList].sort(compareByDate));
  } catch (error) {
      logEvent("error", "Erreur dans sortByDate", { mediaList, error });
      throw error;
  }
}



/*==============================================*/
/* Gestion des IDs et Positions des Médias      */
/*==============================================*/
/**
 * Associe les IDs des médias avec les éléments correspondants dans le DOM.
 * 
 *  **Fonctionnement** :
 *  - Vérifie si `mediaList` est un tableau non vide contenant des objets valides.
 *  - Sélectionne la galerie et tous les médias (`.media-item`) dans le DOM.
 *  - Associe chaque élément `.media-item` avec l'ID correspondant à son `data-title`.
 *  - Journalise chaque étape et capture les erreurs en cas de problème.
 * 
 *  **Gestion des erreurs** :
 *  - Vérifie que `mediaList` est bien un **tableau** contenant des **objets valides** (id et title).
 *  - Vérifie que chaque élément `.media-item` **possède un attribut `data-title`**.
 *  - Capture les erreurs si la galerie ou les médias ne sont pas trouvés dans le DOM.
 *  - Log un avertissement si un média ne correspond à aucun titre dans `mediaList`.
 *
 * @param {Array} mediaList - Liste des médias contenant au moins un `title` et un `id`.
 * @throws {TypeError} - Si `mediaList` n'est pas un tableau valide.
 * @throws {Error} - Si aucun média n'est trouvé dans le DOM.
 */

export async function associateMediaIds(mediaList) {
  logEvent("test_start", "Début de l'association des IDs aux médias du DOM.");

  try {
    //  Vérification que `mediaList` est un tableau non vide
    if (!Array.isArray(mediaList) || mediaList.length === 0) {
      throw new TypeError("La liste des médias doit être un tableau non vide.");
    }

    //  Vérification que chaque média possède bien un `title` (string) et un `id` (number)
    mediaList.forEach((media, index) => {
      if (!media || typeof media.title !== "string" || typeof media.id !== "number") {
        logEvent("error", `Média invalide détecté à l'index ${index}.`, { media });
        throw new TypeError("Chaque média doit contenir un 'title' (string) et un 'id' (number).");
      }
    });

    // Sélection de la galerie contenant les médias
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      throw new Error("Galerie introuvable dans le DOM.");
    }

    // Sélection de tous les éléments `.media-item` présents dans la galerie
    const mediaItems = gallery.querySelectorAll(".media-item");
    if (!mediaItems.length) {
      throw new Error("Aucun élément .media-item trouvé dans la galerie.");
    }

    let associationsCount = 0; // Compteur du nombre d'associations réussies

    // Parcours de chaque élément `.media-item` pour l'associer à un média
    mediaItems.forEach((mediaItem) => {
      //  Récupère la valeur de l'attribut `data-title` de l'élément
      const title = mediaItem.getAttribute("data-title");

      //  Vérifie que `data-title` est bien défini sur l'élément
      if (!title) {
        logEvent("warn", "Un élément .media-item ne possède pas d'attribut 'data-title'.", { element: mediaItem });
        return; // Passe à l'élément suivant
      }

      // Recherche un média correspondant dans `mediaList` en fonction du `title`
      const matchingMedia = mediaList.find((media) => media.title === title);

      // Vérifie si un média correspondant a été trouvé
      if (matchingMedia) {
        // Associe l'ID du média à l'élément `.media-item` via `data-id`
        mediaItem.setAttribute("data-id", matchingMedia.id);
        associationsCount++; // Incrémente le compteur des associations réussies
      } else {
        // Journalise un avertissement si aucun média correspondant n'a été trouvé
        logEvent("warn", `Aucun média correspondant trouvé pour : "${title}".`, { element: mediaItem });
      }
    });

    // Journalise le succès et affiche le nombre d'associations réussies
    logEvent("success", `Association des IDs terminée. ${associationsCount} correspondances trouvées.`);
  } catch (error) {
    //  Capture et log toute erreur rencontrée
    logEvent("error", `Erreur lors de l'association des IDs : ${error.message}`, { error });
  }

  logEvent("test_end", "Fin de l'association des IDs aux médias du DOM.");
}


/*==============================================*/
/* Recuperation position medias*/
/*==============================================*/
/**
 * Capture l'état actuel de la galerie en enregistrant l'ID et la position des médias affichés.
 * 
 *  **Fonctionnement** :
 *  - Sélectionne la galerie contenant les médias (`#gallery`).
 *  - Vérifie que la galerie existe dans le DOM.
 *  - Récupère tous les éléments `.media-item` présents dans la galerie.
 *  - Pour chaque média, extrait l'ID depuis l'attribut `data-id` et enregistre sa position.
 *  - Filtre les éléments invalides pour ne garder que ceux avec un ID valide.
 * 
 *  **Gestion des erreurs** :
 *  - Vérifie que l'élément `#gallery` est bien présent avant de continuer.
 *  - Vérifie que chaque média possède un `data-id` valide.
 *  - Journalise les erreurs et avertissements en cas de problème.
 * 
 * @async
 * @function captureGalleryState
 * @returns {Promise<Array<{ id: number, position: number, element: HTMLElement }>>} 
 * - Un tableau d'objets contenant les **ID**, **positions**, et **références DOM** des médias.
 * - Retourne un tableau vide si une erreur est détectée.
 */

export async function captureGalleryState() {
  logEvent("test_start", "Début de la capture de l'état de la galerie.");

  try {
    //  Sélection de la galerie contenant les médias
    const gallery = document.getElementById("gallery");

    // Vérifie si la galerie existe dans le DOM
    if (!gallery) {
      throw new Error("Galerie introuvable dans le DOM.");
    }

    // Sélection de tous les éléments `.media-item` présents dans la galerie
    const mediaItems = gallery.querySelectorAll(".media-item");

    //  Conversion des NodeList en tableau et extraction des informations nécessaires
    const galleryState = Array.from(mediaItems)
      .map((mediaItem, index) => {
        //  Extraction de l'ID du média depuis l'attribut `data-id`
        const id = parseInt(mediaItem.getAttribute("data-id"), 10);

        //  Vérifie si l'ID est valide
        if (isNaN(id)) {
          logEvent("warn", `ID invalide détecté à la position ${index}.`, { element: mediaItem });
          return null; // Retourne `null` pour les éléments avec un ID invalide
        }

        //  Retourne un objet contenant l'ID, la position et l'élément DOM
        return { id, position: index, element: mediaItem };
      })
      .filter(Boolean); //  Supprime les éléments invalides (`null`)

    // Journalise le succès et retourne l'état de la galerie
    logEvent("success", "État de la galerie capturé avec succès.", { galleryState });
    logEvent("test_end", "Fin de la capture de l'état de la galerie.");
    return galleryState;
  } catch (error) {
    // Capture et journalise toute erreur détectée
    logEvent("error", `Erreur lors de la capture de la galerie : ${error.message}`, { error });

    // Retourne un tableau vide en cas d'erreur
    return [];
  }
}


export function updateGallery() {
  let images = document.querySelectorAll('.gallery img');
  let imageSources = [];
  
  images.forEach(img => imageSources.push(img.src));

  // Met à jour la lightbox avec les nouvelles images
  document.querySelectorAll('.lightbox img').forEach((img, index) => {
      img.src = imageSources[index];
  });
}

/*==============================================*/
/* Fonction Principale : Gérer le Tri des Médias*/
/*==============================================*/

/**
 * Trie les médias d'un photographe selon l'option sélectionnée.
 * 
 * **Fonctionnement** :
 *  - Récupère l'ID du photographe à partir de l'URL.
 *  - Charge les données JSON contenant les médias.
 *  - Filtre les médias correspondant au photographe sélectionné.
 *  - Applique le tri en fonction de l'option sélectionnée (`popularity`, `title`, `date`).
 *  - Récupère l'état actuel de la galerie et replace les éléments dans l'ordre trié.
 * 
 * **Gestion des erreurs** :
 *  - Vérifie que l'ID du photographe est bien récupéré.
 *  - Vérifie que la requête HTTP pour récupérer les médias est valide.
 *  - Vérifie qu'il existe bien des médias à trier pour le photographe.
 *  - Vérifie que l'option de tri est valide.
 *  - Capture et journalise toutes les erreurs.
 * 
 * @async
 * @function handleMediaSort
 * @param {string} sortOption - Option de tri sélectionnée (popularity, title, date).
 * @returns {Promise<void>}
 * @throws {Error} - Lève une erreur si l'un des éléments requis (ID, médias, option de tri) est invalide.
 */

export async function handleMediaSort(sortOption) {
  logEvent("test_start", "Début du processus de tri des médias.", { sortOption });

  try {
    //  Récupération de l'ID du photographe à partir de l'URL
    const photographerId = getPhotographerIdFromUrl();

    // Vérifie si l'ID du photographe est valide
    if (!photographerId) {
      throw new Error("ID du photographe introuvable.");
    }

    // Récupération des données JSON contenant les médias
    const response = await fetch("../../assets/data/photographers.json");

    //  Vérifie que la requête HTTP est valide
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Conversion des données en JSON
    const data = await response.json();

    //  Filtrage des médias appartenant au photographe sélectionné
    const photographerMedia = data.media.filter(
      (media) => media.photographerId === parseInt(photographerId, 10)
    );

    // Vérifie si le photographe a des médias à trier
    if (!photographerMedia.length) {
      logEvent("warn", `Aucun média trouvé pour le photographe ID ${photographerId}.`);
      return;
    }

    // Application du tri selon l'option sélectionnée
    let sortedMedia;
    switch (sortOption) {
      case "popularity":
        sortedMedia = sortByLikes(photographerMedia);
        break;
      case "title":
        sortedMedia = sortByTitle(photographerMedia);
        break;
      case "date":
        sortedMedia = sortByDate(photographerMedia);
        break;
      default:
        throw new Error(`Option de tri inconnue : ${sortOption}`);
    }

    // Journalise le succès du tri
    logEvent("info", "Médias triés avec succès.", { sortedMedia });

    // Capture l'état actuel de la galerie avant la réorganisation
    const currentPositions = await captureGalleryState();

    // Sélection de la galerie DOM
    const gallery = document.getElementById("gallery");

    // Vérifie si la galerie est bien présente dans le DOM
    if (!gallery) {
      throw new Error("Galerie introuvable dans le DOM.");
    }

    // Réorganisation des médias dans la galerie selon le nouvel ordre trié
    sortedMedia.forEach((media, index) => {
      const matchingMedia = currentPositions.find((item) => item.id === media.id);

      if (matchingMedia) {
        // Déplace l'élément DOM du média à la nouvelle position
        gallery.insertBefore(matchingMedia.element, gallery.children[index]);
      } else {
        logEvent("warn", `Aucun élément DOM pour l'ID : ${media.id}`, { media });
      }
    });

    // Journalise la réussite du processus
    logEvent("success", "Tri des médias terminé avec succès.");
  } catch (error) {
    // Capture et journalise toute erreur détectée
    logEvent("error", `Erreur lors du tri des médias : ${error.message}`, {
      stack: error.stack,
    });
  } finally {
    sorted = true;
    // Fin du processus de tri
    logEvent("test_end", "Fin du processus de tri des médias.");
  }
}


