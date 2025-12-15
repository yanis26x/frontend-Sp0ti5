import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import SearchSongs from "./pages/SearchSongs";
import SearchArtists from "./pages/SearchArtists";
import AllPlaylists from "./pages/AllPlaylists";
import PlaylistDetails from "./pages/PlaylistDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Charts from "./pages/Charts";

function App() {
  const [page, setPage] = useState("home");
  const [playlistId, setPlaylistId] = useState(null);
  const [user, setUser] = useState(null);
  const [navHistory, setNavHistory] = useState(["home"]);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleNavigate = (pageName, ...args) => {
    setNavHistory(prev => {
      if (prev[prev.length - 1] !== pageName) {
        return [...prev, pageName];
      }
      return prev;
    });
    
    setPage(pageName);
    if (args.length > 0 && args[0]) {
      setPlaylistId(args[0]);
    } else {
      setPlaylistId(null);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  const handleGoBack = () => {
    setNavHistory(prev => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, -1);
        const previousPage = newHistory[newHistory.length - 1];
        setPage(previousPage);
        return newHistory;
      }
      return prev;
    });
  };

  const renderPage = () => {
    if (!user) {
      return page === "login" ? (
        <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
      ) : (
        <SignUp onSignUpSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
      );
    }

    switch (page) {
      case "home":
        return <Home user={user} onNavigate={handleNavigate} currentPage={page} />;
      case "search-songs":
        return <SearchSongs user={user} onNavigate={handleNavigate} currentPage={page} />;
      case "search-artists":
        return <SearchArtists user={user} onNavigate={handleNavigate} currentPage={page} />;
      case "all-playlists":
        return <AllPlaylists user={user} onNavigate={handleNavigate} currentPage={page} />;
      case "playlist-details":
        return (
          <PlaylistDetails
            user={user}
            onNavigate={handleNavigate}
            playlistId={playlistId}
            currentPage={page}
          />
        );
      case "profile":
        return <Profile user={user} onNavigate={handleNavigate} onLogout={handleLogout} currentPage={page} />;
      case "charts":
        return <Charts user={user} onNavigate={handleNavigate} currentPage={page} />;
      default:
        return <Home user={user} onNavigate={handleNavigate} currentPage={page} />;
    }
  };

  return (
    <div className="app-container">
      <div className="page">
        <Sidebar 
          onNavigate={handleNavigate} 
          onGoBack={handleGoBack}
          user={user} 
          currentPage={page} 
          onLogout={handleLogout}
        />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
