
# 📸 Photographers Directory

"Photographers Directory a été conçu pour simplifier la recherche et le contact avec des photographes talentueux, que ce soit pour des projets professionnels ou personnels. La plateforme offre une expérience utilisateur fluide, en connectant facilement les utilisateurs aux photographes via une interface intuitive et moderne."

## **1.Description**

Photographers Directory est une application web permettant de visualiser les informations des photographes, y compris leurs profils, localisations, slogans, et tarifs journaliers. L'objectif est de fournir une plateforme moderne et dynamique pour explorer les travaux des photographes.

---

## **🛠️ 2.Fonctionnalités principales**

- 🎨 **Interface utilisateur dynamique** : Affiche les profils des photographes sous forme de cartes.
- 🔍 **Navigation fluide** : Accès à des pages individuelles pour chaque photographe.
- 📂 **Données JSON** : Les informations des photographes sont chargées dynamiquement à partir d'un fichier JSON.
- 📋 **Formulaire de contact** : Permet aux utilisateurs de contacter les photographes directement depuis la plateforme.
- ⚡ **Logs intelligents** : Suivi détaillé des étapes et gestion des erreurs avec un système de log (`logEvent`).

---

## **3.Fonctionnalités avancées**

### **🎨 Interface Utilisateur Moderne et Dynamique**

      - Design épuré et intuitif : Une mise en page simple mais élégante, facilitant la navigation et la découverte des photographes.
      - Affichage des profils sous forme de cartes : Les informations clés (nom, localisation, slogan, tarifs journaliers) sont facilement visibles et bien organisées.
      - Photos optimisées : Utilisation de techniques comme le lazy loading pour charger les images des photographes au moment opportun, garantissant des performances accrues.

### **🔍 Navigation Fluide**

      - Pages individuelles pour chaque photographe : En cliquant sur une carte, l'utilisateur accède à une page dédiée contenant des informations détaillées et un formulaire de contact.
      - Liens internes optimisés : Les interactions sont rapides et intuitives grâce à une architecture bien pensée.

### **🖊️ Formulaire de Contact Dynamique**

      - Envoi direct depuis la plateforme : Les utilisateurs peuvent contacter les photographes sans quitter l'application.
      - Validation des champs : Vérification en temps réel pour s'assurer que les informations saisies sont correctes avant l'envoi.
      - Feedback utilisateur : Messages de confirmation ou d'erreur clairs pour une expérience utilisateur sans ambiguïté.

### **📋 Logs Intelligents**

      - Suivi des événements clés : Le système logEvent consigne les actions importantes, comme le chargement des données ou l'envoi d'un formulaire.
      - Différents niveaux de log : info, warning, error permettent de comprendre facilement l'état de l'application.
      - Facilité de débogage : En cas de problème, les développeurs peuvent accéder à des logs détaillés pour diagnostiquer rapidement les erreurs. 

### **⚡ Performance et Réactivité**

      - Optimisation des temps de chargement : Les scripts JavaScript et les styles CSS sont minimisés pour améliorer les performances.
      - Responsive Design : L'application est entièrement adaptée aux écrans de toutes tailles (smartphones, tablettes, ordinateurs).
      - Préchargement des assets : Les images et les fichiers critiques sont préchargés pour une meilleure expérience utilisateur.

### **🛡️ Accessibilité et Compatibilité**

      - Navigation au clavier : Les utilisateurs peuvent naviguer dans l'application sans souris.
      - Support des lecteurs d'écran : Des balises aria sont ajoutées pour rendre l'application accessible aux personnes malvoyantes.
      - Compatibilité cross-browser : Testée sur les navigateurs populaires comme Chrome, Firefox, Edge et Safari.

## **📁 4.Structure du projet**

      ```sh
📦 Photographers Directory
├── 📁 assets                     # Contient les ressources statiques
│   ├── 📁 data                   # Fichiers JSON avec les données
│   ├── 📁 icons                  # Icônes SVG/PNG pour l'interface utilisateur
│   ├── 📁 images                 # Images générales pour le site
│   └── 📁 photographers          # Photos des photographes
│
├── 📁 css                        # Fichiers CSS compilés
│   ├── main.css                  # Styles globaux pour l'application
│   └── photographer.css          # Styles spécifiques pour la page des photographes
│
├── 📁 html                       # Pages HTML de l'application
│   └── photographer.html         # Page individuelle pour chaque photographe
│
├── 📁 js                         # Scripts JavaScript
│   ├── 📁 templates              # Modèles dynamiques (cartes, DOM)
│   │   ├── index.js              # Gestion des éléments sur la page d'accueil
│   │   └── photographer.js       # Génération des cartes des photographes
│   │
│   ├── 📁 utils                  # Fonctions utilitaires et scripts réutilisables
│   │   ├── utils.js              # Utilitaires globaux (ex : logEvent)
│   │   └── contactForm.js        # Gestion dynamique du formulaire de contact
│   └── main.js                   # Script principal pour initialiser l'application
│
├── 📁 scss                       # Fichiers SCSS pour la gestion des styles
│   ├── 📁 base                   # Styles de base (reset, variables, mixins)
│   ├── 📁 components             # Styles pour les composants UI (boutons, cartes)
│   └── 📁 layouts                # Styles pour les layouts (grilles, en-têtes, pieds de page)
│
├── 📄 index.html                 # Page principale (accueil)
├── .gitignore                    # Fichiers et dossiers à exclure du contrôle de version Git
├── package.json                  # Dépendances et scripts npm pour le projet
└── 📄 README.md                  # Documentation complète du projet

      ```

