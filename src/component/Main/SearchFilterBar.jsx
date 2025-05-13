import React from 'react';
import SearchBarResponsive from './SearchBarResponsive';
import ChooseBarResponsive from './ChooseBarResponsive';

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  selectedWho,
  selectedWhat,
  onSelectWho,
  onSelectWhat,
}) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <SearchBarResponsive
        value={searchTerm}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />
      <ChooseBarResponsive
        selectedWho={selectedWho}
        selectedWhat={selectedWhat}
        onSelectWho={onSelectWho}
        onSelectWhat={onSelectWhat}
      />
    </div>
  );
};

export default SearchFilterBar;
