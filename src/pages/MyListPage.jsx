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
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    box-sizing: border-box;
                    overflow-x: hidden; /* 가로 스크롤 방지 */
                }
                                 
                /* 데스크톱 - 양옆 배치 */
                @media (min-width: 769px) {
                    .mylist-container {
                        flex-direction: row;
                    }
                                         
                    .mylist-container > * {
                        flex: 1;
                        min-width: 0; /* flex item이 컨테이너를 넘지 않도록 */
                    }
                }
                                 
                /* 태블릿 */
                @media (max-width: 768px) and (min-width: 481px) {
                    .mylist-container {
                        flex-direction: column;
                        padding: 15px;
                        gap: 15px;
                        max-width: 100%;
                    }
                                         
                    .mylist-container > * {
                        width: 100%;
                        max-width: 100%;
                    }
                }
                
                /* 모바일 - 위아래 배치 */
                @media (max-width: 480px) {
                    .mylist-container {
                        flex-direction: column;
                        padding: 10px;
                        gap: 10px;
                        max-width: 100%;
                        margin: 0;
                    }
                                         
                    .mylist-container > * {
                        width: 100%;
                        max-width: 100%;
                        overflow-x: hidden;
                    }
                }
                
                /* 전체 페이지 스크롤 방지 */
                @media (max-width: 768px) {
                    :global(body) {
                        overflow-x: hidden;
                    }
                    
                    :global(*) {
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </PageWrapper>
    );
};

export default MyListPage;