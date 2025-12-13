import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./auth";
import GenreChart from "./components/GenreChart";
import Top10 from "./pages/Top10";
import Top10ArtistsPopularity from "./pages/Top10ArtistsPopularity";
import Top10Genres from "./pages/Top10Genres";
import Top10NewestSongs from "./pages/Top10NewestSongs";
import Top10OldestSongs from "./pages/Top10OldestSongs";
import Top10Years from "./pages/Top10Years";
import AddSongFromSpotify from "./pages/AddSongFromSpotify";





function App() {
  const [keyword, setKeyword] = useState("");
  const [resultat, setResultat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistMsg, setPlaylistMsg] = useState("");

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);

  const [page, setPage] = useState("home");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);

  const HOST = import.meta.env.VITE_API_URL;

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
    const res = await axios.get(`${HOST}playlists`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPlaylists(res.data.data);
  };

  const loadPlaylistSongs = async (playlistId) => {
    const res = await axios.get(
      `${HOST}playlists/${playlistId}/songs/details`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setPlaylistSongs(res.data.songs);
  };

  useEffect(() => {
    if (user) loadPlaylists();
  }, [user]);

  const chercher = async (pageNum = 1) => {
    if (!keyword) return alert("Tape au moins quelques lettres");

    setIsLoading(true);
    const res = await axios.get(
      `${HOST}spotify/search?keyword=${keyword}&page=${pageNum}`
    );

    if (res.data.songs?.length) {
      setResultat(res.data.songs);
      setCurrentPage(pageNum);
    } else {
      setResultat(null);
    }

    setIsLoading(false);
  };

  const creerPlaylist = async () => {
    if (!playlistName) return alert("Entre un nom de playlist");

    await axios.post(
      `${HOST}playlists`,
      { name: playlistName },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    setPlaylistMsg("Playlist créée !");
    setPlaylistName("");
    loadPlaylists();
  };

  const supprimerPlaylist = async () => {
    if (!selectedPlaylist) return;

    await axios.delete(`${HOST}playlists/${selectedPlaylist._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setSelectedPlaylist(null);
    setPlaylistSongs([]);
    loadPlaylists();
  };

  const ajouterMusiquePlaylist = async (songId) => {
    if (!selectedPlaylist) return alert("Sélectionne une playlist");

    await axios.post(
      `${HOST}playlists/${selectedPlaylist._id}/songs`,
      { songId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    loadPlaylistSongs(selectedPlaylist._id);
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
  if (page === "top10") {
  return <Top10 goBack={() => setPage("home")} />;
}
if (page === "top10-artists") {
  return <Top10ArtistsPopularity onBack={() => setPage("home")} />;
}

if (page === "top10-genres") {
  return <Top10Genres onBack={() => setPage("home")} />;
}
if (page === "top10-newest") {
  return <Top10NewestSongs onBack={() => setPage("home")} />;
}

if (page === "top10-oldest") {
  return <Top10OldestSongs onBack={() => setPage("home")} />;
}

if (page === "top10-years") {
  return <Top10Years onBack={() => setPage("home")} />;
}
if (page === "add-song") {
  return <AddSongFromSpotify onBack={() => setPage("home")} />;
}




  return (
    
    <div className="page">
      
      <div className="topbar">


        
        {!user ? (
          <button className="topbar-btn" onClick={() => setPage("auth")}>
            Login
          </button>
        ) : (
          <button className="topbar-btn logout" onClick={logout}>
            Déconnexion
          </button>
        )}
      </div>
      

      <div className="content">
        <div className="left">
          
          <h1>Mes playlists</h1>

          <div className="playlist-grid">
            {playlists.map((p) => (
              <div
                key={p._id}
                className={`playlist-card ${
                  selectedPlaylist?._id === p._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedPlaylist(p);
                  loadPlaylistSongs(p._id);
                }}
              >
                <img
                  src="src/assets/huhh_playlist.png"
                  alt="playlist"
                  className="playlist-img"
                />
                <div className="playlist-title">{p.name}</div>
              </div>
            ))}
          </div>
          <button
  className="topbar-btn"
  onClick={() => setPage("add-song")}
>
  + Ajouter musique
</button>


          <h1>Créer une playlist</h1>
          <input
            placeholder="Nom de la playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button onClick={creerPlaylist}>Créer</button>
          {playlistMsg && <p>{playlistMsg}</p>}

          <h1>Recherche musique</h1>
          <input
            placeholder="Tape un nom"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={() => chercher()}>Chercher</button>
        </div>


        <div className="right">
          <div className="box">
            <h3>Genres</h3>
            <GenreChart />
          </div>

          {selectedPlaylist && (
            <div className="box">
              <h3>{selectedPlaylist.name}</h3>
              <button className="danger" onClick={supprimerPlaylist}>
                Supprimer la playlist
              </button>
              {playlistSongs.map((s) => (
                <p key={s._id}>🎵 {s.name}</p>
              ))}
            </div>
          )}
                  <button className="topbar-btn" onClick={() => setPage("top10")}>
    Top 10 musiques 
  </button>
  <button onClick={() => setPage("top10-artists")}>Top 10 artistes</button>
<button onClick={() => setPage("top10-genres")}>Top 10 genres</button>
<button onClick={() => setPage("top10-newest")}>Top 10 récentes</button>
<button onClick={() => setPage("top10-oldest")}>Top 10 anciennes</button>
<button onClick={() => setPage("top10-years")}>Top 10 années</button>

          {resultat && !isLoading && (
            <div className="box">
              <h3>Résultats</h3>
              {resultat.map((song) => (
                <div key={song._id} className="song-row">
                  <b>{song.name}</b>
                  <button
                    onClick={() => ajouterMusiquePlaylist(song._id)}
                  >
                    Ajouter
                  </button>
                  
                </div>
              ))}
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
