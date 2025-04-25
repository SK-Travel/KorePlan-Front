import React from 'react';
import SearchBarResponsive from './SearchBarResponsive';
import ChooseBarResponsive from './ChooseBarResponsive';

const SearchFilterBar = () => {
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
      <SearchBarResponsive />
      <ChooseBarResponsive />
    </div>
  );
};

export default SearchFilterBar;


