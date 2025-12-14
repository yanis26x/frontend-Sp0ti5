import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import GenreChart from "../components/GenreChart";
import Sidebar from "../components/Sidebar";

function Charts({ onNavigate, user, currentPage }) {
  const [activeTab, setActiveTab] = useState("genres");
  const [top10Songs, setTop10Songs] = useState([]);
  const [top10Artists, setTop10Artists] = useState([]);
  const [top10Genres, setTop10Genres] = useState([]);
  const [top10Newest, setTop10Newest] = useState([]);
  const [top10Oldest, setTop10Oldest] = useState([]);
  const [top10Years, setTop10Years] = useState([]);
  const [loading, setLoading] = useState(false);

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      loadData(activeTab);
    }
  }, [user, activeTab]);

  const loadData = async (tab) => {
    if (!user) return;
    
    setLoading(true);
    try {
      switch (tab) {
        case "songs":
          if (top10Songs.length === 0) {
            const songsRes = await axios.get(`${HOST}topstats/songs/playcount`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTop10Songs(songsRes.data.top10);
          }
          break;
        case "artists":
          if (top10Artists.length === 0) {
            const artistsRes = await axios.get(`${HOST}topstats/artists/popularity`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTop10Artists(artistsRes.data.top10);
          }
          break;
        case "genres":
          // GenreChart handles its own loading
          break;
        case "newest":
          if (top10Newest.length === 0) {
            const newestRes = await axios.get(`${HOST}topstats/songs/newest`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTop10Newest(newestRes.data.top10);
          }
          break;
        case "oldest":
          if (top10Oldest.length === 0) {
            const oldestRes = await axios.get(`${HOST}topstats/songs/oldest`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTop10Oldest(oldestRes.data.top10);
          }
          break;
        case "years":
          if (top10Years.length === 0) {
            const yearsRes = await axios.get(`${HOST}topstats/years`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTop10Years(yearsRes.data.top10);
          }
          break;
      }
    } catch (err) {
      console.error(`Error loading ${tab} data`, err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p>Chargement...</p>;
    }

    switch (activeTab) {
      case "songs":
        return (
          <div className="box">
            <h3>Top 10 musiques les plus écoutées</h3>
            {top10Songs.map((song, index) => (
              <div
                key={index}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                <span style={{ opacity: 0.6 }}>{index + 1}.</span>{" "}
                <span>{song.name || song.title || song._id}</span>
              </div>
            ))}
          </div>
        );

      case "artists":
        return (
          <div className="box">
            <h3>Top 10 artistes (popularité)</h3>
            {top10Artists.map((artist, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  fontWeight: 600,
                }}
              >
                {i + 1}. {artist.artist || artist.name}
              </div>
            ))}
          </div>
        );

      case "genres":
        return (
          <div className="box">
            <h3>Répartition des musiques par genre</h3>
            <GenreChart />
          </div>
        );

      case "newest":
        return (
          <div className="box">
            <h3>Top 10 musiques les plus récentes</h3>
            {top10Newest.map((song, i) => (
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
        );

      case "oldest":
        return (
          <div className="box">
            <h3>Top 10 musiques les plus anciennes</h3>
            {top10Oldest.map((song, i) => (
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
        );

      case "years":
        return (
          <div className="box">
            <h3>Top 10 années les plus représentées</h3>
            {top10Years.map((year, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                  fontWeight: 600,
                }}
              >
                {i + 1}. {year.year || year._id}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page">
      <div className="home-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar onNavigate={onNavigate} user={user} currentPage={currentPage} />

        {/* Main Content Area */}
        <div className="home-main-content">
          <h1>Charts & Statistiques</h1>

          {!user && (
            <div className="box" style={{ marginBottom: 20 }}>
              <p>Connectez-vous pour voir les statistiques</p>
              <button onClick={() => onNavigate("login")}>Se connecter</button>
            </div>
          )}

          {user && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: 25,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className={activeTab === "genres" ? "" : "topbar-btn"}
                  onClick={() => setActiveTab("genres")}
                >
                  Genres
                </button>
                <button
                  className={activeTab === "songs" ? "" : "topbar-btn"}
                  onClick={() => setActiveTab("songs")}
                >
                  Top 10 Musiques
                </button>
                <button
                  className={activeTab === "artists" ? "" : "topbar-btn"}
                  onClick={() => setActiveTab("artists")}
                >
                  Top 10 Artistes
                </button>
                <button
                  className={activeTab === "newest" ? "" : "topbar-btn"}
                  onClick={() => setActiveTab("newest")}
                >
                  Top 10 Récentes
                </button>
                <button
                  className={activeTab === "oldest" ? "" : "topbar-btn"}
                  onClick={() => setActiveTab("oldest")}
                >
                  Top 10 Anciennes
                </button>
                <button
                  className={activeTab === "years" ? "" : "topbar-btn"}
                  onClick={() => setActiveTab("years")}
                >
                  Top 10 Années
                </button>
              </div>

              {renderContent()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Charts;
