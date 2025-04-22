import React from 'react';
import PopWhoList from '../component/Search/PopWhoList';
import PopWhatList from '../component/Search/PopWhatList';
import Festival from '../component/Search/Festival';

const SearchResult = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        padding: '0 40px',
        
      }}
    >
      {/* 왼쪽 2개 컴포넌트를 묶어서 가로 정렬 */}
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        // marginTop: '100px',
        // marginBottom: '100px',
        // marginRight: '150px',
        // marginLeft: '80px',
      }}>
        <PopWhoList />
        <PopWhatList />
      </div>

      {/* 오른쪽 끝에 Festival */}
      <div>
        <Festival />
      </div>
    </div>
  );
};

export default SearchResult;



