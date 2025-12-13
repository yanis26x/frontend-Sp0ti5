import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./auth";

function App() {
  const [keyword, setKeyword] = useState("");
  const [resultat, setResultat] = useState(null);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistMsg, setPlaylistMsg] = useState("");

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);

  const [addSongMsg, setAddSongMsg] = useState("");

  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  // ============================
  //   COMME ICI STRUCTURE
  // ============================
  const HOST = import.meta.env.VITE_API_URL;
  // ============================

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
    try {
      const res = await axios.get(`${HOST}playlists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists(res.data);
    } catch {
      console.error("Erreur chargement playlists");
    }
  };

  const loadPlaylistSongs = async (playlistId) => {
    try {
      const res = await axios.get(`${HOST}playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylistSongs(res.data.songs || []);
    } catch {
      console.error("Erreur chargement musiques playlist");
    }
  };

  useEffect(() => {
    if (user) loadPlaylists();
  }, [user]);

  const chercher = async () => {
    if (!keyword) {
      alert("Tape au moins quelques lettres");
      return;
    }

    try {
      const res = await axios.get(`${HOST}spotify/search?keyword=${keyword}`);
      setResultat(res.data.data);
      setAddSongMsg("");
    } catch {
      alert("Erreur recherche");
    }
  };
  //CRUD???
  const creerPlaylist = async () => {
    if (!playlistName) return alert("Entre un nom de playlist");

    try {
      await axios.post(
        `${HOST}playlists`,
        { name: playlistName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPlaylistMsg("Playlist créée !");
      setPlaylistName("");
      loadPlaylists();
    } catch {
      setPlaylistMsg("Erreur création playlist");
    }
  };

  const ajouterMusiquePlaylist = async (songId) => {
    if (!selectedPlaylist) {
      alert("Sélectionne une playlist");
      return;
    }

    try {
      await axios.post(
        `${HOST}playlists/${selectedPlaylist._id}/songs`,
        { songId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAddSongMsg("Musique ajoutée !");
      loadPlaylistSongs(selectedPlaylist._id);
    } catch {
      setAddSongMsg("Erreur ajout musique");
    }
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
      <div style={{ textAlign: "center", fontSize: "13px", opacity: 0.7 }}>
        Fait par : Yanis, William, Reda, Manassé
      </div>

      <div className="topbar">
        {!user && (
          <button className="topbar-btn" onClick={() => setPage("auth")}>
            Login
          </button>
        )}
        {user && (
          <button className="topbar-btn logout" onClick={logout}>
            Déconnexion
          </button>
        )}
      </div>

      <div className="content">
        <div className="left">
          <h1>Mes playlists</h1>

          {playlists.length === 0 && user && (
            <p style={{ opacity: 0.7 }}>
              Aucune playlist pour <b>{user.name}</b>, crée-en une.
            </p>
          )}

          {playlists.map((p) => (
            <button
              key={p._id}
              style={{
                marginBottom: "10px",
                background:
                  selectedPlaylist?._id === p._id
                    ? "linear-gradient(135deg, #1e50ff, #3a7bff)"
                    : "rgba(255,255,255,0.1)",
              }}
              onClick={() => {
                setSelectedPlaylist(p);
                loadPlaylistSongs(p._id);
              }}
            >
              {p.name}
            </button>
          ))}

          <hr style={{ margin: "25px 0", opacity: 0.2 }} />

          <h1>Créer une playlist</h1>

          <input
            placeholder="Nom de la playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <button onClick={creerPlaylist}>Créer</button>
          {playlistMsg && <p>{playlistMsg}</p>}

          <hr style={{ margin: "25px 0", opacity: 0.2 }} />

          <h1>Recherche musique</h1>

          <input
            placeholder="Tape un nom"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button onClick={chercher}>Chercher</button>
        </div>

        <div className="right">
          {/* PLAYLIST CHOISI*/}
          {selectedPlaylist && (
            <div className="box" style={{ marginBottom: "25px" }}>
              <h3>{selectedPlaylist.name}</h3>

              {playlistSongs.length === 0 && (
                <p style={{ opacity: 0.7 }}>
                  Aucune musique dans cette playlist
                </p>
              )}

              {playlistSongs.map((s) => (
                <p key={s.id}>🎵 {s.name}</p>
              ))}
            </div>
          )}

          {!resultat && (
            <div className="box">
              <b>Aucun résultat</b>
            </div>
          )}

          {Array.isArray(resultat) && (
            <div className="box">
              <h3>Résultats</h3>

              {resultat.map((song) => (
                <div key={song.id} style={{ marginBottom: "16px" }}>
                  <p>
                    <b>{song.name}</b>
                  </p>
                  <p style={{ opacity: 0.7 }}>{song.album}</p>

                  {selectedPlaylist && (
                    <button
                      style={{ marginTop: "8px" }}
                      onClick={() => ajouterMusiquePlaylist(song.id)}
                    >
                      ➕ Ajouter à "{selectedPlaylist.name}"
                    </button>
                  )}
                </div>
              ))}

              {addSongMsg && <p>{addSongMsg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
