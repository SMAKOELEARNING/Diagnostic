import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Formulaire = () => {
  const [questions, setQuestions] = useState([]); // Stocke les questions récupérées depuis l'API
  const [currentIndex, setCurrentIndex] = useState(0); // Gère l'affichage progressif des questions
  const [responses, setResponses] = useState({}); // Stocke les réponses des utilisateurs

  // Fonction pour récupérer les questions depuis le backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Récupération des questions...'); // Ajoute un message pour savoir si cette fonction est bien appelée
        const response = await axios.get('http://localhost:3001/smako'); // Appelle l'API pour obtenir les questions
        console.log('Questions récupérées:', response.data); // Vérifie si les données sont bien récupérées
        setQuestions(response.data); // Mets à jour le state avec les questions récupérées
      } catch (error) {
        console.error('Erreur lors de la récupération des questions', error); // Affiche l'erreur dans la console
      }
    };

    fetchQuestions();
  }, []);

  // Fonction pour gérer la réponse sélectionnée
  const handleResponse = (questionIndex, value) => {
    setResponses({ ...responses, [questionIndex]: value });
    if (questionIndex < questions.length - 1) {
      setCurrentIndex(questionIndex + 1); // Passe à la question suivante
    }
  };

  console.log('Questions dans le state:', questions); // Vérifie si le state "questions" est bien mis à jour

  return (
    <div className="formulaire-container">
      <h2>Formulaire de notation</h2>

      {questions.length > 0 ? (
        <div>
          <p>{questions[currentIndex].question}</p>
          <div className="choices">
            {[1, 2, 3, 4, 5].map((number) => (
              <button
                key={number}
                onClick={() => handleResponse(currentIndex, number)}
                className="btn btn-primary m-2"
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Chargement des questions...</p>
      )}

      {currentIndex === questions.length - 1 && (
        <div className="mt-4">
          <h3>Merci d'avoir répondu au formulaire !</h3>
        </div>
      )}
    </div>
  );
};

export default Formulaire;
