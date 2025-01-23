export function showLoader() {
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");

  // Messages dynamiques
  const messages = [
    "Nous commençons la vérification...",
    "Contrôle du prénom...",
    "Contrôle du nom...",
    "Vérification de l'email...",
    "Analyse du message...",
    "Envoi en cours...",
  ];

  let progress = 0; // Initial progress value
  let messageIndex = 0;

  // Afficher le loader
  loader.classList.add("loader-active");

  const interval = setInterval(() => {
    // Mise à jour des messages
    if (messageIndex < messages.length) {
      loaderText.textContent = messages[messageIndex];
      messageIndex++;
    }

    // Mise à jour de la barre de progression
    progress += 100 / messages.length;
    progressBar.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;

    // Fin du loader
    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        hideLoader(); // Masquer le loader
        resetLoader(); // Réinitialiser son état
      }, 500); // Attente avant de masquer le loader
    }
  }, 1000); // Intervalle entre chaque étape
}

/**
 * Cache le loader.
 */
export function hideLoader() {
  const loader = document.getElementById("loader");
  loader.classList.remove("loader-active");
}

/**
 * Réinitialise le loader pour être prêt pour la prochaine utilisation.
 */
export function resetLoader() {
  const loaderText = document.getElementById("loader-text");
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");

  // Réinitialisation des valeurs par défaut
  loaderText.textContent = "Nous commençons la vérification...";
  progressBar.style.width = "0%";
  progressPercentage.textContent = "0%";
}
