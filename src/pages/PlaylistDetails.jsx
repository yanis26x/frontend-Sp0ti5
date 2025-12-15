import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SongListItem from "../components/SongListItem";
import axios from "axios";
import "../App.css";
import "./Home.css";
import "./PlaylistDetails.css";
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
      const playlistRes = await axios.get(`${HOST}playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylist(playlistRes.data.data);

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
        `${HOST}playlists/${playlistId}/song/${songId}`,
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
    <div className="playlist-details-container">
      <div className="playlist-header-details">
        <div className="playlist-image-large">
          <img
            src={new URL("../assets/huhh_playlist.png", import.meta.url).href}
            alt={playlist.name}
            className="playlist-thumbnail-large"
          />
        </div>
        <div className="playlist-info-details">
          <h1>{playlist.name}</h1>
          <div className="playlist-actions">
            <button
              className="delete-playlist-btn"
              onClick={supprimerPlaylist}
            >
              <i className="bx bx-trash"></i> Supprimer la playlist
            </button>
          </div>
        </div>
      </div>

      <div className="playlist-songs-container">
        <h3>{playlistSongs.length} TRACKS </h3>
        {playlistSongs.length > 0 ? (
          <div className="songs-list">
            {playlistSongs.map((song) => (
              <SongListItem
                key={song._id}
                song={song}
                onButtonClick={() => removeSongFromPlaylist(song._id)/*  console.log("PlaylistID: " + playlistId +  ",songId: " + song._id + ",Token: " + localStorage.getItem("token")) */}
                buttonIcon="bx-x-circle"
                buttonVariant="danger"
              />
            ))}
            <button
              className="browse-songs-btn"
              onClick={() => onNavigate('search-songs')}
            >
              <i className="bx bx-music"></i> Ajouter des musiques
            </button>
          </div>
        ) : (
          <div className="empty-playlist">
            <p>Aucune musique dans cette playlist</p>
            <button
              className="browse-songs-btn"
              onClick={() => onNavigate('search-songs')}
            >
              <i className="bx bx-music"></i> Parcourir les musiques
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetails;
