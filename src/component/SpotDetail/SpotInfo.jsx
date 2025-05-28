import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Phone, Globe, Clock, Star, Navigation, Share2, AlertCircle } from 'lucide-react';

// ZzimButton 컴포넌트 (기존 것을 사용하거나 아래 간단한 버전 사용)
const ZzimButton = ({ isLiked, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px',
      backgroundColor: isLiked ? '#ef4444' : '#f3f4f6',
      color: isLiked ? 'white' : '#6b7280',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '24px',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
  >
    {isLiked ? '❤️' : '🤍'}
  </button>
);

const SpotInfo = ({ itemId, onGoBack }) => {
  // Props로 받거나 URL에서 추출 (실제 프로젝트에 맞게 조정)
  const id = itemId; // 또는 useParams()로 받기
  
  // 상태 관리
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        setLoading(true);
        
        // API 호출 
        const response = await fetch(`/api/spots/${id}`);
        
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setSpot(data);
        
        // 즐겨찾기 상태도 불러오기 (선택사항)
        // const favoriteResponse = await fetch(`/api/favorites/check/${id}`);
        // if (favoriteResponse.ok) {
        //   const favoriteData = await favoriteResponse.json();
        //   setLiked(favoriteData.isFavorite);
        // }
        
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpotData();
    }
  }, [id]);

  // 즐겨찾기 토글
  const toggleLike = async () => {
    try {
      // API 호출 (실제 구현 시)
      // const response = await fetch(`/api/favorites/toggle/${id}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      setLiked(!liked);
      
      // 성공 피드백 (선택사항)
      // toast.success(liked ? '즐겨찾기에서 제거되었습니다.' : '즐겨찾기에 추가되었습니다.');
      
    } catch (error) {
      console.error('즐겨찾기 실패:', error);
      // toast.error('즐겨찾기 처리에 실패했습니다.');
    }
  };

  // 공유하기
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: spot.name,
          text: `${spot.name} - ${spot.address}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  // 지도에서 보기
  const handleMapClick = () => {
    if (spot.address) {
      const mapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(spot.address)}`;
      window.open(mapUrl, '_blank');
    }
  };

  // 뒤로가기
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error || !spot) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
        <h2 style={{ color: '#111827', marginBottom: '8px' }}>
          {error || '해당 장소를 찾을 수 없습니다.'}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          요청하신 정보를 불러올 수 없습니다.
        </p>
        <button
          onClick={handleGoBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      
      {/* 헤더 - 뒤로가기 + 공유 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={handleGoBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f9fafb';
            e.target.style.borderColor = '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#d1d5db';
          }}
        >
          <ArrowLeft size={16} />
          돌아가기
        </button>

        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          <Share2 size={16} />
          공유하기
        </button>
      </div>

      {/* 메인 컨텐츠 카드 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        
        {/* 이미지 */}
        {spot.imgUrl && (
          <img
            src={spot.imgUrl}
            alt={spot.name}
            style={{
              width: '100%',
              height: '350px',
              objectFit: 'cover'
            }}
          />
        )}

        <div style={{ padding: '32px' }}>
          {/* 제목 + 찜 버튼 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '24px',
            gap: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#111827',
                lineHeight: '1.2'
              }}>
                {spot.name}
              </h1>
              <p style={{
                margin: 0,
                fontSize: '18px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {spot.regionCodeEntity?.name} {spot.wardCodeEntity?.name}
              </p>
            </div>
            <ZzimButton isLiked={liked} onClick={toggleLike} />
          </div>

          {/* 정보 섹션 */}
          <div style={{
            display: 'grid',
            gap: '20px',
            marginBottom: '32px'
          }}>
            
            {/* 주소 */}
            {spot.address && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <MapPin size={24} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    color: '#111827', 
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {spot.address}
                  </p>
                  <button
                    onClick={handleMapClick}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    <Navigation size={14} />
                    지도에서 보기
                  </button>
                </div>
              </div>
            )}

            {/* 연락처 및 기타 정보 */}
            <div style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              
              {/* 전화번호 */}
              {spot.phone && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <Phone size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <a 
                    href={`tel:${spot.phone}`}
                    style={{
                      color: '#111827',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '16px'
                    }}
                  >
                    {spot.phone}
                  </a>
                </div>
              )}

              {/* 웹사이트 */}
              {spot.website && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#fefce8',
                  borderRadius: '12px',
                  border: '1px solid #fde047'
                }}>
                  <Globe size={20} style={{ color: '#ca8a04', flexShrink: 0 }} />
                  <a 
                    href={spot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '16px',
                      wordBreak: 'break-all'
                    }}
                  >
                    웹사이트 바로가기
                  </a>
                </div>
              )}

              {/* 운영시간 */}
              {spot.operatingHours && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#fdf4ff',
                  borderRadius: '12px',
                  border: '1px solid #e9d5ff',
                  gridColumn: '1 / -1'
                }}>
                  <Clock size={20} style={{ color: '#9333ea', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '16px', fontWeight: '600' }}>
                      운영시간
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#374151',
                      whiteSpace: 'pre-line',
                      lineHeight: '1.5'
                    }}>
                      {spot.operatingHours}
                    </p>
                  </div>
                </div>
              )}

              {/* 테마 */}
              {spot.themeCodeEntity && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#fff7ed',
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <Star size={20} style={{ color: '#ea580c', flexShrink: 0 }} />
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: '#ea580c',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {spot.themeCodeEntity.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 설명 */}
          {(spot.description || spot.comment) && (
            <div style={{
              padding: '24px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#111827' 
              }}>
                상세 정보
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '16px', 
                lineHeight: '1.7',
                margin: 0,
                whiteSpace: 'pre-line'
              }}>
                {spot.description || spot.comment || "상세 정보가 없습니다."}
              </p>
            </div>
          )}

          {/* 메타 정보 */}
          {(spot.createdAt || spot.id) && (
            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {spot.id && (
                  <div>
                    <span style={{ fontWeight: '500' }}>ID: </span>
                    <span>{spot.id}</span>
                  </div>
                )}
                {spot.createdAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} />
                    <span>등록일: {new Date(spot.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default SpotInfo;