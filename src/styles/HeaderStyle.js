import styled from 'styled-components';
import { Link } from 'react-router-dom';
// 헤더 전체 래퍼
export const HeaderWrapper = styled.header`
  background-color:rgb(255, 255, 255);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  //position: relative; // 중앙 absolute 포지셔닝 위해 필요
  position: sticky;  // ← relative에서 sticky로 변경
  top: 0;           // ← 추가
  z-index: 1000;    // ← 추가

  top: env(safe-area-inset-top, 0);
  
  @media (max-width: 768px) {
    position: fixed; /* sticky 대신 fixed 사용 */
    top: 0;
    left: 0;
    right: 0;
  }
`;

// 좌측 로고 영역
export const LogoWrapper = styled.div`
  width: 120px;                 // 고정 너비
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;              /* 로고랑 텍스트 사이 간격 */
  text-decoration: none; /* 링크 밑줄 제거 */
   @media (max-width: 768px) {
    gap: 4px; /* 모바일에서 로고와 텍스트 간격 줄임 */
  }
`;

// 로고 이미지
export const LogoImage = styled.img`
  height: 40px;          /* 적당한 높이로 조정 */
  width: auto;
  @media (max-width: 768px) {
    height: 30px; /* 모바일에서 크기 줄임 */
  }
`;

// 로고 텍스트
export const LogoText = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #000;
  @media (max-width: 768px) {
    font-size: 1rem; /* 모바일에서 폰트 크기 줄임 */
  }
`;

export const CenterContent = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto; /* 고정 너비 제거 */
  max-width: 600px; /* 최대 너비만 지정 */
  height: 100%;
  pointer-events: auto; 
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

  @media (max-width: 768px) {
    display: none;
  }
`;


// 우측 유저영역
export const UserSection = styled.div`
  min-width: 200px;               // 유동 너비
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  color: white;
  font-size: 16px;

  @media (max-width: 768px) {
    min-width: auto; /* 최소 너비 제거 */
    gap: 8px; /* 아이콘 간격 줄임 */

    button svg {
      font-size: 35px !important;
    }
  }
`;
export const Row = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

