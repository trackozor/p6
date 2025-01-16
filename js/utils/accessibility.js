/* ========================================================
 * Nom du fichier : accessibility.js
 * Description    : Fonctionnalités d'accessibilité (a11y) optimisées
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 2.1.0 (Optimisée)
 * ======================================================== */

/* ======================= Navigation au clavier ======================= */

/**
 * Active la navigation au clavier pour tous les éléments focusables d'un conteneur donné.
 * @param {HTMLElement} container - Conteneur des éléments focusables.
 * @param {string} selector - Sélecteur CSS pour cibler les éléments focusables.
 * @param {boolean} includeDynamic - Si `true`, inclut les éléments ajoutés dynamiquement.
 */
export function enableKeyboardNavigation(
  container,
  selector = "a, button, input, textarea, select, [tabindex]",
  includeDynamic = false,
) {
  if (!(container instanceof HTMLElement)) {
    console.error("enableKeyboardNavigation: Conteneur invalide.", {
      container,
    });
    return;
  }

  const getFocusableElements = () =>
    Array.from(container.querySelectorAll(selector));

  let focusableElements = getFocusableElements();
  let currentIndex = 0;

  const updateFocusableElements = () => {
    if (includeDynamic) {
      focusableElements = getFocusableElements();
    }
  };

  container.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Empêche le comportement par défaut
      focusableElements[currentIndex]?.focus();
      currentIndex =
        (currentIndex + (e.shiftKey ? -1 : 1) + focusableElements.length) %
        focusableElements.length;
    }
  });

  if (includeDynamic) {
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(container, { childList: true, subtree: true });
    console.log("Observation des éléments focusables activée.");
  }

  console.log("Navigation au clavier activée pour", container);
}

/* ======================= Gestion des liens d'accès rapide ======================= */

/**
 * Ajoute un lien d'accès rapide pour atteindre le contenu principal.
 * @param {HTMLElement} skipLink - Élément lien d'accès rapide.
 * @param {HTMLElement} target - Élément cible (contenu principal).
 */
export function enableSkipLink(skipLink, target) {
  if (!(skipLink instanceof HTMLElement) || !(target instanceof HTMLElement)) {
    console.error("enableSkipLink: Paramètres invalides.", {
      skipLink,
      target,
    });
    return;
  }

  skipLink.addEventListener("click", (e) => {
    e.preventDefault();
    target.setAttribute("tabindex", "-1"); // Temporise le focus
    target.focus();
    target.removeAttribute("tabindex");
    console.log("Lien d'accès rapide activé.", { skipLink, target });
  });
}

/* ======================= Gestion des attributs ARIA ======================= */

/**
 * Met à jour dynamiquement un attribut ARIA d'un élément HTML.
 * @param {HTMLElement} element - Élément cible.
 * @param {string} ariaAttr - Nom de l'attribut ARIA (ex : 'aria-hidden').
 * @param {string | boolean} value - Valeur de l'attribut.
 */
export function updateAriaAttribute(element, ariaAttr, value) {
  if (!(element instanceof HTMLElement)) {
    console.error("updateAriaAttribute: Élément non valide.", { element });
    return;
  }

  if (!ariaAttr.startsWith("aria-")) {
    console.warn(
      `updateAriaAttribute: "${ariaAttr}" n'est pas un attribut ARIA valide.`,
    );
  }

  element.setAttribute(ariaAttr, value.toString());
  console.log(
    `Attribut ARIA "${ariaAttr}" mis à jour avec la valeur "${value}".`,
    { element },
  );
}

/* ======================= Détection des médias ======================= */

/**
 * Détecte si l'utilisateur est sur un appareil mobile.
 * @returns {boolean} - `true` si l'utilisateur est sur mobile, sinon `false`.
 */
export function isMobile() {
  const result = window.matchMedia("(max-width: 1023px)").matches;
  console.log(`Détection de mobile : ${result}`);
  return result;
}

/* ======================= Vérification du contraste des couleurs ======================= */

/**
 * Vérifie le contraste entre deux couleurs selon les normes WCAG 2.1.
 * @param {string} color1 - Première couleur (hexadécimal).
 * @param {string} color2 - Deuxième couleur (hexadécimal).
 * @returns {boolean} - `true` si le contraste est suffisant, sinon `false`.
 */
export function checkColorContrast(color1, color2) {
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
  };

  const luminance = (r, g, b) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const lum1 = luminance(r1, g1, b1);
  const lum2 = luminance(r2, g2, b2);
  const contrastRatio =
    (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  console.log(`Contraste ${color1} vs ${color2} : ${contrastRatio.toFixed(2)}`);
  return contrastRatio >= 4.5;
}

/* ======================= Gestion des animations clavier ======================= */

/**
 * Désactive les animations pour les utilisateurs de clavier.
 */
export function disableAnimationsForKeyboardUsers() {
  const disableAnimations = () => document.body.classList.add("no-animations");
  const enableAnimations = () =>
    document.body.classList.remove("no-animations");

  window.addEventListener(
    "keydown",
    (e) => e.key === "Tab" && disableAnimations(),
  );
  window.addEventListener("mousemove", enableAnimations);

  console.log("Gestion des animations clavier activée.");
}
