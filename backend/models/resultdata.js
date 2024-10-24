const mongoose = require('mongoose');

const resultDataSchema = new mongoose.Schema({
    formId: String,
    questionText: String,
    categorie: String,
    specificite: String,
    score: mongoose.Schema.Types.Mixed // Peut contenir un score (Number) ou une réponse (String)
});

const ResultData = mongoose.model('ResultData', resultDataSchema);

module.exports = ResultData;
