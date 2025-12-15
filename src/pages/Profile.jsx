import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function Profile({ onNavigate, user, onLogout, currentPage }) {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const HOST = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setUserStats({
        playlistsCount: 0,
        songsCount: 0,
      });
    } catch (err) {
      console.error("Error loading user stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      onNavigate("home");
    }
  };

  if (!user) {
    return (
      <div className="page">
        <p>Vous devez être connecté pour voir votre profil</p>
        <button onClick={() => onNavigate("login")}>Se connecter</button>
      </div>
    );
  }

  return (
    <>
        <h1>Mon Profil</h1>

          <div className="box" style={{ marginBottom: 20 }}>
            <h3>Informations</h3>
            <p><strong>Nom:</strong> {user.name || "N/A"}</p>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
          </div>

          <div className="box">
            <h3>Statistiques</h3>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <>
                <p>Nombre de playlists: {userStats?.playlistsCount || 0}</p>
                <p>Nombre de musiques: {userStats?.songsCount || 0}</p>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 30,
              background: "rgba(255, 80, 80, 0.25)",
            }}
          >
            Se déconnecter
          </button>
      </>
  );
}

export default Profile;
