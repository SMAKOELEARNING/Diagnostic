import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DynamicGraph = () => {
  const [data, setData] = useState([]);
  const [xOption, setXOption] = useState('sexe');
  const [yOption, setYOption] = useState('Relations et conditions de travail');
  const [chartData, setChartData] = useState(null);

  const xOptions = [
    { value: 'sexe', label: 'Sexe' },
    { value: 'age', label: 'Âge' },
    { value: 'ville', label: 'Ville' },
    { value: 'poste', label: 'Poste' }
  ];

  const yOptions = [
    'Paix', 'Peuple', 'Prospérité', 'Social', 'Gouvernance', 'Relations et conditions de travail', "Droits de l'homme"
  ];

  useEffect(() => {
    // Récupération des données depuis l'API
    axios.get('http://localhost:3001/api/kpiData')
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  useEffect(() => {
    if (data.length) {
      updateChartData();
    }
  }, [data, xOption, yOption]);

  const getXData = (xOption) => {
    // Définir les expressions régulières correspondantes pour chaque option de l'axe X
    let questionRegex;
    switch (xOption) {
      case 'sexe':
        questionRegex = /Vous êtes/i;
        break;
      case 'age':
        questionRegex = /âge /i;
        break;
      case 'ville':
        questionRegex = /ville se situe votre entreprise/i;
        break;
      case 'poste':
        questionRegex = /position occupez-vous/i;
        break;
      default:
        questionRegex = null;
    }

    // Filtrer les données pour correspondre au regex approprié
    return data.filter(d => questionRegex && questionRegex.test(d.questionText));
  };

  const updateChartData = () => {
    const xData = getXData(xOption);
    const filteredData = data.filter(d => d.specificite === yOption);

    if (!xData.length || !filteredData.length) {
      setChartData(null);
      return;
    }

    // Récupérer les valeurs uniques de l'axe X
    const xLabels = [...new Set(xData.map(d => d.detail))];
    
    // Calculer les scores moyens pour chaque étiquette de l'axe X
    const yValues = xLabels.map(label => {
      const relatedData = filteredData.filter(d => xData.some(x => x.detail === label && x.formId === d.formId));
      if (!relatedData.length) return 0;

      const totalScore = relatedData.reduce((sum, d) => sum + (d.score || 0), 0);
      return totalScore / relatedData.length; // Score moyen
    });

    setChartData({
      labels: xLabels,
      datasets: [
        {
          label: `${yOption} par ${xOption}`,
          data: yValues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    });
  };

  return (
    <div style={{ width: '60%', margin: '0 auto', textAlign: 'center' }}>

      <div style={{ marginBottom: '20px' }}>
        <label>Axe Y :</label>
        <select id="y-select" value={yOption} onChange={(e) => setYOption(e.target.value)}>
          {yOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {chartData ? (
        <Bar data={chartData} options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              grid: {
                display: true
              },
              title: {
                display: true,
                text: 'Score moyen'
              }
            },
            x: {
              grid: {
                display: true
              }
            }
          },
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }} />
      ) : (
        <p>Aucune donnée disponible pour cette combinaison.</p>
      )}

      {/* Boutons pour l'axe X sous le graphique */}
      <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
        {xOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setXOption(option.value)}
            style={{
              margin: '0 10px',
              padding: '10px 15px',
              backgroundColor: xOption === option.value ? '#36A2EB' : '#f0f0f0',
              color: xOption === option.value ? '#fff' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DynamicGraph;
