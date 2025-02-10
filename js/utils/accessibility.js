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
 *  SECTION : ATTRIBUTS ARIA
 *  =============================================================================
 */

/**
 * Met à jour dynamiquement un attribut ARIA d'un élément HTML.
 * @param {HTMLElement} element - Élément cible.
 * @param {string} ariaAttr - Nom de l'attribut ARIA (ex : 'aria-hidden').
 * @param {string | boolean} value - Valeur de l'attribut.
 */
export function updateAriaAttribute(element, ariaAttr, value) {
  if (!(element instanceof HTMLElement)) {
    logEvent("error", "updateAriaAttribute: Élément non valide.", { element });
    return;
  }

  if (!ariaAttr.startsWith("aria-")) {
    logEvent("warn", `updateAriaAttribute: "${ariaAttr}" n'est pas un attribut ARIA valide.`);
  }

  element.setAttribute(ariaAttr, value.toString());
  logEvent("success", `Attribut ARIA "${ariaAttr}" mis à jour avec succès.`, { element, value });
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

/** =============================================================================
 *  SECTION : CONTRASTE DES COULEURS
 *  =============================================================================
 */

/**
 * Vérifie le contraste entre deux couleurs selon les normes WCAG 2.1.
 * @param {string} color1 - Première couleur (hexadécimal).
 * @param {string} color2 - Deuxième couleur (hexadécimal).
 * @returns {boolean} `true` si le contraste est suffisant, sinon `false`.
 */
export function checkColorContrast(color1, color2) {
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
  };

  const luminance = (r, g, b) => {
    const a = [r, g, b].map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const contrastRatio = (Math.max(luminance(r1, g1, b1), luminance(r2, g2, b2)) + 0.05) / 
                        (Math.min(luminance(r1, g1, b1), luminance(r2, g2, b2)) + 0.05);

  logEvent("info", `Contraste entre ${color1} et ${color2} : ${contrastRatio.toFixed(2)}`);
  return contrastRatio >= 4.5;
}
/**
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

  // Sélectionne tous les éléments interactifs dans la modale
  const focusableElements = modal.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
      logEvent("warn", "trapFocus : Aucun élément interactif trouvé dans la modale.");
      return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(event) {
      if (event.key !== "Tab") {
        return;
      }

      logEvent("debug", "trapFocus : Gestion du Tab.", { keyPressed: event.key });

      if (event.shiftKey) {
                // Shift + Tab : Retourne au dernier élément si focus sur le premier
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            }
      else if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
  }

  // Ajout de l'écouteur pour `Tab`
  modal.addEventListener("keydown", handleTabKey);

  // Place le focus sur le premier élément interactif à l'ouverture
  firstElement.focus();

  // Supprime l'événement au moment de la fermeture de la modale
  modal.addEventListener("transitionend", () => {
      modal.removeEventListener("keydown", handleTabKey);
  });
}


