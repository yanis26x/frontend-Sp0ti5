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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleNavigate = (pageName, ...args) => {
    // Update navigation history
    setNavHistory(prev => {
      // Don't add the same page multiple times in a row
      if (prev[prev.length - 1] !== pageName) {
        return [...prev, pageName];
      }
      return prev;
    });
    
    setPage(pageName);
    // Handle playlist ID if provided as second argument
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
        // Remove current page from history
        const newHistory = prev.slice(0, -1);
        // Navigate to previous page
        const previousPage = newHistory[newHistory.length - 1];
        setPage(previousPage);
        return newHistory;
      }
      return prev;
    });
  };

  const renderPageContent = () => {
    switch (page) {
      case "home":
        return <Home onNavigate={handleNavigate} user={user} currentPage={page} />;
      case "search-songs":
        return <SearchSongs onNavigate={handleNavigate} user={user} currentPage={page} />;
      case "search-artists":
        return <SearchArtists onNavigate={handleNavigate} user={user} currentPage={page} />;
      case "all-playlists":
        return <AllPlaylists onNavigate={handleNavigate} user={user} currentPage={page} />;
      case "playlist-details":
        return (
          <PlaylistDetails
            onNavigate={handleNavigate}
            playlistId={playlistId}
            user={user}
            currentPage={page}
          />
        );
      case "login":
        return <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} currentPage={page} />;
      case "signup":
        return <SignUp onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} currentPage={page} />;
      case "profile":
        return <Profile onNavigate={handleNavigate} user={user} onLogout={handleLogout} currentPage={page} />;
      case "charts":
        return <Charts onNavigate={handleNavigate} user={user} currentPage={page} />;
      default:
        return <Home onNavigate={handleNavigate} user={user} currentPage={page} />;
    }
  };

  return (
    <div className="app-container">
      {page !== 'login' && page !== 'signup' && (
        <Sidebar 
          onNavigate={handleNavigate} 
          onGoBack={handleGoBack}
          user={user} 
          currentPage={page} 
          onLogout={handleLogout}
        />
      )}
      <main className="main-content">
        {renderPageContent()}
      </main>
    </div>
  );
}

export default App;
