import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./auth";

function App() {
  const [musique, setMusique] = useState("");
  const [artiste, setArtiste] = useState("");
  const [resultat, setResultat] = useState(null);
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
    if (!musique || !artiste) {
      alert("Remplis les champs !");
      return;
    }

    try {
      const res = await axios.get(
        `${HOST}spotify/search-song?name=${musique}&artist=${artiste}`
      );
      setResultat(res.data.data);
    } catch (err) {
      alert("Erreur ou musique introuvable..");
    }
  };

  // Login 
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

      <div style={{
        textAlign: "center",
        fontSize: "13px",
        opacity: 0.7,
        marginBottom: "14px"
      }}>
        Fait par : Yanis, William, Reda, Manassé
      </div>

      {/* topbar */}
      <div className="topbar">
        
        {!user && (
          <button
            className="topbar-btn"
            onClick={() => setPage("auth")}>
            Login
          </button>
        )}

        {user && (
          <button
            className="topbar-btn logout"
            onClick={logout}
          >
            Déconnexion
          </button>
        )}
      </div>

      {/* 2 collonne */}
      <div className="content">

        <div className="left">
          <h1>Chercher une musique</h1>

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
        </div>

        <div className="right">
          {!resultat && (
            <div className="box">
              <p><b>Aucun résultat</b></p>
              <p>Recherche une musique pour afficher les infos ici!</p>
            </div>
          )}

          {resultat && (
            <div className="box">
              <p><b>Nom :</b> {resultat.name}</p>
              <p><b>Artiste :</b> {artiste}</p>
              <p><b>Album :</b> {resultat.album}</p>
              <p><b>Popularité :</b> {resultat.popularity}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
