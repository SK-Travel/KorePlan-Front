import React from 'react';

import { 
    PageWrapper, 
    BodyWrapper,
    LeftSide,
    Main,
    MainContent,
    } from '../styles/SpotDetailStyle';

import Footer from '../component/fragments/Footer';
import Header from '../component/fragments/Header';
import SpotInfo from '../component/SpotDetail/SpotInfo'
import ReviewList from '../component/Search/ReviewList';
import SpotMap from '../component/SpotDetail/SpotMap';
const SpotDetail = () => {
    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                
                <Main>
                    
                    <MainContent>
                        <SpotInfo/>
                        <ReviewList/>
                        <SpotMap/>
                    </MainContent>
                    
                </Main>
            </BodyWrapper>
            <Footer />
        </PageWrapper>
    );
};

export default SpotDetail;