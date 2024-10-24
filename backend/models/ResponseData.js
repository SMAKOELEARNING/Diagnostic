const mongoose = require('mongoose');

const responseDataSchema = new mongoose.Schema({
    formId: String,
    questionText: String,
    categorie: String,
    specificite: String,
    score: Number,
    detail: String
});

// Vérifiez si le modèle existe déjà avant de le créer
const ResponseData = mongoose.models.ResponseData || mongoose.model('ResponseData', responseDataSchema);

module.exports = ResponseData;
