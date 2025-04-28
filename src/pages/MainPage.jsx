import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/KorePlan.css'
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
//import MyList from '../component/fragments/MyList.jsx';
//import SearchBar from '../component/Main/SearchBar';
//import RecommendChooseBar from '../component/Main/RecommendChooseBar.jsx';
import RecommendBar from '../component/Main/RecommendBar.jsx';
import Calendar from '../component/Main/Calendar.jsx';

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
} from '../styles/MainPageStyle.js'


const MainPage = () => {
    return (
        <PageWrapper>
            <Header />

            <BodyWrapper>

                {/* <LeftSide>
                    <MyListSample />
                </LeftSide> */}

                <Main>
                    <MainContent>
                        <SearchFilterBar />
                        <Row>
                            <RecommendBar />
                        </Row>
                        <Row>
                            <Calendar />
                        </Row>
                    </MainContent>
                </Main>

            </BodyWrapper>

            <Footer />
        </PageWrapper>
    );
};

export default MainPage;