import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function SearchSongs({ onNavigate, user, currentPage: currentRoute }) {
  const [keyword, setKeyword] = useState("");
  const [resultat, setResultat] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const HOST = import.meta.env.VITE_API_URL;

  // Load playlists for adding songs
  const loadPlaylists = async () => {
    try {
      const res = await axios.get(`${HOST}playlists`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPlaylists(res.data.data);
    } catch (err) {
      console.error("Error loading playlists", err);
    }
  };

  // Load playlists when user is logged in
  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const chercher = async (pageNum = 1) => {
    if (!keyword) {
      alert("Tape au moins quelques lettres");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${HOST}spotify/search?keyword=${keyword}&page=${pageNum}`
      );

      if (res.data.songs?.length) {
        setResultat(res.data.songs);
        setCurrentPage(pageNum);
        setHasNextPage(res.data.pagination.hasNextPage);
      } else {
        setResultat(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResultat([]); // Set empty array to trigger the "Aucune musique trouvée" message
      } else {
        alert("Erreur lors de la recherche");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ajouterMusiquePlaylist = async (songId) => {
    if (!selectedPlaylistId) {
      alert("Sélectionne une playlist");
      return;
    }

    try {
      await axios.post(
        `${HOST}playlists/${selectedPlaylistId}/songs`,
        { songId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Musique ajoutée à la playlist !");
    } catch (err) {
      console.error("Error adding song to playlist", err);
      alert("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="page">
      <div className="home-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar onNavigate={onNavigate} user={user} currentPage={currentRoute} />

        {/* Main Content Area */}
        <div className="home-main-content">
          <h1>Recherche musique</h1>
          
          <input
            placeholder="Tape un nom"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && chercher()}
          />
          
          <button onClick={() => chercher()}>Chercher</button>

          {isLoading && <p>Chargement...</p>}

          {resultat !== null && !isLoading && (
            <div className="box" style={{ marginTop: 25 }}>
              <h3>Résultats</h3>
              {resultat.length === 0 ? (
                <p>Aucune musique trouvée avec le mot "{keyword}"</p>
              ) : (
                <div>
                  {user && playlists.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", marginBottom: 10 }}>
                        Ajouter à la playlist:
                      </label>
                      <select
                        value={selectedPlaylistId || ""}
                        onChange={(e) => setSelectedPlaylistId(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          background: "rgba(0,0,0,0.55)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.15)",
                          marginBottom: 15,
                        }}
                      >
                        <option value="">Sélectionner une playlist</option>
                        {playlists.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {resultat.map((song) => (
                    <div
                      key={song._id}
                      style={{
                        padding: "14px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <b>{song.name}</b>
                      </div>
                      {user && (
                        <button
                          onClick={() => ajouterMusiquePlaylist(song._id)}
                          style={{ padding: "2px 0px 0px 0px", width: "40px" }}
                        >
                          <i className='bx bx-plus-square' style={{ fontSize: "30px" }}></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button
                      className={currentPage === 1 ? "disabledButton" : ""}
                      disabled={currentPage === 1}
                      onClick={() => chercher(currentPage - 1)}
                    >
                      ← Previous
                    </button>
                    {hasNextPage ? (
                      <button
                        className="topbar-btn"
                        onClick={() => chercher(currentPage + 1)}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchSongs;
