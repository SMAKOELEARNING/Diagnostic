import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SecondQuestionnaire = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/questionnaire/${id}`)
            .then(result => {
                setData(result.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData.entries());

        // Ajouter l'ID du questionnaire récupéré depuis la première page
        formValues.questionnaireId = id;

        axios.post('http://localhost:3001/secondquestionnaire', formValues)
            .then(() => alert('Réponse soumise avec succès'))
            .catch(error => console.log(error));
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center text-center vh-100 vw-100" >
            <div className="bg-white p-3 rounded" style={{ width: '50%' }}>
                <h2 className='mb-3 ' style={{ color : '#57A6AB' , fontSize : '5vh' , marginTop : '10vh'}}>Complétez le formulaire ci dessous :</h2>

               

                <form onSubmit={handleSubmit} style={{ padding : '20px' , borderRadius : '10px' ,  backgroundColor :'#D9D9D9', marginTop : '50px' }}>
                    {/* Informations du participant */}
                     {/* Informations de l'ambassadeur */}
                <div className="text-start mb-4">
                    <p><strong>Formateur :</strong> {data.nom} &nbsp; {data.prenom}</p>
                    <p><strong>Date de la session:</strong> {new Date(data.date).toLocaleDateString()}</p>
                </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="question_1" className="form-label">
                            <strong>Question 1</strong>
                        </label>
                        <input 
                            type="text"
                            name="question_1"
                            className="form-control" 
                            id="question_1" 
                            required
                        /> 
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="question_2" className="form-label">
                            <strong>Question 2</strong>
                        </label>
                        <input 
                            type="text"
                            name="question_2"
                            className="form-control" 
                            id="question_2" 
                            required
                        /> 
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="atelier" className="form-label">
                            <strong>Sur une échelle de 1 à 10, à quel point avez-vous apprécié l’atelier ? </strong>
                        </label>
                        <input 
                            type="number" 
                            name="atelier"
                            className="form-control" 
                            id="atelier" 
                            required
                        /> 
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="formateur" className="form-label">
                            <strong>Sur une échelle de 1 à 10, à quel point avez-vous apprécié l’animation du formateur ? </strong>
                        </label>
                        <input 
                            type="number" 
                            name="formateur"
                            className="form-control" 
                            id="formateur" 
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label htmlFor="developpement" className="form-label">
                            <strong>Sur une échelle de 1 à 10, à quel point considérez-vous avoir appris sur le développement durable ?</strong>
                        </label>
                        <input 
                            type="number" 
                            name="developpement"
                            className="form-control" 
                            id="developpement" 
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{backgroundColor :'#57A6AB' , textColor : '#000' , padding :'10px 80px' , borderRadius :'20px'}}>Envoyer votre réponse</button>
                </form>
            </div>
        </div>
    );
}

export default SecondQuestionnaire;