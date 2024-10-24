const mongoose = require('mongoose');

const kpiDataSchema = new mongoose.Schema({
    formId: String,
    questionText: String,
    categorie: String,
    specificite: String,
    score: Number,
    detail: String
});

// Utilisez mongoose.models pour éviter de redéfinir le modèle si déjà existant
module.exports = mongoose.models.KPIData || mongoose.model('KPIData', kpiDataSchema);
