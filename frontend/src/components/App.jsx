import Home from './Home';
import Login from './Login';
import Password from './Password';
import Questionnaire from './Questionnaire';
import SecondQuestionnaire from './SecondQuestionnaire';
import Graph from './Graph';
import Dashboard from './Dashboard';
import ProtectedLayout from './ProtectedLayout';
import Register from './Register';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/password" element={<Password />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

          {/* Routes accessibles uniquement lorsque l'utilisateur est connecté */}
          <Route element={isLoggedIn ? <ProtectedLayout /> : <Navigate to="/login" />}>
            <Route path="/home" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
          </Route>

          {/* Route accessible sans connexion */}
          <Route path="/second-questionnaire/:id" element={<SecondQuestionnaire />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
