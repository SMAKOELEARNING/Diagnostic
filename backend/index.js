const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/smako_groupe', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
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

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
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

// Importation du modèle de la question
const Question = require('./models/FormQuestions'); // Assurez-vous que le chemin est correct

// Endpoint pour récupérer les questions
app.get('/amazon', (req, res) => {
    // Utilise le modèle pour trouver toutes les questions
    Question.find()
        .then(questions => {
            if (questions.length === 0) {
                return res.status(404).json({ message: "Aucune question trouvée" });
            }
            // Retourne les questions sous forme de JSON
            res.status(200).json(questions);
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des questions', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des questions', error: err });
        });
});



app.post('/smako', (req, res) => {
    // Traitement pour créer une nouvelle question
    const newQuestion = new QuestionModel({
        question: req.body.question,
        Piliers_RSE: req.body.Piliers_RSE,
        ESG: req.body.ESG,
        SP: req.body.SP,
        Sphère_ISQVT: req.body.Sphère_ISQVT,
        Categorie: req.body.Categorie,
        odd: req.body.odd
    });

    newQuestion.save()
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
