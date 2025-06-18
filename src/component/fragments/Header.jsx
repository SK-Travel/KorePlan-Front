import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TbMapSearch } from "react-icons/tb";
import Menu from "./Menu";
import React from "react";

import {
  HeaderWrapper,
  LogoLink,
  LogoImage,
  LogoText,
  CenterContent,
  UserSection,
} from "../../styles/HeaderStyle";
import Logo from "../../assets/LogoIcon.png";

const Header = () => {
  const navigate = useNavigate();
  const goToSearch = () => navigate("/search");

  return (
    <HeaderWrapper>
      {/* 로고 */}
      <LogoLink to="/mainPage">
        <LogoImage src={Logo} alt="KorePlan 로고" />
        <LogoText>KorePlan</LogoText>
      </LogoLink>

      {/* 중앙 네비게이션 */}
      <CenterContent>
        <nav style={{ display: 'flex', gap: '50px' }}>
          <Button 
            onClick={() => navigate('/region')}
            style={{ color: '#333', fontSize: '15px', fontWeight: '500' }}
          >
            지역별·테마별 여행지
          </Button>
          <Button 
            onClick={() => navigate('/festival')}
            style={{ color: '#333', fontSize: '15px', fontWeight: '500' }}
          >
            축제/행사/공연
          </Button>
          <Button 
            onClick={() => navigate('/myplan')}
            style={{ color: '#333', fontSize: '15px', fontWeight: '500' }}
          >
            My 찜 & 리스트
          </Button>
          <Button 
            onClick={() => navigate('/review')}
            style={{ color: '#333', fontSize: '15px', fontWeight: '500' }}
          >
            여행후기
          </Button>
          <Button 
            onClick={() => navigate('/AIChat')}
            style={{ color: '#333', fontSize: '15px', fontWeight: '500' }}
          >
            AI 추천
          </Button>
        </nav>
      </CenterContent>

      {/* 우측 아이콘 2개 */}
      <UserSection>
        {/* 검색 아이콘 */}
        <Button onClick={goToSearch}>
          <TbMapSearch style={{ fontSize: 45, color: "#000" }} />
        </Button>
        
        {/* Menu 컴포넌트 */}
        <Menu />
      </UserSection>
    </HeaderWrapper>
  );
};

export default Header;