// ========================================================
// Nom du fichier : lightbox.js
// Description    : Gestion de la lightbox pour afficher les médias
//                  (images ou vidéos) en plein écran.
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.3.0 (Améliorations des logs et de la robustesse)
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/
import { logEvent } from "../../utils/utils.js";
import domSelectors from "../../config/domSelectors.js";

let currentIndex = 0; // Index du média affiché
let mediaList = []; // Liste des médias
let globalFolderName = ""; // Nom du dossier global pour les médias

/**
 * Initialise la lightbox avec une liste de médias.
 * @param {Array} mediaArray - Tableau des médias à afficher dans la lightbox.
 * @param {string} folderName - Nom du dossier contenant les médias.
 */
export function initLightbox(mediaArray, folderName) {
  logEvent("init", "Début de l'initialisation de la lightbox.", { mediaArray });

  if (!Array.isArray(mediaArray)) {
    logEvent(
      "error",
      "Le paramètre passé à initLightbox n'est pas un tableau.",
      { mediaArray },
    );
    throw new Error("Le paramètre mediaArray doit être un tableau.");
  }

  if (!folderName || typeof folderName !== "string") {
    logEvent("error", "Nom du dossier (folderName) invalide ou manquant.", {
      folderName,
    });
    throw new Error("Le nom du dossier doit être une chaîne valide.");
  }

  if (mediaArray.length === 0) {
    logEvent("warn", "Le tableau de médias est vide.");
    mediaList = [];
    globalFolderName = folderName; // Définit tout de même le dossier
    return;
  }

  try {
    mediaList = [...mediaArray];
    globalFolderName = folderName; // Définit le dossier global
    currentIndex = 0;
    logEvent("success", "Lightbox initialisée avec succès.", { mediaList });
  } catch (error) {
    logEvent("error", "Erreur lors de l'initialisation de la lightbox.", {
      error,
    });
    throw new Error(
      "Erreur d'initialisation de la lightbox : " + error.message,
    );
  }
}

/**
 * Ouvre la lightbox pour afficher un média à l'index spécifié.
 * @param {number} index - Index du média à afficher.
 * @param {Array} mediaArray - Liste des médias (optionnel si déjà initialisée).
 * @param {string} folderName - Nom du dossier contenant les médias.
 */
export function openLightbox(
  index,
  mediaArray = mediaList,
  folderName = globalFolderName,
) {
  logEvent("action", `Ouverture de la lightbox pour l'index ${index}.`, {
    index,
    folderName,
  });

  try {
    const { lightboxContainer, lightboxMediaContainer, lightboxCaption } =
      domSelectors.lightbox;

    if (!lightboxContainer || !lightboxMediaContainer || !lightboxCaption) {
      throw new Error("Conteneurs requis pour la lightbox introuvables.");
    }

    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      throw new Error("Tableau de médias invalide ou vide.");
    }

    if (!folderName || typeof folderName !== "string") {
      throw new Error("Nom du dossier (folderName) invalide ou manquant.");
    }

    if (index < 0 || index >= mediaArray.length) {
      throw new Error(`Index ${index} hors limites.`);
    }

    mediaList = [...mediaArray];
    globalFolderName = folderName; // Met à jour le dossier global
    currentIndex = index;

    const media = mediaList[index];
    updateLightboxContent(media, folderName);

    lightboxContainer.classList.remove("hidden");
    lightboxContainer.setAttribute("aria-hidden", "false");

    logEvent("success", "Lightbox ouverte avec succès.");
  } catch (error) {
    logEvent("error", "Erreur lors de l'ouverture de la lightbox.", {
      message: error.message,
      stack: error.stack,
    });
  }
}

/**
 * Met à jour le contenu de la lightbox avec un média.
 * @param {Object} media - Données du média à afficher.
 * @param {string} folderName - Nom du dossier contenant les médias.
 */
/**
 * Met à jour le contenu de la lightbox avec animation.
 * @param {Object} media - Données du média à afficher.
 * @param {string} folderName - Nom du dossier contenant les médias.
 * @param {string} direction - Direction du changement ("left" ou "right").
 */
