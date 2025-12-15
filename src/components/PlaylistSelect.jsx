import React from 'react';

const PlaylistSelect = ({ 
  playlists, 
  selectedPlaylistId, 
  onPlaylistChange,
  label = 'Ajouter à la playlist:',
  className = ''
}) => {
  if (!playlists || playlists.length === 0) return null;

  return (
    <div style={{ marginBottom: 20 }} className={className}>
      <label style={{ display: "block", marginBottom: 10 }}>
        {label}
      </label>
      <select
        value={selectedPlaylistId || ""}
        onChange={(e) => onPlaylistChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          background: "rgba(0,0,0,0.55)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.15)",
          marginBottom: 15,
        }}
      >
        <option value="">Sélectionner une playlist</option>
        {playlists.map((playlist) => (
          <option key={playlist._id} value={playlist._id}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlaylistSelect;
