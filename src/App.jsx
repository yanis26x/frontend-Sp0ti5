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
    // seulement artiste toutes ses musiques
    if (!musique && artiste) {
      try {
        const res = await axios.get(
          `${HOST}spotify/songs/${artiste}`
        );
        setResultat(res.data.data); 
        setAddSongMsg("");
        return;
      } catch (err) {
        alert("Erreur récupération musiques de l'artiste");
        return;
      }
    }

    //recherche normale
    if (!musique) {
      alert("Remplis au moins le nom de la musique ou de l'artiste !");
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
      alert("Erreur ou musique introuvable");
    }
  };

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
    if (!selectedPlaylist) return alert("Choisis une playlist");

    try {
      await axios.post(
        `${HOST}playlists/${selectedPlaylist}/songs`,
        { songId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAddSongMsg("Musique ajoutée !");
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
          <h1>Chercher une musique/artiste</h1>

          <input
            placeholder="Nom de la musique"
            value={musique}
            onChange={(e) => setMusique(e.target.value)}
          />

          <input
            placeholder="Nom de l'artiste"
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


        <div className="right">
          {!resultat && (
            <div className="box">
              <b>Aucun résultat</b>
            </div>
          )}

          {Array.isArray(resultat) && (
            <div className="box">
              <h3>Musiques de {artiste}</h3>

              {resultat.map((song) => (
                <div key={song.id} style={{ marginBottom: "15px" }}>
                  <p><b>{song.name}</b></p>
                  <p style={{ opacity: 0.7 }}>{song.album}</p>

                  <select
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                  >
                    <option value="">-- Playlist --</option>
                    {playlists.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <button
                    style={{ marginTop: "8px" }}
                    onClick={() => ajouterMusiquePlaylist(song.id)}
                  >
                    ➕ Ajouter
                  </button>
                </div>
              ))}

              {addSongMsg && <p>{addSongMsg}</p>}
            </div>
          )}

 
          {resultat && !Array.isArray(resultat) && (
            <div className="box">
              <p><b>Nom :</b> {resultat.name}</p>
              <p><b>Album :</b> {resultat.album}</p>

              <select
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
              >
                <option value="">-- Playlist --</option>
                {playlists.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                style={{ marginTop: "10px" }}
                onClick={() => ajouterMusiquePlaylist(resultat.id)}
              >
                ➕ Ajouter à la playlist
              </button>

              {addSongMsg && <p>{addSongMsg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
