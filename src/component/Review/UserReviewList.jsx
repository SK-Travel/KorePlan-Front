import React, { useState, useEffect } from 'react';
import { Star, Calendar, MapPin, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const UserReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 정렬 옵션 (클라이언트 사이드)
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // 모달 상태
  const [editingReview, setEditingReview] = useState(null);

  // 수정 모달 내부 상태
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState('');

  // 사용자 리뷰 목록 조회 (페이징 없이)
  const fetchUserReviews = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews/my-reviews', {
        method: 'POST', // GET에서 POST로 변경
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
      });

      if (response.ok) {
        const result = await response.json();
        if (result.code === 200) {
          setReviews(result.reviews || []);
          setTotalElements(result.count || 0);
        } else {
          setError(result.error_message || '리뷰를 불러오는데 실패했습니다.');
        }
      } else if (response.status === 401) {
        setError('로그인이 필요합니다.');
      } else {
        setError('리뷰를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('사용자 리뷰 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 삭제 확인
  const handleDeleteClick = (review) => {
    if (window.confirm(`"${review.dataTitle}"에 작성한 리뷰를 삭제하시겠습니까?\n삭제한 리뷰는 복구할 수 없습니다.`)) {
      handleDeleteReview(review.reviewId);
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (result.code === 200) {
        alert('리뷰가 삭제되었습니다.');
        
        // 리뷰 삭제 후 목록 새로고침
        if (reviews.length === 1) {
          setReviews([]);
          setTotalElements(0);
        } else {
          fetchUserReviews();
        }
      } else {
        alert(result.error_message || '리뷰 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
      console.error('리뷰 삭제 오류:', err);
    }
  };

  // 리뷰 수정
  const handleUpdateReview = async (reviewId, rating, content) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: rating,
          content: content
        })
      });

      const result = await response.json();

      if (result.code === 200) {
        alert('리뷰가 수정되었습니다.');
        setEditingReview(null);
        fetchUserReviews(); // 목록 새로고침
      } else {
        alert(result.error_message || '리뷰 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
      console.error('리뷰 수정 오류:', err);
    }
  };

  // 장소 상세페이지로 이동
  const handlePlaceClick = (contentId) => {
    window.location.href = `/spot/${contentId}`;
  };

  // 별점 렌더링
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              width: '16px',
              height: '16px',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
              fill: star <= rating ? '#fbbf24' : 'none',
            }}
          />
        ))}
      </div>
    );
  };

  // 페이지 변경 (사용 안 함 - 제거 예정)
  const handlePageChange = (page) => {
    // 페이징 없으므로 주석 처리
  };

  // 정렬 변경 (클라이언트 사이드 정렬)
  const handleSortChange = (newSortBy) => {
    const newDirection = 
      sortBy === newSortBy && sortDirection === 'desc' ? 'asc' : 'desc';
    
    setSortBy(newSortBy);
    setSortDirection(newDirection);
    
    // 클라이언트에서 정렬
    const sortedReviews = [...reviews].sort((a, b) => {
      let aValue, bValue;
      
      if (newSortBy === 'createdAt') {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      } else if (newSortBy === 'rating') {
        aValue = a.rating;
        bValue = b.rating;
      }
      
      if (newDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    setReviews(sortedReviews);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchUserReviews();
  }, []);

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'white',
      padding: '40px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* 전체 컨테이너 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: 'clamp(24px, 5vw, 40px)',
          border: '1px solid #e5e7eb'
        }}>
          {/* 헤더 */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  내 리뷰 ({totalElements})
                </h1>
                <div style={{
                  height: '4px',
                  width: '80px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '2px'
                }}></div>
              </div>

              {/* 정렬 옵션 */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {[
                  { key: 'createdAt', label: '작성일순' },
                  { key: 'rating', label: '별점순' }
                ].map((sort) => (
                  <button
                    key={sort.key}
                    onClick={() => handleSortChange(sort.key)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: sortBy === sort.key ? '#3b82f6' : 'white',
                      color: sortBy === sort.key ? 'white' : '#374151',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {sort.label}
                    {sortBy === sort.key && (
                      <span style={{ fontSize: '12px' }}>
                        {sortDirection === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              color: '#dc2626',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {/* 로딩 상태 */}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '60px 0'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}

          {/* 리뷰 목록 */}
          {!loading && reviews.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              {reviews.map((review, index) => (
                <div
                  key={review.reviewId || index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '16px',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {/* 리뷰 헤더 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    {/* 장소 정보 */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <h3 
                          style={{
                            margin: 0,
                            fontSize: 'clamp(16px, 3vw, 18px)',
                            fontWeight: '600',
                            color: '#1f2937',
                            cursor: 'pointer',
                            textDecoration: 'none'
                          }}
                          onClick={() => handlePlaceClick(review.contentId)}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#3b82f6';
                            e.target.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#1f2937';
                            e.target.style.textDecoration = 'none';
                          }}
                        >
                          {review.dataTitle || '장소명 없음'}
                        </h3>
                      </div>

                      {/* 별점과 작성일 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        {renderStars(review.rating)}
                        <span style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => {
                          setEditingReview(review);
                          setEditRating(review.rating);
                          setEditContent(review.content);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          color: '#374151'
                        }}
                      >
                        <Edit style={{ width: '14px', height: '14px' }} />
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteClick(review)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          color: '#dc2626'
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                        삭제
                      </button>
                    </div>
                  </div>

                  {/* 리뷰 내용 */}
                  <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p style={{
                      margin: 0,
                      lineHeight: '1.6',
                      color: '#374151',
                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                      wordBreak: 'break-word'
                    }}>
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 리뷰가 없을 때 */}
          {!loading && reviews.length === 0 && !error && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#6b7280'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <Star style={{ width: '64px', height: '64px', margin: '0 auto', color: '#d1d5db' }} />
              </div>
              <h3 style={{
                fontSize: 'clamp(18px, 3vw, 20px)',
                marginBottom: '8px',
                color: '#6b7280',
                fontWeight: '600'
              }}>
                작성한 리뷰가 없습니다
              </h3>
              <p style={{
                color: '#9ca3af',
                margin: 0,
                fontSize: 'clamp(14px, 2.5vw, 16px)'
              }}>
                여행지를 방문하고 첫 번째 리뷰를 작성해보세요!
              </p>
            </div>
          )}

          {/* 페이지네이션 제거 */}
        </div>

        {/* 수정 모달 */}
        {editingReview && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                리뷰 수정
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  margin: '0 0 8px 0',
                  color: '#6b7280',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin style={{ width: '14px', height: '14px' }} />
                  {editingReview.dataTitle}
                </p>
              </div>

              {/* 별점 입력 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  별점
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setEditRating(star)}
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        color: star <= editRating ? '#fbbf24' : '#d1d5db',
                        fill: star <= editRating ? '#fbbf24' : 'none',
                      }}
                    />
                  ))}
                  <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>
                    ({editRating}점)
                  </span>
                </div>
              </div>

              {/* 리뷰 내용 입력 */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  리뷰 내용
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="이곳에 대한 솔직한 후기를 남겨주세요..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* 버튼들 */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setEditRating(5);
                    setEditContent('');
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    if (!editContent.trim()) {
                      alert('리뷰 내용을 입력해주세요.');
                      return;
                    }
                    handleUpdateReview(editingReview.reviewId, editRating, editContent);
                  }}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  수정 완료
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 스핀 애니메이션 CSS */}
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
};

export default UserReviewList;