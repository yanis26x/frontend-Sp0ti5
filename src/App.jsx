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

  const chercher = async () => {
    if (!musique) {
      alert("Remplis au moins le nom de la musique !");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("name", musique);

      // artiste OPTIONNEL
      if (artiste.trim() !== "") {
        params.append("artist", artiste);
      }

      const res = await axios.get(
        `${HOST}spotify/search-song?${params.toString()}`
      );

      setResultat(res.data.data);
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

      setPlaylistMsg("Playlist créée avec succès !");
      setPlaylistName("");
    } catch (err) {
      setPlaylistMsg("Erreur lors de la création de la playlist");
    }
  };

  // Page login/register
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
      <div
        style={{
          textAlign: "center",
          fontSize: "13px",
          opacity: 0.7,
          marginBottom: "14px",
        }}
      >
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
          <h1>Chercher une musique !</h1>

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

          <div className="prFaireVite">
            <button
              onClick={() => {
                setMusique("God's Plan");
                setArtiste("Drake");
              }}
            >
              Auto remplir : God's Plan / Drake
            </button>
          </div>

          <hr style={{ margin: "30px 0", opacity: 0.2 }} />

          <h1>Créer une playlist</h1>

          <input
            placeholder="Nom de la playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <button onClick={creerPlaylist}>Créer la playlist</button>

          {playlistMsg && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              {playlistMsg}
            </p>
          )}
        </div>

        <div className="right">
          {!resultat && (
            <div className="box">
              <p>
                <b>Aucun résultat</b>
              </p>
              <p>Recherche une musique pour afficher les infos ici !</p>
            </div>
          )}

          {resultat && (
            <div className="box">
              <p>
                <b>Nom :</b> {resultat.name}
              </p>

              {artiste && (
                <p>
                  <b>Artiste :</b> {artiste}
                </p>
              )}

              <p>
                <b>Album :</b> {resultat.album}
              </p>

              <p>
                <b>Popularité :</b> {resultat.popularity}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
