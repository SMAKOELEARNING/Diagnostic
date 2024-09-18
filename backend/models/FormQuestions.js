const mongoose = require('mongoose');

// Schéma pour les questions, avec la collection spécifiée
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }
    // Ajoute d'autres champs si nécessaire
}, { collection: 'Amazon' }); // Spécifie ici la collection existante 'amazons'

// Crée le modèle en utilisant le schéma
const Question = mongoose.model('Amazon', questionSchema);

// Exporte le modèle pour l'utiliser ailleurs dans ton code
module.exports = Question;
