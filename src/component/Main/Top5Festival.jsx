import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// 순위별 배지 스타일 및 이모지 함수
const getRankStyle = (rank) => {
  let backgroundColor, emoji, text;
  
  switch (rank) {
    case 1:
      backgroundColor = '#ffd700'; // 금색
      emoji = '🥇';
      text = '1위';
      break;
    case 2:
      backgroundColor = '#c0c0c0'; // 은색
      emoji = '🥈';
      text = '2위';
      break;
    case 3:
      backgroundColor = '#cd7f32'; // 동색
      emoji = '🥉';
      text = '3위';
      break;
    case 4:
      backgroundColor = '#4ade80'; // 초록색
      emoji = '🏅';
      text = '4위';
      break;
    case 5:
      backgroundColor = '#60a5fa'; // 파란색
      emoji = '🏅';
      text = '5위';
      break;
    default:
      backgroundColor = '#9ca3af'; // 회색
      emoji = '🏷️';
      text = `${rank}위`;
  }
  
  return { backgroundColor, emoji, text };
};

// 숫자 포맷팅 함수
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// 플레이스홀더 이미지 생성 함수
const createPlaceholderImage = () => {
  const svg = `
    <svg width="320" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <rect x="10" y="10" width="300" height="180" fill="#e9ecef" stroke="#dee2e6" stroke-width="2" rx="8"/>
      <circle cx="160" cy="80" r="20" fill="#6c757d"/>
      <rect x="100" y="110" width="120" height="8" fill="#6c757d" rx="4"/>
      <rect x="120" y="125" width="80" height="6" fill="#adb5bd" rx="3"/>
      <text x="160" y="155" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="12">대표 이미지 없음</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

// 이미지 URL 처리 함수
const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return createPlaceholderImage();
  }
  return imageUrl;
};

// 이미지 에러 핸들러
const handleImageError = (e) => {
  e.target.src = createPlaceholderImage();
};

// Top5Festival 컴포넌트 (조회수만)
const Top5Festival = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTop5Festivals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎪 인기 축제 API 호출 시작 (/api/festival/popular)');
        
        const response = await fetch('/api/festival/popular');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const festivals = await response.json();
        console.log('✅ 인기 축제 TOP5 데이터 로드 완료:', festivals);
        
        setData(festivals);
        
      } catch (error) {
        console.error('❌ 인기 축제 TOP5 로드 실패:', error);
        setError('축제 데이터를 불러오는데 실패했습니다.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTop5Festivals();
  }, []);

  const handleCardClick = (item) => {
    const itemId = item.contentId;
    console.log('🎯 축제 상세페이지로 이동:', itemId, item.title);
    
    
    navigate(`/festival/${itemId}`, {
      state: {
        contentTypeId: 15,
        festivalData: item
      }
    });
  };

  // 슬라이드 이동 함수
  const goToSlide = (direction) => {
    if (direction === 'prev' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === 'next' && currentSlide < data.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  if (loading) {
    return (
      <div className="top5-container">
        <div className="top5-cards-wrapper">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="top5-card" style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              <div style={{
                backgroundColor: '#e5e7eb',
                borderRadius: '12px',
                height: '224px',
                marginBottom: '12px'
              }}></div>
              <div style={{
                height: '16px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                marginBottom: '8px'
              }}></div>
              <div style={{
                height: '12px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                width: '75%'
              }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>⚠️ 오류 발생</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <p>현재 표시할 인기 축제가 없습니다</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      paddingTop: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {/* 데스크탑: 5개 카드 한 줄, 모바일: 스와이프 */}
      <div className="top5-container">
        <div className="top5-cards-wrapper">
          {data.map((item, index) => {
            const rank = index + 1;
            const itemId = item.contentId || item.id;
            const rankStyle = getRankStyle(rank);
            
            return (
              <div
                key={itemId}
                className="top5-card"
                onClick={() => handleCardClick(item)}
              >
                {/* 순위 배지 */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  zIndex: 20,
                  minWidth: '50px',
                  height: '28px',
                  background: rankStyle.backgroundColor,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  color: rank <= 3 ? '#000000' : '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  padding: '0 8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  border: rank <= 3 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                }}>
                  <span style={{ fontSize: '14px' }}>{rankStyle.emoji}</span>
                  <span>{rankStyle.text}</span>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}>
                  {/* 이미지 섹션 */}
                  <div style={{
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={getImageUrl(item.firstimage || item.firstImage)}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={handleImageError}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    
                    {/* 축제 배지 */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(147, 51, 234, 0.9)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      🎪 축제
                    </div>
                  </div>

                  {/* 콘텐츠 섹션 */}
                  <div style={{ padding: '12px' }}>
                    {/* 제목 */}
                    <h3 style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#1f2937',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'color 0.3s ease'
                    }}>
                      {item.title || '제목 없음'}
                    </h3>
                    
                    {/* 위치 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      marginBottom: '8px'
                    }}>
                      <MapPin style={{ width: '12px', height: '12px', marginRight: '4px', flexShrink: 0 }} />
                      <span style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.addr1 || item.regionName || '위치 정보 없음'}
                      </span>
                    </div>

                    {/* 축제 기간 (있는 경우) */}
                    {(item.eventstartdate || item.eventenddate) && (
                      <div style={{
                        fontSize: '11px',
                        color: '#8b5cf6',
                        marginBottom: '8px',
                        backgroundColor: '#f3f4f6',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        📅 {item.eventstartdate && item.eventstartdate.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
                        {item.eventstartdate && item.eventenddate && ' ~ '}
                        {item.eventenddate && item.eventenddate.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
                      </div>
                    )}

                    {/* 통계 정보 - 조회수만 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      backgroundColor: '#f9fafb',
                      padding: '8px',
                      borderRadius: '8px'
                    }}>
                      <Eye style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>
                        {item.viewCount ? formatNumber(item.viewCount) : '0'} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 반응형 스타일 */}
      <style>
        {`
          .top5-container {
            position: relative;
            width: 100%;
          }

          .top5-cards-wrapper {
            display: flex;
            gap: 20px;
            width: 100%;
            justify-content: space-between;
          }

          .top5-card {
            flex: 1;
            min-width: 200px;
            max-width: 240px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .top5-card:hover {
            transform: translateY(-4px);
            z-index: 10;
          }

          /* 모바일 스타일 */
          @media (max-width: 768px) {
            .top5-cards-wrapper {
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              scrollbar-width: none;
              -ms-overflow-style: none;
              justify-content: flex-start;
              padding: 0 20px;
              gap: 16px;
            }

            .top5-cards-wrapper::-webkit-scrollbar {
              display: none;
            }

            .top5-card {
              flex: none;
              min-width: 280px;
              max-width: 280px;
              scroll-snap-align: start;
            }

            .top5-card:hover {
              transform: none;
            }
          }

          /* 더 작은 모바일 */
          @media (max-width: 480px) {
            .top5-cards-wrapper {
              padding: 0 16px;
              gap: 12px;
            }
            
            .top5-card {
              min-width: 260px;
              max-width: 260px;
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Top5Festival;