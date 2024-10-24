import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Slidebar.css';

const Sidebar = () => {
  const handleCopyLink = () => {
    const formLink = `${window.location.origin}/formulaire`;
    navigator.clipboard.writeText(formLink);
    alert("Lien du formulaire copié !");
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="SMAKOLogo_transparency-01.png" alt="Logo" />
      </div>
      <ul>
        <li>
          <Link to="/dashboard/graph1">Aperçu global</Link>
        </li>
        <li>
          <Link to="/dashboard/graph2">Perception développement durable</Link>
        </li>
        <li>
          <Link to="/dashboard/graph3">Perception QVCT</Link>
        </li>
      </ul>
      <div className="form-link">
        <button onClick={handleCopyLink}>Récupérer le lien du formulaire</button>
      </div>
      <div className="logout">
        <button>Déconnexion</button>
      </div>
    </div>
  );
};

export default Sidebar;
