import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./auth";

function App() {
  const [musique, setMusique] = useState("");
  const [artiste, setArtiste] = useState("");
  const [resultat, setResultat] = useState(null);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistMsg, setPlaylistMsg] = useState("");

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
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

  // 🔥 Charger les playlists
  const loadPlaylists = async () => {
    try {
      const res = await axios.get(`${HOST}playlists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPlaylists(res.data);
    } catch (err) {
      console.error("Erreur chargement playlists");
    }
  };

  useEffect(() => {
    if (user) loadPlaylists();
  }, [user]);

  const chercher = async () => {
    if (!musique) {
      alert("Remplis au moins le nom de la musique !");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("name", musique);

      if (artiste.trim() !== "") {
        params.append("artist", artiste);
      }

      const res = await axios.get(
        `${HOST}spotify/search-song?${params.toString()}`
      );

      setResultat(res.data.data);
      setAddSongMsg("");
    } catch (err) {
      alert("Erreur ou musique introuvable..");
    }
  };

  const creerPlaylist = async () => {
    if (!playlistName) {
      alert("Entre un nom de playlist !");
      return;
    }

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
    } catch (err) {
      setPlaylistMsg("Erreur création playlist");
    }
  };

  const ajouterMusiquePlaylist = async () => {
    if (!selectedPlaylist) {
      alert("Choisis une playlist !");
      return;
    }

    if (!resultat?.id) {
      alert("Aucune musique sélectionnée");
      return;
    }

    try {
      await axios.post(
        `${HOST}playlists/${selectedPlaylist}/songs`,
        { songId: resultat.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAddSongMsg("Musique ajoutée à la playlist !");
    } catch (err) {
      setAddSongMsg("Erreur ajout musique");
    }
  };

  // AUTH
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
        {/* GAUCHE */}
        <div className="left">
          <h1>Chercher une musique</h1>

          <input
            placeholder="Nom de la musique"
            value={musique}
            onChange={(e) => setMusique(e.target.value)}
          />

          <input
            placeholder="Nom de l'artiste (optionnel)"
            value={artiste}
            onChange={(e) => setArtiste(e.target.value)}
          />

          <button onClick={chercher}>Chercher</button>

          <hr style={{ margin: "30px 0", opacity: 0.2 }} />

          <h1>Créer une playlist</h1>

          <input
            placeholder="Nom de la playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <button onClick={creerPlaylist}>Créer</button>

          {playlistMsg && <p>{playlistMsg}</p>}
        </div>

        {/* DROITE */}
        <div className="right">
          {!resultat && (
            <div className="box">
              <p><b>Aucun résultat</b></p>
            </div>
          )}

          {resultat && (
            <div className="box">
              <p><b>Nom :</b> {resultat.name}</p>
              {artiste && <p><b>Artiste :</b> {artiste}</p>}
              <p><b>Album :</b> {resultat.album}</p>

              <hr style={{ margin: "20px 0", opacity: 0.2 }} />

              <select
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px" }}
              >
                <option value="">-- Choisir une playlist --</option>
                {playlists.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                style={{ marginTop: "15px" }}
                onClick={ajouterMusiquePlaylist}
              >
                ➕ Ajouter à la playlist
              </button>

              {addSongMsg && <p style={{ marginTop: "10px" }}>{addSongMsg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
