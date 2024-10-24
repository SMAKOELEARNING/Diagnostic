import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';

const KPIPage = () => {
  const [kpiData, setKpiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/kpi-data');
        setKpiData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données KPI:', error);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    // Récupérer les données pour le graphique (ici, exemple pour un graphique en barres)
    const categories = [...new Set(kpiData.map(data => data.categorie))]; // Uniques catégories
    const categoryCount = categories.map(category => 
      kpiData.filter(data => data.categorie === category).length
    );

    return {
      labels: categories,
      datasets: [
        {
          label: 'Réponses par catégorie',
          data: categoryCount,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  return (
    <div>
      <h2>KPI Dashboard</h2>

      {/* Exemple de graphique en barres pour afficher les réponses par catégorie */}
      <div>
        <Bar
          data={getChartData()}
          options={{
            title: {
              display: true,
              text: 'Nombre de réponses par catégorie',
              fontSize: 25,
            },
            legend: {
              display: false,
            },
          }}
        />
      </div>

      {/* Exemple d'un tableau avec les réponses */}
      <div className="table-responsive mt-5">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Formulaire ID</th>
              <th>Question</th>
              <th>Réponse</th>
              <th>Piliers RSE</th>
              <th>ESG</th>
              <th>5P</th>
              <th>Sphère ISQVT</th>
              <th>Catégorie</th>
            </tr>
          </thead>
          <tbody>
            {kpiData.map((data, index) => (
              <tr key={index}>
                <td>{data.formId}</td>
                <td>{data.questionText}</td>
                <td>{data.response}</td>
                <td>{data.piliersRSE}</td>
                <td>{data.ESG}</td>
                <td>{data.p5}</td>
                <td>{data.sphereISQVT}</td>
                <td>{data.categorie}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIPage;
