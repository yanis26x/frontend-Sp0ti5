import React from 'react';

const SongListItem = ({ 
  song, 
  onButtonClick, 
  buttonIcon = 'bx-plus-circle', 
  buttonVariant = 'default',
  showArtist = true,
  showAlbum = true,
  artistName = null
}) => {
  const buttonStyles = {
    default: {},
    danger: { background: 'rgba(255, 80, 80, 0.25)' }
  };

  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <p style={{ margin: 0, fontWeight: 600 }}>Song: {song.name}</p>
        {showArtist && (
          <p style={{ margin: 0, fontWeight: 400 }}>
            {artistName ? `Artist: ${artistName}` : `Artist: ${song.artistName}`}
          </p>
        )}
        {showAlbum && <p style={{ margin: 0, fontWeight: 400 }}>Album: {song.album}</p>}
      </div>
      {onButtonClick && (
        <button
          onClick={() => onButtonClick(song._id)}
          style={{
            padding: "4px 0px 2px 0px",
            width: "40px",
            ...(buttonStyles[buttonVariant] || {})
          }}
        >
          <i className={`bx ${buttonIcon}`} style={{ fontSize: "30px" }}></i>
        </button>
      )}
    </div>
  );
};

export default SongListItem;
