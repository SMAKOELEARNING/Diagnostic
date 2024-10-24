import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import DynamicGraph from './DynamicGraph'; // Importation du composant DynamicGraph
import '../css/Graph2.css';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const Graph2 = () => {
  const [specificData, setSpecificData] = useState({});
  const [sphereIsqvtData, setSphereIsqvtData] = useState({});
  const [categorieData, setCategorieData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/kpiData')
      .then(response => {
        calculateSpecificData(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  const calculateSpecificData = (data) => {
    const specificities = ["Paix", "Peuple", "Prospérité", "Social", "Gouvernance", "Relations et conditions de travail", "Droits de l'homme"];
    const excludedSpecificities = ["Perception RSE", "Participation activité RSE"];
    
    const specificData = {};
    const sphereIsqvtData = {};
    const categorieData = {};

    data.forEach(entry => {
      if (entry.score && entry.categorie !== 'odd' && entry.specificite !== 'NaN') {
        
        // Premier graphique - Spécificités spécifiques
        if (specificities.includes(entry.specificite)) {
          if (!specificData[entry.specificite]) {
            specificData[entry.specificite] = { total: 0, count: 0 };
          }
          specificData[entry.specificite].total += entry.score;
          specificData[entry.specificite].count++;
        }

        // Deuxième graphique - Catégorie Sphère ISQVT
        if (entry.categorie === 'Sphère ISQVT') {
          if (!sphereIsqvtData[entry.specificite]) {
            sphereIsqvtData[entry.specificite] = { total: 0, count: 0 };
          }
          sphereIsqvtData[entry.specificite].total += entry.score;
          sphereIsqvtData[entry.specificite].count++;
        }

        // Troisième graphique - Catégorie "Categorie" sans certaines spécificités
        if (entry.categorie === 'Categorie' && !excludedSpecificities.includes(entry.specificite)) {
          if (!categorieData[entry.specificite]) {
            categorieData[entry.specificite] = { total: 0, count: 0 };
          }
          categorieData[entry.specificite].total += entry.score;
          categorieData[entry.specificite].count++;
        }
      }
    });

    const calculateAverages = (dataset) => {
      const averages = {};
      Object.keys(dataset).forEach(key => {
        averages[key] = dataset[key].total / dataset[key].count;
      });
      return averages;
    };

    setSpecificData(calculateAverages(specificData));
    setSphereIsqvtData(calculateAverages(sphereIsqvtData));
    setCategorieData(calculateAverages(categorieData));
  };

  const renderPolarChart = (data) => {
    const labels = Object.keys(data);
    const dataValues = Object.values(data);

    const chartData = {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00C49F'
        ],
        borderColor: 'rgba(255, 255, 255, 1)', // Couleur de la bordure avec opacité pour plus d'espacement
        borderWidth: 10, // Augmentation de l'espacement entre les barres
      }],
    };

    return (
      <div className="graph-box">
        <PolarArea data={chartData} options={{
          scales: {
            r: {
              beginAtZero: true,
              ticks: {
                stepSize: 2.5,
                max: 10,
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
                }
              }
            },
            legend: {
              display: false // Masquer la légende
            }
          }
        }} />
      </div>
    );
  };

  return (
    <div className="graph2-container">
      {/* Premier graphique - Spécificités spécifiques */}
      {renderPolarChart(specificData)}

      {/* Deuxième graphique - Catégorie Sphère ISQVT */}
      {renderPolarChart(sphereIsqvtData)}

      {/* Troisième graphique - Catégorie "Categorie" avec exclusions */}
      {renderPolarChart(categorieData)}

      {/* Quatrième graphique - Graphique dynamique */}
      <div className="graph-box">
        <DynamicGraph />
      </div>
    </div>
  );
};

export default Graph2;
