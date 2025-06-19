import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, Send } from 'lucide-react';
//백엔드 컨트롤러 만들고 갖고오기.
const DataReviewList = ({ dataId, onReviewUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 리뷰 작성 상태
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 리뷰 목록 조회
  const fetchReviews = async (page = 0) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/reviews/data/${dataId}?page=${page}&size=10&sort=createdAt,desc`);

      if (response.ok) {
        const data = await response.json();
        setReviews(data.content || []);
        setCurrentPage(data.pageable?.pageNumber || 0);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        setError('리뷰를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('리뷰 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 작성
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataId: dataId,
          rating: newReview.rating,
          content: newReview.content.trim()
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        alert('리뷰가 성공적으로 작성되었습니다!');
        setNewReview({ rating: 5, content: '' });

        // 리뷰 목록 새로고침
        fetchReviews(0);

        // 상위 컴포넌트에 리뷰 업데이트 알림
        if (onReviewUpdate && result.reviewCount !== undefined && result.averageRating !== undefined) {
          onReviewUpdate(result.reviewCount, result.averageRating);
        }
      } else if (result.code === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert(result.error_message || '리뷰 작성에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
      console.error('리뷰 작성 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 별점 렌더링
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              width: '20px',
              height: '20px',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
              fill: star <= rating ? '#fbbf24' : 'none',
              cursor: interactive ? 'pointer' : 'default'
            }}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchReviews(page);
    }
  };

  // 컴포넌트 마운트 시 리뷰 조회
  useEffect(() => {
    if (dataId) {
      fetchReviews(0);
    }
  }, [dataId]);

  return (
    // 다른 컴포넌트와 동일한 레이아웃 구조 적용
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
        {/* 전체 컨텐츠를 감싸는 그림자 박스 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: 'clamp(24px, 5vw, 40px)',
          border: '1px solid #e5e7eb'
        }}>
          {/* 리뷰 헤더 */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 28px)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px',
              textAlign: 'left'
            }}>
              리뷰 ({totalElements})
            </h2>
            <div style={{
              height: '4px',
              width: '80px',
              backgroundColor: '#3b82f6',
              borderRadius: '2px'
            }}></div>
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
            <div style={{ marginBottom: '40px' }}>
              {reviews.map((review, index) => (
                <div key={index} style={{
                  borderBottom: index === reviews.length - 1 ? 'none' : '1px solid #e5e7eb',
                  paddingBottom: '24px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    {/* 사용자 아바타 */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#d1d5db',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User style={{ width: '24px', height: '24px', color: '#6b7280' }} />
                    </div>

                    {/* 리뷰 내용 */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: 'clamp(14px, 2.5vw, 16px)'
                        }}>
                          사용자 {review.userid}
                        </span>
                        {renderStars(review.rate)}
                        <span style={{
                          fontSize: 'clamp(12px, 2vw, 14px)',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar style={{ width: '16px', height: '16px' }} />
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>

                      <p style={{
                        color: '#374151',
                        lineHeight: '1.6',
                        fontSize: 'clamp(14px, 2.5vw, 15px)',
                        margin: 0,
                        wordBreak: 'break-word'
                      }}>
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 리뷰가 없을 때 */}
          {!loading && reviews.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <Star style={{ width: '64px', height: '64px', margin: '0 auto', color: '#d1d5db' }} />
              </div>
              <p style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                marginBottom: '8px',
                color: '#6b7280'
              }}>
                아직 리뷰가 없습니다.
              </p>
              <p style={{
                color: '#9ca3af',
                margin: 0,
                fontSize: 'clamp(14px, 2.5vw, 16px)'
              }}>
                첫 번째 리뷰를 작성해보세요!
              </p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(6px, 2vw, 8px)',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                style={{
                  padding: 'clamp(6px 12px, 2vw, 8px 16px)',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 0 ? 0.5 : 1,
                  minWidth: '60px'
                }}
              >
                이전
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage < 3 ? i : currentPage - 2 + i;
                if (page >= totalPages) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: 'clamp(6px 10px, 2vw, 8px 12px)',
                      fontSize: 'clamp(12px, 2vw, 14px)',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: page === currentPage ? '#3b82f6' : 'white',
                      color: page === currentPage ? 'white' : '#374151',
                      cursor: 'pointer',
                      minWidth: '60px'
                    }}
                  >
                    {page + 1}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                style={{
                  padding: 'clamp(6px 12px, 2vw, 8px 16px)',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                  minWidth: '60px'
                }}
              >
                다음
              </button>
            </div>
          )}

          {/* 리뷰 작성 폼 */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: 'clamp(20px, 4vw, 24px)',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              리뷰 작성
            </h3>

            <form onSubmit={handleSubmitReview}>
              {/* 별점 선택 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  별점
                </label>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>

              {/* 리뷰 내용 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  리뷰 내용
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="이곳에 대한 솔직한 후기를 남겨주세요..."
                  style={{
                    width: '100%',
                    minHeight: 'clamp(80px, 15vw, 100px)',
                    padding: 'clamp(10px, 2vw, 12px)',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting || !newReview.content.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: 'clamp(10px 20px, 3vw, 12px 24px)',
                  backgroundColor: isSubmitting || !newReview.content.trim() ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: '500',
                  cursor: isSubmitting || !newReview.content.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
                {isSubmitting ? '작성 중...' : '리뷰 작성'}
              </button>
            </form>
          </div>
        </div>
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

export default DataReviewList;