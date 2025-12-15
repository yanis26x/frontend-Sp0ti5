import { useState, useEffect } from "react";
import SongListItem from "../components/SongListItem";
import Pagination from "../components/Pagination";
import PlaylistSelect from "../components/PlaylistSelect";
import axios from "axios";
import "../App.css";
import "./Home.css";

function SearchSongs({ onNavigate, user, currentPage: currentRoute }) {
  const [keyword, setKeyword] = useState("");
  const [resultat, setResultat] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const HOST = import.meta.env.VITE_API_URL;

  // Load playlists for adding songs
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

  // Load playlists when user is logged in
  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const chercher = async (pageNum = 1) => {
    if (!keyword) {
      alert("Tape au moins quelques lettres");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${HOST}spotify/search?keyword=${keyword}&page=${pageNum}`
      );

      if (res.data.songs?.length) {
        setResultat(res.data.songs);
        console.log(resultat);
        setCurrentPage(pageNum);
        setHasNextPage(res.data.pagination.hasNextPage);
      } else {
        setResultat(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResultat([]); // Set empty array to trigger the "Aucune musique trouvée" message
      } else {
        alert("Erreur lors de la recherche");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ajouterMusiquePlaylist = async (songId) => {
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

  return (
    <>
      <h1>Recherche musique</h1>

      <input
        placeholder="Tape un nom"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && chercher()}
      />

      <button onClick={() => chercher()}>Chercher</button>

      {isLoading && <p>Chargement...</p>}

      {resultat !== null && !isLoading && (
        <div className="box" style={{ marginTop: 25 }}>
          <h3>Résultats</h3>
          {resultat.length === 0 ? (
            <p>Aucune musique trouvée avec le mot "{keyword}"</p>
          ) : (
            <>
              {user && (
                <PlaylistSelect 
                  playlists={playlists}
                  selectedPlaylistId={selectedPlaylistId}
                  onPlaylistChange={setSelectedPlaylistId}
                />
              )}
              {resultat.map((song) => (
                <SongListItem
                  key={song._id}
                  song={song}
                  onButtonClick={user ? ajouterMusiquePlaylist : null}
                  buttonIcon="bx-plus-circle"
                />
              ))}
              
              <Pagination
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                onPageChange={(page) => chercher(page)}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default SearchSongs;
