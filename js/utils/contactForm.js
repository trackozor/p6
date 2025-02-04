// ========================================================
// Nom du fichier : contactForm.js
// Description    : Gestion de la validation du formulaire
// Auteur         : Trackozor
// Date           : 15/01/2025
// Version        : 1.4.1 (Optimisation de la gestion des animations et suppression des doublons)
// ========================================================

/*==============================================*/
/*              Imports et Config              */
/*==============================================*/

import { logEvent, showError, removeError } from "./utils.js";
import {
  openConfirmationModal,
  showSpamModal,
} from "../components/modal/modalManager.js";

// === Définition des champs obligatoires ===
const REQUIRED_FIELDS = ["first-name", "last-name", "email", "message"];
const FIELD_NAMES = {
  "first-name": "Prénom",
  "last-name": "Nom",
  email: "E-mail",
  message: "Message",
};
/*===============================================================================================*/
/*                                 ======= Validation des champs =======                         */
/*===============================================================================================*/

/*==============================================*/
/*              Nom et Prénom             */
/*==============================================*/
/**
 * Valide un champ de texte (ex: prénom, nom) en respectant plusieurs critères :
 *
 * ### **Critères de validation :**
 * - **Obligatoire** : Le champ ne peut pas être vide.
 * - **Longueur minimale et maximale** :
 *   - Doit contenir **au moins 2 caractères**.
 *   - Ne doit **pas dépasser 50 caractères**.
 * - **Caractères autorisés** :
 *   - Lettres avec accents (`A-Z, À-Ö, Ø-ö, ø-ÿ`).
 *   - Espaces (` `), tirets (`-`), apostrophes (`'`).
 *   - **Empêche les doubles espaces, tirets ou apostrophes**.
 *
 * ### **Gestion des erreurs :**
 * - Affiche un message d'erreur en cas de validation échouée (`showError()`).
 * - Retire l'erreur une fois le champ corrigé (`removeError()`).
 * - Journalise l'événement (`logEvent()`) pour suivi et débogage.
 *
 * @function validateTextField
 * @param {HTMLElement} field - L'élément HTML du champ de texte à valider.
 * @param {string} fieldId - Identifiant unique du champ (ex: "firstName", "lastName").
 * @returns {boolean} Retourne `true` si le champ est valide, sinon `false`.
 * @throws {Error} Génère une erreur si `field` n'est pas un élément valide.
 */

