// ========================================================
// Nom du fichier : lightbox.js
// Description    : Gestion de la lightbox pour afficher les médias (images ou vidéos) en plein écran.
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.4.1 (Optimisation de la gestion des animations et suppression des doublons)
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/
import { logEvent } from "../../utils/utils.js";
import domSelectors from "../../config/domSelectors.js";

// Indice du média actuellement affiché dans la lightbox
let currentIndex = 0;

// Liste des médias disponibles pour la lightbox
let mediaList = [];

// Nom du dossier contenant les fichiers médias (images, vidéos, etc.)
let globalFolderName = "";

let isTransitioning = false;

/*==============================================*/
/*              Initialisation              */
/*==============================================*/
/**
 * Initialise la lightbox avec une liste de médias.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `mediaArray` est un **tableau valide** et **non vide**.
 * - Vérifie que `folderName` est **une chaîne de caractères valide**.
 * - Stocke la liste des médias et le dossier associé dans des variables globales.
 * - Initialise `currentIndex` à `0` pour afficher le premier média.
 * - Journalise chaque étape avec `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie si `mediaArray` est **un tableau valide** avant de continuer.
 * - Vérifie que `folderName` est **une chaîne valide**, sinon une erreur est levée.
 * - Capture et journalise toute erreur rencontrée via `logEvent("error", ...)`.
 * - En cas d'erreur critique, **lève une exception** pour empêcher une mauvaise configuration.
 * 
 * @function initLightbox
 * @param {Array} mediaArray - Tableau contenant les médias à afficher dans la lightbox.
 * @param {string} folderName - Nom du dossier contenant les fichiers médias.
 * @throws {Error} Lève une erreur si `mediaArray` est invalide ou si `folderName` est incorrect.
 */

export function initLightbox(mediaArray, folderName) {
    // Journalisation du début de l'initialisation
    logEvent("init", "Début de l'initialisation de la lightbox.", { mediaArray });

    // Vérifie que `mediaArray` est un tableau et contient au moins un élément
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
        logEvent("warn", "Le tableau de médias est vide ou invalide.");
        mediaList = []; // Vide la liste pour éviter tout affichage erroné
        globalFolderName = folderName || ""; // Stocke un nom de dossier par défaut
        return;
    }

    // Vérifie que `folderName` est une chaîne de caractères valide
    if (typeof folderName !== "string" || folderName.trim() === "") {
        logEvent("error", "Nom du dossier (folderName) invalide ou manquant.", { folderName });
        throw new Error("Le nom du dossier doit être une chaîne de caractères non vide.");
    }

    try {
        // Stocke les médias et le nom du dossier dans des variables globales
        mediaList = [...mediaArray];
        globalFolderName = folderName;

        // Réinitialise l'index du média actuellement affiché
        currentIndex = 0;

        // Journalisation du succès
        logEvent("success", "Lightbox initialisée avec succès.", { mediaList });
    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", "Erreur lors de l'initialisation de la lightbox.", { error });

        // Lève une erreur pour éviter une configuration incorrecte
        throw new Error("Erreur d'initialisation de la lightbox : " + error.message);
    }
}

/*==============================================*/
/*              Ouverture lightbox            */
/*==============================================*/
/**
 * Ouvre la lightbox pour afficher un média à l'index spécifié.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `lightboxContainer` existe dans le DOM avant toute modification.
 * - Met à jour `mediaList` et `globalFolderName` si une nouvelle liste de médias est fournie.
 * - Vérifie que l'`index` demandé est dans les limites de la liste de médias.
 * - Met à jour `currentIndex` pour suivre le média actuellement affiché.
 * - Met à jour le contenu de la lightbox via `updateLightboxContent()`.
 * - Rend la lightbox visible (`.hidden` supprimé et `aria-hidden` mis à `false`).
 * - Journalise chaque étape avec `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `lightboxContainer` est **présent dans le DOM** avant d’y accéder.
 * - Vérifie que `mediaArray` est **un tableau valide** et **différent de `mediaList` existant** avant de le mettre à jour.
 * - Vérifie que `index` est **un nombre valide et dans les limites** de `mediaList`, sinon une erreur est levée.
 * - Capture et journalise toute erreur avec `logEvent("error", ...)`.
 * 
 * @function openLightbox
 * @param {number} index - Index du média à afficher dans la lightbox.
 * @param {Array} mediaArray - Tableau contenant les médias (optionnel si déjà défini).
 * @param {string} folderName - Nom du dossier contenant les fichiers médias.
 * @throws {Error} Lève une erreur si `lightboxContainer` est introuvable ou si `index` est invalide.
 */

