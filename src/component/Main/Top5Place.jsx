import React, { useState, useEffect } from 'react';
import { Heart, Eye, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

// Top5Place 컴포넌트 (리뷰+조회+찜)
const Top5Place = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(new Set());
  
  // 토스트 관련 state 추가
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const navigate = useNavigate();

  // 토스트 자동 닫기
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  useEffect(() => {
    const loadTop5Data = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/region-list/top5');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Top5 Place API 응답:', result);
        
        const places = result.dataList || result.data || result || [];
        setData(places);
        
        // 사용자의 찜 상태 확인
        if (places.length > 0) {
          await loadUserLikes();
        }
      } catch (error) {
        console.error('Top5 Place 데이터 로딩 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadTop5Data();
  }, []);

  // 사용자의 찜 목록 불러오기
  const loadUserLikes = async () => {
    try {
      const response = await fetch('/api/like/my-likes', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 200 && result.likedDataIds) {
          const likedIds = new Set(result.likedDataIds.map(id => Number(id)));
          setBookmarkedItems(likedIds);
          console.log('✅ 사용자 찜 목록 로드 성공:', result.likedDataIds);
        }
      }
    } catch (error) {
      console.error('❌ 찜 목록 로드 실패:', error);
    }
  };

  // 찜 토글 함수 (토스트 기능 추가)
  const toggleBookmark = async (item, e) => {
    e.stopPropagation();
    const itemId = item.id || item.contentId;
    const itemTitle = item.title || '항목';
    
    if (bookmarkLoading.has(itemId)) return;

    setBookmarkLoading(prev => new Set([...prev, itemId]));
    
    try {
      const response = await fetch(`/api/like/${itemId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`찜 처리 실패: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📊 찜 API 응답:', result);
      
      if (result.code === 200) {
        const newIsBookmarked = result.likeStatus;
        
        setBookmarkedItems(prev => {
          const newSet = new Set(prev);
          if (newIsBookmarked) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
        
        // likeCount 실시간 업데이트
        setData(prevList => 
          prevList.map(dataItem => {
            const dataItemId = dataItem.id || dataItem.contentId;
            return dataItemId === itemId
              ? { 
                  ...dataItem, 
                  likeCount: newIsBookmarked 
                    ? (dataItem.likeCount || 0) + 1 
                    : Math.max((dataItem.likeCount || 0) - 1, 0)
                }
              : dataItem;
          })
        );
        
        // 토스트 메시지 표시
        setSnackbar({
          open: true,
          message: result.message || (newIsBookmarked ? 
            `"${itemTitle}"이(가) 찜 목록에 추가되었습니다` : 
            `"${itemTitle}"이(가) 찜 목록에서 제거되었습니다`),
          severity: newIsBookmarked ? 'success' : 'removed'
        });
        
        console.log(`✅ 찜 ${newIsBookmarked ? '추가' : '제거'} 성공: ${item.title}`);
        
      } else if (result.code === 401) {
        console.log('⚠️ 로그인 필요');
        setSnackbar({
          open: true,
          message: '로그인이 필요한 서비스입니다',
          severity: 'info'
        });
      } else {
        throw new Error(result.error_message || '찜 처리 중 오류가 발생했습니다');
      }
      
    } catch (error) {
      console.error('❌ 찜 처리 실패:', error);
      setSnackbar({
        open: true,
        message: '찜 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
        severity: 'error'
      });
    } finally {
      setBookmarkLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCardClick = (item) => {
    const itemId = item.id 
    console.log('여행지 상세페이지로 이동:', itemId);
    
    navigate(`/spot/${itemId}`, {
      state:
      {
        contentId: item.contentId,
        contentTypeId: item.theme,
        spotData: item,
      }

    });
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

  return (
    <>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        paddingTop: '20px',
        paddingBottom: '20px',
      }}>
        {/* 데스크탑: 5개 카드 한 줄, 모바일: 스와이프 */}
        <div className="top5-container">
          <div className="top5-cards-wrapper">
            {data.map((item, index) => {
              const rank = index + 1;
              const itemId = item.id || item.contentId;
              const isBookmarked = bookmarkedItems.has(itemId);
              const isBookmarkLoading = bookmarkLoading.has(itemId);
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
                        src={getImageUrl(item.firstImage || item.firstimage)}
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
                      
                      {/* 찜 버튼 */}
                      <button
                        onClick={(e) => toggleBookmark(item, e)}
                        disabled={isBookmarkLoading}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '32px',
                          height: '32px',
                          backgroundColor: isBookmarkLoading ? 
                            'rgba(255, 255, 255, 0.7)' : 
                            'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: isBookmarkLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          opacity: isBookmarkLoading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isBookmarkLoading) {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                            e.target.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isBookmarkLoading) {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {isBookmarkLoading ? (
                          <span style={{ fontSize: '14px' }}>⏳</span>
                        ) : (
                          <Heart 
                            style={{ 
                              width: '16px', 
                              height: '16px', 
                              color: isBookmarked ? '#ef4444' : '#6b7280',
                              fill: isBookmarked ? '#ef4444' : 'none'
                            }} 
                          />
                        )}
                      </button>
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
                          {item.regionName || item.addr1 || '위치 정보 없음'}
                          {item.wardName && item.wardName !== item.regionName && (
                            <span> {item.wardName}</span>
                          )}
                        </span>
                      </div>

                      {/* 통계 정보 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* 별점과 좋아요 */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#eab308'
                          }}>
                            <Star style={{ width: '12px', height: '12px', marginRight: '4px', fill: 'currentColor' }} />
                            <span style={{ fontSize: '12px', fontWeight: '500' }}>
                              {item.rating ? item.rating.toFixed(1) : '0.0'}
                            </span>
                            <span style={{ fontSize: '10px', color: '#6b7280', marginLeft: '2px' }}>
                              ({formatNumber(item.reviewCount || 0)})
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#ef4444'
                          }}>
                            <Heart style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                            <span style={{ fontSize: '12px' }}>{formatNumber(item.likeCount || 0)}</span>
                          </div>
                        </div>
                        
                        {/* 조회수 */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#6b7280'
                        }}>
                          <Eye style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                          <span style={{ fontSize: '12px' }}>
                            {formatNumber(item.viewCount || 0)} views
                          </span>
                        </div>
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

            /* 토스트 애니메이션 */
            @keyframes slideDown {
              0% {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
              }
              100% {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }
          `}
        </style>
      </div>

      {/* 토스트 메시지 */}
      {snackbar.open && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          backgroundColor: snackbar.severity === 'success' ? '#4caf50' : 
                         snackbar.severity === 'error' ? '#f44336' : 
                         snackbar.severity === 'removed' ? '#ff9800' : '#2196f3',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideDown 0.3s ease-out',
          maxWidth: '400px'
        }}>
          <span>
            {snackbar.severity === 'success' ? '✅' : 
             snackbar.severity === 'error' ? '❌' : 
             snackbar.severity === 'removed' ? '💔' : 'ℹ️'}
          </span>
          {snackbar.message}
          <button
            onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '16px',
              padding: '0'
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default Top5Place;