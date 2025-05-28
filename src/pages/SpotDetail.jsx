import React from 'react';
//CSS
import { 
    PageWrapper, 
    BodyWrapper,
    LeftSide,
    RightSide,
    Main,
    MainContent,
    Row,
    } from '../styles/DetailPageStyle';
//------------------------------------------
// 구조 컴포넌트
import Footer from '../component/fragments/Footer';
import Header from '../component/fragments/Header';
import SpotInfo from '../component/SpotDetail/SpotInfo'
import ReviewList from '../component/Search/ReviewList';
import SpotMap from '../component/SpotDetail/SpotMap';
//-------------------------------------------

const SpotDetail = () => {
    return (
        <PageWrapper>
            <Header />
            
            <BodyWrapper>
                <LeftSide/>
                <Main>
                    
                    <MainContent>
                        <SpotInfo/>
                        
                        
                        

                    </MainContent>
                    
                </Main>
                <RightSide/>
            </BodyWrapper>
            
            <Footer />
        </PageWrapper>
    );
};

export default SpotDetail;