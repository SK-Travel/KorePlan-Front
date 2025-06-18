import React from 'react';
import {
    PageWrapper,
    BodyWrapper,
    LeftSide,
    Main,
    MainContent,
    Row,
    RightSide,
} from '../styles/MainPageStyle.js'
import Header from '../component/fragments/Header';
import MyList from '../component/MyList/MyList';
import Like from '../component/MyList/Like';
import Footer from '../component/fragments/Footer.jsx'

const MyListPage = () => {
    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <div className="container d-flex">
                    <MyList />
                    <Like />
                </div>

            </BodyWrapper>
            <Footer />
        </PageWrapper>
    );
};

export default MyListPage;