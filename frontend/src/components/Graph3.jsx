import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import DynamicGraph from './DynamicGraph';
import '../css/Graph2.css';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const Graph3 = () => {
  const [specificData, setSpecificData] = useState({});
  const [oddData, setOddData] = useState({});
  
  useEffect(() => {
    axios.get('http://localhost:3001/api/kpiData')
      .then(response => {
        calculateSpecificData(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  const calculateSpecificData = (data) => {
    const specificities = ["Paix", "Peuple", "Prospérité", "Social", "Gouvernance", "Relations et conditions de travail", "Droits de l'homme"];
    
    const specificData = {};
    const oddData = {};

    data.forEach(entry => {
      if (entry.score && entry.specificite !== 'NaN') {
        
        // Premier graphique - Spécificités spécifiques
        if (specificities.includes(entry.specificite)) {
          if (!specificData[entry.specificite]) {
            specificData[entry.specificite] = { total: 0, count: 0 };
          }
          specificData[entry.specificite].total += entry.score;
          specificData[entry.specificite].count++;
        }

        // Deuxième graphique - Catégorie "odd" uniquement
        if (entry.categorie === 'odd') {
          if (!oddData[entry.specificite]) {
            oddData[entry.specificite] = { total: 0, count: 0 };
          }
          oddData[entry.specificite].total += entry.score;
          oddData[entry.specificite].count++;
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
    setOddData(calculateAverages(oddData));
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
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 10,
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
              display: false
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

      {/* Deuxième graphique - Catégorie "odd" */}
      {renderPolarChart(oddData)}

      {/* Troisième graphique - Graphique dynamique */}
      <div className="graph-box">
        <DynamicGraph />
      </div>
    </div>
  );
};

export default Graph3;
