import React from 'react';
// 구조 컴포넌트
//-------------------------------------------------------------//
import PopularList from '../component/Search/PopularList';
//import PopWhatList from '../component/Search/PopWhatList';
import Festival from '../component/Search/Festival';
import Result from '../component/Search/Result';
import ReviewList from '../component/Search/ReviewList';
import Header from '../component/fragments/Header';
import Footer from '../component/fragments/Footer';
import MyListSample from '../component/fragments/MyListSample';
import SearchFilterBar from '../component/Main/SearchFilterBar';
//--------------------------------------------------------------//
// CSS 컴포넌트
//--------------------------------------------------------------//
import {
  PageWrapper,
  BodyWrapper,
  LeftSide,
  RightSide,
  Main,
  MainContent,
  Row,
} from '../styles/SearchResultStyles';
//--------------------------------------------------------------//
//            구조              
// |         header         |    <= 헤더(로고 및 회원 정보)
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
    <PageWrapper>
      <Header />
      <BodyWrapper>

        <LeftSide>

          <MyListSample />

        </LeftSide>

        <Main>
          <MainContent>

            <SearchFilterBar />
        
            <PopularList />
            
            <Row>

              <Result />
              <ReviewList />

            </Row>

          </MainContent>
        </Main>

        <RightSide>

          <Festival />

        </RightSide>

      </BodyWrapper>

      <Footer />
      
    </PageWrapper>
  );
};

export default SearchResult;
