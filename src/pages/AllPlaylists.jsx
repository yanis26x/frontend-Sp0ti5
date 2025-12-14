import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function AllPlaylists({ onNavigate, user, currentPage }) {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    try {
      const res = await axios.get(`${HOST}playlists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists(res.data.data);
    } catch (err) {
      console.error("Error loading playlists", err);
    }
  };

  const createPlaylist = async () => {
    if (!name) return;
    try {
      await axios.post(
        `${HOST}playlists`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setName("");
      loadPlaylists();
    } catch (err) {
      console.error("Error creating playlist", err);
      alert("Erreur lors de la création");
    }
  };

  const deletePlaylist = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette playlist ?")) {
      return;
    }
    try {
      await axios.delete(`${HOST}playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      loadPlaylists();
    } catch (err) {
      console.error("Error deleting playlist", err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="page">
      <div className="home-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar onNavigate={onNavigate} user={user} currentPage={currentPage} />

        {/* Main Content Area */}
        <div className="home-main-content">
          <h1>Mes Playlists</h1>

          <div style={{ marginBottom: 30 }}>
            <input
              placeholder="Nom de la playlist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createPlaylist()}
            />
            <button onClick={createPlaylist} style={{ marginTop: 10 }}>
              Créer une playlist
            </button>
          </div>

          <div className="playlist-grid-page">
            {playlists.map((p) => (
              <div
                key={p._id}
                className="playlist-card-page"
                onClick={() => onNavigate("playlist-details", p._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="playlist-image">🎵</div>
                <div className="playlist-name">{p.name}</div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(p._id);
                  }}
                  style={{ marginTop: 10 }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {playlists.length === 0 && (
            <p style={{ opacity: 0.7, marginTop: 20 }}>
              Aucune playlist. Créez-en une pour commencer !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllPlaylists;
