import { useState, useEffect } from "react";
import axios from "axios";
import "./AllPlaylists.css";
import "../App.css";
import "./Home.css";

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
    <>
      <h1>Mes Playlists</h1>

      <div className="search-container" style={{ marginBottom: '30px' }}>
        <input
          className="search-input"
          placeholder="Nom de la nouvelle playlist"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && createPlaylist()}
        />
        <button
          className="search-button"
          onClick={createPlaylist}
          disabled={!name.trim()}
        >
          <i className="bx bx-plus"></i>
        </button>
      </div>

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="playlist-card">
            <div
              className="playlist-image"
              onClick={() => onNavigate("playlist-details", playlist._id)}
            >
              <img
                src={new URL("../assets/huhh_playlist.png", import.meta.url).href}
                alt={playlist.name}
                className="playlist-thumbnail"
              />
            </div>
            <div className="playlist-info">
              <h3 onClick={() => onNavigate("playlist-details", playlist._id)}>
                {playlist.name}
              </h3>

            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <p style={{ opacity: 0.7, marginTop: 20 }}>
          Aucune playlist. Créez-en une pour commencer !
        </p>
      )}
    </>
  );
}

export default AllPlaylists;
