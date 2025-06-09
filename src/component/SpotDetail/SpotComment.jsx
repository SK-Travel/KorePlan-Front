import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const SpotComment = ({ contentId }) => {
  const [spotData, setSpotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
            border: '1px solid #e9ecef'
          }}>
            <p style={{ 
              color: '#374151', 
              lineHeight: '1.7', 
              fontSize: 'clamp(16px, 2.5vw, 18px)', 
              fontWeight: '400',
              margin: 0,
              wordBreak: 'keep-all'
            }}>
              {overview}
            </p>
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