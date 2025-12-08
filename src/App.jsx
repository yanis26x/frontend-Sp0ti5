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
      const res = await axios.get("http://localhost:4000/spotify/search-song", {
        params: { name: musique, artist: artiste },
      });

      setResultat(res.data.data);
    } catch {
      alert("Erreur ou musique introuvable..");
    }
  };

  if (page === "auth")
    return (
      <Auth
        goHome={() => {
          setPage("home");
          const storedUser = localStorage.getItem("user");
          if (storedUser) setUser(JSON.parse(storedUser));
        }}
      />
    );

  return (
    <div className="page">

    <p className="welcome">
  {user ? `Bienvenue, ${user.name} 👋` : "Bienvenue !"}
</p>


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


      {!user && (
        <button className="login-btn" onClick={() => setPage("auth")}>
          Login
        </button>
      )}

      <h1>Chercher musique</h1>

      <input
        placeholder="Nom 2 la musique"
        value={musique}
        onChange={(e) => setMusique(e.target.value)}
      />

      <input
        placeholder="Nom 2 l'artiste"
        value={artiste}
        onChange={(e) => setArtiste(e.target.value)}
      />

      <button onClick={chercher}>chercher</button>

      {resultat && (
        <div className="box">
          <p>Nom : {resultat.name}</p>
          <p>Album : {resultat.album}</p>
          <p>Popularité : {resultat.popularity}</p>
        </div>
      )}

      <div className="quick-tests">
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
