import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const Festival_Info = ({ contentId }) => {
  const [detailInfo, setDetailInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // 축제 상세 정보 API 호출
  useEffect(() => {
    const fetchFestivalDetailInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎪 축제 상세 정보 API 호출:', contentId);
        const response = await fetch(`/api/detail/${contentId}/festival`);
        
        if (!response.ok) {
          throw new Error('축제 상세 정보를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('📋 받은 데이터:', data);
        
        // API 응답에서 item 배열 추출
        const items = data.response?.body?.items?.item || [];
        setDetailInfo(items);
        
      } catch (err) {
        console.error('❌ 축제 상세 정보 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchFestivalDetailInfo();
    }
  }, [contentId]);

  // 모바일 체크
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 텍스트 자르기 함수
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  // 더보기/접기 토글
  const toggleExpansion = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        margin: '20px 0'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>축제 정보를 불러오는 중...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        margin: '20px 0'
      }}>
        <AlertCircle size={40} style={{ color: '#ef4444', marginBottom: '12px' }} />
        <p style={{ color: '#dc2626', fontWeight: '500', marginBottom: '8px' }}>
          축제 정보를 불러올 수 없습니다
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {error}
        </p>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!detailInfo || detailInfo.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '2px dashed #d1d5db',
        margin: '20px 0'
      }}>
        <Info size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '500' }}>
          등록된 축제 정보가 없습니다
        </p>
      </div>
    );
  }

  // 행사소개와 행사내용 분리
  const getInfoByName = (infoname) => {
    const info = detailInfo.find(item => item.infoname === infoname);
    return info?.infotext || '';
  };

  const introduction = getInfoByName('행사소개');
  const content = getInfoByName('행사내용');

  // 텍스트 렌더링 컴포넌트
  const ExpandableText = ({ text, sectionKey, title }) => {
    const isExpanded = expandedSections[sectionKey];
    const shouldTruncate = isMobile && text.length > 150;
    const displayText = shouldTruncate && !isExpanded ? truncateText(text) : text;

    return (
      <div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          {title}
        </h3>
        <div style={{
          fontSize: '16px',
          lineHeight: '1.7',
          color: '#4b5563',
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <div
            dangerouslySetInnerHTML={{
              __html: displayText.replace(/\n/g, '<br>').replace(/&lt;br&gt;/g, '<br>')
            }}
          />
          
          {shouldTruncate && !isExpanded && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              height: '60px',
              background: 'linear-gradient(transparent, #f8fafc)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => toggleExpansion(sectionKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                더보기
                <ChevronDown size={16} />
              </button>
            </div>
          )}
          
          {shouldTruncate && isExpanded && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }}>
              <button
                onClick={() => toggleExpansion(sectionKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4b5563';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6b7280';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                접기
                <ChevronUp size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      margin: '20px 0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Calendar size={28} style={{ color: '#3b82f6' }} />
        축제 상세 정보
      </h2>

      {/* 행사소개 */}
      {introduction && (
        <div style={{ marginBottom: '32px' }}>
          <ExpandableText 
            text={introduction} 
            sectionKey="introduction" 
            title="🎭 행사소개" 
          />
        </div>
      )}

      {/* 행사내용 */}
      {content && (
        <div style={{ marginBottom: '16px' }}>
          <ExpandableText 
            text={content} 
            sectionKey="content" 
            title="📋 행사내용" 
          />
        </div>
      )}

      {/* 기타 정보들 (행사소개, 행사내용 외) */}
      {detailInfo.filter(item => !['행사소개', '행사내용'].includes(item.infoname)).map((item, index) => (
        <div key={index} style={{ marginBottom: '24px' }}>
          <ExpandableText 
            text={item.infotext} 
            sectionKey={`other-${index}`} 
            title={`ℹ️ ${item.infoname}`} 
          />
        </div>
      ))}
    </div>
  );
};

export default Festival_Info;