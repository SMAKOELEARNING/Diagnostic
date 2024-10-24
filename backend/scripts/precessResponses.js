const cron = require('node-cron');
const mongoose = require('mongoose');
const Response = require('../models/ResponseDataNumber');
const KPIData = require('../models/KPIData');
const Amazon = require('../models/amazon'); // Importez la collection Amazon

// Fonction pour convertir les réponses en score, si possible
const convertResponseToScore = (responseText) => {
    const responsesMap = {
        'pas du tout d\'accord': 2,
        'pas d\'accord': 4,
        'ni d\'accord, ni pas d\'accord': 6,
        'd\'accord': 8,
        'tout à fait d\'accord': 10,
    };
    return responsesMap[responseText.toLowerCase().trim()] || null;
};

const processResponse = async (response) => {
    const { formId, questionText, response: userResponse } = response;

    try {
        const questionData = await Amazon.findOne({ question: { $regex: new RegExp(questionText, 'i') } });
        if (!questionData) {
            console.log('Aucune correspondance trouvée pour la question:', questionText);
            return;
        }

        const specificites = [
            { categorie: 'Piliers RSE', specificite: questionData['Piliers RSE'] },
            { categorie: 'ESG', specificite: questionData['ESG'] },
            { categorie: '5P', specificite: questionData['5P'] },
            { categorie: 'Sphère ISQVT', specificite: questionData['Sphère ISQVT'] },
            { categorie: 'Categorie', specificite: questionData['Categorie'] },
            { categorie: 'odd', specificite: questionData['odd'] },
        ].filter(entry => entry.specificite);

        const score = convertResponseToScore(userResponse);

        await Promise.all(specificites.map(async ({ categorie, specificite }) => {
            // Vérifier si un enregistrement identique existe déjà
            const existingData = await KPIData.findOne({ formId, questionText, categorie, specificite });
            if (existingData) {
                // Supprimer l'enregistrement existant en cas de doublon
                await KPIData.deleteOne({ _id: existingData._id });
                console.log('Doublon trouvé et supprimé pour:', { formId, questionText, categorie, specificite });
            }

            const kpiData = {
                formId,
                questionText,
                categorie,
                specificite,
                score: typeof score === 'number' ? score : null, // Utilisez null si score n'est pas un nombre
                detail: typeof score !== 'number' ? userResponse : undefined, // Enregistrez la réponse textuelle si ce n'est pas un score
            };
            
            // Créer le nouvel enregistrement
            await KPIData.create(kpiData);
            console.log('Données sauvegardées dans KPIData:', kpiData);
        }));

    } catch (err) {
        console.error('Erreur lors du traitement de la réponse:', err);
    }
};



// Fonction pour vérifier périodiquement les nouvelles réponses
const checkNewResponses = async () => {
    try {
        const responses = await Response.find({ processed: { $ne: true } });
        await Promise.all(responses.map(async (response) => {
            await processResponse(response);
            response.processed = true;
            await response.save();
        }));
    } catch (err) {
        console.error('Erreur lors de la vérification des nouvelles réponses:', err);
    }
};

// Planifier une tâche toutes les minutes
cron.schedule('* * * * *', () => {
    console.log('Vérification des nouvelles réponses...');
    checkNewResponses();
});

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/smako_group', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur lors de la connexion à MongoDB:', err));
