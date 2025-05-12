import styled from 'styled-components';

// 전체 Wrapper
export const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 2rem 16px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem 16px;
  }
`;

// 제목 박스
export const TitleBox = styled.div`
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-right: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

// 슬라이더 컨테이너 (포지션 기준 고정)
export const SliderContainer = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  .slick-slide {
    display: flex !important;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    opacity: 0.4;
    transform: scale(0.85);
    width: 280px !important;
  }

  .slick-center {
    opacity: 1;
    transform: scale(1);
  }

  .slick-track {
    display: flex;
    align-items: center;
  }
`;

// 슬라이드 항목
export const SlideItem = styled.div`
  width: 280px;
  height: 280px;
  flex-shrink: 0;
  margin: 0 auto;
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
  border-radius: 8px;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