export function openLightbox(index, mediaArray, folderName) {
    // Journalisation de l'action d'ouverture
    logEvent("action", `Ouverture de la lightbox pour l'index ${index}.`, { index });

    try {
        // Récupère le conteneur principal de la lightbox
        const { lightboxContainer } = domSelectors.lightbox;

        // Vérifie que la lightbox existe bien dans le DOM avant de procéder
        if (!lightboxContainer) {
            throw new Error("Conteneur principal de la lightbox introuvable.");
        }

        // Mise à jour de `mediaList` si une nouvelle liste de médias est fournie
        if (Array.isArray(mediaArray) && mediaArray.length > 0 && mediaArray !== mediaList) {
            mediaList = [...mediaArray];
            globalFolderName = folderName;
        }

        // Vérifie que l'index fourni est dans les limites de la liste de médias
        if (index < 0 || index >= mediaList.length) {
            throw new Error(`Index ${index} hors limites (doit être entre 0 et ${mediaList.length - 1}).`);
        }

        // Met à jour l'index du média actuellement affiché
        currentIndex = index;

        // Met à jour le contenu de la lightbox en fonction du média sélectionné
        updateLightboxContent(mediaList[currentIndex], globalFolderName, "right");

        // Rend la lightbox visible en supprimant la classe "hidden"
        lightboxContainer.classList.remove("hidden");

        // Indique que la lightbox est visible pour l'accessibilité
        lightboxContainer.setAttribute("aria-hidden", "false");

        // Journalisation du succès de l'ouverture
        logEvent("success", "Lightbox ouverte avec succès.", { currentIndex });

    } catch (error) {
        // Capture et journalise toute erreur survenue lors de l'ouverture de la lightbox
        logEvent("error", "Erreur lors de l'ouverture de la lightbox.", { error });
    }
}

/*==============================================*/
/*              Fermeture lightbox            */
/*==============================================*/
/**
 * Ferme la lightbox et réinitialise son état.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que le `lightboxContainer` existe avant toute interaction.
 * - Supprime le média actuellement affiché pour libérer la mémoire.
 * - Réinitialise le texte du titre (`lightboxCaption`).
 * - Réinitialise les variables globales (`currentIndex`, `mediaList`, `globalFolderName`).
 * - Ajoute la classe `hidden` pour masquer la lightbox et met `aria-hidden` à `true` pour l’accessibilité.
 * - Journalise chaque étape et capture les erreurs éventuelles.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `lightboxContainer` existe avant d’essayer de le masquer.
 * - Vérifie que `lightboxMediaContainer` et `lightboxCaption` existent avant de les modifier.
 * - Capture et journalise toute erreur avec `logEvent("error", ...)`.
 * 
 * @function closeLightbox
 * @throws {Error} Lève une erreur si la lightbox ne peut pas être fermée correctement.
 */

