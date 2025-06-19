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
import DataReviewList from '../component/SpotDetail/DataReviewList.jsx'; // 새로 추가
//-------------------------------------------

const SpotDetail = () => {
    const location = useLocation();
    const { contentId, contentTypeId, spotData, selectedTheme } = location.state || {};
    
    // 통계 데이터는 이제 spotData에 포함되어 있음
    // 필요한 경우에만 별도 상태로 관리 (좋아요 토글 등)
    const [localSpotData, setLocalSpotData] = useState(spotData);
    const [viewCountIncremented, setViewCountIncremented] = useState(false);

    // 페이지 진입 시 조회수 증가
    useEffect(() => {
        if (!contentId || viewCountIncremented) return;

        const incrementViewCount = async () => {
            try {
                const response = await fetch(`/api/data/stats/${contentId}/view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    console.log('✅ 조회수가 증가했습니다');
                    // 로컬 상태의 조회수 업데이트
                    setLocalSpotData(prev => ({
                        ...prev,
                        viewCount: (prev?.viewCount || 0) + 1
                    }));
                    setViewCountIncremented(true);
                } else {
                    console.warn('⚠️ 조회수 증가 실패:', response.status);
                }
            } catch (error) {
                console.error('❌ 조회수 증가 API 호출 오류:', error);
                // 조회수 증가 실패해도 페이지는 정상 작동
            }
        };

        incrementViewCount();
    }, [contentId, viewCountIncremented]);

    // 좋아요 토글 함수
    const handleLikeToggle = async () => {
        if (!contentId) return;
        
        try {
            const response = await fetch(`/api/data/stats/${contentId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                // 좋아요 수 업데이트
                setLocalSpotData(prev => ({
                    ...prev,
                    likeCount: result.likeCount || (prev?.likeCount || 0) + 1
                }));
                console.log('✅ 좋아요 상태 변경됨');
            }
        } catch (error) {
            console.error('❌ 좋아요 처리 실패:', error);
            // 실패 시에도 UI 업데이트 (낙관적 업데이트)
            setLocalSpotData(prev => ({
                ...prev,
                likeCount: (prev?.likeCount || 0) + 1
            }));
        }
    };

    // 리뷰 작성 후 spotData의 reviewCount 업데이트를 위한 콜백
    const handleReviewUpdate = (newReviewCount, newAverageRating) => {
        setLocalSpotData(prev => ({
            ...prev,
            reviewCount: newReviewCount,
            rating: newAverageRating
        }));
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

    // 디버깅용 로그
    console.log('🎯 SpotDetail에서 사용할 spotData:', {
        id: localSpotData?.id,  // 리뷰에서 사용할 ID
        title: localSpotData?.title,
        contentId,
        viewCount: localSpotData?.viewCount,
        likeCount: localSpotData?.likeCount,
        rating: localSpotData?.rating,
        reviewCount: localSpotData?.reviewCount
    });
    
    // 정상적으로 데이터가 있는 경우
    return (
        <PageWrapper>
            <Header />
            
            <BodyWrapper>
                <Main>
                    <MainContent>
                       
                        <SpotHeader 
                            spotData={localSpotData}
                            onLikeToggle={handleLikeToggle}
                        /> 
                        
                        
                        <SpotImages 
                            contentId={contentId} 
                        />
                        
                        <SpotInfo spotData={localSpotData} />

                        
                        {localSpotData?.id && (
                            <DataReviewList 
                                dataId={localSpotData.id}
                                onReviewUpdate={handleReviewUpdate}
                            />
                        )}

                        <ScrollToTop/>
                    </MainContent>
                    
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default SpotDetail;