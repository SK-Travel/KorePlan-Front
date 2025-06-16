import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import Festival_Info_Header from '../component/Festival/Detail/Festival_Info_Header';
import SpotImages from '../component/SpotDetail/SpotImages';
import ScrollToTop from '../component/Button/ScrollToTop.jsx';
import FestivalTotal_Info from '../component/Festival/Detail/FestivalTotal_Info';
import Festival_Info from '../component/Festival/Detail/Festival_Info.jsx';
import Festival_Info_Detail from '../component/Festival/Detail/Festival_Info_Detail.jsx';
import FestivalMap from '../component/Festival/Detail/FestivalMap.jsx';
import Top5Festival from '../component/Main/Top5Festival.jsx';
//-------------------------------------------

const FestivalDetail = () => {
  const location = useLocation();
  const { contentId } = useParams();
  const { contentTypeId, festivalData } = location.state || {};

  // 🔍 디버깅: 받아온 데이터 확인
  console.log('🔍 FestivalDetail 디버깅:', {
    contentId,
    'location.state': location.state,
    'location.state?.festivalData': location.state?.festivalData,
    festivalData,
    contentTypeId
  });

  // 통계 데이터 (현재는 FestivalCardList에서 받아온 조회수만 사용)
  const [viewCount, setViewCount] = useState(festivalData?.viewCount || 0);
  const [statsError, setStatsError] = useState(null);
  // festivalData는 이미 FestivalCardList에서 전달받음 (API 호출 불필요)

  // 페이지 진입 시 초기화 및 조회수 증가
  useEffect(() => {
    console.log('🚀 useEffect 실행됨!', { contentId, festivalData }); // 이 로그 추가
    
    if (!contentId) {
      console.log('❌ contentId가 없어서 종료');
      return;
    }
  
    console.log('🎪 축제 상세페이지 진입:', {
      contentId,
      title: festivalData?.title,
      viewCount: festivalData?.viewCount
    });
  
    // 조회수 증가 API 호출
    incrementViewCount(contentId);
  
  }, [contentId]);

  // 조회수 증가 API 함수
  const incrementViewCount = async (contentId) => {
    try {
      const response = await fetch(`/api/festival/${contentId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ 축제 조회수가 증가했습니다');
        // 조회수 증가 후 최신 데이터 반영
        setViewCount(prev => {
          const newCount = prev + 1;
          console.log('조회수 업데이트:', prev, '→', newCount);
          return newCount;
        });
      } else {
        console.warn('⚠️ 축제 조회수 증가 실패:', response.status);
      }
    } catch (error) {
      console.error('❌ 축제 조회수 증가 API 호출 오류:', error);
    }
  };

  

  // festivalData가 없는 경우 처리
  if (!festivalData || !contentId) {
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
                  축제 정보를 찾을 수 없습니다
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  margin: '8px 0 16px 0'
                }}>
                  {!contentId && '축제 ID가 없습니다.'}
                  {contentId && !festivalData && '축제 데이터가 전달되지 않았습니다.'}
                  <br />
                  축제 목록에서 다시 선택해주세요.
                </p>

                {/* 🔍 디버깅 정보 표시 */}
                <div style={{
                  backgroundColor: '#f3f4f6',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  textAlign: 'left',
                  fontFamily: 'monospace'
                }}>
                  <div>contentId: {contentId || 'undefined'}</div>
                  <div>location.state: {location.state ? 'exists' : 'null'}</div>
                  <div>festivalData: {festivalData ? 'exists' : 'null'}</div>
                </div>

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
        <Footer />
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
            {/* Festival_Info_Header에 festivalData 전달 */}
            <Festival_Info_Header
              festivalData={festivalData}
              stats={{
                viewCount: viewCount
              }}
            />
            <SpotImages
              contentId={contentId}
            />

            <FestivalTotal_Info
              contentId={contentId}
              festivalData={festivalData}
            />
            <Top5Festival/>
            <ScrollToTop />
          </MainContent>

        </Main>
      </BodyWrapper>
      <Footer />
    </PageWrapper>
  );
};

export default FestivalDetail;