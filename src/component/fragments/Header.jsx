import React, { useState } from "react";

import { Link } from "react-router-dom";
import SearchBarResponsive from "../Main/SearchBarResponsive";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import {
  HeaderWrapper,
  LogoWrapper,
  LogoImage,
  CenterContent,
  UserSection,
  Row,
} from "../../styles/HeaderStyle";
import sam from "../../assets/sam.png";
import MyList from "./MyList";

import { TbMapSearch } from "react-icons/tb";
import { RightSide } from "../../styles/MainPageStyle";
const Header = () => {
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow((prev) => !prev);
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Link to="/mainPage">
          <LogoImage src={sam} alt="KorePlan 로고" />
        </Link>
      </LogoWrapper>

      <CenterContent>

      </CenterContent>

      <UserSection>
        {/* 검색 버튼 */}
        <Button onClick={toggleMenu}><TbMapSearch style={{ fontSize: '50px', color: '#000' }} /></Button>
        {/* SwipeableDrawer */}
        <SwipeableDrawer
          anchor="top"
          open={show}
          onClose={toggleMenu}
          onOpen={toggleMenu}
          PaperProps={{
            sx: {
              height: '50%',
            }
          }}
        >
          <Row>
          <LogoWrapper>
            <Link to="/mainPage">
              <LogoImage src={sam} alt="KorePlan 로고" />
            </Link>
          </LogoWrapper>
          <SearchBarResponsive style={{marginTop: '20px'}} />
          <RightSide/>
          </Row>
        </SwipeableDrawer>
        <MyList />
      </UserSection>
    </HeaderWrapper>
  );
};

export default Header;

