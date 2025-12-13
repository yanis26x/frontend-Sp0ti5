import { useEffect, useState } from "react";
import axios from "axios";

function Top10ArtistsPopularity({ onBack }) {
  const [top10, setTop10] = useState([]);
  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${HOST}topstats/artists/popularity`,
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
        Top 10 artistes (popularité)
      </h1>

      <div className="box" style={{ marginTop: 25 }}>
        {top10.map((a, i) => (
          <div key={i} style={{ padding: "12px 0" }}>
            {i + 1}. {a.artist || a.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10ArtistsPopularity;
