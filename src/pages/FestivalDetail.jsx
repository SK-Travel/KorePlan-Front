import React from 'react';
import FestivalInfo from '../component/Festival/FestivalInfo';

import { 
    PageWrapper, 
    BodyWrapper,
    LeftSide,
    RightSide,
    Main,
    MainContent,
    Row
    }
    from '../styles/DetailPageStyle';

import Footer from '../component/fragments/Footer';
import Header from '../component/fragments/Header';
import ReviewList from '../component/Search/ReviewList';
import SpotMap from '../component/SpotDetail/SpotMap';

const DetailFestival = () => {
    
    return (
        <PageWrapper>
      <Header />
      <BodyWrapper>

        <LeftSide/>


        <Main>
          <MainContent>
            <Row>
              <FestivalInfo/>
            <ReviewList/>
            </Row>
            <SpotMap/>
          </MainContent>
        </Main>
        <RightSide/>

       

      </BodyWrapper>

      <Footer />
      
    </PageWrapper>
    );
};

export default DetailFestival;