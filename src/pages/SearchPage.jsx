// 검색 결과 리스트 및 지도 표시 페이지.
//검색바와 인기 차트가 기본으로 왼쪽 30퍼센트 정도 부분으로 표시됨. 모바일에서는 열고 닫을 수있는 창으로 drop up 형식으로 만들예정
import React,{useState} from 'react';
import Header from '../component/fragments/Header';
//import Footer from '../component/fragments/Footer';
import {
  PageWrapper,
  SearchLayout,
  SearchListWrapper,
  MapSection,
} from '../styles/SearchResultStyles';

import SearchList from '../component/Search/SearchList';
import MapSearch from '../component/Search/MapSearch';

const Search = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <PageWrapper>
      <Header />
      <SearchLayout>
        <SearchListWrapper>
          <SearchList onSelectPlace={setSelectedPlace} />
        </SearchListWrapper>
        <MapSection>
          <MapSearch selectedPlace={selectedPlace} />
        </MapSection>
      </SearchLayout>
     
    </PageWrapper>
  );
};

export default Search;