function updateLightboxContent(media, folderName, direction) {
  const { lightboxMediaContainer, lightboxCaption } = domSelectors.lightbox;

  if (!lightboxMediaContainer || !lightboxCaption) {
    logEvent("error", "Conteneurs de la lightbox introuvables.", {
      lightboxMediaContainer,
      lightboxCaption,
    });
    return;
  }

  if (!media) {
    logEvent("error", "Média invalide ou introuvable.", { media });
    lightboxMediaContainer.innerHTML = "<p>Média introuvable.</p>";
    return;
  }

  if (!folderName || typeof folderName !== "string") {
    logEvent("error", "Nom du dossier (folderName) invalide ou non défini.", {
      folderName,
    });
    lightboxMediaContainer.innerHTML =
      "<p>Erreur : Dossier média introuvable.</p>";
    return;
  }

  try {
    const folderPath = `../../../assets/photographers/${folderName}/`;
    logEvent("info", "Chemin du dossier construit.", { folderPath });

    lightboxMediaContainer.innerHTML = "";

    let mediaElement;
    if (media.image) {
      const imagePath = `${folderPath}${media.image}`;
      mediaElement = document.createElement("img");
      mediaElement.src = imagePath;
      mediaElement.alt = media.title || "Image sans titre";
      mediaElement.loading = "lazy";

      logEvent("info", "Image détectée pour mise à jour dans la lightbox.", {
        imagePath,
        media,
      });
    } else if (media.video) {
      const videoPath = `${folderPath}${media.video}`;
      mediaElement = document.createElement("video");
      mediaElement.src = videoPath;
      mediaElement.controls = true;

      logEvent("info", "Vidéo détectée pour mise à jour dans la lightbox.", {
        videoPath,
        media,
      });
    }

    if (mediaElement) {
      mediaElement.classList.add(`entering-${direction}`);
      lightboxMediaContainer.appendChild(mediaElement);

      setTimeout(() => {
        mediaElement.classList.remove(`entering-${direction}`);
      }, 500); // Fin de l'animation

      lightboxCaption.textContent = media.title || "Sans titre";
      logEvent("success", "Contenu de la lightbox mis à jour avec succès.", {
        media,
        folderName,
      });
    } else {
      throw new Error("Type de média non pris en charge.");
    }
  } catch (error) {
    logEvent(
      "error",
      "Erreur lors de la mise à jour du contenu de la lightbox.",
      {
        error,
        media,
        folderName,
      },
    );
    lightboxMediaContainer.innerHTML =
      "<p>Erreur lors du chargement du contenu.</p>";
  }
}

/**
 * Ferme la lightbox.
 */
export function closeLightbox() {
  logEvent("action", "Fermeture de la lightbox.");

  const { lightboxContainer } = domSelectors.lightbox;
  if (!lightboxContainer) {
    logEvent("error", "Conteneur principal introuvable.");
    return;
  }

  lightboxContainer.classList.add("hidden");
  lightboxContainer.setAttribute("aria-hidden", "true");
  logEvent("success", "Lightbox fermée avec succès.");
}

/**
 * Affiche le média précédent.
 */
export function showPreviousMedia(
  mediaArray = mediaList,
  folderName = globalFolderName,
) {
  if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
    logEvent("error", "Aucun média disponible pour afficher le précédent.");
    return;
  }

  currentIndex = (currentIndex - 1 + mediaArray.length) % mediaArray.length;
  logEvent(
    "info",
    `Navigation vers le média précédent : Index ${currentIndex}`,
    { currentIndex },
  );
  displayMedia(currentIndex, folderName);
}

export function showNextMedia(
  mediaArray = mediaList,
  folderName = globalFolderName,
) {
  if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
    logEvent("error", "Aucun média disponible pour afficher le suivant.");
    return;
  }

  currentIndex = (currentIndex + 1) % mediaArray.length;
  logEvent("info", `Navigation vers le média suivant : Index ${currentIndex}`, {
    currentIndex,
  });
  displayMedia(currentIndex, folderName);
}

/**
 * Affiche un média spécifique.
 * @param {number} index - Index du média à afficher.
 */
function displayMedia(index, folderName = globalFolderName) {
  if (!Array.isArray(mediaList) || index < 0 || index >= mediaList.length) {
    logEvent("error", "Index ou média invalide.", { index, mediaList });
    return;
  }

  const { lightboxMediaContainer } = domSelectors.lightbox;
  const currentMedia = lightboxMediaContainer.querySelector("img, video");

  let direction = index > currentIndex ? "right" : "left"; // Déterminer la direction

  if (currentMedia) {
    // Applique l’animation de sortie
    currentMedia.classList.add(`exiting-${direction}`);
    
    // Supprime l'ancien média après l'animation
    setTimeout(() => {
      currentMedia.remove();
      updateLightboxContent(mediaList[index], folderName, direction);
    }, 500); // Attendre la fin de l'animation (0.5s)
  } else {
    updateLightboxContent(mediaList[index], folderName, direction);
  }
}
