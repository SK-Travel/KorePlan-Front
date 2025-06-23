import React, { useState, useEffect } from 'react';
import { Trash2, Heart, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Like = () => {
  const [likedPlaces, setLikedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const navigate = useNavigate();

  // 전체 좋아요 목록 조회
  const fetchLikedPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/like/all-liked-places', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.code === 200) {
        setLikedPlaces(data.allLikedPlaces || []);
      } else if (data.code === 401) {
        setError('로그인이 필요합니다.');
      } else {
        setError(data.error_message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('좋아요 목록 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 삭제 (토글)
  const handleRemoveLike = async (dataId, e) => {
    e.stopPropagation();
    
    if (deletingIds.has(dataId)) return;
    
    try {
      setDeletingIds(prev => new Set([...prev, dataId]));
      
      const response = await fetch(`/api/like/${dataId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.code === 200) {
        setLikedPlaces(prev => prev.filter(place => (place.id || place.contentId) !== dataId));
      } else if (data.code === 401) {
        setError('로그인이 필요합니다.');
      } else {
        setError(data.error_message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('좋아요 삭제 오류:', err);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(dataId);
        return newSet;
      });
    }
  };

  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (place) => {
    const contentId = place.contentId || place.id;
    console.log('여행지 상세페이지로 이동:', contentId);
    
    navigate(`/spot/${contentId}`, {
      state: {
        contentId: contentId,
        contentTypeId: place.theme || place.contentTypeId,
        spotData: place,
      }
    });
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchLikedPlaces();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RefreshCw style={{
              animation: 'spin 1s linear infinite',
              width: '32px',
              height: '32px',
              color: '#3b82f6',
              marginRight: '12px'
            }} />
            <span style={{
              fontSize: '18px',
              color: '#4b5563'
            }}>좋아요 목록을 불러오고 있습니다...</span>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <AlertCircle style={{ width: '32px', height: '32px', marginRight: '12px' }} />
            <div>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>{error}</p>
              <button 
                onClick={fetchLikedPlaces}
                style={{
                  marginTop: '16px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 헤더 */}
        <div style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1
            }}>
              <Heart style={{
                width: '24px',
                height: '24px',
                color: '#ef4444',
                marginRight: '12px',
                flexShrink: 0
              }} />
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0,
                lineHeight: '1.2'
              }}>내 찜 목록</h1>
            </div>
            <span style={{
              fontSize: '14px',
              color: '#6b7280',
              marginLeft: '16px',
              flexShrink: 0
            }}>
              총 {likedPlaces.length}개
            </span>
          </div>
        </div>

        {/* 좋아요 목록 */}
        <div style={{ 
          padding: '16px',
          maxHeight: likedPlaces.length > 5 ? '500px' : 'auto',
          overflowY: likedPlaces.length > 5 ? 'auto' : 'visible'
        }}>
          {likedPlaces.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: '#6b7280'
            }}>
              <Heart style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                color: '#d1d5db'
              }} />
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>아직 찜한 여행지가 없습니다</p>
              <p style={{ fontSize: '14px' }}>마음에 드는 여행지를 찜해보세요!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {likedPlaces.map((place) => {
                const placeId = place.id || place.contentId;
                const isDeleting = deletingIds.has(placeId);
                
                return (
                  <div
                    key={placeId}
                    onClick={() => handleCardClick(place)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* 이미지 */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginRight: '16px',
                      flexShrink: 0,
                      background: '#f3f4f6'
                    }}>
                      {(place.firstImage || place.firstimage) ? (
                        <img
                          src={place.firstImage || place.firstimage}
                          alt={place.title || '이미지'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: (place.firstImage || place.firstimage) ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#e5e7eb'
                      }}>
                        <MapPin style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                      </div>
                    </div>

                    {/* 정보 */}
                    <div style={{ 
                      flex: 1,
                      minWidth: 0, // 텍스트 오버플로우 방지
                      paddingRight: '12px'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0 0 8px 0',
                        lineHeight: '1.3',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {place.title || '제목 없음'}
                      </h3>
                      
                      {(place.regionName || place.addr1) && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <MapPin style={{
                            width: '14px',
                            height: '14px',
                            color: '#6b7280',
                            marginRight: '6px',
                            flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {place.regionName || place.addr1}
                            {place.wardName && place.wardName !== place.regionName && (
                              <span> {place.wardName}</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => handleRemoveLike(placeId, e)}
                      disabled={isDeleting}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'transparent',
                        border: '1px solid rgba(148, 163, 184, 0.5)',
                        color: isDeleting ? '#9ca3af' : '#64748b',
                        borderRadius: '8px',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                      onMouseOver={(e) => {
                        if (!isDeleting) {
                          e.target.style.background = '#fee2e2';
                          e.target.style.borderColor = '#fca5a5';
                          e.target.style.color = '#dc2626';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isDeleting) {
                          e.target.style.background = 'transparent';
                          e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                          e.target.style.color = '#64748b';
                        }
                      }}
                    >
                      {isDeleting ? (
                        <RefreshCw style={{
                          width: '16px',
                          height: '16px',
                          animation: 'spin 1s linear infinite'
                        }} />
                      ) : (
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* 스크롤바 스타일링 */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default Like;