
# 📸 Photographers Directory

### **Description**

Photographers Directory est une application web permettant de visualiser les informations des photographes, y compris leurs profils, localisations, slogans, et tarifs journaliers. L'objectif est de fournir une plateforme moderne et dynamique pour explorer les travaux des photographes.

---

### **🛠️ Fonctionnalités principales**

- 🎨 **Interface utilisateur dynamique** : Affiche les profils des photographes sous forme de cartes.
- 🔍 **Navigation fluide** : Accès à des pages individuelles pour chaque photographe.
- 📂 **Données JSON** : Les informations des photographes sont chargées dynamiquement à partir d'un fichier JSON.
- 📋 **Formulaire de contact** : Permet aux utilisateurs de contacter les photographes directement depuis la plateforme.
- ⚡ **Logs intelligents** : Suivi détaillé des étapes et gestion des erreurs avec un système de log (`logEvent`).

---

### **📁 Structure du projet**

```
📦 Photographers Directory
├── 📁 assets
│   ├── 📁 data
│   │   └── photographers.json  # Données des photographes
│   └── 📁 images
│       └── photographers        # Images des photographes
├── 📁 css
│   └── styles.css               # Styles principaux
├── 📁 js
│   ├── 📁 templates
│   │   └── photographer.js      # Modèle pour les cartes des photographes
│   ├── 📁 utils
│   │   └── utils.js             # Fonctions utilitaires (ex : logEvent)
│   └── photographer.js          # Script principal
├── 📁 scss
│   └── styles.scss              # Fichier SCSS source
├── 📄 index.html                # Page principale
└── 📄 README.md                 # Documentation du projet
```

---

### **🚀 Démo en ligne**

Accédez à une démo fonctionnelle ici : [Lien vers la démo](https://trackozor-photographers-directory.com)

---

### **🛠️ Prérequis**

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- Un serveur HTTP local (comme [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) ou [http-server](https://www.npmjs.com/package/http-server))

---

### **📦 Installation**

1. **Clonez le dépôt :**

   ```bash
   git clone https://github.com/trackozor/photographers-directory.git
   cd photographers-directory
   ```

2. **Installez les dépendances :**
   Si vous utilisez Sass pour les styles, installez-le globalement :

   ```bash
   npm install -g sass
   ```

3. **Compilez le fichier SCSS (si applicable) :**
   Pour compiler `styles.scss` en `styles.css` :

   ```bash
   npm run sass
   ```

4. **Démarrez un serveur local :**
   Exemple avec [http-server](https://www.npmjs.com/package/http-server) :

   ```bash
   npx http-server .
   ```

5. **Ouvrez l'application dans le navigateur :**
   Accédez à [http://localhost:8080](http://localhost:8080).

---

### **📖 Utilisation**

#### **Page principale**

1. **Visualiser les photographes** :
   - Les profils des photographes sont affichés sous forme de cartes.
   - Cliquez sur une carte pour accéder à la page dédiée au photographe.

2. **Contactez un photographe** :
   - Cliquez sur le bouton "Contact" pour ouvrir le formulaire de contact.
   - Remplissez les champs et envoyez un message directement au photographe.

#### **Structure JSON**

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

### **🧩 Fonctionnalités techniques**

1. **Scripts principaux :**
   - `photographer.js` : Récupère les données JSON, affiche les photographes et gère les erreurs.
   - `photographerTemplate.js` : Génère dynamiquement les cartes des photographes.

2. **Système de log :**
   Utilisez `logEvent` pour enregistrer des messages de débogage, des erreurs ou des succès. Exemple :

   ```javascript
   logEvent('info', 'Initialisation du projet réussie');
   ```

3. **Système SCSS :**
   - Divisez vos styles en fichiers SCSS partiels (`_variables.scss`, `_mixins.scss`) pour une meilleure organisation.
   - Compilez-les en un seul fichier CSS.

---

### **🛡️ Gestion des erreurs**

1. **Récupération JSON :**
   - Si le fichier JSON est introuvable ou corrompu, une erreur sera loguée :

     ```bash
     [error] Erreur lors du fetch JSON
     ```

2. **Affichage des photographes :**
   - Si aucune donnée n'est disponible, un message est affiché :

     ```
     Aucun photographe trouvé.
     ```

3. **Logs intelligents :**
   - Exemple de log en cas de succès :

     ```
     [success] Données récupérées avec succès depuis /assets/data/photographers.json
     ```

---

### **📂 Exemple d'organisation SCSS**

Voici un exemple de structure pour vos fichiers SCSS :

```
scss/
├── main.scss           # Fichier principal
├── _variables.scss     # Variables globales
├── _mixins.scss        # Mixins réutilisables
├── _base.scss          # Styles de base (body, h1, etc.)
├── _header.scss        # Styles pour l'en-tête
├── _footer.scss        # Styles pour le pied de page
```

---

### **✅ Checklist des tests**

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

### **🔧 Développement futur**

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
