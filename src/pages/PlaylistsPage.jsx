import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

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
    <div className="page">

      <div className="playlist-header">
        <button className="back-btn" onClick={onBack}>←</button>

        <div className="create-box">
          <input
            placeholder="nom..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={createPlaylist}>Create</button>
        </div>
      </div>

      
      <div className="playlist-grid-page">
        {playlists.map((p) => (
          <div
            key={p._id}
            className={`playlist-card-page ${
              selectedId === p._id ? "active" : ""
            }`}
            onClick={() =>
              setSelectedId(selectedId === p._id ? null : p._id)
            }
          >
            <div className="playlist-image">
              🎵
            </div>

            <div className="playlist-name">{p.name}</div>

            {selectedId === p._id && (
              <div className="playlist-actions">
                <button className="see-btn">Voir</button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(p._id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

{/* 
      <div className="pagination">
        <button>← Previous</button>
        <button>Next →</button>
      </div> */}
    </div>
  );
}

export default PlaylistsPage;
