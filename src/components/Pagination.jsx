import React from 'react';

const Pagination = ({ 
  currentPage, 
  hasNextPage, 
  onPageChange,
  previousLabel = '← Previous',
  nextLabel = 'Next →',
  className = ''
}) => {
  return (
    <div className={className} style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
      <button
        className={currentPage === 1 ? 'disabledButton' : ''}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {previousLabel}
      </button>

      {hasNextPage ? (
        <button
          className="topbar-btn"
          onClick={() => onPageChange(currentPage + 1)}
        >
          {nextLabel}
        </button>
      ) : (
        <button className="disabledButton">{nextLabel}</button>
      )}
    </div>
  );
};

export default Pagination;
