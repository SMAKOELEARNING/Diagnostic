import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PolarArea, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import '../css/Graph1.css';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const Graph1 = () => {
  const [data, setData] = useState([]);
  const [categoryAverages, setCategoryAverages] = useState({});
  const [generalSatisfaction, setGeneralSatisfaction] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/api/kpiData')
      .then(response => {
        setData(response.data);
        calculateAverages(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  const calculateAverages = (data) => {
    const categories = {};
    let totalScore = 0;
    let totalEntries = 0;

    data.forEach(entry => {
      if (entry.score && entry.categorie !== 'odd') {
        totalScore += entry.score;
        totalEntries++;

        if (!categories[entry.categorie]) {
          categories[entry.categorie] = { total: 0, count: 0 };
        }
        categories[entry.categorie].total += entry.score;
        categories[entry.categorie].count++;
      }
    });

    const averages = {};
    Object.keys(categories).forEach(category => {
      averages[category] = categories[category].total / categories[category].count;
    });

    setCategoryAverages(averages);
    setGeneralSatisfaction(totalEntries > 0 ? (totalScore / totalEntries) : 0);
  };

  const doughnutDataGeneral = {
    labels: ['Satisfaction Générale', ''],
    datasets: [{
      data: [generalSatisfaction, 10 - generalSatisfaction],
      backgroundColor: ['#36A2EB', '#EAEAEA'],
      borderColor: ['#36A2EB', '#EAEAEA'],
      borderWidth: 1,
    }],
  };

  const doughnutDataCategory = {
    labels: Object.keys(categoryAverages),
    datasets: [{
      label: 'Répartition des Scores par Catégorie',
      data: Object.values(categoryAverages),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      borderColor: '#333333',
      borderWidth: 1,
    }],
  };

  return (
    <div className="graph-container">
      <div className="graph-section">
        <div className="graph-box">
          {/* <h3>Satisfaction Générale</h3>
          <Doughnut data={doughnutDataGeneral} className="doughnut-chart" />
          <p>{generalSatisfaction.toFixed(2)} / 10</p> */}
          <h3>Répartition par Catégorie</h3>
        <Doughnut data={doughnutDataCategory} className="doughnut-chart" options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
                }
              }
            }
          },
          cutout: '30%',
          rotation: -90,
        }} />
        </div>
        <div className="graph-box">
          <h3>Notes par Catégorie</h3>
          <ul>
            {Object.entries(categoryAverages).map(([category, average], index) => (
              <li key={index} style={{ margin: '5px 0' }}>
                <strong>{category}</strong>: {average.toFixed(2)*10} / 100
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="full-width-graph">
      <h3>Satisfaction Générale</h3>
          <Doughnut data={doughnutDataGeneral} className="doughnut-chart" />
          <p>{generalSatisfaction.toFixed(2)} / 10</p>
        
      </div>
    </div>
  );
};

export default Graph1;
