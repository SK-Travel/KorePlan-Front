import React from 'react';
import PopWhoList from '../component/Search/PopWhoList';
import PopWhatList from '../component/Search/PopWhatList';
import Festival from '../component/Search/Festival';
import Result from '../component/Search/Result';
import ReviewList from '../component/Search/ReviewList';
import Header from '../component/fragments/Header';
import Footer from '../component/fragments/Footer';
import MyList from '../component/fragments/MyList';
import SearchFilterBar from '../component/Main/SearchFilterBar';


// 구조
// |     header             |    <= 헤더
// --------------------------
// |menu |   검색바   |축제  |
// |box  |    테마    |      |  <= 바디
// |     |    결과    |      |
// |     |  정보/후기 |      |
// --------------------------
// |        footer          |   <= 푸터
// 총 3개의 큰 덩어리는 수직으로 나열해야함  하나의 div로 묶기 |              body의 [div]                        |
// 바디의 3가지의 작은 덩어리들은 수평으로 나열해야함. =>         (div) menu  /  (div) main  / (div) fest

const SearchResult = () => {
  return (
    // //큰 덩어리 3개 수직 나열하기
    // <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> 
    //   {/* 상단 헤더 */}
    //   <Header />
      
      
      
    //   {/* 메인 콘텐츠 */}
    //   {/* 총 3개의 컨텐츠 
    //   1. 메뉴박스 
    //   2. 6개의 컴포넌트(검색,테마,누구,무엇,정보,후기) 
    //   3. 축제 */}
    //   <main
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'row',
    //       gap: '40px',
    //       padding: '40px',
    //       backgroundColor: '#f0faff',
    //       margin: '0 auto'
    //     }}
    //   >
    //   {/* 1. 메뉴박스 */}
    //     <div
    //       style={{
    //         position: 'fixed',      
    //         top: '150px',               // 헤더 높이에 맞게 조절
    //         left: '20px',
    //         zIndex: 2000,
    //         width: '180px',            //  폭 좁게
    //         padding: '16px',           // 안쪽 여백
    //         borderRadius: '8px',
    //         boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    //         color: 'white',
    //         fontSize: '14px',          
    //       }}
    //     >     
    //       <MyList />
    //     </div>
    //     {/* <div className="d-flex" style={{margin: '0 auto'}}><SearchBar style={{backgroundColor:'#f0faff',flex: 5}}/></div> */}
    //     {/* <div style={{margin: '0 auto'}}><RecommendChooseBar/></div> */}
        
    //     <div style={{flexDirection: 'column'}}>
          
    //       <SearchFilterBar style={{display : 'flex'}}/>
    //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    //         <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
    //           <PopWhoList />
    //           <PopWhatList />
    //         </div>
    //       </div>

    //     {/* 하단 콘텐츠: Result, ReviewList */}
    //     <div
    //     style={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       gap: '40px',
    //       backgroundColor: '#ffffff',
    //       padding: '30px',
    //       borderRadius: '12px',
    //       boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    //       maxWidth: '1000px',
    //       width: '100%',
    //       margin: '0 auto',
    //     }}
    //     >
    //       <Result />
    //       <ReviewList />
    //     </div>
    //     </div>
    //     <div
    //     style={{
    //       position: 'fixed',     // 또는 'fixed'로 고정
    //       top: '150px',              // 헤더 아래로 띄움
    //       right: '40px',            // 오른쪽 여백
    //       zIndex: 1000,
    //       width: '220px',           
    //       padding: '16px',
    //       borderRadius: '8px',
    //       boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    //       fontSize: '14px'
    //     }}
    //   >
    //     <Festival />
    //   </div>
    //   </main>



    //   {/* 푸터 */}
    //   <Footer />
    // </div>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <Header />

  {/* 바디 전체: 수평 3분할 (메뉴박스 / 메인 / 축제) */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '40px',
      gap: '20px',
    }}
  >
    {/* 왼쪽: 메뉴박스 (main 바깥) */}
    <div style={{ flex: 1 }}>
      <div
        style={{
          padding: '16px',
          fontSize: '14px',
        }}
      >
        <MyList />
      </div>
    </div>

    {/* 가운데: <main> - 진짜 메인 콘텐츠만 */}
    <main style={{ flex: 5, display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f0faff' }}>
      {/* 메인 콘텐츠 wrapper */}
<div
  style={{
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',         // ✅ 중앙 정렬 핵심
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }}
>
  <SearchFilterBar />

  <div style={{ display: 'flex', gap: '20px' }}>
    <PopWhoList />
    <PopWhatList />
  </div>

  <div style={{ display: 'flex', gap: '20px' }}>
    <Result />
    <ReviewList />
  </div>
</div>

    </main>

    {/* 오른쪽: 축제 정보 (main 바깥) */}
    <div style={{ flex: 1 }}>
      <div
        style={{
          padding: '16px',
          fontSize: '14px',
        }}
      >
        <Festival />
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
};

export default SearchResult;
