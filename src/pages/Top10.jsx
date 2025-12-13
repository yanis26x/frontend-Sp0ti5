import { useEffect, useState } from "react";
import axios from "axios";

function Top10({ onBack }) {
  const [top10, setTop10] = useState([]);

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadTop10 = async () => {
      try {
        const res = await axios.get(
          `${HOST}topstats/songs/playcount`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setTop10(res.data.top10);
      } catch (err) {
        console.error("Erreur Top10 musiques", err);
      }
    };

    loadTop10();
  }, []);

  return (
    <div className="page">
      <button className="topbar-btn" onClick={onBack}>← Retour</button>

      <h1 style={{ marginTop: "25px" }}>
        Top 10 musiques les plus écoutées
      </h1>

      <div className="box" style={{ marginTop: "25px" }}>
        {top10.map((song, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "14px",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <span style={{ opacity: 0.6 }}>
              {index + 1}.
            </span>

            <span>
              {song.name || song.title || song._id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10;
