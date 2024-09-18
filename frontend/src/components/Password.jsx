import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import emailjs from 'emailjs-com';

export default function Password() {
  const [email, setEmail] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      user_email: email,
      to_email: 'smakodev@gmail.com',  // Adresse e-mail du destinataire
    };

    emailjs.send('service_ms9hmda', 'template_t591s2i', templateParams, 'N7avS5zpxvc1umHD5')
      .then((result) => {
        alert('Email envoyé avec succès à smakodev@gmail.com !');
      }, (error) => {
        alert('Une erreur s\'est produite, veuillez réessayer.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center text-center" style={{ width: '100vw', height: '100vh' , backgroundColor:'#edeef0',display: 'flex', justifyContent:'space-between' }}>
      <div className="premiere_div" style={{ display: 'flex', flexDirection:'column', width: '30vw', height: '95vh' , backgroundColor:'#4053a1', padding:'20px' ,borderRadius:'5%' }}>
        <img src="../logo_smako.png" alt="" className='images_logo' style={{ width: '150%', height: '150%' , marginRight:'100%' }} />
        <div className="account_login" style={{display : 'flex' , justifyContent:"space-between" , color:'#fff'}}>
            <h6>⬅ Retour</h6>
            <h6>Mot de passe oublié</h6>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center text-center " style={{width: '40vw', height: '95vh'}} >
        <div className=" p-3 rounded" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , backgroundColor:'#edeef0' }}>
          <img src="../SMAKOLogo_transparency-02.png" alt="" className='images_logo' style={{ width: '10vw', height: '15vh' }} />
          <h2 className='mb-3 '>Mot de passe oublié</h2>
          <p>Si vous rencontrez des difficultés pour accéder à votre compte ou pour réinitialiser <br /> votre mot de passe, veuillez entrer votre e-mail ci-dessous. Nous vous enverrons un message rapidement.</p>
          
          <form onSubmit={sendEmail}>
            <div className="form-group">
              <label htmlFor="email">Votre adresse e-mail :</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
