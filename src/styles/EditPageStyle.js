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
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0;
  @media (max-width: 768px) {
    margin-top: 110px; 
    justify-content: center; // ← Main을 중앙에 배치
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


export const MainContent = styled.div`
  width: 100%;
  max-width: 1600px;           // 1500px → 1600px로 확장!
  margin: 0 auto 0 auto;    
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0;
  align-items: center;         

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;



