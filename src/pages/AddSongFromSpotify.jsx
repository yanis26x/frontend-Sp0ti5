import { useState } from "react";
import axios from "axios";

function AddSongFromSpotify({ onBack }) {
  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const HOST = import.meta.env.VITE_API_URL;

  const searchSongs = async () => {
    if (!artist) {
      setMessage("Entre le nom de l’artiste");
      return;
    }

    setLoading(true);
    setMessage("");
    setSongs([]);

    try {
      const res = await axios.get(
        `${HOST}spotify/${artist}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let fetchedSongs = res.data.data || [];

   
      if (songName) {
        fetchedSongs = fetchedSongs.filter((s) =>
          s.name.toLowerCase().includes(songName.toLowerCase())
        );
      }

      if (fetchedSongs.length === 0) {
        setMessage("Aucune musique trouvée");
      }

      setSongs(fetchedSongs);
    } catch (err) {
      setMessage("Erreur appel Spotify");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button className="topbar-btn" onClick={onBack}>
        ← Retour
      </button>

      <h1 style={{ marginTop: 20 }}>
        Ajouter une musique depuis Spotify
      </h1>

      <input
        placeholder="Nom de l’artiste"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />

      <input
        placeholder="Nom de la musique (optionnel)"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />

      <button onClick={searchSongs}>
        Chercher
      </button>

      {loading && <p>Chargement...</p>}
      {message && <p>{message}</p>}

      <div className="box" style={{ marginTop: 25 }}>
        {songs.map((song) => (
          <div
            key={song._id}
            style={{
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <b>{song.name}</b>
            <p style={{ opacity: 0.7 }}>
              {song.album}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddSongFromSpotify;
