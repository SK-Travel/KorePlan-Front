import React from 'react';
import { useLocation } from 'react-router-dom';
//CSS
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/MainPageStyle.js'
//------------------------------------------
// 구조 컴포넌트
import Footer from '../component/fragments/Footer';
import Header from '../component/fragments/Header';
import ReviewList from '../component/Search/ReviewList';
import SpotMap from '../component/SpotDetail/SpotMap';
import SpotImages from '../component/SpotDetail/SpotImages';
import SpotHeader from '../component/SpotDetail/SpotHeader.jsx';
import SpotComment from '../component/SpotDetail/SpotComment.jsx';
import SpotInfo from '../component/SpotDetail/SpotInfo.jsx';
//-------------------------------------------

const SpotDetail = () => {
    // useLocation을 컴포넌트 안에서 호출
    const location = useLocation();
    const { contentId, contentTypeId, spotData, selectedTheme } = location.state || {};
    
    // contentTypeId가 없으면 selectedTheme로 매핑
    const getContentTypeId = (themeName) => {
        const mapping = {
            '관광지': '12',
            '문화시설': '14',
            '레포츠': '28',
            '숙박': '32',
            '쇼핑': '38',
            '음식점': '39'
        };
        return mapping[themeName];
    };
    const finalContentTypeId = contentTypeId || getContentTypeId(selectedTheme);
    // spotData가 없는 경우 처리
    if (!spotData || !contentId) {
        return (
            <PageWrapper>
                <Header />
                <BodyWrapper>
                    <Main>
                        <MainContent>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '400px',
                                padding: '40px',
                                textAlign: 'center',
                                backgroundColor: '#fef2f2',
                                borderRadius: '12px',
                                border: '1px solid #fecaca',
                                margin: '20px'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: '#ef4444',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <span style={{ color: 'white', fontSize: '24px' }}>!</span>
                                </div>
                                <h3 style={{ 
                                    color: '#dc2626', 
                                    fontWeight: '600', 
                                    marginBottom: '8px',
                                    margin: 0
                                }}>
                                    장소 정보를 찾을 수 없습니다
                                </h3>
                                <p style={{ 
                                    color: '#6b7280', 
                                    fontSize: '14px',
                                    margin: '8px 0 16px 0'
                                }}>
                                    잘못된 접근이거나 데이터가 누락되었습니다.
                                </p>
                                <button
                                    onClick={() => window.history.back()}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    이전 페이지로 돌아가기
                                </button>
                            </div>
                        </MainContent>
                    </Main>
                </BodyWrapper>
            </PageWrapper>
        );
    }
    
    // 정상적으로 데이터가 있는 경우
    return (
        <PageWrapper>
            <Header />
            
            <BodyWrapper>
                <Main>
                    <MainContent>
                        {/* SpotHeader에 DataCardList에서 받은 데이터 전달 */}
                        <SpotHeader spotData={spotData} />
                        
                        {/* SpotImages에 contentId 전달 */}
                        <SpotImages contentId={contentId} displayMode="slider" />
                        
                        <SpotComment contentId={contentId} />

                        <SpotInfo spotData={spotData} />
                    </MainContent>
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default SpotDetail;