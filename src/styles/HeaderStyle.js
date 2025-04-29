import styled from 'styled-components';

// 헤더 전체 래퍼
export const HeaderWrapper = styled.header`
  background-color: #228B22;
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  position: relative; // 중앙 absolute 포지셔닝 위해 필요
`;

// 좌측 로고 영역
export const LogoWrapper = styled.div`
  width: 120px;                 // 고정 너비
  display: flex;
  align-items: center;
`;

// 로고 이미지
export const LogoImage = styled.img`
  max-height: 100px;
  width: auto;
  object-fit: contain;
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
  width: 120px;               // 고정 너비
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  color: white;
  font-size: 16px;
`;

export const CustomSelect = styled.select`

  padding: 6px 25px 6px 12px; /* 오른쪽 패딩을 충분히 확보 */
  border: 2px solid #228B22;
  border-radius: 6px;
  background-color: white;
  color: #228B22;
  font-weight: 600;
  font-size: 14px;
  appearance: none; /* 기본 화살표 제거 */
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