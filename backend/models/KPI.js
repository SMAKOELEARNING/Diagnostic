const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
    question: String,
    categorie: String,
    specificite: String,
    score: Number,
    detail: String // Utilisé pour stocker les réponses textuelles non-convertibles en score
});

// Vérifiez si le modèle existe déjà avant de le créer
const KPI = mongoose.models.KPI || mongoose.model('KPI', kpiSchema);

module.exports = KPI;
