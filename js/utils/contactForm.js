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

/**
 * Valide un champ de texte (par exemple, prénom ou nom) en vérifiant plusieurs critères :
 * - Champ requis.
 * - Longueur minimale.
 * - Contenu valide (pas de caractères spéciaux non autorisés).
 *
 * @param {HTMLElement} field - L'élément HTML du champ à valider.
 * @param {string} fieldName - Nom du champ pour un affichage clair dans les erreurs (ex. : "prénom", "nom").
 * @returns {boolean} - Retourne `true` si le champ est valide, sinon `false`.
 */
export function validateTextField(field, fieldId) {
  const value = field.value.trim();
  const fieldName = FIELD_NAMES[fieldId] || "Champ";
  let errorMessage = "";

  // ✅ Autorisation stricte : Seulement lettres, espaces, apostrophes, tirets
  const VALID_NAME_REGEX = /^(?!.*[\s'-]{2})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  if (value === "") {
    errorMessage = `⚠️ Le ${fieldName} est requis.`;
  } else if (value.length < 2) {
    errorMessage = `⚠️ Le ${fieldName} doit contenir au moins 2 caractères.`;
  } else if (value.length > 50) {
    errorMessage = `⚠️ Le ${fieldName} ne doit pas dépasser 50 caractères.`;
  } else if (!VALID_NAME_REGEX.test(value)) {
    errorMessage = `❌ Le ${fieldName} contient des caractères invalides.`;
  }

  if (errorMessage) {
    showError(errorMessage, field);
    logEvent("warn", `⚠️ Validation échouée pour ${fieldName}.`, {
      errorMessage,
      value,
    });
    return false;
  } else {
    removeError(field);
    logEvent("success", `✅ Validation réussie pour ${fieldName}.`, { value });
    return true;
  }
}

/**
 * Valide le champ "E-mail".
 *
 * @param {HTMLElement} field - L'élément HTML du champ email.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
export function validateEmail(field) {
  const value = field.value.trim();
  let errorMessage = "";

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const FORBIDDEN_PATTERNS = [
    /javascript:/gi,
    /http:/gi,
    /https:/gi,
    /<.*?>/gi,
  ];

  if (value === "") {
    errorMessage = "⚠️ L'e-mail est requis.";
  } else if (!EMAIL_REGEX.test(value)) {
    errorMessage = "❌ Adresse e-mail invalide.";
  } else if (FORBIDDEN_PATTERNS.some((pattern) => pattern.test(value))) {
    errorMessage = "❌ Adresse e-mail suspecte détectée.";
  }

  if (errorMessage) {
    showError(errorMessage, field);
    logEvent("warn", "⚠️ Validation échouée pour l'e-mail.", {
      errorMessage,
      value,
    });
    return false;
  } else {
    removeError(field);
    logEvent("success", "✅ Validation réussie pour l'e-mail.", { value });
    return true;
  }
}

export function checkHoneypot() {
  const honeypot = document.getElementById("hidden-field").value;
  if (honeypot !== "") {
    logEvent("error", "🚨 Spam détecté via Honeypot !");
    return false;
  }
  return true;
}

/**
 * Vérifie si un message contient des scripts ou des injections malveillantes.
 *
 * @param {string} message - Le message utilisateur.
 * @returns {boolean} - Retourne `true` si le message est sécurisé, sinon `false`.
 */
export function isMessageSafe(message) {
  const sanitizedMessage = message.trim();

  // Liste des motifs interdits (XSS, SQLi, JS Injection, Fetch, DOM Manipulation)
  const forbiddenPatterns = [
    /<.*?>/gi, // Interdit toute balise HTML
    /<\/?[^>]+(>|$)/gi, // Interdit les balises non autorisées
    /on\w+=["'].*?["']/gi, // Interdit les événements JS (onerror, onclick)
    /javascript:/gi, // Interdit les URLs JS
    /eval\s*\(.*?\)/gi, // Interdit eval()
    /document\./gi, // Interdit document.*
    /window\./gi, // Interdit window.*
    /fetch\(/gi, // Interdit fetch() (attaque CSRF)
    /XMLHttpRequest/gi, // Interdit les requêtes AJAX
    /SELECT\s.*?\sFROM/gi, // Interdit les requêtes SQL
    /INSERT\s+INTO/gi, // Interdit les injections SQL
    /DROP\s+TABLE/gi, // Interdit les suppressions SQL
    /script/gi, // Interdit "script"
    /cookie/gi, // Interdit l'accès aux cookies
    /sessionStorage/gi, // Interdit l'accès au stockage session
    /localStorage/gi, // Interdit l'accès au stockage local
  ];

  // ✅ Vérification des motifs interdits
  for (let pattern of forbiddenPatterns) {
    if (pattern.test(sanitizedMessage)) {
      logEvent("error", "❌ Message contient du code suspect.", { message });
      return false;
    }
  }

  logEvent("success", "✅ Message validé et sécurisé.");
  return true;
}

/**
 * Valide et sécurise le champ "message" avant soumission.
 *
 * @param {HTMLElement} field - L'élément HTML du champ message.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
export function validateMessageField(field) {
  const value = field.value.trim();
  const MAX_LENGTH = 500;
  const MIN_LENGTH = 10;
  let errorMessage = "";

  if (!isMessageSafe(value)) {
    errorMessage = "Le message contient du code suspect.";
  } else if (value.length < MIN_LENGTH) {
    errorMessage = `Le message doit contenir au moins ${MIN_LENGTH} caractères.`;
  } else if (value.length > MAX_LENGTH) {
    errorMessage = `Le message ne doit pas dépasser ${MAX_LENGTH} caractères.`;
  }

  if (errorMessage) {
    showError(errorMessage, field);
    logEvent("warn", "Validation échouée pour le message.", {
      errorMessage,
      value,
    });
    return false;
  } else {
    removeError(field);
    logEvent("success", "Validation réussie pour le message.", { value });
    return true;
  }
}
/*===============================================================================================*/
/*                             ======= Validation Globale =======                                */
/*===============================================================================================*/

/**
 * Valide tous les champs du formulaire et retourne le résultat global.
 *
 * @returns {boolean} - Retourne `true` si tous les champs sont valides, sinon `false`.
 */
export function validateForm() {
  let isValid = true;

  // Vérification du Honeypot
  if (!checkHoneypot()) {
    logEvent("error", "Validation échouée : spam détecté via Honeypot.");
    showSpamModal(); // Affiche la modale anti-spam
    return false; // Stoppe immédiatement la validation si le honeypot est rempli
  }

  // Validation des champs obligatoires
  REQUIRED_FIELDS.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if (fieldId === "message") {
      // Validation spécifique au message
      isValid = validateMessageField(field) && isValid;
    } else if (fieldId === "email") {
      // Validation spécifique à l'e-mail
      isValid = validateEmail(field) && isValid;
    } else {
      // Validation générale pour les autres champs
      isValid = validateTextField(field, fieldId) && isValid;
    }
  });

  logEvent("info", "Résultat final de la validation du formulaire.", {
    isValid,
  });
  return isValid;
}

/*===============================================================================================*/
/*                         ======= Gestion de la Soumission =======                              */
/*===============================================================================================*/

/**
 * Fonction pour valider et gérer la soumission d'un formulaire.
 *
 * @param {Event} event - Événement de soumission déclenché par le formulaire.
 */

export function initvalidform() {
  logEvent("info", "Soumission du formulaire détectée.");

  const formValid = validateForm();

  if (formValid) {
    logEvent("success", "Formulaire valide. Affichage de la confirmation.");
    openConfirmationModal(); // Affiche une modale ou un message de confirmation
  } else {
    logEvent(
      "error",
      "Validation échouée : le formulaire contient des erreurs.",
    );
    // Si un spam est détecté, la modale anti-spam sera déjà affichée
    // par validateForm() via showSpamModal()
  }
}
