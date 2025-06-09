import React, { useState, useEffect } from 'react';
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
import ScrollToTop from '../component/Button/ScrollToTop.jsx';
//-------------------------------------------

const SpotDetail = () => {
    const location = useLocation();
    const { contentId, contentTypeId, spotData, selectedTheme } = location.state || {};
    
    // 통계 데이터 상태 관리
    const [spotStats, setSpotStats] = useState({
        viewCount: 0,
        likeCount: 0,
        rating: 4.5, // 임시 하드코딩
        reviewCount: 0
    });
    
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    // 페이지 진입 시 조회수 증가 및 통계 데이터 가져오기
    useEffect(() => {
        if (!contentId) return;

        const initializeSpotData = async () => {
            try {
                setStatsLoading(true);
                setStatsError(null);

                // 1. 조회수 증가 API 호출
                await incrementViewCount(contentId);
                
                // 2. 통계 데이터 가져오기 API 호출
                await fetchSpotStats(contentId);

            } catch (error) {
                console.error('❌ 스팟 데이터 초기화 실패:', error);
                setStatsError(error.message);
            } finally {
                setStatsLoading(false);
            }
        };

        initializeSpotData();
    }, [contentId]);

    // 조회수 증가 API 함수
    const incrementViewCount = async (contentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/data/stats/${contentId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ 조회수가 증가했습니다');
            } else {
                console.warn('⚠️ 조회수 증가 실패:', response.status);
            }
        } catch (error) {
            console.error('❌ 조회수 증가 API 호출 오류:', error);
            // 조회수 증가 실패해도 페이지는 정상 작동
        }
    };

    // 통계 데이터 가져오기 API 함수
    const fetchSpotStats = async (contentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/data/stats/${contentId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // API 응답 구조에 맞춰 데이터 설정
            setSpotStats({
                viewCount: data.viewCount || 0,
                likeCount: data.likeCount || 0,
                rating: data.rating || 0,
                reviewCount: data.reviewCount || 0
            });
            
            console.log('✅ 통계 데이터 로드 완료:', data);
            
        } catch (error) {
            console.error('❌ 통계 데이터 로드 실패:', error);
            
            // 실패 시 기본값 또는 하드코딩된 값 사용
            setSpotStats({
                viewCount: 21400, // 임시 하드코딩
                likeCount: 185,   // 임시 하드코딩
                rating: 4.5,      // 임시 하드코딩
                reviewCount: 128  // 임시 하드코딩
            });
            
            throw error; // 에러를 다시 던져서 상위에서 처리
        }
    };

    // 좋아요 토글 함수 (SpotHeader에서 호출할 수 있도록)
    const handleLikeToggle = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/data/stats/${contentId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                // 좋아요 수 업데이트
                setSpotStats(prev => ({
                    ...prev,
                    likeCount: result.likeCount
                }));
                console.log('✅ 좋아요 상태 변경됨');
            }
        } catch (error) {
            console.error('❌ 좋아요 처리 실패:', error);
        }
    };

    
    
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
                        {/* SpotHeader에 spotData와 spotStats 전달 */}
                        <SpotHeader 
                            spotData={spotData}
                            stats={spotStats} 
                            statsLoading={statsLoading}
                            statsError={statsError}
                            onLikeToggle={handleLikeToggle}
                        />
                        
                        {/* SpotImages에 contentId와 contentTypeId 전달 */}
                        <SpotImages 
                            contentId={contentId} 
                            contentTypeId={contentTypeId}
                            displayMode="slider" 
                        />
                        
                        <SpotInfo spotData={spotData} />

                        <ScrollToTop/>
                    </MainContent>
                    
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default SpotDetail;