import { Link, useNavigate } from "react-router-dom";
import '../css/Styles.css';


const Choix = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Appel de la fonction de déconnexion fournie
    onLogout();
    // Redirection vers la page de connexion
    navigate('/login');
  };

  return (
    <div style= {{  width : '15vw' , height : '100vh' , display : 'flex' , flexDirection :'column' , backgroundColor :'black' , color :"#fff" , justifyContent :"space-between" }} className="choix">
      <img src="./TERRATWIST.png" alt="" />
      
      <div className="div_choix" style={{height : '10vh' , width :'100%'  , display :'flex ' }}><Link to="/dashboard" style={{color: '#fff', textDecoration: 'none' , padding :'0 15px'}}><h2 >Dashboard</h2></Link></div>
      <div className="div_choix" style={{height : '10vh' , width :'100%'  , display :'flex ' }}><Link to="/questionnaire" style={{color: '#fff', textDecoration: 'none' , padding :'0 15px'}}><h2>Ajouter une session</h2></Link></div>
      <div className="div_choix" style={{height : '10vh' , width :'100%' , display :'flex '}}><Link to="/regles" style={{color: '#fff', textDecoration: 'none' , padding :'0 15px'}}><h2>Régle du jeu</h2></Link></div>
      <div className="div_choix" style={{height : '10vh' , width :'100%' , display :'flex ' }}><h5 style={{cursor: 'pointer' , padding :'0 15px'}} onClick={handleLogout}>Déconnexion</h5></div>
    </div>
  )
}

export default Choix;
