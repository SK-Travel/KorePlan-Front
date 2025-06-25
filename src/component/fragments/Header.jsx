import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TbMapSearch } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import Menu from "./Menu";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  ClickAwayListener,
  Paper,
  MenuList,
  MenuItem,
  Divider
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });

  // 윈도우 리사이즈 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 사용자 정보 가져오기
  useEffect(() => {
    const getUserInfoFromStorage = () => {
      try {
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        
        if (name || email) {
          setUserInfo({
            name: name || '',
            email: email || ''
          });
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    getUserInfoFromStorage();
  }, []);

  const goToSearch = () => navigate("/search");
  
  const handleUserIconClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const goToMyInfo = () => {
    navigate('/infomodified');
    setDropdownOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    alert("로그아웃 완료");
    window.location.href = "/";
  };

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
            My 찜 & Plan
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

      {/* 우측 아이콘 */}
      <UserSection>
        {/* 검색 아이콘 */}
        <Button onClick={goToSearch}>
          <TbMapSearch style={{ fontSize: 45, color: "#000" }} />
        </Button>
        
        {/* 모바일: Menu 컴포넌트, 데스크탑: 유저 아이콘 + 드롭다운 */}
        {isMobile ? (
          <Menu />
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Button onClick={handleUserIconClick}>
              <FaUser style={{ fontSize: 35, color: "#000" }} />
            </Button>
            
            {dropdownOpen && (
              <ClickAwayListener onClickAway={handleCloseDropdown}>
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    mt: 1,
                    minWidth: 250,
                    maxWidth: 280,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    borderRadius: 3,
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.06)',
                    animation: 'fadeIn 0.2s ease-out',
                    '@keyframes fadeIn': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(-10px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  <Box sx={{ 
                    p: 3,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  }}>
                    {/* 사용자 정보 섹션 */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: '600',
                        fontSize: '16px',
                        mb: 1.5,
                        color: '#1a1a1a',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      안녕하세요, {userInfo.name}님!
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: 'rgba(255, 165, 0, 0.08)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 165, 0, 0.15)',
                    }}>
                      <Box sx={{ 
                        width: 10, 
                        height: 10, 
                        backgroundColor: '#ffa500', 
                        borderRadius: '50%',
                        mr: 1.5,
                        flexShrink: 0,
                      }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#555',
                          fontSize: '13px',
                          fontWeight: '500',
                          wordBreak: 'break-all',
                        }}
                      >
                        {userInfo.email || '이메일 정보 없음'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />
                  
                  <MenuList sx={{ p: 1.5 }}>
                    
                    <MenuItem 
                      onClick={handleLogOut}
                      sx={{ 
                        borderRadius: 2,
                        color: '#666',
                        fontSize: '14px',
                        fontWeight: '500',
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.04)',
                          color: '#f44336',
                          transform: 'translateX(2px)',
                        }
                      }}
                    >
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} />
                      로그아웃
                    </MenuItem>
                  </MenuList>
                </Paper>
              </ClickAwayListener>
            )}
          </Box>
        )}
      </UserSection>
    </HeaderWrapper>
  );
};

export default Header;