export function closeLightbox() {
    // Journalisation de l'action de fermeture
    logEvent("action", "Fermeture de la lightbox et réinitialisation.");

    try {
        // Récupération des éléments clés de la lightbox
        const { lightboxContainer, lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;
        
        // Vérifie que la lightbox existe dans le DOM avant d’agir
        if (!lightboxContainer) {
            throw new Error("Conteneur principal de la lightbox introuvable.");
        }

        // Suppression du média actuellement affiché pour éviter une accumulation en mémoire
        const currentMedia = lightboxMediaContainer.querySelector(".active-media");
        if (currentMedia) {
            currentMedia.remove();
            logEvent("info", "Média supprimé de la lightbox.");
        }

        // Réinitialisation du texte du titre/caption
        if (lightboxCaption) {
            lightboxCaption.textContent = "";
            logEvent("info", "Caption de la lightbox réinitialisée.");
        }

        // Réinitialisation des variables globales
        currentIndex = 0;  // Remise à zéro de l'index du média
        mediaList = [];     // Vidage de la liste des médias
        globalFolderName = ""; // Suppression du nom du dossier

        // Masquer la lightbox avec une classe CSS et un attribut d'accessibilité
        lightboxContainer.classList.add("hidden");
        lightboxContainer.setAttribute("aria-hidden", "true");

        // Journalisation du succès de la fermeture
        logEvent("success", "Lightbox fermée et réinitialisée avec succès.");

    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de la fermeture de la lightbox : ${error.message}`, { error });
    }
}


/*==============================================*/
/*             Gestion des animations          */
/*==============================================*/

/**
 * Applique une animation de sortie vers la gauche au média actuellement affiché dans la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Ajoute la classe CSS `"lightbox-exit-left"` pour déclencher l'animation de sortie.
 * - Attend la fin de l'animation (`animationend`) avant d'exécuter la fonction `callback()`.
 * - Supprime l'écouteur d'événement après la première exécution grâce à `{ once: true }`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie si `mediaElement` est bien un élément HTML avant d'ajouter la classe.
 * - Vérifie si `callback` est une fonction avant de l'exécuter.
 * - Capture et journalise toute erreur avec `logEvent("error", ...)`.
 * 
 * @function animateMediaExitLeft
 * @param {HTMLElement} mediaElement - L'élément HTML du média en cours d'affichage dans la lightbox.
 * @param {Function} callback - Fonction de rappel exécutée une fois l'animation terminée.
 * @throws {Error} Lève une erreur si `mediaElement` n'est pas valide ou si `callback` n'est pas une fonction.
 */

function animateMediaExitLeft(mediaElement, callback) {
    try {
        // Vérifie que `mediaElement` est un élément HTML valide
        if (!(mediaElement instanceof HTMLElement)) {
            throw new Error("L'élément média est invalide ou non défini.");
        }

        // Vérifie que `callback` est bien une fonction avant de l'appeler
        if (typeof callback !== "function") {
            throw new Error("Le paramètre `callback` doit être une fonction valide.");
        }

        // Ajoute la classe CSS pour déclencher l'animation de sortie vers la gauche
        mediaElement.classList.add("lightbox-exit-left");

        // Ajoute un écouteur d'événement pour détecter la fin de l'animation
        mediaElement.addEventListener("animationend", () => {
            try {
                // Exécute la fonction de rappel après l'animation
                callback();
                logEvent("success", "Animation de sortie vers la gauche terminée.");
            } catch (callbackError) {
                logEvent("error", `Erreur dans la fonction de rappel après l'animation : ${callbackError.message}`, { callbackError });
            }
        }, { once: true });

        logEvent("info", "Animation de sortie vers la gauche lancée.");
    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de l'animation de sortie vers la gauche : ${error.message}`, { error });
    }
}


/**
 * Applique une animation de sortie vers la droite au média actuellement affiché dans la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Ajoute la classe CSS `"lightbox-exit-right"` pour déclencher l'animation de sortie.
 * - Attend la fin de l'animation (`animationend`) avant d'exécuter la fonction `callback()`.
 * - Supprime l'écouteur d'événement après la première exécution grâce à `{ once: true }`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie si `mediaElement` est bien un élément HTML avant d'ajouter la classe.
 * - Vérifie si `callback` est une fonction avant de l'exécuter.
 * - Capture et journalise toute erreur avec `logEvent("error", ...)`.
 * 
 * @function animateMediaExitRight
 * @param {HTMLElement} mediaElement - L'élément HTML du média en cours d'affichage dans la lightbox.
 * @param {Function} callback - Fonction de rappel exécutée une fois l'animation terminée.
 * @throws {Error} Lève une erreur si `mediaElement` n'est pas valide ou si `callback` n'est pas une fonction.
 */

