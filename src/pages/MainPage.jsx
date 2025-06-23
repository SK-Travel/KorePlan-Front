import React from 'react';
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import Calendar from '../component/Main/Calendar.jsx';
import SearchFilterBar from '../component/Main/SearchFilterBar';

/// CSS 컴포넌트 ///
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
    
} from '../styles/MainPageStyle.js'

import ScrollToTop from '../component/Button/ScrollToTop.jsx';
import Top5Section from '../component/Main/Top5Section.jsx';  
import LikedPlacesSection from '../component/Main/LikedPlacesSection.jsx';

const MainPage = () => {
    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <Main>
                    <MainContent>
                        <Top5Section/>
                        <LikedPlacesSection></LikedPlacesSection>
                        <Calendar />
                        <ScrollToTop/>
                    </MainContent>
                </Main>
            </BodyWrapper>
            <Footer />
        </PageWrapper>
    );
};

export default MainPage;