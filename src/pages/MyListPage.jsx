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
import Footer from '../component/fragments/Footer.jsx';

const MyListPage = () => {
    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <div className="mylist-container">
                    <MyList />
                    <Like />
                </div>
            </BodyWrapper>
            <Footer />
            
            <style jsx>{`
                .mylist-container {
                    display: flex;
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                /* 데스크톱 - 양옆 배치 */
                @media (min-width: 769px) {
                    .mylist-container {
                        flex-direction: row;
                    }
                    
                    .mylist-container > * {
                        flex: 1;
                    }
                }
                
                /* 모바일 - 위아래 배치 */
                @media (max-width: 768px) {
                    .mylist-container {
                        flex-direction: column;
                        padding: 10px;
                        gap: 15px;
                    }
                    
                    .mylist-container > * {
                        width: 100%;
                    }
                }
            `}</style>
        </PageWrapper>
    );
};

export default MyListPage;