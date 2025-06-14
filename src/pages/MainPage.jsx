import React from 'react';
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import Calendar from '../component/Main/Calendar.jsx';
import Top5Place from '../component/Main/Top5Place.jsx';
import Top5Hotel from '../component/Main/Top5Hotel.jsx';
import Top5Festival from '../component/Main/Top5Festival.jsx';
import SearchFilterBar from '../component/Main/SearchFilterBar';

/// CSS 컴포넌트
/// -----------------------------------------------------//
import {
    PageWrapper,
    BodyWrapper,
    LeftSide,
    Main,
    MainContent,
    Row,
    RightSide,
} from '../styles/MainPageStyle.js'
import ScrollToTop from '../component/Button/ScrollToTop.jsx';


//테스트
const MainPage = () => {
    return (
        <PageWrapper>
            <Header />

            
            <BodyWrapper>
            
                <Main>
                    <MainContent>
                        <Top5Place />
                        <Top5Hotel />
                        <Top5Festival/>
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