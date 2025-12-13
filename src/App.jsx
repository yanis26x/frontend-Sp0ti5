import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./auth";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [keyword, setKeyword] = useState("");
  const [resultat, setResultat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistMsg, setPlaylistMsg] = useState("");

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);

  const [addSongMsg, setAddSongMsg] = useState("");

  const [page, setPage] = useState("home");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);

  const [genreStats, setGenreStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

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
    try {
      const res = await axios.get(`${HOST}playlists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists(res.data.data);
    } catch {}
  };

  const loadPlaylistSongs = async (playlistId) => {
    try {
      const res = await axios.get(`${HOST}playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylistSongs(res.data.songs || []);
    } catch {}
  };

  useEffect(() => {
    if (user) loadPlaylists();
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

      if (res.data.songs && res.data.songs.length > 0) {
        setResultat(res.data.songs);
        setCurrentPage(pageNum);
        setHasNextPage(res.data.pagination.hasNextPage);
        setHasPreviousPage(res.data.pagination.hasPreviousPage);
      } else {
        setResultat(null);
      }
    } catch {
    } finally {
      setIsLoading(false);
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

  const supprimerPlaylist = async () => {
    if (!selectedPlaylist) return;

    try {
      await axios.delete(`${HOST}playlists/${selectedPlaylist._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSelectedPlaylist(null);
      setPlaylistSongs([]);
      loadPlaylists();
    } catch {}
  };

  const ajouterMusiquePlaylist = async (songId) => {
    if (!selectedPlaylist) {
      alert("Sélectionne une playlist");
      return;
    }

    try {
      await axios.post(
        `${HOST}playlists/${selectedPlaylist._id}/songs`,
        { songId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAddSongMsg("Musique ajoutée !");
      loadPlaylistSongs(selectedPlaylist._id);
    } catch {
      setAddSongMsg("Erreur ajout musique");
    }
  };

  const loadGenreStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await axios.get(`${HOST}topstats/genres`);
      setGenreStats(res.data);
    } catch {
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadGenreStats();
  }, []);

  let chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#1e50ff",
          "#3a7bff",
          "#00c2ff",
          "#7c4dff",
          "#ff4d4d",
          "#00ff9d",
          "#ffd84d",
        ],
        borderWidth: 0,
      },
    ],
  };

  if (genreStats) {
    if (Array.isArray(genreStats)) {
      chartData.labels = genreStats.map((g) => g.genre);
      chartData.datasets[0].data = genreStats.map((g) => g.count);
    } else {
      chartData.labels = Object.keys(genreStats);
      chartData.datasets[0].data = Object.values(genreStats);
    }
  }

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
          <h1>Mes playlists</h1>

          {playlists.length === 0 && user && (
            <p style={{ opacity: 0.7 }}>
              Aucune playlist pour <b>{user.name}</b>, crée-en une.
            </p>
          )}

          {playlists.map((p) => (
            <button
              key={p._id}
              style={{
                marginBottom: "10px",
                background:
                  selectedPlaylist?._id === p._id
                    ? "linear-gradient(135deg, #1e50ff, #3a7bff)"
                    : "rgba(255,255,255,0.1)",
              }}
              onClick={() => {
                setSelectedPlaylist(p);
                loadPlaylistSongs(p._id);
              }}
            >
              {p.name}
            </button>
          ))}

          <hr style={{ margin: "25px 0", opacity: 0.2 }} />

          <h1>Créer une playlist</h1>

          <input
            placeholder="Nom de la playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <button onClick={creerPlaylist}>Créer</button>
          {playlistMsg && <p>{playlistMsg}</p>}

          <hr style={{ margin: "25px 0", opacity: 0.2 }} />

          <h1>Recherche musique</h1>

          <input
            placeholder="Tape un nom"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button onClick={() => chercher()}>Chercher</button>
        </div>

        <div className="right">
          <div
            className="box"
            style={{ marginBottom: "25px", height: "260px" }}
          >
            <h3>Répartition des musiques par genre</h3>

            {isLoadingStats && <p>Chargement...</p>}

            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "white" },
                  },
                },
              }}
            />

            {chartData.labels.length === 0 && (
              <p style={{ opacity: 0.6, marginTop: "10px" }}>
                Aucune donnée disponible pour le moment
              </p>
            )}
          </div>

          {selectedPlaylist && (
            <div className="box" style={{ marginBottom: "25px" }}>
              <h3>{selectedPlaylist.name}</h3>

              <button
                style={{
                  marginBottom: "15px",
                  background: "rgba(255,80,80,0.25)",
                }}
                onClick={supprimerPlaylist}
              >
                🗑 Supprimer la playlist
              </button>

              {playlistSongs.length === 0 && (
                <p style={{ opacity: 0.7 }}>
                  Aucune musique dans cette playlist
                </p>
              )}

              {playlistSongs.map((s) => (
                <p key={s._id}>!musi1ue! {s.name}</p>
              ))}
            </div>
          )}

          {(!resultat || resultat == null) && (
            <div className="box">
              <b>Aucun résultat</b>
            </div>
          )}

          {isLoading && (
            <div className="box">
              <b>Chargement...</b>
            </div>
          )}

          {resultat && !isLoading && (
            <div className="box">
              <h3>Résultats</h3>

              {resultat.map((song) => (
                <div key={song._id} style={{ marginBottom: "16px" }}>
                  <p><b>{song.name}</b></p>
                  <p style={{ opacity: 0.7 }}>{song.album}</p>

                  {selectedPlaylist && (
                    <button
                      style={{ marginTop: "8px" }}
                      onClick={() => ajouterMusiquePlaylist(song._id)}
                    >
                      ➕ Ajouter à "{selectedPlaylist.name}"
                    </button>
                  )}
                </div>
              ))}

              {hasPreviousPage ? (
                <button onClick={() => chercher(currentPage - 1)}>Previous</button>
              ) : (
                <button className="disabledButton">Previous</button>
              )}

              {hasNextPage ? (
                <button onClick={() => chercher(currentPage + 1)}>Next</button>
              ) : (
                <button className="disabledButton">Next</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
