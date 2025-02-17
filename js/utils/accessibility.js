/**
 * =============================================================================
 * Projet      : Fisheye
 * Fichier     : accessibility.js
 * Auteur      : Trackozor
 * Date        : 01/01/2025
 * Version     : 2.1.0
 * Description : Ce fichier contient les fonctionnalités d'accessibilité (a11y)
 *               optimisées pour :
 *               - Navigation au clavier.
 *               - Gestion des liens d'accès rapide.
 *               - Mise à jour des attributs ARIA.
 *               - Détection des médias et des couleurs.
 * =============================================================================
 */

import { logEvent } from "../utils/utils.js";
import { handleTabKey } from "../events/keyboardHandler.js";


/**=============================================================================
 * SECTION : LIENS D'ACCÈS RAPIDE
 * =============================================================================
 */

/**
 * Active un lien d'accès rapide permettant aux utilisateurs d'accéder directement
 * au contenu principal via le clavier ou un lecteur d'écran.
 *
 * Fonctionnement :
 * - Le clic sur `skipLink` redirige le focus vers `target`.
 * - Ajoute temporairement `tabindex="-1"` sur `target` pour permettre le focus.
 * - Supprime immédiatement `tabindex` après le focus pour éviter un comportement inattendu.
 * - Améliore l'accessibilité pour les utilisateurs de clavier et de lecteurs d'écran.
 *
 * @param {HTMLElement} skipLink - Élément HTML représentant le lien d'accès rapide.
 * @param {HTMLElement} target - Élément HTML vers lequel le focus sera redirigé.
 */
export function enableSkipLink(skipLink, target) {
  // Vérification des paramètres : doivent être des éléments HTML valides
  if (!(skipLink instanceof HTMLElement)) {
    logEvent("error", "enableSkipLink: `skipLink` doit être un élément HTML valide.", { skipLink });
    return;
  }
  if (!(target instanceof HTMLElement)) {
    logEvent("error", "enableSkipLink: `target` doit être un élément HTML valide.", { target });
    return;
  }

  /**
   * Gestionnaire de l'événement "click" sur le lien d'accès rapide.
   * - Empêche le comportement par défaut du lien (`e.preventDefault()`).
   * - Ajoute temporairement `tabindex="-1"` pour permettre le focus sur `target`.
   * - Déplace le focus sur `target`.
   * - Supprime immédiatement `tabindex` après la mise au point.
   */
  skipLink.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche le défilement et le comportement par défaut du lien
    target.setAttribute("tabindex", "-1"); // Ajout temporaire de l'attribut pour le focus
    target.focus(); // Déplacement du focus sur l'élément cible
    target.removeAttribute("tabindex"); // Suppression immédiate de l'attribut après focus

    // Journalisation du succès de l'opération
    logEvent("success", "Lien d'accès rapide activé.", { skipLink, target });
  });

  // Journalisation de l'activation du skip link
  logEvent("info", "Lien d'accès rapide configuré avec succès.", { skipLink, target });
}




/** =============================================================================
 *  SECTION : DÉTECTION DES MÉDIAS
 *  =============================================================================
 */

/**
 * Détecte si l'utilisateur est sur un appareil mobile.
 * @returns {boolean} `true` si l'utilisateur est sur mobile, sinon `false`.
 */
export function isMobile() {
  const result = window.matchMedia("(max-width: 1023px)").matches;
  logEvent("info", `Détection de mobile : ${result}`);
  return result;
}


/**
 * =============================================================================
 * Fonction : trapFocus
 * =============================================================================
 * Empêche l'utilisateur de sortir du focus lorsqu'une modale est ouverte.
 *
 * - Capture tous les éléments interactifs (input, boutons, liens...).
 * - Permet la navigation avec `Tab` entre ces éléments.
 * - Empêche la sortie de la modale avec `Shift + Tab` et `Tab` cyclique.
 *
 * @param {HTMLElement} modal - Élément de la modale active.
 */
export function trapFocus(modal) {
  if (!modal || !(modal instanceof HTMLElement)) {
      logEvent("error", "trapFocus : Élément de modale invalide ou inexistant.", { modal });
      return;
  }

  logEvent("info", "trapFocus : Activation du focus trap.", { modal });

  // Sélectionne tous les éléments interactifs dans la modale (exclut ceux désactivés)
  const focusableElements = Array.from(modal.querySelectorAll(
      'a, button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));

  if (focusableElements.length === 0) {
      logEvent("warn", "trapFocus : Aucun élément interactif trouvé dans la modale.");
      return;
  }

  // 🔹 Ajout de l'écouteur d'événement sur `document` pour capter tous les `Tab`
  document.addEventListener("keydown", handleTabKey);

  
  // 🔹 Suppression de l'événement lorsque la modale est fermée
  function removeTrapFocus() {
      document.removeEventListener("keydown");
      modal.removeEventListener("transitionend", removeTrapFocus);
      logEvent("info", "trapFocus : Désactivation du focus trap.");
  }

  modal.addEventListener("transitionend", removeTrapFocus);
}



