
# 📸 **Photographers Directory**

> **"Photographers Directory a été conçu pour simplifier la recherche et le contact avec des photographes talentueux, que ce soit pour des projets professionnels ou personnels. La plateforme offre une expérience utilisateur fluide, en connectant facilement les utilisateurs aux photographes via une interface intuitive et moderne."**

---

## **1. Description**

**Photographers Directory** est une application web qui permet :

- 📍 De découvrir les photographes par leur localisation, leurs slogans et leurs tarifs.
- 📋 D'accéder à leurs profils détaillés.
- 📬 De les contacter directement via un formulaire intégré.

🎯 **Objectif principal** : Offrir une plateforme moderne et intuitive qui simplifie la mise en relation entre clients et photographes.

---

## **2. Fonctionnalités principales**

- 🎨 **Interface utilisateur dynamique** : Profils affichés sous forme de cartes modernes.
- 🔍 **Navigation fluide** : Accès rapide aux pages individuelles de chaque photographe.
- 📂 **Données JSON dynamiques** : Les informations sont récupérées à partir d'un fichier JSON.
- 📋 **Formulaire de contact** : Les utilisateurs peuvent envoyer des messages directement.
- ⚡ **Logs intelligents** : Suivi des étapes clés et gestion des erreurs avec `logEvent`.

---

## **3. Fonctionnalités avancées**

### 🎨 **Interface Utilisateur Moderne**

- **Design mobile-first** : Conception pensée pour s'adapter aux smartphones, tablettes et ordinateurs.
- **Affichage des cartes** : Profils bien organisés, avec nom, localisation, slogan, prix et portrait.
- **Optimisation des images** : Lazy loading pour une navigation plus rapide.

### 🔍 **Navigation fluide**

- Pages dédiées pour chaque photographe avec détails complets.
- Architecture de navigation optimisée pour réduire les temps de chargement.

### 📋 **Formulaire de contact dynamique**

- Validation en temps réel : Empêche les erreurs de soumission.
- Feedback utilisateur clair : Confirmation de l'envoi ou affichage des erreurs.

### ⚡ **Performances optimisées**

- Scripts et styles minifiés pour des chargements rapides.
- Responsive design pour toutes les tailles d'écran.

### 🛡️ **Accessibilité**

- Prise en charge des lecteurs d'écran avec balises ARIA.
- Navigation possible au clavier.

---

## **4. Captures d’écran**

### 🌟 **Vue mobile**

![Vue mobile](assets/screenshots/mobile-view.png)

### 💻 **Vue desktop**

![Vue desktop](assets/screenshots/desktop-view.png)

### ✉️ **Formulaire de contact**

![Formulaire de contact](assets/screenshots/contact-form.png)

---

## **5. Structure du projet**

```plaintext
📦 Photographers Directory
├── 📁 assets                     # Ressources statiques
│   ├── 📁 data                   # Données JSON des photographes
│   ├── 📁 screenshots            # Captures d’écran pour la documentation
│   ├── 📁 icons                  # Icônes SVG/PNG pour l’interface
│   └── 📁 photographers          # Photos des photographes
│
├── 📁 css                        # Styles CSS compilés
├── 📁 html                       # Pages HTML (accueil, profils)
├── 📁 js                         # Scripts JS pour la logique dynamique
├── 📁 scss                       # Fichiers SCSS pour les styles modulaires
└── 📄 README.md                  # Documentation complète
```

---

## **6. Dépendances et Technologies**

### **Frontend**

- **HTML5** : Structure sémantique pour une meilleure accessibilité.
- **CSS3 / SCSS** : Styles avancés, organisés en modules SCSS.
- **JavaScript ES6+** : Manipulation du DOM et logique interactive.

### **Backend**

- Fichier JSON centralisé pour stocker les informations des photographes.

---

## **7. Installation**

### **Prérequis**

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- Un serveur HTTP local comme [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) ou [http-server](https://www.npmjs.com/package/http-server).

### **Étapes d'installation**

#### **1. Clonez le dépôt :**

```bash
   git clone https://github.com/your-repo/photographers-directory.git
   cd photographers-directory
```

#### **2. Installez les dépendances :**

```bash
   npm install
```

#### **3. Compilez les SCSS :**

```bash
   npm run sass
```

#### **4. Lancez un serveur local :**

```bash
   npx http-server .
```

#### **5. Ouvrez votre navigateur à l'adresse suivante :**

   [http://localhost:8080](http://localhost:8080).

---

## **8. Utilisation**

### **Page principale**

1. Parcourez les cartes pour visualiser les informations des photographes.
2. Cliquez sur une carte pour accéder à une page détaillée.

### **Formulaire de contact**

1. Accédez à la page d’un photographe.
2. Remplissez les champs du formulaire.
3. Soumettez le formulaire pour envoyer votre message.

---

## **9. Gestion des erreurs**

- **Erreur lors de la récupération JSON :**

```plaintext
  [error] Impossible de charger les données depuis photographers.json.
```

- **Aucun photographe trouvé :**

```plaintext
  [error] Aucun photographe n'a été trouvé dans les données.
```

- **Log de succès :**

```javascript
  logEvent('success', 'Données récupérées avec succès.');
```

---

## **10. Checklist des tests**

### **Tests manuels**

- Vérifiez que les cartes des photographes s’affichent correctement.
- Testez la validation et l’envoi du formulaire de contact.

### **Tests unitaires**

Exemple avec Jest :

```javascript
test('photographerTemplate génère une carte valide', () => {
    const mockData = { name: "John Doe", city: "Paris", price: 300 };
    const result = photographerTemplate(mockData).getUserCardDOM();
    expect(result).toBeInstanceOf(HTMLElement);
});
```

---

## **11. Développement futur**

1. **Pagination dynamique** : Ajout d’un système de pages pour les profils.
2. **Recherche avancée** : Filtrer les photographes par localisation ou spécialité.
3. **Galerie interactive** : Permettre aux photographes de présenter leurs travaux.

---

## **12. Licence**

Ce projet est sous licence **MIT**. Consultez le fichier `LICENSE` pour plus d'informations.

---
