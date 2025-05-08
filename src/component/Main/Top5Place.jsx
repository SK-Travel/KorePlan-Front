// src/component/Main/Top5Place.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import styled from 'styled-components';
import SamplePopData from '../../datas/Sample/SamplePopData';

// ─── 전체 래퍼: 부모(max-900px) 벗어나지 않도록 고정 ─────────────────────────────
const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;               /* ← 여기가 핵심 */
  margin: 0 auto;                 /* 가로 중앙 정렬 */
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 2rem 16px;             /* 좌우 16px 여유 */
  box-sizing: border-box;         /* 패딩 포함 폭 계산 */
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;       /* 모바일: 세로 배치 */
    padding: 1.5rem 16px;
  }
`;

// ─── 제목 박스 ────────────────────────────────────────────────────────────────
const TitleBox = styled.div`
  width: 200px;                   /* 고정 폭 */
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-right: 16px;            /* 슬라이드와 간격 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;                 /* 모바일에선 풀폭 */
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

// ─── 슬라이드 컨테이너 ───────────────────────────────────────────────────────
const SlideContainer = styled.div`
  flex: 1;                        /* 남은 공간 전부 */
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// ─── 슬라이드 아이템 ─────────────────────────────────────────────────────────
const SlideItem = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`;

// ─── 오버레이 텍스트 ─────────────────────────────────────────────────────────
const Overlay = styled.div`
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

// ─── 이미지 스타일 ───────────────────────────────────────────────────────────
const SlideImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
`;

export default function Top5Place() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <TitleBox>인기 명소</TitleBox>
      <SlideContainer>
        <Swiper
          modules={[EffectCoverflow, Pagination]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={3}
          spaceBetween={20}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          loop
        >
          {SamplePopData.map(item => (
            <SwiperSlide key={item.id}>
              <SlideItem onClick={() => navigate(`/spot/${item.id}`)}>
                <Overlay>{item.region} {item.spot}</Overlay>
                <SlideImage src={item.imgUrl} alt={item.name} />
              </SlideItem>
            </SwiperSlide>
          ))}
        </Swiper>
      </SlideContainer>
    </Wrapper>
  );
}
