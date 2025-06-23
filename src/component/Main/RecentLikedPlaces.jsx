import React, { useState, useEffect } from 'react';
import { Heart, Eye, Star, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

// RecentLikedPlaces 컴포넌트
const RecentLikedPlaces = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecentLikedData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 새로운 API 호출 - 최근 찜한 여행지 5개 직접 조회
        const response = await fetch('/api/like/recent-liked-places', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('로그인이 필요한 서비스입니다.');
            setData([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('최근 찜한 여행지 API 응답:', result);
        
        if (result.code === 200 && result.recentLikedPlaces) {
          const places = result.recentLikedPlaces.map(item => ({
            ...item,
            // 기존 코드와 호환을 위한 필드 매핑
            firstImage: item.firstimage,
            contentId: item.contentId
          }));
          
          setData(places);
          
          // 찜한 데이터 ID 설정 (모든 데이터가 찜한 상태)
          const likedIds = places.map(place => place.id);
          setBookmarkedItems(new Set(likedIds.map(id => Number(id))));
          
        } else if (result.code === 401) {
          setError('로그인이 필요한 서비스입니다.');
          setData([]);
        } else {
          setData([]);
        }
        
      } catch (error) {
        console.error('최근 찜한 데이터 로딩 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentLikedData();
  }, []);

  // 찜 토글 함수
  const toggleBookmark = async (item, e) => {
    e.stopPropagation();
    const itemId = item.id || item.contentId;
    
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
            // 찜 해제시 목록에서 제거
            setData(prevData => prevData.filter(dataItem => {
              const dataItemId = dataItem.id || dataItem.contentId;
              return dataItemId !== itemId;
            }));
          }
          return newSet;
        });
        
        // likeCount 실시간 업데이트
        if (newIsBookmarked) {
          setData(prevList => 
            prevList.map(dataItem => {
              const dataItemId = dataItem.id || dataItem.contentId;
              return dataItemId === itemId
                ? { 
                    ...dataItem, 
                    likeCount: (dataItem.likeCount || 0) + 1
                  }
                : dataItem;
            })
          );
        }
        
        console.log(`✅ 찜 ${newIsBookmarked ? '추가' : '제거'} 성공: ${item.title}`);
        
      } else if (result.code === 401) {
        console.log('⚠️ 로그인 필요');
        alert('로그인이 필요한 서비스입니다.');
      } else {
        throw new Error(result.error_message || '찜 처리 중 오류가 발생했습니다');
      }
      
    } catch (error) {
      console.error('❌ 찜 처리 실패:', error);
      alert('찜 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setBookmarkLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCardClick = (item) => {
    const itemId = item.contentId;
    console.log('여행지 상세페이지로 이동:', itemId);
    
    navigate(`/spot/${itemId}`, {
      state: {
        contentId: item.contentId,
        contentTypeId: item.theme,
        spotData: item,
      }
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="recent-liked-container">
        <div className="recent-liked-cards-wrapper">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="recent-liked-card" style={{
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

  // 에러 상태
  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>⚠️ {error}</h3>
        {error.includes('로그인') ? (
          <p>로그인 후 찜한 여행지를 확인해보세요!</p>
        ) : (
          <p>다시 시도해주세요.</p>
        )}
      </div>
    );
  }

  // 데이터가 없는 경우
  if (data.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
      }}>
        <Heart style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
        <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>아직 찜한 여행지가 없어요</h3>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>마음에 드는 여행지를 찜해보세요!</p>
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
      <div className="recent-liked-container">
        <div className="recent-liked-cards-wrapper">
          {data.map((item, index) => {
            const itemId = item.id || item.contentId;
            const isBookmarked = bookmarkedItems.has(itemId);
            const isBookmarkLoading = bookmarkLoading.has(itemId);
            
            return (
              <div
                key={itemId}
                className="recent-liked-card"
                onClick={() => handleCardClick(item)}
              >
                

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
          .recent-liked-container {
            position: relative;
            width: 100%;
          }

          .recent-liked-cards-wrapper {
            display: flex;
            gap: 20px;
            width: 100%;
            justify-content: flex-start;
          }

          .recent-liked-card {
            flex: 1;
            min-width: 200px;
            max-width: 240px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .recent-liked-card:hover {
            transform: translateY(-4px);
            z-index: 10;
          }

          /* 모바일 스타일 */
          @media (max-width: 768px) {
            .recent-liked-cards-wrapper {
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              scrollbar-width: none;
              -ms-overflow-style: none;
              justify-content: flex-start;
              padding: 0 20px;
              gap: 16px;
            }

            .recent-liked-cards-wrapper::-webkit-scrollbar {
              display: none;
            }

            .recent-liked-card {
              flex: none;
              min-width: 280px;
              max-width: 280px;
              scroll-snap-align: start;
            }

            .recent-liked-card:hover {
              transform: none;
            }
          }

          /* 더 작은 모바일 */
          @media (max-width: 480px) {
            .recent-liked-cards-wrapper {
              padding: 0 16px;
              gap: 12px;
            }
            
            .recent-liked-card {
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

export default RecentLikedPlaces;