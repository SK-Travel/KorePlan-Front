import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { MdArrowCircleRight, MdArrowCircleLeft, MdVisibility } from "react-icons/md";
import { Wrapper, TitleBox, SliderContainer, SlideItem, SlideImage, Overlay } from "../../styles/RolingSlideStyle";

// 화살표 컴포넌트 (함수형으로 onClick 받음)
const PrevArrow = (props) => {
  const { onClick, style } = props;
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      <MdArrowCircleLeft size={36} color="#333" />
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick, style } = props;
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      <MdArrowCircleRight size={36} color="#333" />
    </button>
  );
};

function Top5Festival() {
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 순위별 뱃지 스타일 함수
  const getRankBadge = (index) => {
    const rank = index + 1;
    let backgroundColor, emoji;

    switch (rank) {
      case 1:
        backgroundColor = '#ffd700'; // 금색
        emoji = '🥇';
        break;
      case 2:
        backgroundColor = '#c0c0c0'; // 은색
        emoji = '🥈';
        break;
      case 3:
        backgroundColor = '#cd7f32'; // 동색
        emoji = '🥉';
        break;
      case 4:
        backgroundColor = '#4ade80'; // 초록색
        emoji = '4️⃣';
        break;
      case 5:
        backgroundColor = '#60a5fa'; // 파란색
        emoji = '5️⃣';
        break;
      default:
        backgroundColor = '#9ca3af'; // 회색
        emoji = '🏷️';
    }

    return {
      backgroundColor,
      emoji,
      rank
    };
  };

  // 백엔드에서 조회수 상위 5개 축제 가져오기
  useEffect(() => {
    const fetchTop5Festivals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎪 인기 축제 API 호출 시작 (/popular)');
        
        const response = await fetch('http://localhost:8080/api/festival/popular');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ 인기 축제 TOP5 데이터 로드 완료:', data);
        
        setFestivals(data);
        
      } catch (error) {
        console.error('❌ 인기 축제 TOP5 로드 실패:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTop5Festivals();
  }, []);

  // 축제 클릭 핸들러
  const handleFestivalClick = (festival) => {
    console.log('🎯 축제 클릭:', festival.title);
    
    // 축제 상세페이지로 이동 (state로 festivalData 전달)
    navigate(`/festival/${festival.contentId}`, {
      state: {
        contentTypeId: 15,
        festivalData: festival
      }
    });
  };

  // 이미지 에러 처리
  const handleImageError = (e) => {
    e.target.src = '/images/default-festival.jpg'; // 기본 이미지로 대체
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: festivals.length > 1, // 데이터가 1개 이하면 infinite 비활성화
    centerPadding: "100px",
    slidesToShow: Math.min(3, festivals.length), // 데이터 개수에 따라 조정
    slidesToScroll: 1,
    autoplay: festivals.length > 1, // 데이터가 1개 이하면 autoplay 비활성화
    autoplaySpeed: 3000,
    speed: 500,
    arrows: festivals.length > 1, // 데이터가 1개 이하면 화살표 비활성화
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "50px",
        },
      },
    ],
  };

  // 로딩 상태
  if (loading) {
    return (
      <Wrapper>
        <TitleBox>조회수 높은 축제/행사/공연</TitleBox>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>인기 축제를 불러오는 중...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </Wrapper>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Wrapper>
        <TitleBox>조회수 높은 축제/행사/공연</TitleBox>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          margin: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <span style={{ color: 'white', fontSize: '24px' }}>!</span>
          </div>
          <p style={{ color: '#dc2626', fontWeight: '500', marginBottom: '8px' }}>
            인기 축제를 불러올 수 없습니다
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {error}
          </p>
        </div>
      </Wrapper>
    );
  }

  // 데이터가 없는 경우
  if (!festivals || festivals.length === 0) {
    return (
      <Wrapper>
        <TitleBox>조회수 높은 축제/행사/공연</TitleBox>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          margin: '20px'
        }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            현재 표시할 인기 축제가 없습니다
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <TitleBox>조회수 높은 축제/행사/공연</TitleBox>
      <SliderContainer>
        <Slider {...settings}>
          {festivals.map((festival, index) => {
            const rankBadge = getRankBadge(index);
            
            return (
              <SlideItem 
                key={festival.contentId} 
                onClick={() => handleFestivalClick(festival)}
                style={{ cursor: 'pointer' }}
              >
                <SlideImage 
                  src={festival.firstimage || '/images/default-festival.jpg'} 
                  alt={festival.title}
                  onError={handleImageError}
                />
                {/* 제목과 순위 뱃지 영역 (상단) - 기존 Overlay 영역 */}
                <Overlay>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      textAlign: 'center',
                      lineHeight: '1.4'
                    }}>
                      {festival.title}
                    </div>
                    
                    {/* 순위 뱃지 (제목 옆) */}
                    <div style={{
                      fontSize: '10px',
                      backgroundColor: rankBadge.backgroundColor,
                      color: '#333',
                      padding: '3px 6px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      minWidth: 'fit-content',
                      flexShrink: 0
                    }}>
                      <span>{rankBadge.emoji}</span>
                      <span>{rankBadge.rank}위</span>
                    </div>
                  </div>
                </Overlay>
                
                {/* 조회수 (오른쪽 하단) - 별도 절대 위치 */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(4px)',
                  zIndex: 2
                }}>
                  <MdVisibility size={14} />
                  <span>{festival.viewCount.toLocaleString()}</span>
                </div>
              </SlideItem>
            );
          })}
        </Slider>
      </SliderContainer>
    </Wrapper>
  );
}

export default Top5Festival;