function animateMediaExitRight(mediaElement, callback) {
    try {
        // Vérifie que `mediaElement` est un élément HTML valide
        if (!(mediaElement instanceof HTMLElement)) {
            throw new Error("L'élément média est invalide ou non défini.");
        }

        // Vérifie que `callback` est bien une fonction avant de l'appeler
        if (typeof callback !== "function") {
            throw new Error("Le paramètre `callback` doit être une fonction valide.");
        }

        // Ajoute la classe CSS pour déclencher l'animation de sortie vers la droite
        mediaElement.classList.add("lightbox-exit-right");

        // Ajoute un écouteur d'événement pour détecter la fin de l'animation
        mediaElement.addEventListener("animationend", () => {
            try {
                // Exécute la fonction de rappel après l'animation
                callback();
                logEvent("success", "Animation de sortie vers la droite terminée.");
            } catch (callbackError) {
                logEvent("error", `Erreur dans la fonction de rappel après l'animation : ${callbackError.message}`, { callbackError });
            }
        }, { once: true });

        logEvent("info", "Animation de sortie vers la droite lancée.");
    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de l'animation de sortie vers la droite : ${error.message}`, { error });
    }
}
/*==============================================*/
/*             Insertion           */
/*==============================================*/

/**
 * Insère un nouveau média dans la lightbox avec une animation d'entrée.
 * 
 * ### **Fonctionnement :**
 * - Vérifie si les paramètres `media` et `folderPath` sont valides.
 * - Crée dynamiquement un élément `<img>` ou `<video>` en fonction du type de média.
 * - Configure les attributs nécessaires pour chaque type de média (source, accessibilité, contrôles...).
 * - Ajoute une classe CSS pour animer l’entrée du média.
 * - Met à jour la légende (`lightboxCaption`) avec le titre du média.
 * - Journalise l'opération via `logEvent()`.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `media` est bien un objet avec une image ou une vidéo.
 * - Vérifie que `folderPath` est une chaîne valide.
 * - Vérifie que `lightboxMediaContainer` et `lightboxCaption` existent bien dans le DOM.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function insertNewMedia
 * @param {Object} media - Objet représentant le média à insérer.
 * @param {string} folderPath - Chemin d'accès au dossier contenant les médias.
 * @param {string} direction - Direction de l'animation d'entrée (`"left"` ou `"right"`).
 * @throws {Error} Génère une erreur si un paramètre est invalide ou si l'insertion échoue.
 */

