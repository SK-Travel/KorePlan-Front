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
  padding: 0;
`;

export const LeftSide = styled.div`
  flex: 0.5;
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
  background-color: #f0faff;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const RightSide = styled.div`
  flex: 0.5;
  min-width: 140px;
  padding: 16px;
  font-size: 14px;

  @media (max-width: 768px) {
    display: none;
  }
`;


export const MainContent = styled.div`
  width: 100%;
  max-width: 900px;           /* 최대 너비 유지 */
  margin: 30px 0 0 0;         /* 상단만 30px, 좌우 모두 0으로 왼쪽 정렬 */
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 16px;            /* 좌우 여백은 그대로 유지 */
  align-items: flex-start;    /* 내부 컴포넌트도 왼쪽 정렬 */

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
