import { useState, useEffect } from "react";
import SongListItem from "../components/SongListItem";
import Pagination from "../components/Pagination";
import PlaylistSelect from "../components/PlaylistSelect";
import axios from "axios";
import "../App.css";
import "./Home.css";

function SearchArtists({ onNavigate, user, currentPage: currentRoute }) {
  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const HOST = import.meta.env.VITE_API_URL;

  const loadPlaylists = async () => {
    try {
      const res = await axios.get(`${HOST}playlists`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPlaylists(res.data.data);
    } catch (err) {
      console.error("Error loading playlists", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const addSongToPlaylist = async (songId) => {
    if (!selectedPlaylistId) {
      alert("Sélectionne une playlist");
      return;
    }

    try {
      await axios.post(
        `${HOST}playlists/${selectedPlaylistId}/songs`,
        { songId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Musique ajoutée à la playlist !");
    } catch (err) {
      console.error("Error adding song to playlist", err);
      alert("Erreur lors de l'ajout");
    }
  };

  const searchSongs = async (pageNum = 1) => {
    if (!artist) {
      setMessage("Entre le nom de l'artiste");
      return;
    }

    setLoading(true);
    setMessage("");
    setSongs([]);
    setCurrentPage(pageNum);

    try {
      const res = await axios.get(
        `${HOST}spotify/songs/${artist}?page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      let fetchedSongs = res.data.data || [];
      let fetchedArtistInfo = res.data.artist.name || "";

      if (songName) {
        fetchedSongs = fetchedSongs.filter((s) =>
          s.name.toLowerCase().includes(songName.toLowerCase())
        );
      }

      if (fetchedSongs.length === 0) {
        setMessage("Aucune musique trouvée");
      }

      setSongs(fetchedSongs);
      setArtistName(fetchedArtistInfo);
      setHasNextPage(res.data.pagination.hasNextPage);
    } catch (err) {
      console.error("Erreur appel Spotify", err);
      setMessage("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Rechercher un artiste</h1>

      <div className="search-container">
        <input
          className="search-input"
          placeholder="Nom de l'artiste"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchSongs()}
        />
        <button className="search-button" onClick={() => searchSongs(1)}>
          <i className="bx bx-search"></i>
        </button>
      </div>
      
      {artist && (
        <div className="search-container" style={{ marginTop: '10px' }}>
          <input
            className="search-input"
            placeholder="Filtrer par titre de musique (optionnel)"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchSongs()}
          />
        </div>
      )}

      {loading && <p>Chargement...</p>}
      {message && <p>{message}</p>}

      {songs.length > 0 && (
        <div className="box" style={{ marginTop: 25 }}>
          {user && (
            <PlaylistSelect 
              playlists={playlists}
              selectedPlaylistId={selectedPlaylistId}
              onPlaylistChange={setSelectedPlaylistId}
            />
          )}
          {songs.map((song) => (
            <SongListItem
              key={song._id}
              song={song}
              onButtonClick={user ? addSongToPlaylist : null}
              buttonIcon="bx-plus-circle"
              artistName={artistName}
            />
          ))}

          <Pagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            onPageChange={(page) => searchSongs(page)}
          />
        </div>
      )}
    </>
  );
}

export default SearchArtists;
