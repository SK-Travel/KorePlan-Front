import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TbMapSearch } from "react-icons/tb";
import MyList from "./MyList";

import {
  HeaderWrapper,
  LogoLink,     // ★ 새로 import
  LogoImage,
  LogoText,     // ★ 새로 import
  CenterContent,
  UserSection,
} from "../../styles/HeaderStyle";
import Logo from "../../assets/LogoIcon.png";

const Header = () => {
  const navigate = useNavigate();
  const goToSearch = () => navigate("/search");

  return (
    <HeaderWrapper>

      {/* Logo + 텍스트 */}
      <LogoLink to="/mainPage">
        <LogoImage src={Logo} alt="KorePlan 로고" />
        <LogoText>KorePlan</LogoText>
      </LogoLink>


      {/* 중앙 비워두거나 나중에 컴포넌트 삽입 */}
      <CenterContent />

      {/* 우측 아이콘들 */}
      <UserSection>
        {/* 검색 아이콘  /search 로 이동 */}
        <Button onClick={goToSearch}>
          <TbMapSearch style={{ fontSize: 45, color: "#000" }} />
        </Button>

        {/* MyList 메뉴창창 */}
        <MyList />
      </UserSection>
    </HeaderWrapper>
  );
};

export default Header;
