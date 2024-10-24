import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Assurez-vous d'avoir un composant Sidebar

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar /> {/* La Sidebar reste fixe */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <Outlet /> {/* Affiche le contenu dynamique ici */}
      </div>
    </div>
  );
};

export default Dashboard;
