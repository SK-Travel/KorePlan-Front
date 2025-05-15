import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/KorePlan.css'
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
//import MyList from '../component/fragments/MyList.jsx';
//import SearchBar from '../component/Main/SearchBar';
//import RecommendChooseBar from '../component/Main/RecommendChooseBar.jsx';

import Calendar from '../component/Main/Calendar.jsx';
import Top5Place from '../component/Main/Top5Place.jsx';
import Top5Hotel from '../component/Main/Top5Hotel.jsx';
import Top5Festival from '../component/Main/Top5Festival.jsx';
///--형 거 복붙
//import MyListSample from '../component/fragments/MyListSample';
import SearchFilterBar from '../component/Main/SearchFilterBar';
//import PopularList from '../component/Search/PopularList';
//import ReviewList from '../component/Search/ReviewList';
/// ------------------------------------------------------/
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



const MainPage = () => {
    return (
        <PageWrapper>
            <Header />

            
            <BodyWrapper>
            <LeftSide></LeftSide>
                <Main>
                    <MainContent>
                        <Top5Place />
                        <Top5Hotel />
                        <Top5Festival/>
                        <Calendar />
                    </MainContent>
                </Main>
            <RightSide></RightSide>

            </BodyWrapper>

            <Footer />
        </PageWrapper>
    );
};

export default MainPage;