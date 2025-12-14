import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function PlaylistDetails({ onNavigate, user, playlistId, currentPage }) {
  const [playlist, setPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (playlistId && user) {
      loadPlaylistDetails();
    }
  }, [playlistId, user]);

  const loadPlaylistDetails = async () => {
    try {
      setLoading(true);
      // Load playlist info
      const playlistRes = await axios.get(`${HOST}playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylist(playlistRes.data.data);

      // Load playlist songs
      const songsRes = await axios.get(
        `${HOST}playlists/${playlistId}/songs/details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPlaylistSongs(songsRes.data.songs);
    } catch (err) {
      console.error("Error loading playlist details", err);
      alert("Erreur lors du chargement de la playlist");
    } finally {
      setLoading(false);
    }
  };

  const supprimerPlaylist = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette playlist ?")) {
      return;
    }

    try {
      await axios.delete(`${HOST}playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onNavigate("all-playlists");
    } catch (err) {
      console.error("Error deleting playlist", err);
      alert("Erreur lors de la suppression");
    }
  };

  const removeSongFromPlaylist = async (songId) => {
    try {
      await axios.delete(
        `${HOST}playlists/${playlistId}/songs/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      loadPlaylistDetails();
    } catch (err) {
      console.error("Error removing song", err);
      alert("Erreur lors de la suppression de la musique");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="page">
        <p>Playlist introuvable</p>
        <button onClick={() => onNavigate("all-playlists")}>
          Retour aux playlists
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="home-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar onNavigate={onNavigate} user={user} currentPage={currentPage} />

        {/* Main Content Area */}
        <div className="home-main-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <h1>{playlist.name}</h1>
            <button
              className="danger"
              onClick={supprimerPlaylist}
              style={{ background: "rgba(255, 80, 80, 0.25)" }}
            >
              Supprimer la playlist
            </button>
          </div>

          <div className="box">
            <h3>Musiques ({playlistSongs.length})</h3>
            {playlistSongs.length > 0 ? (
              playlistSongs.map((song) => (
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
                    <p style={{ margin: 0, fontWeight: 600 }}>🎵 {song.name}</p>
                    {song.artist && (
                      <p style={{ margin: "5px 0 0 0", opacity: 0.7, fontSize: 14 }}>
                        {song.artist}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeSongFromPlaylist(song._id)}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(255, 80, 80, 0.25)",
                      fontSize: 12,
                    }}
                  >
                    Retirer
                  </button>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.7 }}>Aucune musique dans cette playlist</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetails;