function insertNewMedia(media, folderPath, direction) {
    try {
        // Vérifie que `media` est un objet valide avec une image ou une vidéo
        if (!media || (typeof media !== "object") || (!media.image && !media.video)) {
            throw new Error("Le paramètre `media` est invalide ou ne contient ni image ni vidéo.");
        }

        // Vérifie que `folderPath` est une chaîne valide
        if (typeof folderPath !== "string" || folderPath.trim() === "") {
            throw new Error("Le chemin du dossier `folderPath` est invalide.");
        }

        // Vérifie la validité des sélecteurs DOM avant d'interagir avec eux
        const { lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;
        if (!lightboxMediaContainer || !lightboxCaption) {
            throw new Error("Les éléments DOM de la lightbox sont introuvables.");
        }

        // Crée un nouvel élément média en fonction du type (image ou vidéo)
        const newMedia = document.createElement(media.image ? "img" : "video");
        newMedia.classList.add("lightbox-media", "active-media");

        // Configure les attributs spécifiques selon le type de média
        if (media.image) {
            newMedia.src = `${folderPath}${media.image}`;
            newMedia.alt = media.title || "Image sans titre"; // Accessibilité
            newMedia.loading = "lazy"; // Optimisation du chargement
        } else if (media.video) {
            newMedia.src = `${folderPath}${media.video}`;
            newMedia.controls = true;
            newMedia.autoplay = true;
            newMedia.muted = false;
        }

        // Ajoute le nouvel élément média au conteneur de la lightbox
        lightboxMediaContainer.appendChild(newMedia);

        // Met à jour la légende avec le titre du média
        lightboxCaption.textContent = media.title || "Sans titre";

        // Journalisation du succès
        logEvent("success", "Média inséré avec succès dans la lightbox.", { media, direction });

    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de l'insertion du média dans la lightbox : ${error.message}`, { error });
    }
}


/*==============================================*/
/*             Navigation          */
/*==============================================*/
/**
 * Gère la navigation vers le média suivant dans la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `mediaList` est bien défini et contient des médias.
 * - Empêche les changements multiples rapides grâce à la variable `isTransitioning`.
 * - Met à jour l'index actuel (`currentIndex`) pour passer au média suivant en boucle.
 * - Met à jour l'affichage du média en appelant `updateLightboxContent()`.
 * - Utilise un `setTimeout()` pour limiter la rapidité des changements et garantir une animation fluide.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `mediaList` est bien un tableau et qu'il contient des médias.
 * - Vérifie que `globalFolderName` est bien une chaîne valide avant de l'utiliser.
 * - Empêche tout comportement erratique en bloquant les transitions trop rapides avec `isTransitioning`.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function showNextMedia
 * @throws {Error} Génère une erreur si `mediaList` est invalide ou vide.
 */

export function showNextMedia() {
    try {
        // Vérifie que `mediaList` est défini et contient au moins un média
        if (!Array.isArray(mediaList) || mediaList.length === 0) {
            throw new Error("Aucun média disponible pour la navigation.");
        }

        // Vérifie que `globalFolderName` est une chaîne valide avant de l'utiliser
        if (typeof globalFolderName !== "string") {
            throw new Error("Nom du dossier invalide ou non défini.");
        }

        // Empêche la navigation si une transition est déjà en cours
        if (isTransitioning) {
            logEvent("warn", "Tentative de navigation alors qu'une transition est en cours.");
            return;
        }

        // Active la protection contre les changements trop rapides
        isTransitioning = true;

        // Met à jour l'index en avançant dans la liste (retourne au début si fin de liste)
        currentIndex = (currentIndex + 1) % mediaList.length;

        // Met à jour l'affichage avec le nouveau média
        updateLightboxContent(mediaList[currentIndex], globalFolderName, "right");

        // Désactive la protection après l'animation (500ms)
        setTimeout(() => {
            isTransitioning = false;
            logEvent("info", "Transition terminée, navigation autorisée.");
        }, 500);

        // Journalisation du succès
        logEvent("success", `Navigation vers le média suivant. Index actuel : ${currentIndex}.`);

    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de la navigation vers le média suivant : ${error.message}`, { error });
    }
}

/**
 * Gère la navigation vers le média précédent dans la lightbox.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que `mediaList` est bien défini et contient des médias.
 * - Empêche les changements multiples rapides grâce à la variable `isTransitioning`.
 * - Met à jour l'index actuel (`currentIndex`) pour passer au média précédent en boucle.
 * - Met à jour l'affichage du média en appelant `updateLightboxContent()`.
 * - Utilise un `setTimeout()` pour limiter la rapidité des changements et garantir une animation fluide.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `mediaList` est bien un tableau et qu'il contient des médias.
 * - Vérifie que `globalFolderName` est bien une chaîne valide avant de l'utiliser.
 * - Empêche tout comportement erratique en bloquant les transitions trop rapides avec `isTransitioning`.
 * - Capture et journalise toute erreur inattendue.
 * 
 * @function showPreviousMedia
 * @throws {Error} Génère une erreur si `mediaList` est invalide ou vide.
 */

export function showPreviousMedia() {
    try {
        // Vérifie que `mediaList` est défini et contient au moins un média
        if (!Array.isArray(mediaList) || mediaList.length === 0) {
            throw new Error("Aucun média disponible pour la navigation.");
        }

        // Vérifie que `globalFolderName` est une chaîne valide avant de l'utiliser
        if (typeof globalFolderName !== "string") {
            throw new Error("Nom du dossier invalide ou non défini.");
        }

        // Empêche la navigation si une transition est déjà en cours
        if (isTransitioning) {
            logEvent("warn", "Tentative de navigation alors qu'une transition est en cours.");
            return;
        }

        // Active la protection contre les changements trop rapides
        isTransitioning = true;

        // Met à jour l'index en reculant dans la liste (retourne à la fin si au début)
        currentIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;

        // Met à jour l'affichage avec le nouveau média
        updateLightboxContent(mediaList[currentIndex], globalFolderName, "left");

        // Désactive la protection après l'animation (500ms)
        setTimeout(() => {
            isTransitioning = false;
            logEvent("info", "Transition terminée, navigation autorisée.");
        }, 500);

        // Journalisation du succès
        logEvent("success", `Navigation vers le média précédent. Index actuel : ${currentIndex}.`);

    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de la navigation vers le média précédent : ${error.message}`, { error });
    }
}
/*==============================================*/
/*             Mise a jour du contenu
/*==============================================*/
/**
 * Met à jour dynamiquement le contenu de la lightbox avec la bonne animation.
 * 
 * ### **Fonctionnement :**
 * - Vérifie que les paramètres `media` et `folderName` sont valides.
 * - Détermine le chemin correct du dossier des médias.
 * - Vérifie si un média est déjà affiché dans la lightbox.
 * - Applique une animation de sortie (`animateMediaExitLeft` ou `animateMediaExitRight`).
 * - Supprime l'ancien média avant d'insérer le nouveau (`insertNewMedia`).
 * - Journalise chaque étape du processus pour assurer une meilleure traçabilité.
 * 
 * ### **Gestion des erreurs :**
 * - Vérifie que `media` est défini avant de le traiter.
 * - Vérifie que `folderName` est une chaîne valide.
 * - Vérifie que `direction` est bien `"right"` ou `"left"`.
 * - Capture et journalise toute erreur inattendue via `logEvent("error", ...)`.
 * 
 * @function updateLightboxContent
 * @param {Object} media - L'objet contenant les informations du média à afficher.
 * @param {string} folderName - Le nom du dossier contenant les médias.
 * @param {string} direction - La direction de l'animation (`"right"` pour avancer, `"left"` pour reculer).
 * @throws {Error} Génère une erreur si `media` est invalide ou si `folderName` est incorrect.
 */

