import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        console.log(result);
        if (result.data === "Success") {
          console.log("Login Success");
          alert('Login successful!');
          onLogin(); // Mise à jour de l'état de connexion
          navigate('/dashboard');
        } else {
          alert('Incorrect password! Please try again.');
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="d-flex justify-content-center align-items-center text-center" style={{ width: '100vw', height: '100vh' , backgroundColor:'#edeef0',display: 'flex', justifyContent:'space-between' }}>
      <div className="premiere_div" style={{ display: 'flex', flexDirection:'column', width: '30vw', height: '95vh' , backgroundColor:'#4053a1', padding:'20px' ,borderRadius:'5%' }}>
        <img src="../logo_smako.png" alt="" className='images_logo' style={{ width: '150%', height: '150%' , marginRight:'100%' }} />
        <div className="account_login" style={{display : 'flex' , justifyContent:"space-between" , color:'#fff'}}>
            <h6>⬅ Retour</h6>
            <Link to="/Password"  style={{textDecoration :'none' ,color:'#fff'}}><h6>Mot de passe oublié</h6></Link>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center text-center " style={{width: '40vw', height: '95vh'}} >
        <div className=" p-3 rounded" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , backgroundColor:'#edeef0' }}>
          <img src="../SMAKOLogo_transparency-02.png" alt="" className='images_logo' style={{ width: '10vw', height: '15vh' }} />
          <h2 className='mb-3 '>Connectez-vous</h2>
          <p>Remplissez les champs ci-dessous pour <br></br>
          vous connecter et accéder à votre compte.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Email :</strong>
              </label>
              <input
                type="email"
                placeholder="Entrez votre adresse email"
                style={{ borderRadius: '8px', width: '25vw', boxShadow: '5px 5px 5px #767676' }}
                className="form-control"
                id="exampleInputEmail1"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start" style={{ padding: '15px 0' }} >
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Mot de passe :</strong>
              </label>
              <input
                type="password"
                placeholder="Entrez votre mot de passe "
                className="form-control"
                style={{ borderRadius: '8px', boxShadow: '5px 5px 5px #767676' }}
                id="exampleInputPassword1"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#4053a1", width: '100%', borderRadius: '50px' }}>Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
