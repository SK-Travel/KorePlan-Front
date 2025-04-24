// import React from 'react';
// import SearchBar from './SearchBar';
// import RecommendChooseBar from './RecommendChooseBar';

// const SearchFilterBar = () => {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',         // ✅ 가운데 정렬
//         justifyContent: 'center',
//         width: '100%',
//         maxWidth: '900px',            // ✅ 최대 너비 제한
//         margin: '0 auto',             // ✅ 수평 중앙 정렬
//         padding: '12px 16px',
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//         gap: '12px',                  // ✅ 두 컴포넌트 사이 간격
//       }}
//     >
//       <div style={{ width: '100%' }}>
//         <SearchBar />
//       </div>
//       <div style={{ width: '100%' }}>
//         <RecommendChooseBar />
//       </div>
//     </div>
//   );
// };

// export default SearchFilterBar;


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
        gap: '16px', // 
      }}
    >
      <SearchBarResponsive />
      <ChooseBarResponsive />
    </div>
  );
};

export default SearchFilterBar;


