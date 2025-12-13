import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#00e5ff",
  "#1e50ff",
  "#ff4d4d",
  "#00ff9d",
  "#ffd166",
  "#c77dff",
  "#ff7b00",
  "#4cc9f0",
  "#f72585",
  "#90dbf4",
];

function GenreChart() {
  const [data, setData] = useState([]);

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGenres = async () => {


      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN:", token);

        const res = await axios.get(`${HOST}topstats/genres`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });



        const formatted = res.data.top10.map((g) => ({
          name: g._id,   
          value: g.count,  
        }));



        setData(formatted);
      } catch (err) {
      }
    };

    fetchGenres();
  }, []);

  if (data.length === 0) {
    return (
      <div className="box">
        <b>Aucune donnée de genre</b>
      </div>
    );
  }

  return (
    <div className="box">
      <h3>Répartition des musiques par genre</h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GenreChart;