---

## **⚙️ 5. Dépendances et Technologies**

### **Frontend 🖌️**

      - HTML5 : Structure sémantique pour une meilleure accessibilité et optimisation SEO.
      - CSS3 / SCSS : Préprocesseur pour organiser les styles en utilisant des variables, mixins, et règles imbriquées.
      - JavaScript ES6+ : Gère la logique interactive et les manipulations dynamiques des données.

## **🚀 Démo en ligne**

Accédez à une démo fonctionnelle ici : [Lien vers la démo]()

---

## **🛠️ Prérequis**

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- Un serveur HTTP local (comme [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) ou [http-server](https://www.npmjs.com/package/http-server))

---

## **📦 Installation**

### **1. Clonez le dépôt :**

         git clone ()
         cd photographers-directory

### **2. Installez les dépendances :**

   Si vous utilisez Sass pour les styles, installez-le globalement :
         npm install -g sass

### **3. Compilez le fichier SCSS (si applicable) :**

   Pour compiler `styles.scss` en `styles.css` :

         npm run sass

### **4. Démarrez un serveur local :**

   Exemple avec [http-server](https://www.npmjs.com/package/http-server) :

         ```sh
   npx http-server .
         ```

### **5. Ouvrez l'application dans le navigateur :**

   Accédez à [http://localhost:8080](http://localhost:8080).

---

## **📖 Utilisation**

### **Page principale**

1. **Visualiser les photographes** :
   - Les profils des photographes sont affichés sous forme de cartes.
   - Cliquez sur une carte pour accéder à la page dédiée au photographe.

2. **Contactez un photographe** :
   - Cliquez sur le bouton "Contact" pour ouvrir le formulaire de contact.
   - Remplissez les champs et envoyez un message directement au photographe.

### **Structure JSON**

Les données des photographes se trouvent dans `assets/data/photographers.json`. Exemple de structure JSON :

```json
{
  "photographers": [
    {
      "id": 1,
      "name": "John Doe",
      "city": "Paris",
      "country": "France",
      "tagline": "La vie est belle",
      "price": 300,
      "portrait": "johndoe.jpg"
    }
  ]
}
```

---

## **🧩 Fonctionnalités techniques**

### **1. Scripts principaux :**

      - `photographer.js` : Récupère les données JSON, affiche les photographes et gère les erreurs.
      - `photographerTemplate.js` : Génère dynamiquement les cartes des photographes.

### **2. Système de log :**

   Utilisez `logEvent` pour enregistrer des messages de débogage, des erreurs ou des succès. Exemple :

      ```javascript
   logEvent('info', 'Initialisation du projet réussie');
      ```

### **3. Système SCSS :**

      - Divisez vos styles en fichiers SCSS partiels (`_variables.scss`, `_mixins.scss`) pour une meilleure organisation.
      - Compilez-les en un seul fichier CSS.

---

## **🛡️ Gestion des erreurs**

1. **Récupération JSON :**
   - Si le fichier JSON est introuvable ou corrompu, une erreur sera loguée :

         ```javascript
         [error] Erreur lors du fetch JSON
         ```

2. **Affichage des photographes :**
   - Si aucune donnée n'est disponible, un message est affiché :

         ```javascript
         [error] Aucun photographe trouvé.
         ```

3. **Logs intelligents :**
   - Exemple de log en cas de succès :

         ```javascript
         [success] Données récupérées avec succès depuis /assets/data/photographers.json
         ```

---

### **📂 Exemple d'organisation SCSS**

Voici un exemple de structure pour vos fichiers SCSS :

      ```sh
scss/
├── main.scss           # Fichier principal
├── variables.scss     # Variables globales
├── mixins.scss        # Mixins réutilisables
├── base.scss          # Styles de base (body, h1, etc.)
├── header.scss        # Styles pour l'en-tête
├── footer.scss        # Styles pour le pied de page
      ```

---

## **✅ Checklist des tests**

1. **Tests manuels :**
   - Vérifiez que les cartes des photographes s'affichent correctement.
   - Testez le formulaire de contact.

2. **Tests unitaires :**
   - Exemple avec Jest :

         ```javascript
      test('photographerTemplate génère une carte valide', () => {
         const mockData = { name: "John", id: 1, city: "Paris", price: 300, tagline: "Test", portrait: "test.jpg" };
         const result = photographerTemplate(mockData).getUserCardDOM();
         expect(result).toBeInstanceOf(HTMLElement);
      });
         ```

---

## **🔧 Développement futur**

1. **Améliorations UI :**
   - Ajouter des animations pour les interactions utilisateur.

2. **Pagination :**
   - Implémenter une pagination pour les profils des photographes.

3. **Tests automatisés :**
   - Intégrer des tests E2E avec Cypress.

---

### **📜 Licence**

Ce projet est sous licence MIT. Consultez le fichier `LICENSE` pour plus d'informations.

---
