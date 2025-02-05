const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000; // Port du serveur

// Middleware pour traiter les requêtes JSON
app.use(express.json());
app.use(cors()); // Autorise les requêtes depuis un autre domaine

// Chemin vers le fichier JSON des photographes
const DATA_FILE = path.join(__dirname, "assets/data/photographers.json");

// Route pour récupérer les médias (GET)
app.get("/api/media", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lecture du fichier JSON" });
        }
        res.json(JSON.parse(data));
    });
});

// Route pour mettre à jour les likes d’un média (POST)
app.post("/api/update-likes", (req, res) => {
    const { mediaId, likeCount } = req.body;

    if (!mediaId || typeof likeCount !== "number") {
        return res.status(400).json({ error: "Données invalides" });
    }

    // Lire le fichier JSON
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lecture du fichier JSON" });
        }

        let jsonData = JSON.parse(data);

        // Vérifie que le média existe
        const mediaIndex = jsonData.media.findIndex(media => media.id === parseInt(mediaId, 10));
        if (mediaIndex === -1) {
            return res.status(404).json({ error: "Média introuvable" });
        }

        // Met à jour les likes du média
        jsonData.media[mediaIndex].likes = likeCount;

        // Écrit les données mises à jour dans le fichier JSON
        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur écriture du fichier JSON" });
            }
            res.json({ success: true, mediaId, likeCount });
        });
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
