const mongoose = require('mongoose');

// Schéma pour stocker les réponses des utilisateurs
const resultSchema = new mongoose.Schema({
  question: { type: String, required: true },
  response: { type: Number, required: true }, // ou String si c'est du texte
  date: { type: Date, default: Date.now } // Pour enregistrer la date de soumission
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;