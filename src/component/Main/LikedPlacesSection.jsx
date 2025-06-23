import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecentLikedPlaces from './RecentLikedPlaces'

const LikedPlacesSection = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    // 전체 찜 목록 페이지로 이동
    navigate('/my-likes');
  };

  return (
    <section style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '40px 0',
      borderBottom: '1px solid #f1f5f9'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* 섹션 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          {/* 제목 영역 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef2f2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart style={{
                width: '24px',
                height: '24px',
                color: '#ef4444',
                fill: '#ef4444'
              }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0,
                lineHeight: '1.2'
              }}>
                최근 찜한 여행지
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                lineHeight: '1.4'
              }}>
                내가 관심있어 하는 여행지들을 확인해보세요
              </p>
            </div>
          </div>
        </div>

        {/* 최근 찜한 여행지 컴포넌트 */}
        <RecentLikedPlaces />
      </div>

      {/* 모바일 반응형 스타일 */}
      <style>
        {`
          /* 모바일 스타일 */
          @media (max-width: 768px) {
            .liked-places-section {
              padding: 30px 0;
            }
            
            .liked-places-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
              margin-bottom: 24px;
            }
            
            .liked-places-title h2 {
              font-size: 24px !important;
            }
            
            .liked-places-title p {
              font-size: 14px !important;
            }
            
            .view-all-button {
              padding: 10px 16px !important;
              font-size: 13px !important;
              align-self: flex-end;
            }
            
            .liked-places-icon-wrapper {
              width: 40px !important;
              height: 40px !important;
            }
            
            .liked-places-icon {
              width: 20px !important;
              height: 20px !important;
            }
          }

          /* 더 작은 모바일 */
          @media (max-width: 480px) {
            .liked-places-section {
              padding: 24px 0;
            }
            
            .liked-places-container {
              padding: 0 16px !important;
            }
            
            .liked-places-title h2 {
              font-size: 22px !important;
            }
            
            .liked-places-header {
              margin-bottom: 20px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default LikedPlacesSection;