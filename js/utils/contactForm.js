import { logEvent, showError, removeError } from "./utils";
/*===============================================================================================*/
/*                                 ======= Validation des champs =======                         */
/*===============================================================================================*/

/**
 * Valide un champ texte (prénom ou nom).
 *
 * Critères de validation :
 * - Non vide.
 * - Longueur minimale de 2 caractères.
 * - Ne contient que des lettres, des accents, des espaces, des apostrophes ou des tirets.
 *
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @param {string} fieldName - Nom du champ (exemple : "prénom" ou "nom").
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
export function validateTextField(event, fieldName) {
  const field = event.target; // Champ cible
  const value = field.value.trim(); // Supprime les espaces inutiles
  let errorMessage = "";

  // === Validation des critères ===
  if (value === "") {
    errorMessage = `Le ${fieldName} est requis.`;
  } else if (value.length < 2) {
    errorMessage = `Le ${fieldName} doit contenir au moins 2 caractères.`;
  } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
    errorMessage = `Le ${fieldName} contient des caractères invalides.`;
  }

  // === Gestion des erreurs ===
  if (errorMessage) {
    showError(errorMessage, field); // Affiche un message d'erreur
    logEvent("warn", `Validation échouée pour le ${fieldName}.`, {
      errorMessage,
      value,
    });
    return false; // Indique une validation échouée
  } else {
    removeError(field); // Supprime tout message d'erreur existant
    logEvent("success", `Validation réussie pour le ${fieldName}.`, { value });
    return true; // Indique une validation réussie
  }
}

/* ============ Fonction de validation du champ email ===================*/
/**
 * Valide le champ "E-mail".
 *
 * Critères de validation :
 * - Non vide.
 * - Respecte un format d'adresse e-mail valide.
 *
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
export function validateEmail(event) {
  const field = event.target;
  const value = field.value.trim();
  let errorMessage = "";

  // === Validation des critères ===
  if (value === "") {
    errorMessage = "L'e-mail est requis.";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    errorMessage = "Veuillez entrer une adresse e-mail valide.";
  }

  // === Gestion des erreurs ===
  if (errorMessage) {
    showError(errorMessage, field); // Affiche un message d'erreur
    logEvent("warn", "Validation échouée pour l'e-mail.", {
      errorMessage,
      value,
    });
    return false; // Indique une validation échouée
  } else {
    removeError(field); // Supprime tout message d'erreur existant
    logEvent("success", "Validation réussie pour l'e-mail.", { value });
    return true; // Indique une validation réussie
  }
}

/* ============ Gestion de la Soumission du Formulaire ============ */
/**
 * Valide le formulaire et ouvre la modale de confirmation si valide.
 *
 * Étapes principales :
 * 1. Empêche le rechargement de la page à la soumission.
 * 2. Valide les champs du formulaire.
 * 3. Si valide, ouvre la modale de confirmation.
 * 4. Si invalide, affiche les erreurs.
 *
 * @param {Event} event - Événement de soumission du formulaire.
 * @returns {void}
 */

export function handleFormSubmit(event) {
  event.preventDefault();
  logEvent("info", "Soumission du formulaire détectée.");

  let hasEmptyFields = false;

  // Vérification des champs obligatoires
  const requiredFields = ["first", "last", "email", "birthdate", "quantity"];
  requiredFields.forEach((fieldId) => {
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement && fieldElement.value.trim() === "") {
      // Affiche une erreur pour les champs vides
      showError("Ce champ est requis.", fieldElement);
      logEvent("warn", `Champ "${fieldId}" vide lors de la soumission.`, {
        fieldId,
      });
      hasEmptyFields = true;
    }
  });

  // Si des champs sont vides, ne pas valider le formulaire
  if (hasEmptyFields) {
    logEvent("error", "Validation interrompue : champs vides détectés.");
    return; // Empêche la soumission
  }

  // Si tous les champs sont remplis, passe à la validation globale
  const formValid = validateForm();

  if (formValid) {
    logEvent("info", "Formulaire valide.");
    openConfirmationModal();
  } else {
    logEvent("error", "Échec de la validation du formulaire.");
  }
}
/* ============ Validation Globale du Formulaire ============ */
/**
 * Valide tous les champs du formulaire et retourne le résultat global.
 *
 * Étapes principales :
 * 1. Parcourt tous les champs à valider.
 * 2. Déclenche un événement de validation pour chaque champ.
 * 4. Retourne `true` si tous les champs sont valides, sinon `false`.
 *
 * @returns {boolean} - Résultat de la validation globale.
 */
export function validateForm() {
  let isValid = true;

  // === Étape 1 : Validation des champs ===
  const fields = ["first", "last", "email", "birthdate", "quantity"];
  fields.forEach((fieldId) => {
    const fieldElement = document.getElementById(fieldId);

    if (fieldElement) {
      // Déclenche l'événement de validation pour chaque champ
      const fieldIsValid = fieldElement.dispatchEvent(new Event("blur"));

      if (!fieldIsValid) {
        logEvent("warn", `Validation échouée pour le champ "${fieldId}".`, {
          fieldId,
          value: fieldElement.value,
        });
        isValid = false;
      } else {
        logEvent("success", `Validation réussie pour le champ "${fieldId}".`, {
          fieldId,
          value: fieldElement.value,
        });
      }
    } else {
      logEvent("error", `Champ "${fieldId}" introuvable dans le DOM.`);
      isValid = false;
    }
  });

  // === Étape 3 : Retourne le résultat global ===
  logEvent("info", "Résultat final de la validation du formulaire.", {
    isValid,
  });
  return isValid;
}
