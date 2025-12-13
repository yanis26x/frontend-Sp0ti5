import { useEffect, useState } from "react";
import axios from "axios";

function Top10Genres({ onBack }) {
  const [top10, setTop10] = useState([]);
  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${HOST}topstats/genres`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTop10(res.data.top10);
    };
    load();
  }, []);

  return (
    <div className="page">
      <button className="topbar-btn" onClick={onBack}>← Retour</button>

      <h1 style={{ marginTop: 20 }}>
        Top 10 genres
      </h1>

      <div className="box" style={{ marginTop: 25 }}>
        {top10.map((g, i) => (
          <div key={i}>
            {i + 1}. {g.genre || g._id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10Genres;
