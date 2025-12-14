import "./Sidebar.css";

function Sidebar({ onNavigate, onGoBack, user, currentPage }) {
  return (
    <div className="home-sidebar">
      <button className="back-btn" onClick={onGoBack}>
        ←
      </button>
      <nav className="sidebar-nav">
        <div
          className={`nav-item ${currentPage === "home" ? "active" : ""}`}
          onClick={() => onNavigate("home")}
        >
          <span><i className="bx bx-home"></i></span>
          <span className="nav-text">Home</span>
        </div>

        <div
          className={`nav-item ${currentPage === "search-songs" ? "active" : ""}`}
          onClick={() => onNavigate("search-songs")}
        >
          <span><i className="bx bx-search"></i></span>
          <span className="nav-text">Search song</span>
        </div>

        <div
          className={`nav-item ${currentPage === "search-artists" ? "active" : ""}`}
          onClick={() => onNavigate("search-artists")}
        >
          <span><i className="bx bx-search"></i></span>
          <span className="nav-text">Search Artists</span>
        </div>

        <div
          className={`nav-item ${currentPage === "all-playlists" ? "active" : ""}`}
          onClick={() => onNavigate("all-playlists")}
        >
          <span><i className="bx bx-categories"></i></span>
          <span className="nav-text">Playlists</span>
        </div>

        <div
          className={`nav-item ${currentPage === "charts" ? "active" : ""}`}
          onClick={() => onNavigate("charts")}
        >
          <span><i className="bx bx-pie-chart"></i></span>
          <span className="nav-text">Charts</span>
        </div>

        {user && (
          <div
            className={`nav-item profile-nav ${currentPage === "profile" ? "active" : ""}`}
            onClick={() => onNavigate("profile")}
          >
            <span><i className="bx bx-user"></i></span>
            <span className="nav-text">Profile</span>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
