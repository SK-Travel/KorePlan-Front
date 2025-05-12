import React, { useEffect } from 'react';
import styled from 'styled-components';
import Header from '../component/fragments/Header';
import Footer from '../component/fragments/Footer';
import {
  PageWrapper,
  BodyWrapper,
  Main,
  MainContent,
} from '../styles/SearchResultStyles';

const SearchResult = () => {
  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    };

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      new naver.maps.Map('map', mapOptions);
    }
  }, []);

  return (
    <PageWrapper>
      <Header />
      <BodyWrapper>
        <Main>
          <MainContent>
            {/* ✅ 지도만 출력 */}
            <div
              id="map"
              style={{
                width: '100%',
                height: '500px',
                marginTop: '30px',
                borderRadius: '8px',
              }}
            />
          </MainContent>
        </Main>
      </BodyWrapper>
      <Footer />
    </PageWrapper>
  );
};

export default SearchResult;
