import { useEffect, useState } from "react";
import axios from "axios";

function Top10OldestSongs({ onBack }) {
  const [top10, setTop10] = useState([]);
  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${HOST}topstats/songs/oldest`,
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

      <h1 style={{ marginTop: "25px" }}>
        Top 10 musiques les plus anciennes
      </h1>

      <div className="box" style={{ marginTop: "25px" }}>
        {top10.map((song, i) => (
          <div
            key={i}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              fontWeight: 600,
            }}
          >
            {i + 1}. {song.name || song.title || song._id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10OldestSongs;
