import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function SearchArtists({ onNavigate, user, currentPage: currentRoute }) {
  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const HOST = import.meta.env.VITE_API_URL;

  const searchSongs = async (pageNum = 1) => {
    if (!artist) {
      setMessage("Entre le nom de l'artiste");
      return;
    }

    setLoading(true);
    setMessage("");
    setSongs([]);
    setCurrentPage(pageNum);

    try {
      const res = await axios.get(
        `${HOST}spotify/songs/${artist}?page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let fetchedSongs = res.data.data || [];
      let fetchedArtistInfo = res.data.artist.name || "";

      if (songName) {
        fetchedSongs = fetchedSongs.filter((s) =>
          s.name.toLowerCase().includes(songName.toLowerCase())
        );
      }

      if (fetchedSongs.length === 0) {
        setMessage("Aucune musique trouvée");
      }

      setSongs(fetchedSongs);
      setArtistName(fetchedArtistInfo);
      setHasNextPage(res.data.pagination.hasNextPage);
    } catch (err) {
      console.error("Erreur appel Spotify", err);
      setMessage("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="home-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar onNavigate={onNavigate} user={user} currentPage={currentRoute} />

        {/* Main Content Area */}
        <div className="home-main-content">
          <h1>Rechercher les musiques d'un artiste</h1>

          <input
            placeholder="Nom de l'artiste"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchSongs()}
          />

          <input
            placeholder="Nom de la musique (optionnel)"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchSongs()}
          />

          <button onClick={() => searchSongs(1)}>Chercher</button>

          {loading && <p>Chargement...</p>}
          {message && <p>{message}</p>}

          {songs.length > 0 && (
            <div className="box" style={{ marginTop: 25 }}>
              {songs.map((song) => (
                <div
                  key={song._id}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p>Artiste: {artistName}</p>
                  <b>Musique: {song.name}</b>
                  <p style={{ opacity: 0.7 }}>Album: {song.album}</p>
                </div>
              ))}

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  className={currentPage === 1 ? "disabledButton" : ""}
                  disabled={currentPage === 1}
                  onClick={() => searchSongs(currentPage - 1)}
                >
                  ← Previous
                </button>

                {hasNextPage ? (
                  <button
                    className="topbar-btn"
                    onClick={() => searchSongs(currentPage + 1)}
                  >
                    Next →
                  </button>
                ) : (
                  <button className="disabledButton">Next →</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchArtists;
