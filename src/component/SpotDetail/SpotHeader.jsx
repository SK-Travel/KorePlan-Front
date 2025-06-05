import React from 'react';
import { MapPin, Heart, Eye, Bookmark, Share2 } from 'lucide-react';

const SpotHeader = ({ spotData }) => {
  // spotData가 없으면 로딩 상태 표시
  if (!spotData) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        margin: '20px 0'
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
    );
  }

  // 지역 정보 포맷팅 (regionName + wardName)
  const formatLocation = () => {
    const parts = [];
    if (spotData.regionName) parts.push(spotData.regionName);
    if (spotData.wardName && spotData.wardName !== spotData.regionName) {
      parts.push(spotData.wardName);
    }
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
    wardName: spotData.wardName
  });

  return (
    <div style={{
      width: '100%',
      padding: '60px 0',
      textAlign: 'center',
      backgroundColor: 'white',
      color: '#333',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
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
          여행지
        </div>

        {/* 장소명 */}
        <h1 style={{
          fontSize: '42px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          lineHeight: '1.2',
          color: '#1f2937'
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
          marginBottom: '40px'
        }}>
          <MapPin size={20} color="#9ca3af" />
          <span>{formatLocation()}</span>
        </div>

        {/* 통계 및 액션 버튼 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {/* 좋아요 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '30px',
            ...buttonHoverStyle
          }}>
            <Heart size={18} color="#ef4444" />
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              185
            </span>
          </div>

          {/* 조회수 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '30px',
            ...buttonHoverStyle
          }}>
            <Eye size={18} color="#3b82f6" />
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              21.4K
            </span>
          </div>

          {/* 북마크 */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '30px',
            color: '#6b7280',
            ...buttonHoverStyle
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.borderColor = '#d1d5db';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f9fafb';
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.transform = 'translateY(0)';
          }}>
            <Bookmark size={18} />
          </button>

          {/* 공유 */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '30px',
            color: '#6b7280',
            ...buttonHoverStyle
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.borderColor = '#d1d5db';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f9fafb';
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.transform = 'translateY(0)';
          }}>
            <Share2 size={18} />
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>45</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotHeader;