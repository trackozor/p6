import { logEvent, showError, removeError } from "./utils.js";
import { openConfirmationModal } from "../components/modal/modalManager.js";

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
  const fieldName = FIELD_NAMES[fieldId] || "Champ"; // Récupère le nom lisible ou utilise "Champ" par défaut
  let errorMessage = "";

  // Limite de caractères (exemple : 50 caractères max)
  const MAX_LENGTH = 50;

  // === Validation des critères ===
  if (value === "") {
    errorMessage = `Le ${fieldName} est requis.`; // Champ obligatoire
  } else if (value.length < 2) {
    errorMessage = `Le ${fieldName} doit contenir au moins 2 caractères.`; // Longueur minimale
  } else if (value.length > MAX_LENGTH) {
    errorMessage = `Le ${fieldName} ne doit pas dépasser ${MAX_LENGTH} caractères.`;
  } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
    errorMessage = `Le ${fieldName} contient des caractères invalides.`; // Caractères non autorisés
  }

  // === Gestion des erreurs ===
  if (errorMessage) {
    showError(errorMessage, field); // Affiche un message d'erreur
    logEvent("warn", `Validation échouée pour le ${fieldName}.`, {
      errorMessage,
      value,
    });
    return false; // Validation échouée
  } else {
    removeError(field); // Supprime les messages d'erreur existants
    logEvent("success", `Validation réussie pour le ${fieldName}.`, { value });
    return true; // Validation réussie
  }
}

/**
 * Valide le champ "E-mail".
 *
 * @param {HTMLElement} field - L'élément HTML du champ email.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
/**
 * Valide le champ "E-mail".
 *
 * @param {HTMLElement} field - L'élément HTML du champ email.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
export function validateEmail(field) {
  const value = field.value.trim();
  const MAX_LENGTH = 254; // Longueur maximale d'un e-mail standard (RFC 5321)
  let errorMessage = "";

  // === Validation des critères ===
  if (value === "") {
    errorMessage = "L'e-mail est requis.";
  } else if (value.length > MAX_LENGTH) {
    errorMessage = `L'adresse e-mail ne doit pas dépasser ${MAX_LENGTH} caractères.`;
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    errorMessage = "Veuillez entrer une adresse e-mail valide.";
  }

  // === Gestion des erreurs ===
  if (errorMessage) {
    showError(errorMessage, field); // Affiche l'erreur sous le champ
    logEvent("warn", "Validation échouée pour l'e-mail.", {
      errorMessage,
      value,
    });
    return false; // Validation échouée
  } else {
    removeError(field); // Supprime les erreurs précédentes
    logEvent("success", "Validation réussie pour l'e-mail.", { value });
    return true; // Validation réussie
  }
}

/**
 * Valide le champ "message" dans une demande de contact.
 *
 * @param {HTMLElement} field - L'élément HTML du champ message.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
export function validateMessageField(field) {
  const value = field.value.trim(); // Supprime les espaces en début/fin
  const MAX_LENGTH = 500; // Longueur maximale pour un message de contact
  const MIN_LENGTH = 10; // Longueur minimale pour un message utile
  const fieldName = "Message";
  let errorMessage = "";

  // === Validation des critères ===
  if (value === "") {
    errorMessage = `Le ${fieldName} est requis.`;
  } else if (value.length < MIN_LENGTH) {
    errorMessage = `Le ${fieldName} doit contenir au moins ${MIN_LENGTH} caractères.`;
  } else if (value.length > MAX_LENGTH) {
    errorMessage = `Le ${fieldName} ne doit pas dépasser ${MAX_LENGTH} caractères.`;
  }

  // === Gestion des erreurs ===
  if (errorMessage) {
    showError(errorMessage, field); // Affiche l'erreur sous le champ
    logEvent("warn", `Validation échouée pour le ${fieldName}.`, {
      errorMessage,
      value,
    });
    return false; // Validation échouée
  } else {
    removeError(field); // Supprime les erreurs précédentes
    logEvent("success", `Validation réussie pour le ${fieldName}.`, { value });
    return true; // Validation réussie
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
  }
}
