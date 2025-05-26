import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: 100%;
  gap: 20px;
  background-color: #ffffff;
  margin-top: 10px;
  margin-bottom: 50px;
  padding: 0;
`;

export const LeftSide = styled.div`
  flex: 0.25;
  min-width: 120px;
  padding: 16px;
  font-size: 14px;
  top: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color:rgb(255, 255, 255);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const RightSide = styled.div`
  flex: 0.25;
  min-width: 140px;
  padding: 16px;
  font-size: 14px;

  @media (max-width: 768px) {
    display: none;
  }
`;


export const MainContent = styled.div`
  width: 100%;
  max-width: 1500px;           // 더 넓게 설정
  margin: 30px auto 0 auto;    // 중앙 정렬로 수정
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 16px;
  align-items: center;         // 중앙 배치로 변경

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;


export const Row = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
