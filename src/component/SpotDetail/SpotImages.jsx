import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, ImageIcon, AlertCircle } from 'lucide-react';

const SpotImages = ({ contentId, displayMode = "grid" }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [imageLoadStatus, setImageLoadStatus] = useState({}); // 이미지 로드 상태 추적

  // 이미지 프리로드 함수
  const preloadImages = useCallback((imageList) => {
    imageList.forEach((image, index) => {
      // 작은 이미지 먼저 프리로드
      const smallImg = new Image();
      smallImg.onload = () => {
        setImageLoadStatus(prev => ({
          ...prev,
          [`small_${index}`]: true
        }));
      };
      smallImg.src = image.smallimageurl;
      
      // 원본 이미지도 백그라운드에서 프리로드
      const originImg = new Image();
      originImg.onload = () => {
        setImageLoadStatus(prev => ({
          ...prev,
          [`origin_${index}`]: true
        }));
      };
      originImg.src = image.originimgurl;
    });
  }, []);

  // 이미지 데이터 로드
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 이미지 API 호출 시작:', contentId);
        const response = await fetch(`/api/spots/${contentId}/images`);
        console.log('📡 API 응답 상태:', response.status);
        
        if (!response.ok) {
          throw new Error('이미지를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('📋 받은 데이터 전체:', data);
        
        const imageList = data.response?.body?.items?.item || [];
        console.log('🖼️ 추출된 이미지 리스트:', imageList);
        console.log('🔍 첫 번째 이미지 URL:', imageList[0]?.originimgurl);
        
        setImages(imageList);
        
        // 이미지 프리로드 시작
        if (imageList.length > 0) {
          preloadImages(imageList);
        }
        
      } catch (err) {
        console.error('❌ 이미지 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (contentId) {
      fetchImages();
    }
  }, [contentId, preloadImages]);

  // 슬라이더 네비게이션 - useCallback으로 최적화
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % images.length;
      console.log(`슬라이드 변경: ${prev} → ${next}`);
      return next;
    });
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev - 1 + images.length) % images.length;
      console.log(`슬라이드 변경: ${prev} → ${next}`);
      return next;
    });
  }, [images.length]);

  // 현재 슬라이드 이미지 메모이제이션
  const currentImage = useMemo(() => images[currentSlide], [images, currentSlide]);

  // 이미지 에러 핸들러
  const handleImageError = useCallback((e, image, fallbackField) => {
    console.log('❌ 이미지 로드 실패:', e.target.src);
    if (fallbackField && image[fallbackField] && e.target.src !== image[fallbackField]) {
      e.target.src = image[fallbackField];
    }
  }, []);

  // 모달 관련 함수들
  const openModal = useCallback((index) => {
    setModalImageIndex(index);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const nextModalImage = useCallback(() => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevModalImage = useCallback(() => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) {
        if (e.key === 'ArrowLeft') prevModalImage();
        if (e.key === 'ArrowRight') nextModalImage();
        if (e.key === 'Escape') closeModal();
      } else if (displayMode === 'slider' && images.length > 1) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, displayMode, images.length, prevModalImage, nextModalImage, closeModal, prevSlide, nextSlide]);

  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>이미지를 불러오는 중...</p>
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
        height: '300px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca'
      }}>
        <AlertCircle size={40} style={{ color: '#ef4444', marginBottom: '12px' }} />
        <p style={{ color: '#dc2626', fontWeight: '500', marginBottom: '8px' }}>
          이미지를 불러올 수 없습니다
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {error}
        </p>
      </div>
    );
  }

  // 이미지가 없는 경우
  if (!images || images.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '2px dashed #d1d5db'
      }}>
        <ImageIcon size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '500' }}>
          등록된 이미지가 없습니다
        </p>
      </div>
    );
  }

  // 슬라이더 모드
  if (displayMode === 'slider') {
    return (
      <>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#000',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {/* 메인 이미지 - 작은 이미지를 기본으로, 원본이 로드되면 교체 */}
          <img
            key={`slide-${currentSlide}`} // 키 추가로 강제 리렌더링
            src={
              imageLoadStatus[`origin_${currentSlide}`] 
                ? currentImage?.originimgurl 
                : currentImage?.smallimageurl || currentImage?.originimgurl
            }
            alt={currentImage?.imgname || `이미지 ${currentSlide + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out' // 부드러운 전환
            }}
            onClick={() => openModal(currentSlide)}
            onError={(e) => handleImageError(e, currentImage, 'smallimageurl')}
            onLoad={() => console.log(`✅ 슬라이드 ${currentSlide} 이미지 로드 완료`)}
          />

          {/* 슬라이더 컨트롤 */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.9)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* 인디케이터 */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: index === currentSlide ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          )}

          {/* 이미지 카운터 */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 10
          }}>
            {currentSlide + 1} / {images.length}
          </div>
        </div>

        {/* 썸네일 */}
        {images.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            overflowX: 'auto',
            padding: '8px 0'
          }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image.smallimageurl || image.originimgurl}
                alt={image.imgname || `썸네일 ${index + 1}`}
                style={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: index === currentSlide ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onClick={() => setCurrentSlide(index)}
                onError={(e) => handleImageError(e, image, 'originimgurl')}
              />
            ))}
          </div>
        )}

        {/* 모달 */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} onClick={closeModal}>
            <div style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }} onClick={(e) => e.stopPropagation()}>
              <img
                src={images[modalImageIndex]?.originimgurl || images[modalImageIndex]?.smallimageurl}
                alt={images[modalImageIndex]?.imgname || `확대된 이미지 ${modalImageIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => handleImageError(e, images[modalImageIndex], 'smallimageurl')}
              />
              
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    style={{
                      position: 'absolute',
                      left: '-60px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={nextModalImage}
                    style={{
                      position: 'absolute',
                      right: '-60px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  
   
  
};

export default SpotImages;