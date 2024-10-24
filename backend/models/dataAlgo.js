const mongoose = require('mongoose');

// Définir le schéma pour la collection 'responses'
const responseSchema = new mongoose.Schema({
    formId: String,            // Identifiant du formulaire
    questionText: String,      // Texte de la question
    response: String,          // Réponse de l'utilisateur
    processed: {               // Champ pour indiquer si la réponse a été traitée
        type: Boolean,
        default: false
    }
});

// Vérifiez si le modèle existe déjà avant de le créer
const Response = mongoose.models.Response || mongoose.model('Response', responseSchema);

module.exports = Response;
