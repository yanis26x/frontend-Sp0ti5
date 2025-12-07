import { useState } from "react";
import axios from "axios";
import "./App.css";
import BloodFullscreen from "./assets/Sang2.png";

function App() {
  const [musique, setMusique] = useState("");
  const [artiste, setArtiste] = useState("");
  const [resultat, setResultat] = useState(null);

  const chercher = async () => {
    if (!musique || !artiste) {
      alert("REMPLIS LES CHAMPS !!");
      return;
    }

    setResultat(null);

    try {
      const res = await axios.get("http://localhost:4000/spotify/search-song", {
        params: { name: musique, artist: artiste },
      });

      if (res.data && res.data.data) {
        setResultat(res.data.data);
      }
    } catch (err) {
      alert("Erreur ou musique introuvable");
    }
  };

  return (
    <div className="page">

      <h1>Chercher musique</h1>

      <input
        placeholder="Nom musique"
        value={musique}
        onChange={(e) => setMusique(e.target.value)}
      />

      <input
        placeholder="Nom artiste"
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
    </div>
  );
}

export default App;
