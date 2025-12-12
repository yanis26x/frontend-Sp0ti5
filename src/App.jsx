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
    try {
      // ============================
      //     COMME ICI STRUCTURE
      // ============================
      const res = await axios.get(
        `${HOST}spotify/search-song?name=${musique}&artist=${artiste}`
      );
      // ============================

      setResultat(res.data.data);
    } catch (err) {
      alert("Erreur ou musique introuvable..");
    }
  };

  // ==== PAGE AUTH ====
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

  // ==== PAGE HOME ====
  return (
    <div className="page">

      {/* Message bienvenue */}


      {/* LOGIN / LOGOUT */}
      {!user && (
        <button className="login-btn" onClick={() => setPage("auth")}>
          Login
        </button>
      )}

      {user && (
        <button className="logout-btn" onClick={logout}>
          Se déconnecter
        </button>
      )}

      {/* Titre */}
      <h1>Chercher une musique !</h1>

      {/* Inputs */}
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

      {/* Bouton chercher */}
      <button onClick={chercher}>Chercher</button>

      {/* Résultat */}
      {resultat && (
        <div className="box">
          <p>Nom : {resultat.name}</p>
          <p>Album : {resultat.album}</p>
          <p>Popularité : {resultat.popularity}</p>
        </div>
      )}

      {/* pr faire vite !! */}
      <div className="prFaireVite">
        <button
          onClick={() => {
            setMusique("God's Plan");
            setArtiste("Drake");
          }}
        >
          Auto remplir God's Plan / Drake
        </button>
      </div>

    </div>
  );
}

export default App;
