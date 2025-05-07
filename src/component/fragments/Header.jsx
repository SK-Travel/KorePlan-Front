import React from "react";
import { Link } from "react-router-dom";
import {
  HeaderWrapper,
  LogoWrapper,
  LogoImage,
  CenterContent,
  UserSection,
} from "../../styles/HeaderStyle";
import sam from "../../assets/sam.png";
import MyList from "./MyList";
import RealTimeRankingBar from "./RealtimeRanking";
import { Avatar } from "@mui/material";
import userAvatar from "../../assets/DefaultUserAvatar.png";

const Header = () => {
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Link to="/mainPage">
          <LogoImage src={sam} alt="KorePlan 로고" />
        </Link>
      </LogoWrapper>

      <CenterContent>
        {/* <RealTimeRankingBar /> */}
      </CenterContent>

      <UserSection>
        <MyList />
      </UserSection>
    </HeaderWrapper>
  );
};

export default Header;