export function validateTextField(field, fieldId) {
  try {
    // Vérifie que le champ est bien un élément HTML valide
    if (!(field instanceof HTMLElement)) {
      throw new Error("L'élément fourni n'est pas un champ HTML valide.");
    }

    // Récupère la valeur et supprime les espaces inutiles
    const value = field.value.trim();
    const fieldName = FIELD_NAMES[fieldId] || "Champ"; // Nom du champ pour affichage clair
    let errorMessage = "";

    // ✅ Autorisation stricte : Seulement lettres, espaces, apostrophes, tirets
    const VALID_NAME_REGEX =
      /^(?!.*[\s'-]{2})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    // === Vérification des conditions ===
    if (value === "") {
      errorMessage = `⚠️ Le ${fieldName} est requis.`;
    } else if (value.length < 2) {
      errorMessage = `⚠️ Le ${fieldName} doit contenir au moins 2 caractères.`;
    } else if (value.length > 50) {
      errorMessage = `⚠️ Le ${fieldName} ne doit pas dépasser 50 caractères.`;
    } else if (!VALID_NAME_REGEX.test(value)) {
      errorMessage = `❌ Le ${fieldName} contient des caractères invalides.`;
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
      showError(errorMessage, field); // Affiche le message d'erreur
      logEvent("warn", ` Validation échouée pour ${fieldName}.`, {
        errorMessage,
        value,
      });
      return false;
    } else {
      removeError(field); // Supprime l'erreur si tout est OK
      logEvent("success", `Validation réussie pour ${fieldName}.`, { value });
      return true;
    }
  } catch (error) {
    // Capture et journalisation de l'erreur en cas de problème inattendu
    logEvent("error", `Erreur critique lors de la validation de ${fieldId}`, {
      message: error.message,
      stack: error.stack,
    });
    return false;
  }
}

/*==============================================*/
/*              Email             */
/*==============================================*/
/**
 * Valide le champ "E-mail" en appliquant plusieurs contrôles de sécurité.
 *
 * ### **Critères de validation :**
 * - **Obligatoire** : Le champ ne peut pas être vide.
 * - **Format valide** : Respecte la structure standard des e-mails (`nom@domaine.ext`).
 * - **Protection contre les attaques XSS et injections** :
 *   - Empêche l'insertion de scripts (`javascript:`).
 *   - Bloque les URL non sécurisées (`http://`, `https://`).
 *   - Rejette toute tentative d'injection HTML (`<script>`, `<img>`...).
 *
 * ### **Gestion des erreurs :**
 * - Affiche un message d'erreur en cas de validation échouée (`showError()`).
 * - Retire l'erreur une fois corrigée (`removeError()`).
 * - Journalise l'événement (`logEvent()`) pour suivi et sécurité.
 *
 * @function validateEmail
 * @param {HTMLElement} field - L'élément HTML du champ email.
 * @returns {boolean} Retourne `true` si la validation est réussie, sinon `false`.
 * @throws {Error} Génère une erreur si `field` n'est pas un élément HTML valide.
 */

export function validateEmail(field) {
  try {
    // Vérifie que le champ est bien un élément HTML valide
    if (!(field instanceof HTMLElement)) {
      throw new Error("L'élément fourni n'est pas un champ HTML valide.");
    }

    // Récupère la valeur et supprime les espaces inutiles
    const value = field.value.trim();
    let errorMessage = "";

    // Format d'email standard (nom@domaine.ext)
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //  Patterns interdits (tentatives d'injection XSS ou URL malveillantes)
    const FORBIDDEN_PATTERNS = [
      /javascript:/gi, // Bloque `<a href="javascript:alert('XSS')">`
      /http:/gi, // Empêche `http://` dans les adresses email
      /https:/gi, // Empêche `https://` (exemple : `<a href="https://malware.com">`)
      /<.*?>/gi, // Bloque toute balise HTML (`<script>`, `<img>`, etc.)
    ];

    // === Vérification des conditions ===
    if (value === "") {
      errorMessage = "⚠️ L'e-mail est requis.";
    } else if (!EMAIL_REGEX.test(value)) {
      errorMessage = "❌ Adresse e-mail invalide.";
    } else if (FORBIDDEN_PATTERNS.some((pattern) => pattern.test(value))) {
      errorMessage = "❌ Adresse e-mail suspecte détectée.";
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
      showError(errorMessage, field); // Affiche le message d'erreur
      logEvent("warn", " Validation échouée pour l'e-mail.", {
        errorMessage,
        value,
      });
      return false;
    } else {
      removeError(field); // Supprime l'erreur si tout est OK
      logEvent("success", " Validation réussie pour l'e-mail.", { value });
      return true;
    }
  } catch (error) {
    // Capture et journalisation de l'erreur en cas de problème inattendu
    logEvent("error", "Erreur critique lors de la validation de l'e-mail", {
      message: error.message,
      stack: error.stack,
    });
    return false;
  }
}
/*==============================================*/
/*              Anti-spam ( pot de miel  )             */
/*==============================================*/

/**
 * Vérifie le champ Honeypot pour détecter les tentatives de spam.
 *
 * ### **Fonctionnement :**
 * - Récupère la valeur du champ caché `"hidden-field"`.
 * - Si le champ contient une valeur, il s'agit probablement d'un bot (tentative de spam).
 * - Journalise l'événement (`logEvent()`) en cas de détection d'un spam.
 * - Retourne `false` si une activité suspecte est détectée, sinon `true`.
 *
 * ### **Gestion des erreurs et journalisation :**
 * - Vérifie que l'élément HTML existe avant d'accéder à sa valeur.
 * - Journalise toute erreur inattendue (`logEvent("error", ...)`).
 * - Sécurise l'accès au champ pour éviter les erreurs JavaScript en cas de modification du DOM.
 *
 * @function checkHoneypot
 * @returns {boolean} Retourne `false` si un spam est détecté, sinon `true`.
 * @throws {Error} Génère une erreur si l'élément Honeypot est introuvable.
 */

export function checkHoneypot() {
  try {
    // Récupération sécurisée de l'élément Honeypot
    const honeypotField = document.getElementById("hidden-field");

    if (!honeypotField) {
      throw new Error("🚨 Champ Honeypot introuvable dans le DOM !");
    }

    // Vérification du contenu du champ Honeypot
    const honeypotValue = honeypotField.value.trim();

    if (honeypotValue !== "") {
      logEvent("error", "🚨 Spam détecté via Honeypot !", { honeypotValue });
      return false; // Bloque l'envoi du formulaire en cas de spam détecté
    }

    logEvent("success", "✅ Honeypot validé, pas de spam détecté.");
    return true; // Aucun spam détecté, formulaire valide

  } catch (error) {
    // Capture et journalisation des erreurs
    logEvent("error", "Erreur lors de la vérification du Honeypot.", {
      message: error.message,
      stack: error.stack,
    });
    return false; // Par mesure de sécurité, on bloque l'envoi du formulaire en cas d'erreur
  }
}

/*==============================================*/
/*             vérification Message            */
/*==============================================*/
/**
/**
 * Vérifie si un message contient des scripts malveillants ou des tentatives d'injection.
 *
 * ### **Fonctionnement :**
 * - Nettoie l'entrée en supprimant les espaces inutiles (`trim()`).
 * - Vérifie la présence de motifs interdits tels que :
 *   - Balises HTML `<script>`, `<img onerror=...>`, etc. (XSS)
 *   - Manipulation du DOM (`document.`, `window.`, `fetch()`, `XMLHttpRequest`)
 *   - Injections SQL (`SELECT`, `INSERT`, `DROP TABLE`)
 *   - Tentatives de vol de données (`cookie`, `localStorage`, `sessionStorage`)
 * - Si un motif suspect est détecté, journalise l'événement et renvoie `false` pour bloquer le message.
 * - Sinon, journalise la validation et renvoie `true`.
 *
 * ### **Gestion des erreurs et journalisation :**
 * - Capture les erreurs inattendues et les journalise avec `logEvent("error", ...)`.
 * - Ajoute des logs de succès lorsque le message est considéré comme sûr.
 *
 * @function isMessageSafe
 * @param {string} message - Le message saisi par l'utilisateur.
 * @returns {boolean} - Retourne `true` si le message est sécurisé, sinon `false`.
 * @throws {Error} Génère une erreur si le paramètre `message` est invalide.
 */

export function isMessageSafe(message) {
  try {
    // Vérification que le message est bien une chaîne de caractères
    if (typeof message !== "string") {
      throw new Error("Le message à vérifier n'est pas une chaîne valide.");
    }

    // Nettoyage du message en supprimant les espaces superflus
    const sanitizedMessage = message.trim();

    // Liste des motifs interdits pour prévenir les attaques XSS, SQLi, CSRF et JS Injection
    const forbiddenPatterns = [
      /<.*?>/gi, // Interdit toute balise HTML
      /<\/?[^>]+(>|$)/gi, // Interdit les balises non autorisées
      /on\w+=["'].*?["']/gi, // Interdit les événements JS (onerror, onclick)
      /javascript:/gi, // Interdit les URLs JS
      /eval\s*\(.*?\)/gi, // Interdit eval()
      /document\./gi, // Interdit la manipulation du DOM
      /window\./gi, // Interdit la manipulation de la fenêtre navigateur
      /fetch\(/gi, // Interdit fetch() (attaque CSRF)
      /XMLHttpRequest/gi, // Interdit les requêtes AJAX directes
      /SELECT\s.*?\sFROM/gi, // Interdit les requêtes SQL classiques
      /INSERT\s+INTO/gi, // Interdit les insertions SQL
      /DROP\s+TABLE/gi, // Interdit les suppressions SQL
      /script/gi, // Interdit toute mention du mot "script"
      /cookie/gi, // Interdit l'accès aux cookies
      /sessionStorage/gi, // Interdit l'accès au stockage de session
      /localStorage/gi, // Interdit l'accès au stockage local
    ];

    // Vérification du message en le comparant aux motifs interdits
    for (let pattern of forbiddenPatterns) {
      if (pattern.test(sanitizedMessage)) {
        logEvent("error", "🚨 Message suspect détecté !", { message });
        return false; // Bloque l'envoi du message suspect
      }
    }

    // Message validé avec succès
    logEvent("success", "✅ Message validé et sécurisé.", { sanitizedMessage });
    return true; // Autorise l'envoi du message

  } catch (error) {
    // Capture et journalisation des erreurs inattendues
    logEvent("error", "Erreur lors de la validation du message.", {
      message: error.message,
      stack: error.stack,
    });
    return false; // Par mesure de sécurité, on bloque le message en cas d'erreur
  }
}

/*==============================================*/
/*      validation et Sécurisation Message            */
/*==============================================*/
/**
 * Valide et sécurise le champ "message" avant sa soumission.
 *
 * ### **Fonctionnement :**
 * - Nettoie l'entrée utilisateur (`trim()`).
 * - Vérifie si le message contient du code suspect (XSS, SQLi, etc.) avec `isMessageSafe()`.
 * - Vérifie la longueur du message :
 *   - Minimum requis : `10 caractères` pour éviter les messages vides ou inutiles.
 *   - Maximum autorisé : `500 caractères` pour éviter les abus.
 * - Affiche un message d'erreur si la validation échoue.
 * - Supprime l'erreur si le message est valide.
 * - Enregistre les tentatives dans les logs via `logEvent()`.
 *
 * ### **Gestion des erreurs :**
 * - Vérifie que `field` est bien un élément HTML valide.
 * - Vérifie que le message respecte les critères de longueur et de sécurité.
 * - Capture et journalise toute erreur inattendue.
 *
 * @function validateMessageField
 * @param {HTMLTextAreaElement} field - L'élément HTML du champ message.
 * @returns {boolean} - Retourne `true` si le message est sécurisé et valide, sinon `false`.
 * @throws {Error} - Génère une erreur si `field` est invalide.
 */

export function validateMessageField(field) {
  try {
    // Vérifie que le champ `field` est bien un élément HTML valide
    if (!(field instanceof HTMLTextAreaElement)) {
      throw new Error("Le champ message n'est pas un élément HTML valide.");
    }

    // Récupération et nettoyage de la valeur du champ
    const value = field.value.trim();

    // Définition des contraintes de longueur du message
    const MAX_LENGTH = 500;
    const MIN_LENGTH = 10;

    let errorMessage = "";

    // Vérification de la sécurité du message (XSS, SQLi, etc.)
    if (!isMessageSafe(value)) {
      errorMessage = "🚨 Le message contient du code suspect et a été bloqué.";
    }
    // Vérification de la longueur minimale
    else if (value.length < MIN_LENGTH) {
      errorMessage = `⚠️ Le message doit contenir au moins ${MIN_LENGTH} caractères.`;
    }
    // Vérification de la longueur maximale
    else if (value.length > MAX_LENGTH) {
      errorMessage = `⚠️ Le message ne doit pas dépasser ${MAX_LENGTH} caractères.`;
    }

    // Si une erreur est détectée, l'afficher et enregistrer l'échec
    if (errorMessage) {
      showError(errorMessage, field);
      logEvent("warn", "⚠️ Validation échouée pour le message.", {
        errorMessage,
        value,
      });
      return false;
    } else {
      // Supprime l'erreur si le message est valide
      removeError(field);
      logEvent("success", " Validation réussie pour le message.", { value });
      return true;
    }

  } catch (error) {
    // Capture et journalise toute erreur inattendue
    logEvent("error", "Erreur lors de la validation du message.", {
      message: error.message,
      stack: error.stack,
    });
    return false; // En cas d'erreur, on bloque la soumission par précaution
  }
}

/*===============================================================================================*/
/*                             ======= Validation Globale =======                                */
/*===============================================================================================*/
/**
 * Valide tous les champs du formulaire et retourne le résultat global.
 *
 * ### **Fonctionnement :**
 * - Vérifie le champ Honeypot (`checkHoneypot()`) pour détecter les robots spammeurs.
 * - Si un spam est détecté, la validation s'arrête immédiatement et affiche `showSpamModal()`.
 * - Parcourt la liste des champs obligatoires (`REQUIRED_FIELDS`).
 * - Applique la validation spécifique selon le type de champ :
 *   - `validateMessageField()` pour le message.
 *   - `validateEmail()` pour l'email.
 *   - `validateTextField()` pour les champs texte (nom, prénom, etc.).
 * - Si **tous les champs sont valides**, retourne `true`, sinon `false`.
 *
 * ### **Gestion des erreurs :**
 * - Capture et log les erreurs rencontrées via `logEvent()`.
 * - En cas de détection de spam, empêche l'envoi du formulaire et affiche une modale d'alerte.
 * - Gère individuellement chaque champ et conserve l'état des validations partielles.
 *
 * @function validateForm
 * @returns {boolean} - Retourne `true` si tous les champs sont valides, sinon `false`.
 */

export function validateForm() {
  let isValid = true; // Indicateur global de validation

  // Vérification du champ Honeypot (détection anti-spam)
  if (!checkHoneypot()) {
    logEvent("error", "🚨 Validation échouée : spam détecté via Honeypot.");
    showSpamModal(); // Affiche une alerte de détection de spam
    return false; // Stoppe immédiatement la validation
  }

  // Validation des champs obligatoires un par un
  REQUIRED_FIELDS.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (!field) {
      logEvent("error", "Champ introuvable : `${fieldId}`");
      return;
    }

    // Validation selon le type de champ
    if (fieldId === "message") {
      isValid = validateMessageField(field) && isValid;
    } else if (fieldId === "email") {
      isValid = validateEmail(field) && isValid;
    } else {
      isValid = validateTextField(field, fieldId) && isValid;
    }
  });

  // Log final de la validation
  logEvent("info", "Résultat final de la validation du formulaire.", {
    isValid,
  });

  return isValid;
}


/*===============================================================================================*/
/*                         ======= Gestion de la Soumission =======                              */
/*===============================================================================================*/

/**
 * Valide et gère la soumission du formulaire.
 *
 * ### **Fonctionnement :**
 * - Déclenche la validation complète du formulaire via `validateForm()`.
 * - Si la validation est réussie :
 *   - Journalise le succès.
 *   - Affiche une modale de confirmation (`openConfirmationModal()`).
 * - Si la validation échoue :
 *   - Journalise l'échec avec un message d'erreur.
 *   - La gestion des erreurs (y compris la détection de spam) est assurée par `validateForm()`.
 *
 * ### **Gestion des erreurs :**
 * - Gère automatiquement le cas où un spam est détecté (`showSpamModal()` est déclenché par `validateForm()`).
 * - Empêche l'affichage de la confirmation si des erreurs sont présentes.
 *
 * @function initvalidform
 */

export function initvalidform() {
  logEvent("info", "Soumission du formulaire détectée.");

  // Déclenche la validation complète du formulaire
  const formValid = validateForm();

  if (formValid) {
    // Formulaire valide : affiche la confirmation
    logEvent("success", "Formulaire valide. Affichage de la confirmation.");
    openConfirmationModal(); // Affiche la modale de confirmation
  } else {
    // Formulaire invalide : journalisation de l'erreur
    logEvent(
      "error",
      "Validation échouée : le formulaire contient des erreurs.",
    );
  }
}

