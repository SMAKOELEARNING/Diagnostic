// questionsController.js
const express = require('express');
const router = express.Router();
const Question = require('./models/Question'); // Modèle Mongoose pour la collection 'questions'

// Route pour récupérer les questions
router.get('/smako', async (req, res) => {
  try {
    const questions = await Question.find({}, { _id: 0, question: 1 }); // Ne récupérer que le champ 'question'
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des questions' });
  }
});

module.exports = router;
