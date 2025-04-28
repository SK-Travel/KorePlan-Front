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
  padding: 0px;
  @media (max-width: 1024px) {
    
  }
`;

/*왼쪽 메뉴 영역 */
export const LeftSide = styled.div`
  flex: 0.6;
  min-width: 120px;
  padding: 16px;
  font-size: 14px;
  top: 10px;
  position: sticky;
  @media (max-width: 768px) {
    
    display: none;
  }
`;

/*가운데 콘텐츠 (넓게) */
export const Main = styled.main`
  flex: 2.5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f0faff;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/*오른쪽 컨텐츠 (축제 정보) */
export const RightSide = styled.div`
  flex: 0.7;
  min-width: 140px;
  padding: 16px;
  font-size: 14px;

  @media (max-width: 768px) {
  display: none;
  }
`;

export const MainContent = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 16px;

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
