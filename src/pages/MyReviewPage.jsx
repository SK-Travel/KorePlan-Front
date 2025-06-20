
import React from 'react';
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import ScrollToTop from '../component/Button/ScrollToTop.jsx';
/// CSS 컴포넌트
/// -----------------------------------------------------//
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/MainPageStyle.js'
import UserReviewList from '../component/Review/UserReviewList.jsx';

const MyReviewPage = () => {
    
     return (
        <PageWrapper>
            <Header />

            
            <BodyWrapper>
            
                <Main>

                    <MainContent>
                        <UserReviewList/>
                    </MainContent>
                        
                </Main>

            </BodyWrapper>

            <Footer />
        </PageWrapper>
    );
};

export default MyReviewPage;