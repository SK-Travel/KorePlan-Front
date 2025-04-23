import React from 'react';
import PopWhoList from '../component/Search/PopWhoList';
import PopWhatList from '../component/Search/PopWhatList';
import Festival from '../component/Search/Festival';
import Result from '../component/Search/Result';
import ReviewList from '../component/Search/ReviewList';
import Header from '../fragments/Header';
import Footer from '../fragments/Footer';

const SearchResult = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 상단 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexGrow: 1, 
        padding: '40px', 
        backgroundColor: '#f0faff'
      }}>
        {/* 왼쪽: 누구랑 / 무엇을 */}
        <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
          <PopWhoList />
          <PopWhatList />
        </div>

        {/* 오른쪽: 축제 */}
        <div style={{ marginLeft: '40px', minWidth: '200px' }}>
          <Festival />
        </div>
      </main>

      {/* 하단: 장소 정보 + 후기 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px', 
        padding: '40px', 
        backgroundColor: '#ffffff' 
      }}>
        <Result />
        <ReviewList />
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default SearchResult;