function updateLightboxContent(media, folderName, direction) {
    try {
        // Journalisation de la mise à jour de la lightbox
        logEvent("debug", ` Mise à jour de la lightbox : ${currentIndex} / ${mediaList.length}`, {
            media, 
            currentIndex, 
            folderName, 
            direction
        });

        // Vérifie que les paramètres sont valides
        if (!media || typeof folderName !== "string") {
            throw new Error("Média ou nom du dossier invalide.");
        }

        // Vérifie que la direction est bien définie ("right" ou "left")
        if (direction !== "right" && direction !== "left") {
            throw new Error(`Direction "${direction}" non valide. Attendu : "right" ou "left".`);
        }

        // Récupération des éléments de la lightbox
        const { lightboxMediaContainer } = domSelectors.lightbox;

        // Vérifie que le conteneur existe avant de manipuler le DOM
        if (!lightboxMediaContainer) {
            throw new Error("Conteneur de médias de la lightbox introuvable.");
        }

        // Récupère l'élément média actuellement affiché
        const currentMedia = lightboxMediaContainer.querySelector(".active-media");

        // Construit le chemin du dossier contenant les médias
        const folderPath = `../../../assets/photographers/${folderName}/`;

        // Vérifie si un média est déjà affiché et applique l'animation appropriée avant de l'enlever
        if (currentMedia) {
            if (direction === "right") {
                animateMediaExitLeft(currentMedia, () => {
                    currentMedia.remove(); // Supprime l'ancien média après l'animation
                    insertNewMedia(media, folderPath, direction); // Insère le nouveau média
                });
            } else {
                animateMediaExitRight(currentMedia, () => {
                    currentMedia.remove(); // Supprime l'ancien média après l'animation
                    insertNewMedia(media, folderPath, direction); // Insère le nouveau média
                });
            }
        } else {
            // Si aucun média précédent, on insère directement le nouveau média
            insertNewMedia(media, folderPath, direction);
        }

        // Journalisation du succès
        logEvent("success", `Média mis à jour avec succès. Direction : ${direction}`, { media });

    } catch (error) {
        // Capture et journalise toute erreur rencontrée
        logEvent("error", `Erreur lors de la mise à jour du média dans la lightbox : ${error.message}`, { error });
    }
}

