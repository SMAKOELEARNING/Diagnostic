import { Link } from "react-router-dom";
import React, { useState } from "react";

const Dashboard = () => {
  const formLink = `${window.location.origin}/formulaire`; // Lien standard vers le formulaire
  const [copied, setCopied] = useState(false);

  // Fonction pour copier le lien dans le presse-papiers
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formLink);
    setCopied(true); // Changer l'état pour indiquer que le lien a été copié
    setTimeout(() => setCopied(false), 2000); // Réinitialise l'état après 2 secondes
  };

  return (
    <div className="dashboard-container">
      <h2>Bienvenue sur votre tableau de bord</h2>

      <div className="copy-link-section">
        <h3>Partager le formulaire</h3>
        <p>Utilisez le bouton ci-dessous pour copier le lien du formulaire à partager :</p>

        <div className="link-copy-wrapper">
          <input
            type="text"
            value={formLink}
            readOnly
            className="form-control"
            style={{ width: '300px', marginBottom: '10px' }}
          />
          <button onClick={copyToClipboard} className="btn btn-primary">
            {copied ? "Lien copié !" : "Copier le lien"}
          </button>
        </div>
      </div>

      <div className="other-links mt-5">
        <h3>Autres actions</h3>
        <ul>
          <li>
            <Link to="/profile">Voir votre profil</Link>
          </li>
          <li>
            <Link to="/settings">Paramètres du compte</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
