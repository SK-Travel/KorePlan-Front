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
`;

// 로고 이미지
export const LogoImage = styled.img`
  height: 40px;          /* 적당한 높이로 조정 */
  width: auto;
`;

// 로고 텍스트
export const LogoText = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #000;
`;

// 가운데 콘텐츠 (정중앙 정렬)
export const CenterContent = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 500px; /* 고정 너비 지정 */
  height: 100%;
  pointer-events: auto; 

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
`;
export const Row = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

//Select 커스텀 
//추후 헤더 색상이 바뀌거나 하면 색상 변경 및 구조 변경
export const CustomSelect = styled.select`

  padding: 6px 25px 6px 12px; /* 오른쪽 패딩을 충분히 확보  -> 화살표 V 먹힘 방지*/
  border: 2px solid rgb(54, 116, 54);
  border-radius: 6px;
  background-color: white;
  color:rgb(0, 0, 0);
  font-weight: 600;
  font-size: 14px;
  appearance: none; /* 기본 화살표 제거 */
  /* 화살표 재구성 */
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23228B22' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #B2DFDB;
  }
`;