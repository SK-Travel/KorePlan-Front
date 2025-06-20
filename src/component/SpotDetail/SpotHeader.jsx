import React from 'react';
import { MapPin, Heart, Eye, Star } from 'lucide-react';

const SpotHeader = ({ spotData }) => {
  // spotData가 없으면 로딩 상태 표시
  if (!spotData) {
    return (
      // 🔥 수정: 다른 컴포넌트와 동일한 레이아웃 구조 적용
      <div style={{
        width: '100%',
        padding: '40px 0',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            <div style={{
              width: '200px',
              height: '24px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              margin: '0 auto 16px',
              animation: 'shimmer 1.5s infinite'
            }}></div>
            <div style={{
              width: '120px',
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              margin: '0 auto'
            }}></div>
            <style>
              {`
                @keyframes shimmer {
                  0% { opacity: 1; }
                  50% { opacity: 0.5; }
                  100% { opacity: 1; }
                }
              `}
            </style>
          </div>
        </div>
      </div>
    );
  }

  // 테마 코드를 한글명으로 변환
  const getThemeName = (themeCode) => {
    const themeMapping = {
      12: '관광지',
      14: '문화시설',
      28: '레포츠',
      32: '숙박',
      38: '쇼핑',
      39: '음식점'
    };
    return themeMapping[themeCode] || '기타';
  };

  // 지역 정보 포맷팅 (regionName + wardName)
  const formatLocation = () => {
    const parts = [];
    if (spotData.regionName) parts.push(spotData.regionName);
    if (spotData.wardName && spotData.wardName !== spotData.regionName) {
      parts.push(spotData.wardName);
    }
    return parts.join(' ');
  };

  // 주소 정보 포맷팅 (addr1 + addr2)
  const formatAddress = () => {
    const parts = [];
    if (spotData.addr1) parts.push(spotData.addr1);
    if (spotData.addr2) parts.push(spotData.addr2);
    return parts.join(' ');
  };

  // 좋아요, 조회수 포맷팅 (K 단위)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 버튼 호버 효과
  const buttonHoverStyle = {
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  console.log('🎯 SpotHeader에서 사용할 데이터:', {
    title: spotData.title,
    regionName: spotData.regionName,
    wardName: spotData.wardName,
    addr1: spotData.addr1,
    addr2: spotData.addr2,
    theme: spotData.theme,
    themeName: getThemeName(spotData.theme),
    // 통계 데이터 확인
    viewCount: spotData.viewCount,
    likeCount: spotData.likeCount,
    rating: spotData.rating,
    reviewCount: spotData.reviewCount
  });

  return (
    // 🔥 수정: 다른 컴포넌트와 동일한 레이아웃 구조 적용
    <div style={{
      width: '100%',
      padding: '60px 0',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          textAlign: 'center',
          color: '#333'
        }}>
          {/* 카테고리 뱃지 */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            {getThemeName(spotData.theme)}
          </div>

          {/* 장소명 */}
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 42px)', // 🔥 수정: 반응형 폰트 크기
            fontWeight: '700',
            margin: '0 0 16px 0',
            lineHeight: '1.2',
            color: '#1f2937',
            wordBreak: 'keep-all' // 🔥 추가: 한글 줄바꿈 최적화
          }}>
            {spotData.title || '장소명 없음'}
          </h1>

          {/* 지역 정보 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '8px',
            flexWrap: 'wrap' // 🔥 추가: 모바일에서 줄바꿈 허용
          }}>
            <MapPin size={20} color="#9ca3af" />
            <span style={{ wordBreak: 'keep-all' }}>{formatLocation()}</span>
          </div>

          {/* 상세 주소 */}
          {formatAddress() && (
            <div style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px',
              lineHeight: '1.5',
              wordBreak: 'break-all', // 🔥 추가: 긴 주소 줄바꿈
              padding: '0 10px' // 🔥 추가: 모바일에서 여백
            }}>
              {formatAddress()}
            </div>
          )}

          {/* 통계 및 액션 버튼 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 3vw, 24px)', // 🔥 수정: 반응형 간격
            flexWrap: 'wrap'
          }}>
            {/* 좋아요 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: 'clamp(10px 16px, 2.5vw, 12px 20px)', // 🔥 수정: 반응형 패딩
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '30px',
              minWidth: 'fit-content', // 🔥 추가: 최소 너비 보장
              ...buttonHoverStyle
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <Heart size={18} color="#ef4444" />
              <span style={{ 
                fontSize: 'clamp(14px, 2.5vw, 16px)', // 🔥 수정: 반응형 폰트
                fontWeight: '600', 
                color: '#374151' 
              }}>
                {formatNumber(spotData.likeCount || 0)}
              </span>
            </div>

            {/* 조회수 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: 'clamp(10px 16px, 2.5vw, 12px 20px)', // 🔥 수정: 반응형 패딩
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '30px',
              minWidth: 'fit-content', // 🔥 추가: 최소 너비 보장
              ...buttonHoverStyle
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <Eye size={18} color="#3b82f6" />
              <span style={{ 
                fontSize: 'clamp(14px, 2.5vw, 16px)', // 🔥 수정: 반응형 폰트
                fontWeight: '600', 
                color: '#374151' 
              }}>
                {formatNumber(spotData.viewCount || 0)}
              </span>
            </div>

            {/* 별점 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: 'clamp(10px 16px, 2.5vw, 12px 20px)', // 🔥 수정: 반응형 패딩
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '30px',
              minWidth: 'fit-content', // 🔥 추가: 최소 너비 보장
              ...buttonHoverStyle
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <Star size={18} color="#fbbf24" fill="#fbbf24" />
              <span style={{ 
                fontSize: 'clamp(14px, 2.5vw, 16px)', // 🔥 수정: 반응형 폰트
                fontWeight: '600', 
                color: '#374151' 
              }}>
                {spotData.rating ? spotData.rating.toFixed(1) : '0.0'}
              </span>
              <span style={{ 
                fontSize: 'clamp(12px, 2vw, 14px)', // 🔥 수정: 반응형 폰트
                color: '#9ca3af', 
                marginLeft: '4px' 
              }}>
                ({formatNumber(spotData.reviewCount || 0)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotHeader;