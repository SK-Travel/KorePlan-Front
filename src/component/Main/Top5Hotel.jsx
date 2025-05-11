// src/components/Top10Place.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// React용 컴포넌트
import { Swiper, SwiperSlide } from 'swiper/react';
// 모듈은 modules 폴더에서!
import { EffectCoverflow, Pagination } from 'swiper/modules';

// 스타일
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import styled from 'styled-components';
import SampleHotelData from '../../datas/Sample/SampleHotelData';

const SlideContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
`;

export default function Top5Hotel() {
  const navigate = useNavigate();

  return (
    
    <SlideContainer>
      <Swiper
        modules={[EffectCoverflow, Pagination]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        loop={true}
      >
        {SampleHotelData.map(item => (
          <SwiperSlide
            key={item.id}
            style={{ width: '300px', height: '300px' }}
            onClick={() => navigate(`/myTravel/detail/${item.id}`)}
          >
            <SlideImage src={item.imgUrl} alt={item.name} />
          </SwiperSlide>
        ))}
      </Swiper>
    </SlideContainer>
  
  );
}
