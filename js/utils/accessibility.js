/* ========================================================
 * Nom du fichier : accessibility.js
 * Description    : Ensemble complet de fonctionnalités d'accessibilité (a11y)
 * Auteur         : Trackozor
 * Date           : 01/01/2025
 * Version        : 2.0.0
 * ======================================================== */

/* ======================= Navigation au clavier ======================= */

/**
 * Active la navigation au clavier pour tous les éléments focusable à l'intérieur d'un conteneur donné.
 * @param {HTMLElement} container - Conteneur des éléments focusable.
 * @param {string} selector - Sélecteur CSS pour cibler les éléments focusable.
 */
export function enableKeyboardNavigation(container, selector = 'a, button, input, textarea, select, [tabindex]') {
    if (!(container instanceof HTMLElement)) {
        console.error('enableKeyboardNavigation: Conteneur invalide.', { container });
        return;
    }

    const focusableElements = Array.from(container.querySelectorAll(selector));
    if (focusableElements.length === 0) {
        console.warn('enableKeyboardNavigation: Aucun élément focusable trouvé dans le conteneur.');
        return;
    }

    let currentIndex = 0;

    container.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Empêche le comportement par défaut
            focusableElements[currentIndex].focus();

            // Mise à jour de l'index pour passer au suivant/précédent
            if (e.shiftKey) {
                currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            } else {
                currentIndex = (currentIndex + 1) % focusableElements.length;
            }
        }
    });

    console.log('Navigation au clavier activée pour', container);
}

/* ======================= Gestion des liens d'accès rapide ======================= */

/**
 * Active un lien d'accès rapide qui permet de passer directement au contenu principal.
 * @param {HTMLElement} skipLink - Élément lien d'accès rapide.
 * @param {HTMLElement} target - Élément cible du lien (contenu principal).
 */
export function enableSkipLink(skipLink, target) {
    if (!(skipLink instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        console.error('enableSkipLink: Paramètres invalides.', { skipLink, target });
        return;
    }

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1'); // Rend temporairement la cible focusable
        target.focus();
        target.removeAttribute('tabindex'); // Supprime tabindex après le focus
        console.log('Lien d\'accès rapide activé.', { skipLink, target });
    });
}

/* ======================= Gestion des attributs ARIA ======================= */

/**
 * Met à jour dynamiquement un attribut ARIA sur un élément HTML.
 * @param {HTMLElement} element - Élément cible.
 * @param {string} ariaAttr - Nom de l'attribut ARIA (ex : 'aria-hidden').
 * @param {string | boolean} value - Valeur à attribuer (ex : 'true', 'false').
 */
export function updateAriaAttribute(element, ariaAttr, value) {
    if (!(element instanceof HTMLElement)) {
        console.error('updateAriaAttribute: L\'élément fourni n\'est pas valide.', { element });
        return;
    }

    element.setAttribute(ariaAttr, value);
    console.log(`Attribut ARIA "${ariaAttr}" mis à jour avec la valeur "${value}".`, { element });
}

/* ======================= Détection et gestion des médias ======================= */

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
 * @param {string} color1 - Première couleur au format hexadécimal (ex : "#FFFFFF").
 * @param {string} color2 - Deuxième couleur au format hexadécimal (ex : "#000000").
 * @returns {boolean} - `true` si le contraste est suffisant, sinon `false`.
 */
export function checkColorContrast(color1, color2) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.replace('#', ''), 16);
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
    const contrastRatio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

    console.log(`Contraste entre ${color1} et ${color2} : ${contrastRatio.toFixed(2)}`);
    return contrastRatio >= 4.5; // Standard WCAG AA pour le texte normal
}

/* ======================= Gestion des animations au clavier ======================= */

/**
 * Désactive les animations pour les utilisateurs naviguant au clavier.
 */
export function disableAnimationsForKeyboardUsers() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('no-animations');
            console.log('Animations désactivées pour les utilisateurs clavier.');
        }
    });

    window.addEventListener('mousemove', () => {
        document.body.classList.remove('no-animations');
        console.log('Animations réactivées pour les utilisateurs souris.');
    });
}
