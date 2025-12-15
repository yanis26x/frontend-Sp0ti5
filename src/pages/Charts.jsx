import { useState, useEffect } from "react";
import "./Charts.css";
import axios from "axios";
import "../App.css";
import "./Home.css";
import GenreChart from "../components/GenreChart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
} from "recharts";

function Charts({ onNavigate, user }) {
  const [activeTab, setActiveTab] = useState("genres");
  const [top10Songs, setTop10Songs] = useState([]);
  const [top10Artists, setTop10Artists] = useState([]);
  const [top10Newest, setTop10Newest] = useState([]);
  const [top10Oldest, setTop10Oldest] = useState([]);
  const [top10Years, setTop10Years] = useState([]);
  const [loading, setLoading] = useState(false);

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) loadData(activeTab);
  }, [user, activeTab]);

  const loadData = async (tab) => {
    if (!user) return;

    setLoading(true);
    try {
      if (tab === "songs" && top10Songs.length === 0) {
        const res = await axios.get(`${HOST}topstats/songs/playcount`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTop10Songs(
          res.data.top10.map((s) => ({
            name: s.name || s.title || s._id,
            value: s.playCount || 0,
          }))
        );
      }

      if (tab === "artists" && top10Artists.length === 0) {
        const res = await axios.get(`${HOST}topstats/artists/popularity`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTop10Artists(
          res.data.top10.map((a) => ({
            name: a.artist || a.name,
            value: a.popularity || 0,
          }))
        );
      }

      if (tab === "newest" && top10Newest.length === 0) {
        const res = await axios.get(`${HOST}topstats/songs/newest`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTop10Newest(
          res.data.top10.map((s) => ({
            name: s.name || s.title || s._id,
            year: Number(String(s.releaseDate).slice(0, 4)),
          }))
        );
      }

      if (tab === "oldest" && top10Oldest.length === 0) {
        const res = await axios.get(`${HOST}topstats/songs/oldest`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTop10Oldest(
          res.data.top10.map((s) => ({
            name: s.name || s.title || s._id,
            year: Number(String(s.releaseDate).slice(0, 4)),
          }))
        );
      }

      if (tab === "years" && top10Years.length === 0) {
        const res = await axios.get(`${HOST}topstats/years`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTop10Years(
          res.data.top10.map((y) => ({
            name: y._id,
            value: y.songs,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (data, dataKey, yLabel) => (
    <div className="box" style={{ marginTop: 30, height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ bottom: 80, left: 40 }}>
          <XAxis
            dataKey="name"
            interval={0}
            angle={-30}
            textAnchor="end"
            tick={{ fontSize: 12 }}
          >
            <Label
              value="Titres / Artistes"
              position="insideBottom"
              offset={-60}
              fill="#ffffffaa"
            />
          </XAxis>

          <YAxis>
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              fill="#ffffffaa"
            />
          </YAxis>

          <Bar dataKey={dataKey} fill="#f302e7ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderContent = () => {
    if (loading) return <p>chargement...</p>;

    if (activeTab === "genres") return <GenreChart />;

    if (activeTab === "songs")
      return (
        <>
          <div className="box">
            <h3>Top 10 musiques les plus écoutées</h3>
            {top10Songs.map((s, i) => (
              <div key={i} style={{ padding: "12px 0", fontWeight: 600 }}>
                {i + 1}. {s.name}
              </div>
            ))}
          </div>
          {renderChart(top10Songs, "value", "Nombre d'écoutes")}
        </>
      );

    if (activeTab === "artists")
      return (
        <>
          <div className="box">
            <h3>Top 10 artistes (popularité)</h3>
            {top10Artists.map((a, i) => (
              <div key={i} style={{ padding: "12px 0", fontWeight: 600 }}>
                {i + 1}. {a.name}
              </div>
            ))}
          </div>
          {renderChart(top10Artists, "value", "Popularité")}
        </>
      );

    if (activeTab === "newest")
      return (
        <>
          <div className="box">
            <h3>Top 10 musiques les plus récentes</h3>
            {top10Newest.map((s, i) => (
              <div key={i} style={{ padding: "12px 0", fontWeight: 600 }}>
                {i + 1}. {s.name} ({s.year})
              </div>
            ))}
          </div>
          {renderChart(top10Newest, "year", "Année de sortie")}
        </>
      );

    if (activeTab === "oldest")
      return (
        <>
          <div className="box">
            <h3>Top 10 musiques les plus anciennes</h3>
            {top10Oldest.map((s, i) => (
              <div key={i} style={{ padding: "12px 0", fontWeight: 600 }}>
                {i + 1}. {s.name} ({s.year})
              </div>
            ))}
          </div>
          {renderChart(top10Oldest, "year", "Année de sortie")}
        </>
      );

    if (activeTab === "years")
      return (
        <>
          <div className="box">
            <h3>Top 10 années les plus représentées</h3>
            {top10Years.map((y, i) => (
              <div key={i} style={{ padding: "12px 0", fontWeight: 600 }}>
                {i + 1}. {y.name}
              </div>
            ))}
          </div>
          {renderChart(top10Years, "value", "Nombre de titres")}
        </>
      );
  };

  return (
    <>
      <h1>Charts & Statistiques</h1>

      {!user ? (
        <div className="box">
          <button onClick={() => onNavigate("login")}>Se connecter</button>
        </div>
      ) : (
        <>
          <div className="tabs-container">
            <button onClick={() => setActiveTab("genres")}>Genres</button>
            <button onClick={() => setActiveTab("songs")}>Titres</button>
            <button onClick={() => setActiveTab("artists")}>Artistes</button>
            <button onClick={() => setActiveTab("newest")}>Récentes</button>
            <button onClick={() => setActiveTab("oldest")}>Anciennes</button>
            <button onClick={() => setActiveTab("years")}>Années</button>
          </div>

          {renderContent()}
        </>
      )}
    </>
  );
}

export default Charts;
