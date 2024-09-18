import { useState, useEffect } from 'react';
import axios from 'axios';
import { Legend ,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Graph = () => {
  const [averageAtelier, setAverageAtelier] = useState(0);
  const [averageDeveloppement, setAverageDeveloppement] = useState(0);
  const [sessionsData, setSessionsData] = useState([]);
  const [cityParticipantsData, setCityParticipantsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const atelierResponse = await axios.get('http://localhost:3001/average-atelier');
        setAverageAtelier(atelierResponse.data.average);

        const developpementResponse = await axios.get('http://localhost:3001/average-developpement');
        setAverageDeveloppement(developpementResponse.data.average);

        const sessionsResponse = await axios.get('http://localhost:3001/sessions-per-month');
        setSessionsData(sessionsResponse.data.map(item => ({
          month: item.month,
          count: item.count
        })));

        const cityParticipantsResponse = await axios.get('http://localhost:3001/participants-by-city');
        setCityParticipantsData(cityParticipantsResponse.data.map(item => ({
          name: item._id,
          value: item.count
        })));

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="container" style={{ display : 'flex' , flexDirection : 'column' , alignItems :'center' }}>
      <h1>Dashboard Terra Twist :</h1>
      <div className="container_2" style={{  display : 'flex' , flexWrap :'wrap' , gap :'10px'}}>
      <div className="graph" style={{flex :'1 1 45%' , boxSizing :'border-box' , border: '1px solid #000;' , padding: '10px', margin: '5px', textAlign :'center' ,  width : '35vw', height : '35vh' , borderRadius: '20px', boxShadow : '2px 2px 2px #767676'}}>
        <h2>Taux de comprehension sur le développement durable </h2>
        
        <p style={{  fontSize : '5vh'}}> <span style={{ color : '#57A6AB' , fontSize : '10vh'}}>{averageAtelier.toFixed(2)*10}</span>  %</p >
      </div>

      <div className="graph" style={{flex :'1 1 45%' , boxSizing :'border-box' , border: '1px solid #000;' , padding: '10px', margin: '5px', textAlign :'center' , width : '35vw', height : '35vh' , borderRadius: '20px', boxShadow : '2px 2px 2px #767676'}}>
        <h2>Taux de satisfaction sur l’atelier Terra Twist</h2> 
        <p style={{  fontSize : '5vh'}}><span style={{ color : '#57A6AB' , fontSize : '10vh'}}>{averageDeveloppement.toFixed(2)*10}</span>%</p>
      </div>

      <div className="graph" style={{flex :'1 1 45%' , boxSizing :'border-box' , border: '1px solid #000;' , padding: '10px', margin: '5px', textAlign :'center' ,borderRadius: '20px', boxShadow : '2px 2px 2px #767676'}}>
        <h2 style={{marginBottom :'60px'}}>Nombre de sessions par mois</h2>
        <LineChart width={400} height={300} data={sessionsData} style={{marginLeft :'50px'}}>
          <CartesianGrid strokeDasharray="3 3"  />
          <XAxis dataKey="month" tickFormatter={(tick) => monthNames[tick - 1]}  />
          <YAxis  />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="graph" style={{flex :'1 1 45%' , boxSizing :'border-box' , border: '1px solid #000;' , padding: '10px', margin: '5px', textAlign :'center' ,  borderRadius: '20px',  boxShadow : '2px 2px 2px #767676'}}>
      <h2> Nombre de Participants par Ville</h2>
      {cityParticipantsData.length > 0 ? (
        <PieChart width={400} height={400} style={{marginLeft :'40px' }}>
          <Pie
            data={cityParticipantsData}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            
          >
            {cityParticipantsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>Chargement des données...</p>
      )}
      </div>
      
    </div>
    </div>
  );
};

export default Graph;
