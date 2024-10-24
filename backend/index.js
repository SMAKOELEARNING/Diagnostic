const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const FormDataModel = require('./models/FormData');
const ResponseModel = require('./models/Response'); 
const ResponseDataNumber = require('./models/ResponseDataNumber'); 
const KPIData = require('./models/KPIData'); 
const Question = require('./models/FormQuestions'); 
const ResponseData = require('./models/ResponseData'); 
const Response = require('./models/Response');

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB avec gestion des erreurs
mongoose.connect('mongodb://127.0.0.1:27017/smako_group', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Route pour l'enregistrement
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                FormDataModel.create(req.body)
                    .then(log_reg_form => res.json(log_reg_form))
                    .catch(err => res.json(err));
            }
        });
});

// Route pour la connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No records found!");
            }
        });
});

// Endpoint pour récupérer les questions
app.get('/amazon', (req, res) => {
    Question.find()
        .then(questions => {
            if (questions.length === 0) {
                return res.status(404).json({ message: "Aucune question trouvée" });
            }
            res.status(200).json(questions);
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des questions', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des questions', error: err });
        });
});

// Route pour enregistrer une nouvelle question
app.post('/smako', (req, res) => {
    const newQuestion = new Question({
        question: req.body.question,
        Piliers_RSE: req.body.Piliers_RSE,
        ESG: req.body.ESG,
        SP: req.body.SP,
        Sphere_ISQVT: req.body.Sphere_ISQVT,
        Categorie: req.body.Categorie,
        odd: req.body.odd
    });

    newQuestion.save()
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/submit-response', async (req, res) => {
    try {
        const { formId, questionText, response } = req.body;

        // Enregistrer dans la collection "response" avec ResponseModel
        const newResponse = new ResponseModel({
            formId,
            questionText,
            response
        });
        await newResponse.save();

        // Recherche la question dans la base de données
        const questionData = await Question.findOne({ question: questionText });
        if (!questionData) {
            console.log('Question non trouvée:', questionText);
            return res.status(404).json({ message: 'Question non trouvée.' });
        }

        // Enregistre directement la réponse textuelle dans le champ `score`
        const newResponseData = new ResponseDataNumber({
            formId,
            questionText,
            response: response, // Ici, on stocke la réponse textuelle au lieu d'un score numérique
            "Piliers RSE": questionData["Piliers_RSE"],
            ESG: questionData.ESG,
            "5P": questionData["5P"],
            "Sphère ISQVT": questionData["Sphère_ISQVT"],
            Categorie: questionData.Categorie
        });
        await newResponseData.save();

        res.status(201).json({ message: 'Réponse enregistrée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du traitement de la réponse:', error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
});



// Fonction pour convertir les réponses en score
function convertResponseToScore(responseText) {
    switch (responseText) {
        case 'Pas du tout d\'accord': return 2;
        case 'Pas d\'accord': return 4;
        case 'Ni d\'accord, Ni pas d\'accord': return 6;
        case 'D\'accord': return 8;
        case 'Tout à fait d\'accord': return 10;
        default: return null;
    }
}

// Route pour générer des KPI
app.post('/generate-kpi', async (req, res) => {
    try {
        const responseDataList = await Response.find();

        const kpiPromises = responseDataList.map(async (responseData) => {
            const { formId, questionText, score } = responseData;

            const amazonQuestion = await Question.findOne({ question: questionText });
            if (!amazonQuestion) return null;

            const kpiEntries = [
                { categorie: 'Piliers RSE', specificite: amazonQuestion['Piliers RSE'] },
                { categorie: 'ESG', specificite: amazonQuestion['ESG'] },
                { categorie: '5P', specificite: amazonQuestion['5P'] },
                { categorie: 'Sphère ISQVT', specificite: amazonQuestion['Sphère ISQVT'] },
                { categorie: 'Categorie', specificite: amazonQuestion['Categorie'] }
            ].filter(entry => entry.specificite);

            const savePromises = kpiEntries.map(entry => {
                const newKPIData = new KPIData({
                    formId,
                    questionText,
                    categorie: entry.categorie,
                    specificite: entry.specificite,
                    score
                });
                return newKPIData.save();
            });

            return Promise.all(savePromises);
        });

        await Promise.all(kpiPromises);
        res.status(201).json({ message: 'Les données KPI ont été générées et sauvegardées avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la génération des KPI:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route pour récupérer les données KPI
app.get('/kpi-data', async (req, res) => {
    try {
        const kpiData = await KPIData.find();
        res.status(200).json(kpiData);
    } catch (error) {
        console.error('Erreur lors de la récupération des KPI:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des KPI.', error: error.message });
    }
});

// Route pour récupérer toutes les données de KPIData
app.get('/api/kpiData', async (req, res) => {
    try {
        const data = await KPIData.find(); // Récupère tous les documents
        res.status(200).json(data); // Envoie les données en réponse
    } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
});



// Lancer le serveur
app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
