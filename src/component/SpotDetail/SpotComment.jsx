import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const SpotComment = ({ contentId }) => {
  const [spotData, setSpotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
  
  // API 호출
  useEffect(() => {
    const fetchSpotData = async () => {
      if (!contentId) {
        setError('contentId가 필요합니다.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/spot/${contentId}/comment`);
        
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('🔍 SpotComment API 응답:', data);
        
        // API 응답 구조에 맞게 데이터 추출
        const itemData = data?.response?.body?.items?.item?.[0];
        setSpotData(itemData);
        
      } catch (err) {
        console.error('SpotComment API 호출 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpotData();
  }, [contentId]);
  
  // 텍스트 자르기 함수
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  // 더보기/접기 토글
  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
  };
  
  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '40px 20px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        margin: '20px 0',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(20px, 3vw, 24px)', 
            fontWeight: '700', 
            color: '#111827', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            margin: 0
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            </div>
            장소 소개
          </h3>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '48px 0' 
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ marginLeft: '12px', color: '#4b5563', fontWeight: '500' }}>
            정보를 불러오는 중...
          </span>
        </div>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
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
        backgroundColor: 'white',
        padding: '40px 20px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        margin: '20px 0',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(20px, 3vw, 24px)', 
            fontWeight: '700', 
            color: '#111827', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            margin: 0
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>
            </div>
            장소 소개
          </h3>
        </div>
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#ef4444' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <ExternalLink size={28} style={{ color: '#f87171' }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }
  
  const overview = spotData?.overview;
  const homepage = spotData?.homepage;

  // homepage URL 정리 (HTML 태그 제거)
  const cleanHomepage = homepage?.replace(/<[^>]*>/g, '').trim();
  const hasHomepage = cleanHomepage && cleanHomepage !== '';
  
  const handleLinkClick = () => {
    if (hasHomepage) {
      window.open(cleanHomepage, '_blank', 'noopener,noreferrer');
    }
  };

  // 텍스트가 있을 때 더보기/접기 로직
  const shouldTruncate = isMobile && overview && overview.length > 150;
  const displayText = shouldTruncate && !isExpanded ? truncateText(overview) : overview;

  const formattedOverview = displayText
    ? displayText.split(/(?<=\.)\s+/).map((sentence, index) => (
        <span key={index}>
          {sentence}
          <br />
        </span>
      ))
    : null;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '40px 20px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      margin: '20px 0',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h3 style={{ 
          fontSize: 'clamp(20px, 3vw, 24px)', 
          fontWeight: '700', 
          color: '#111827', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          margin: 0
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>
          </div>
          장소 소개
        </h3>
        
        {/* 관련 링크 버튼 */}
        {hasHomepage && (
          <button
            onClick={handleLinkClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)';
            }}
          >
            <ExternalLink size={16} />
            관련 링크
          </button>
        )}
      </div>
      
      {/* 콘텐츠 */}
      <div>
        {overview ? (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid #e9ecef',
            position: 'relative'
          }}>
            <p style={{ 
              color: '#374151', 
              lineHeight: '1.7', 
              fontSize: 'clamp(12px, 2.5vw, 18px)', 
              fontWeight: '400',
              margin: 0,
              wordBreak: 'keep-all',
              whiteSpace: 'pre-wrap',
            }}>
              {formattedOverview}
            </p>
            
            {/* 더보기 버튼 - 텍스트가 잘려서 표시될 때 */}
            {shouldTruncate && !isExpanded && (
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '30px',
                right: '30px',
                height: '60px',
                background: 'linear-gradient(transparent, #f8f9fa)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <button
                  onClick={toggleExpansion}
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
            
            {/* 접기 버튼 - 전체 텍스트가 표시될 때 */}
            {shouldTruncate && isExpanded && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px'
              }}>
                <button
                  onClick={toggleExpansion}
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
        ) : (
          /* 데이터가 없을 때 */
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ExternalLink size={24} style={{ color: '#9ca3af' }} />
            </div>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              margin: '0 0 8px 0',
              color: '#374151'
            }}>
              장소 소개 정보가 없습니다
            </h4>
            <p style={{ 
              fontSize: '14px', 
              margin: 0,
              color: '#6b7280'
            }}>
              해당 장소에 대한 소개 정보를 찾을 수 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotComment;