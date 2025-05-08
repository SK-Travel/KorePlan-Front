import styled, { createGlobalStyle } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';

// 전역 스타일
export const GlobalStyle = createGlobalStyle`
  #app { height: 100%; }
  html, body {
    position: relative;
    height: 100%;
  }
  body {
    background: #eee;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #000;
    margin: 0;
    padding: 0;
  }
`;

// Swiper 컨테이너 스타일
export const StyledSwiper = styled(Swiper)`
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
`;

// 각 슬라이드 스타일
export const StyledSwiperSlide = styled(SwiperSlide)`
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 300px;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;
