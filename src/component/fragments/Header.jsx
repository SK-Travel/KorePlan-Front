import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TbMapSearch } from "react-icons/tb";
import MyList from "./MyList";
import React, { useEffect, useState } from "react";


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
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow((prev) => !prev);
  const [userName, setUserName] = useState(null);

  // 로그인 여부 확인
  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    // console.log("Header에서 name:", name); // ← 확인용
    if (name && email) {
      setUserName(name);
    }
  }, []);

  // 로그아웃 처리
  const handleLogOut = () => {
    localStorage.clear(); // 제거
    alert("로그아웃 완료");
    window.location.href="/signIn";
  }
  return (
    <HeaderWrapper >
      {/* Logo + 텍스트 */}
      {userName ? (
        <>
          {/* 로그인 시 */}
          <LogoLink to="/mainPage">
            <LogoImage src={Logo} alt="KorePlan 로고" />
            <LogoText>KorePlan</LogoText>
          </LogoLink>
        </>) : (
        <>
          {/* 비로그인 시 */}
          <LogoLink to="/signIn">
            <LogoImage src={Logo} alt="KorePlan 로고" />
            <LogoText>KorePlan</LogoText>
          </LogoLink>
        </>
      )}
      {/* 중앙 비워두거나 나중에 컴포넌트 삽입 */}
      <CenterContent />

      {/* 우측 아이콘들 */}
      <UserSection>


        {userName ? (
        <>
          {/* 로그인 시 */}
            <a type="button" href="/infoModified" style={{ color: 'green', fontSize: '19px', textDecoration: 'none'}}>
              {userName}님 안녕하세요
            </a>
            {/* 검색 아이콘  /search 로 이동 */}
            <Button onClick={goToSearch}>
              <TbMapSearch style={{ fontSize: 45, color: "#000" }} />
            </Button>
            <MyList />
        </>
        ) : (
        <>
          {/* 비로그인 시 */}
            <div style={{ marginRight: '20px' }}>
              <LogoLink to="/signin" style={{ color: 'green', fontSize: '18px', textDecoration: 'none' }}>
                로그인
              </LogoLink>
            </div>
        </>
        )}
      </UserSection>
    </HeaderWrapper>
  );
};

export default Header;
