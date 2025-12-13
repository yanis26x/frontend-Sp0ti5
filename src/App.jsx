import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./auth";
import GenreChart from "./components/GenreChart";

function App() {
  const [keyword, setKeyword] = useState("");
  const [resultat, setResultat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistMsg, setPlaylistMsg] = useState("");

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);

  const [page, setPage] = useState("home");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);

  const HOST = import.meta.env.VITE_API_URL;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const loadPlaylists = async () => {
    const res = await axios.get(`${HOST}playlists`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPlaylists(res.data.data);
  };

  const loadPlaylistSongs = async (playlistId) => {
    const res = await axios.get(
      `${HOST}playlists/${playlistId}/songs/details`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setPlaylistSongs(res.data.songs);
  };

  useEffect(() => {
    if (user) loadPlaylists();
  }, [user]);

  const chercher = async (pageNum = 1) => {
    if (!keyword) return alert("Tape au moins quelques lettres");

    setIsLoading(true);
    const res = await axios.get(
      `${HOST}spotify/search?keyword=${keyword}&page=${pageNum}`
    );

    if (res.data.songs?.length) {
      setResultat(res.data.songs);
      setCurrentPage(pageNum);
    } else {
      setResultat(null);
    }

    setIsLoading(false);
  };

  const creerPlaylist = async () => {
    if (!playlistName) return alert("Entre un nom de playlist");

    await axios.post(
      `${HOST}playlists`,
      { name: playlistName },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    setPlaylistMsg("Playlist créée !");
    setPlaylistName("");
    loadPlaylists();
  };

  const supprimerPlaylist = async () => {
    if (!selectedPlaylist) return;

    await axios.delete(`${HOST}playlists/${selectedPlaylist._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setSelectedPlaylist(null);
    setPlaylistSongs([]);
    loadPlaylists();
  };

  const ajouterMusiquePlaylist = async (songId) => {
    if (!selectedPlaylist) return alert("Sélectionne une playlist");

    await axios.post(
      `${HOST}playlists/${selectedPlaylist._id}/songs`,
      { songId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    loadPlaylistSongs(selectedPlaylist._id);
  };

  if (page === "auth") {
    return (
      <Auth
        goHome={() => {
          setPage("home");
          const stored = localStorage.getItem("user");
          if (stored) setUser(JSON.parse(stored));
        }}
      />
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        {!user ? (
          <button className="topbar-btn" onClick={() => setPage("auth")}>
            Login
          </button>
        ) : (
          <button className="topbar-btn logout" onClick={logout}>
            Déconnexion
          </button>
        )}
      </div>

      <div className="content">
        {/* LEFT */}
        <div className="left">
          <h1>Mes playlists</h1>

          <div className="playlist-grid">
            {playlists.map((p) => (
              <div
                key={p._id}
                className={`playlist-card ${
                  selectedPlaylist?._id === p._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedPlaylist(p);
                  loadPlaylistSongs(p._id);
                }}
              >
                <img
                  src="src/assets/huhh_playlist.png"
                  alt="playlist"
                  className="playlist-img"
                />
                <div className="playlist-title">{p.name}</div>
              </div>
            ))}
          </div>

          <h1>Créer une playlist</h1>
          <input
            placeholder="Nom de la playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button onClick={creerPlaylist}>Créer</button>
          {playlistMsg && <p>{playlistMsg}</p>}

          <h1>Recherche musique</h1>
          <input
            placeholder="Tape un nom"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={() => chercher()}>Chercher</button>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="box">
            <h3>Genres</h3>
            <GenreChart />
          </div>

          {selectedPlaylist && (
            <div className="box">
              <h3>{selectedPlaylist.name}</h3>
              <button className="danger" onClick={supprimerPlaylist}>
                Supprimer la playlist
              </button>
              {playlistSongs.map((s) => (
                <p key={s._id}>🎵 {s.name}</p>
              ))}
            </div>
          )}

          {resultat && !isLoading && (
            <div className="box">
              <h3>Résultats</h3>
              {resultat.map((song) => (
                <div key={song._id} className="song-row">
                  <b>{song.name}</b>
                  <button
                    onClick={() => ajouterMusiquePlaylist(song._id)}
                  >
                    Ajouter
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
