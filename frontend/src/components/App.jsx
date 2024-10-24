import Home from './Home';
import Login from './Login';
import Password from './Password';
import Questionnaire from './Questionnaire';
import Dashboard from './Dashboard';
import ProtectedLayout from './ProtectedLayout';
import Register from './Register';
import Graph1 from './Graph1';
import Graph2 from './Graph2';
import Graph3 from './Graph3';
import DynamicGraph from './DynamicGraph';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import Formulaire from './Formulaire';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/password" element={<Password />} />
          <Route path="/ajout1257" element={<Register />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

          {/* Routes accessibles uniquement lorsque l'utilisateur est connecté */}
          <Route element={isLoggedIn ? <ProtectedLayout /> : <Navigate to="/login" />}>
            <Route path="/home" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            
            {/* Structure de la page Dashboard avec Sidebar et graphiques dynamiques */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="graph1" element={<Graph1 />} />
              <Route path="graph2" element={<Graph2 />} />
              <Route path="graph3" element={<Graph3 />} />
              <Route index element={<Graph1 />} /> {/* Affiche Graph1 par défaut */}
            </Route>

            <Route path="/DynamicGraph" element={<DynamicGraph />} />
          </Route>

          {/* Route accessible sans connexion */}
          <Route path="/formulaire" element={<Formulaire />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
