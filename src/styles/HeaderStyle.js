import styled from 'styled-components';


export const HeaderWrapper = styled.header`
  background-color: #228B22;
  height: 70px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

export const LogoWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  max-height: 50px; /* 삐져나오지 않게 제한 */
  width: auto;
  object-fit: contain;
`;

export const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 24px;
  color: black;
`;

export const UserSection = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 16px;
`;

export const UserName = styled.h5`
  margin: 0;
  color: black;
`;


