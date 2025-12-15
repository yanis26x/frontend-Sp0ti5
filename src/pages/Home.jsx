import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

const GENRES = [
  { id: 1, genre: "Hyperpop", name: "Top 50 des Chansons Hyperpop" },
  { id: 2, genre: "R&B", name: "Top 50 des Chansons R&B" },
  { id: 3, genre: "Pop", name: "Top 50 des Chansons Pop" },
  { id: 4, genre: "Bedroom pop", name: "Top 50 des Chansons Bedroom pop" },
  { id: 5, genre: "French rap", name: "Top 50 des Chansons French rap" },
  { id: 6, genre: "Rap", name: "Top 50 des Chansons Rap" },
  { id: 7, genre: "Pop urbaine", name: "Top 50 des Chansons Pop urbaine" },
  { id: 8, genre: "Indie rock", name: "Top 50 des Chansons Indie rock" },
  { id: 9, genre: "Rage rap", name: "Top 50 des Chansons Rage rap" },
  { id: 10, genre: "Alternative rock", name: "Top 50 des Chansons Alternative rock" },
  { id: 11, genre: "Japanese indie", name: "Top 50 des Chansons Japanese indie" }
];

function Home({ onNavigate, user, currentPage }) {
  const [playlists, setPlaylists] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        const requests = GENRES.map(genre => 
          axios.get(`${HOST}autoplaylist/genre/${encodeURIComponent(genre.genre)}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const responses = await Promise.all(requests);
        const playlistsData = responses.reduce((acc, response, index) => {
          return {
            ...acc,
            [index + 1]: {
              ...response.data,
              name: GENRES[index].name
            }
          };
        }, {});

        setPlaylists(playlistsData);
      } catch (err) {
        console.error('Error fetching playlists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPlaylists();
  }, [HOST]);

  if (isLoading) {
    return <div className="loading">Chargement des playlists...</div>;
  }

  return (
    <div className="home-layout">
      <Sidebar onNavigate={onNavigate} currentPage={currentPage} />
      <div className="home-main-content">
        <h1>Voici quelques playlists populaires!</h1>
        <div className="playlist-grid">
          {Object.values(playlists).map((playlist, index) => (
            <div key={index} className="playlist-card">
              <div className="playlist-image">
                <img
                  src={new URL("../assets/huhh_playlist.png", import.meta.url).href}
                  alt={playlist.name}
                  className="playlist-thumbnail"
                />
              </div>
              <div className="playlist-info">
                <p>{playlist.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
