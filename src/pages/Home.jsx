import { useState } from "react";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function Home({ onNavigate, user, currentPage }) {
  const [popularPlaylists] = useState([
    { id: 1, genre: "pop", icon: "⭐" },
    { id: 2, genre: "hiphop", icon: "🪐" },
    { id: 3, genre: "rock/np", icon: "👍" },
  ]);

  return (
    <>
      <h1>Voici quelques playlists populaires!</h1>

      <div className="home-playlist-cards">
        {popularPlaylists.map((playlist) => (
          <div key={playlist.id} className="home-playlist-card">
            <div className="home-playlist-icon">{playlist.icon}</div>
            <div className="home-playlist-genre">genre/{playlist.genre}</div>
          </div>
        ))}
      </div>

      {!user && (
        <center>
          <div className="home-placeholder" style={{ fontSize: "30px" }}>
            CONNECTEZ VOUS!
          </div>
          <button
            className="home-auth-btn"
            onClick={() => onNavigate("login")}
            style={{
              padding: "2px 0px 0px 0px",
              width: "60px",
              fontSize: "30px",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <span>
              <i className="bx bx-arrow-in-right-square-half"></i>
            </span>
          </button>
        </center>
      )}
    </>
  );
}

export default Home;
