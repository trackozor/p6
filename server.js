const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000; // Assurez-vous que votre frontend envoie bien les requêtes sur ce port

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Configuration de CORS
app.use(cors({
    origin: "http://localhost:5501", // Autorise uniquement le frontend en local
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Chemin vers le fichier JSON des photographes
const DATA_FILE = path.join(__dirname, "assets/data/photographers.json");

/**
 * 🔄 Fonction pour lire le fichier JSON
 * @returns {Promise<Object>} Données du fichier JSON
 */
async function readJsonFile() {
    try {
        const data = await fs.promises.readFile(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("❌ Erreur lors de la lecture du fichier JSON:", error);
        throw new Error("Impossible de lire les données.");
    }
}

/**
 * 💾 Fonction pour écrire dans le fichier JSON
 * @param {Object} jsonData - Données mises à jour
 */
async function writeJsonFile(jsonData) {
    try {
        await fs.promises.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), "utf8");
    } catch (error) {
        console.error("❌ Erreur lors de l'écriture du fichier JSON:", error);
        throw new Error("Impossible d'écrire les nouvelles données.");
    }
}

/**
 * 📢 Route pour récupérer tous les médias (GET)
 */
app.get("/api/media", async (req, res) => {
    try {
        const jsonData = await readJsonFile();
        res.json(jsonData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * ❤️ Route pour mettre à jour les likes d’un média (POST)
 */
app.post("/api/update-likes", async (req, res) => {
    try {
        console.log("🔍 Données reçues:", req.body); // Debug

        let { mediaId, likeCount } = req.body;

        // ✅ Convertir les valeurs pour éviter les erreurs
        mediaId = parseInt(mediaId, 10);
        likeCount = Number(likeCount);

        // 🔴 Vérifications des entrées utilisateur
        if (isNaN(mediaId) || isNaN(likeCount) || likeCount < 0) {
            return res.status(400).json({ error: "Données invalides : mediaId et likeCount doivent être corrects." });
        }

        // 📖 Lire le fichier JSON
        let jsonData = await readJsonFile();

        // 🔍 Vérifie que le média existe bien dans les données
        const mediaIndex = jsonData.media.findIndex(media => media.id === mediaId);
        if (mediaIndex === -1) {
            return res.status(404).json({ error: "Média introuvable" });
        }

        // ✅ Met à jour le nombre de likes du média
        jsonData.media[mediaIndex].likes = likeCount;

        // 💾 Écrit les modifications dans le fichier JSON
        await writeJsonFile(jsonData);

        console.log(`✅ Likes mis à jour pour média ID ${mediaId}: ${likeCount}`);
        res.json({ success: true, mediaId, likeCount });

    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour des likes:", error);
        res.status(500).json({ error: "Échec de la mise à jour des likes." });
    }
});

// 🚀 Lancer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
