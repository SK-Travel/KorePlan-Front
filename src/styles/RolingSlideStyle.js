import styled from 'styled-components';

// 전체 Wrapper: 제목 위, 슬라이드 아래
export const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;   /* 세로 스택 */
  align-items: flex-start;
  padding: 2rem 16px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 1.5rem 16px;
  }
`;

// 제목 텍스트
export const TitleBox = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

// 슬라이더 컨테이너
export const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  
  /* 트랙을 flex 컨테이너로 */
  .slick-track {
    display: flex !important;
    align-items: center !important;
  }

  /* 모든 슬라이드 기본 불투명 + 축소 */
  .slick-slide {
    opacity: 0.4;
    transform: scale(0.85);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  /* 중앙(active) 슬라이드만 강조 */
  .slick-center {
    opacity: 1 !important;
    transform: scale(1) !important;
  }
`;

// 슬라이드 아이템 (카드)
export const SlideItem = styled.div`
  width: 280px;
  height: 280px;
  flex-shrink: 0;
  margin: 0 8px;           /* 카드 간격 조정 */
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    width: 240px;
    height: 240px;
  }
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  background: rgba(0,0,0,0.4);
  color: #fff;
  padding: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;
