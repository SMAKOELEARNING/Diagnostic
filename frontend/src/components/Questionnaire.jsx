import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';

const Questionnaire = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [date, setDate] = useState('');
    const [ville, setVille] = useState('');
    const [participant, setParticipant] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:3001/questionnaire', { nom, prenom, date, ville, participant })
            .then(result => {
                if (result.data.message === "Success") {
                    setUrl(result.data.url);
                    alert(`Le lien a été généré : ${result.data.url}`);
                } else {
                    console.log(result.data);
                    alert("Erreur lors de la soumission");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" >
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2 className='mb-3 ' style={{ color : '#57A6AB' , fontSize : '5vh'}}>Génération du questionnaire :</h2>
                    <form onSubmit={handleSubmit} style={{ padding : '20px' , borderRadius : '10px' ,  backgroundColor :'#D9D9D9', marginTop : '50px' }}> 
                        <div className="mb-3 text-start">
                            <label htmlFor="nom" className="form-label">
                                <strong>Nom</strong>
                            </label>
                            <input 
                                type="text"
                                placeholder="Entrez votre Nom"
                                className="form-control" 
                                id="nom" 
                                onChange={(event) => setNom(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="prenom" className="form-label">
                                <strong>Prenom</strong>
                            </label>
                            <input 
                                type="text"
                                placeholder="Entrez votre Prenom"
                                className="form-control" 
                                id="prenom" 
                                onChange={(event) => setPrenom(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="date" className="form-label">
                                <strong>Veuillez indiquer la date de la session :</strong>
                            </label>
                            <input 
                                type="date" 
                                placeholder="Entrez la date"
                                className="form-control" 
                                id="date" 
                                onChange={(event) => setDate(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="ville" className="form-label">
                                <strong>Dans quelle ville s'est déroulée la session ?</strong>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Entrez votre Ville"
                                className="form-control" 
                                id="ville" 
                                onChange={(event) => setVille(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="participant" className="form-label">
                                <strong>Combien de participants ont participé à la session ?</strong>
                            </label>
                            <input 
                                type="number" 
                                placeholder="Entrez le nombre Participant"
                                className="form-control" 
                                id="participant" 
                                onChange={(event) => setParticipant(event.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{backgroundColor :'#57A6AB' , textColor : '#000' , padding :'10px 80px' , borderRadius :'20px'}}>Générer le lien</button>
                    </form>
                    {url && <div className="mt-3">
                        <p>Lien généré : <a href={url}>{url}</a></p>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default Questionnaire;
