import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import "./PlaylistsPage.css";

function PlaylistsPage({ onBack }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    const res = await axios.get(`${HOST}playlists`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setPlaylists(res.data.data);
  };

  const createPlaylist = async () => {
    if (!name) return;
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
  };

  const deletePlaylist = async (id) => {
    await axios.delete(`${HOST}playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setSelectedId(null);
    loadPlaylists();
  };

  return (
    <div className="page playlist-page">
      <div className="playlist-header">
        <button className="back-btn" onClick={onBack} title="Retour">
          ←
        </button>

        <div className="create-box">
          <input
            placeholder="Nom de la playlist..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
          />
          <button onClick={createPlaylist} disabled={!name.trim()}>Créer</button>
        </div>
      </div>

      {playlists.length > 0 ? (
        <div className="playlist-grid-page">
          {playlists.map((p) => (
            <div
              key={p._id}
              className={`playlist-card-page ${
                selectedId === p._id ? "active" : ""
              }`}
              onClick={() => setSelectedId(selectedId === p._id ? null : p._id)}
            >
              <div className="playlist-image">
                {p.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </div>

              <div className="playlist-name" title={p.name}>
                {p.name}
              </div>

              <div className="playlist-actions">
                <button 
                  className="see-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add navigation to playlist details here
                  }}
                >
                  Voir
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Supprimer la playlist "${p.name}" ?`)) {
                      deletePlaylist(p._id);
                    }
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="playlist-image" style={{ margin: '0 auto 20px' }}>📭</div>
          <h3>Aucune playlist</h3>
          <p>Créez votre première playlist en utilisant le formulaire ci-dessus</p>
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
