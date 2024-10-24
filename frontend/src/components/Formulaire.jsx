
import '../css/Formulaire.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Fonction pour calculer la similarité entre deux chaînes
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

// Fonction pour calculer la distance d'édition entre deux chaînes
function editDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

const Formulaire = () => {
  const [questions, setQuestions] = useState([]); // Stocker les questions récupérées
  const [currentIndex, setCurrentIndex] = useState(0); // Gérer la progression des questions
  const [responses, setResponses] = useState([]); // Stocker les réponses de l'utilisateur
  const [loading, setLoading] = useState(true); // Gérer l'état de chargement
  const [error, setError] = useState(null); // Gérer les erreurs éventuelles
  const [formId, setFormId] = useState(''); // Identifiant unique pour chaque formulaire soumis
  const [currentValue, setCurrentValue] = useState(''); // Gérer la valeur actuelle des questions

  // Fonction pour récupérer les questions depuis le back-end
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Tentative de récupération des questions...');
        const response = await axios.get('http://localhost:3001/amazon'); // Endpoint du back-end
        console.log('Réponse de l\'API:', response.data);
        
        // Ajouter la première question "Quel est votre nom et prénom ?" et la dernière question
        const questionsWithIntroAndEnd = [
          { question: 'Quel est votre nom et prénom ?' },
          ...response.data,
          { question: 'Souhaitez-vous être un ambassadeur de la RSE dans votre entreprise ?' }  // Correction de l'orthographe ici
        ];

        setQuestions(questionsWithIntroAndEnd); // Mettre à jour les questions
        setFormId(Date.now().toString()); // Générer un identifiant unique pour ce formulaire
        setLoading(false); // Arrêter le chargement
      } catch (err) {
        console.error('Erreur lors de la récupération des questions:', err);
        setError('Erreur lors de la récupération des questions.');
        setLoading(false);
      }
    };

    fetchQuestions(); // Appeler la fonction pour récupérer les questions une seule fois, à la première exécution
  }, []);  // Note que le tableau de dépendances est vide ici, donc ce useEffect sera exécuté une seule fois.

  // Fonction pour gérer la réponse sélectionnée et l'envoyer au back-end
  const handleResponse = async (value) => {
    const currentQuestion = questions[currentIndex];
    setResponses([...responses, { questionText: currentQuestion.question, response: value }]);

    // Envoyer la réponse au back-end avec le texte de la question
    try {
      await axios.post('http://localhost:3001/submit-response', {
        formId, // Identifiant unique du formulaire
        questionText: currentQuestion.question, // Texte de la question
        response: value, // Réponse de l'utilisateur
      });
      console.log('Réponse envoyée:', currentQuestion.question, value);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse', error);
    }

    // Réinitialiser la valeur actuelle et passer à la question suivante
    setCurrentValue('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1); // Passer à la question suivante
    } else {
      console.log('Formulaire complété:', responses); // Afficher toutes les réponses
    }
  };

  const handleSubmitResponse = () => {
    if (currentValue) {
      handleResponse(currentValue);
    }
  };

  // Fonction pour afficher les types d'input différents en fonction de la question
  const renderInputForQuestion = (question) => {
    const similarityThreshold = 0.9; // 90% de similarité requise

    // Vérifier si la question est similaire à celles attendues
    const isSimilarTo = (str) => calculateSimilarity(question, str) >= similarityThreshold;

    if (isSimilarTo('Quel est votre nom et prénom ?')) {
      return (
        <div>
          <input
            type="text"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleSubmitResponse}>Valider</button>
        </div>
      );
    }

    if (isSimilarTo('Souhaitez-vous être un ambassadeur de la RSE dans votre entreprise ?')) {
      return (
        <div>
          <button onClick={() => handleResponse('Oui')} className="btn btn-primary m-2">Oui</button>
          <button onClick={() => handleResponse('Non')} className="btn btn-primary m-2">Non</button>
        </div>
      );
    }

    // Vérification des questions spécifiques pour l'âge ou l'ancienneté
    if (isSimilarTo('Quel âge avez-vous?') || isSimilarTo('Ancienneté dans votre entreprise')) {
      return (
        <div>
          <input
            type="number"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleSubmitResponse}>Valider</button>
        </div>
      );
    }

    // Vérification des questions où la réponse doit être du texte
    if (isSimilarTo('Que signifie pour vous la Responsabilité Sociétale des Entreprises (RSE)') ||
        isSimilarTo('Que savez-vous sur les Objectifs du Développement Durable (ODD)')) {
      return (
        <div>
          <textarea
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleSubmitResponse}>Valider</button>
        </div>
      );
    }

    if (isSimilarTo('Vous êtes')) {
      return (
        <div>
          <button onClick={() => handleResponse('Homme')} className="btn btn-primary m-2">Homme</button>
          <button onClick={() => handleResponse('Femme')} className="btn btn-primary m-2">Femme</button>
          <button onClick={() => handleResponse('Autre')} className="btn btn-primary m-2">Autre</button>
        </div>
      );
    }

    if (isSimilarTo('Dans quelle ville se situe votre entreprise ?')) {
      return (
        <div>
          <input
            type="text"
            className="form-control"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={handleSubmitResponse}>Valider</button>
        </div>
      );
    }

    if (isSimilarTo('Quelle position occupez-vous au sein de votre entreprise ?')) {
      return (
        <div>
          <select className="form-control" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)}>
            <option value="">Sélectionner</option>
            <option>Directeur</option>
            <option>Responsable de département</option>
            <option>Manager</option>
            <option>Non manager</option>
            <option>Assistant</option>
            <option>Technicien</option>
            <option>Opérateur</option>
            <option>Étudiant</option>
            <option>Autre</option>
          </select>
          <button className="btn btn-success mt-2" onClick={handleSubmitResponse}>Valider</button>
        </div>
      );
    }
    

    return (
      <div>
        {['Pas du tout d\'accord', 'Pas d\'accord', 'Ni d\'accord, ni pas d\'accord', 'D\'accord', 'Tout à fait d\'accord'].map((choice) => (
          <button
            key={choice}
            onClick={() => handleResponse(choice)}
            className="btn btn-primary m-2"
          >
            {choice}
          </button>
        ))}
      </div>
    );
  };

  // Gérer l'état de chargement et les erreurs
  if (loading) {
    return <p>Chargement des questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="formulaire-container">
      <h2>Formulaire de notation</h2>

      {questions.length > 0 ? (
        <div>
          <p>{questions[currentIndex].question}</p>
          {renderInputForQuestion(questions[currentIndex].question)}
        </div>
      ) : (
        <p>Aucune question trouvée.</p>
      )}

      {currentIndex === questions.length - 1 && (
        <div className="mt-4">
          <h3>Merci d'avoir complété le formulaire !</h3>
        </div>
      )}
    </div>
  );
};

export default Formulaire;
