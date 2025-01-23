/**
 * Initialise le loader avec messages dynamiques et barre de progression.
 */
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

  loader.classList.add("loader-active"); // Afficher le loader

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
        hideLoader();
      }, 500); // Attente avant de masquer le loader
    }
  }, 1000); // Intervalle entre chaque étape
}

/**
 * Cache le loader après la complétion.
 */
function hideLoader() {
  const loader = document.getElementById("loader");
  loader.classList.remove("loader-active");
}
// Exemple d'appel du loader
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire pour test
  showLoader();
});
