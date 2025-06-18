import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { FaUser, FaHeart, FaChartBar, FaCalendarAlt, FaRobot, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { MdTravelExplore, MdReviews, MdNotifications, MdBookmark } from 'react-icons/md';
import LogoutIcon from '@mui/icons-material/Logout';

export default function MyList() {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // 사용자 정보 상태
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

  // localStorage에서 개별 키로 직접 가져오기
  useEffect(() => {
    const getUserInfoFromStorage = () => {
      try {
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        const userId = localStorage.getItem("userId");
        
        console.log('localStorage에서 가져온 name:', name);
        console.log('localStorage에서 가져온 email:', email);
        console.log('localStorage에서 가져온 userId:', userId);
        
        if (name || email) {
          setUserInfo({
            name: name || '',
            email: email || ''
          });
        } else {
          console.log('localStorage에 name, email 정보가 없습니다.');
        }

      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    getUserInfoFromStorage();
  }, []);

  // 모바일용 메뉴 (로그아웃 제외)
  const mobileMenuItems = [
    { label: 'My 찜 & 리스트', icon: <FaHeart />, link: '/MyList' },
    { label: '지역별·테마별 여행지', icon: <MdTravelExplore />, link: '/region' },
    { label: '축제/행사', icon: <FaCalendarAlt />, link: '/festival' },
    { label: '여행후기', icon: <MdReviews />, link: '/review' },
    { label: 'AI 추천', icon: <FaRobot />, link: '/AIChat' },
  ];

  // 데스크탑용 메뉴 (빈 배열로 설정)
  const desktopMenuItems = [];

  const toggleMenu = () => setShow((prev) => !prev);
  
  // 로그아웃 처리
  const handleLogOut = () => {
    localStorage.clear();
    alert("로그아웃 완료");
    window.location.href="/";
  }

  // 내 정보 페이지로 이동
  const goToMyInfo = () => {
    window.location.href = '/infomodified';
  };

  // 현재 환경에 맞는 메뉴 아이템 선택
  const currentMenuItems = isMobile ? mobileMenuItems : desktopMenuItems;
  
  const list = () => (
    <Box
      sx={{
        width: {
          xs: '50vw !important',
          sm: '250px !important',
          md: '350px !important',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
      onClick={toggleMenu}
      onKeyDown={toggleMenu}
    >
      {/* 메인 컨텐츠 영역 - 스크롤 가능 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {/* 사용자 정보 표시 영역 */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={goToMyInfo}
              sx={{
                paddingY: {
                  xs: 2,
                  md: 4, // 데스크탑에서 더 큰 여백
                },
                paddingX: {
                  xs: 2,
                  md: 3, // 데스크탑에서 더 큰 여백
                },
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ width: '100%' }}>
                {/* 인사말 추가 */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: {
                      xs: '14px',
                      md: '22px', // 데스크탑에서 더 큰 폰트
                    },
                    mb: {
                      xs: 0.5,
                      md: 1, // 데스크탑에서 더 큰 여백
                    },
                    color: '#333',
                  }}
                >
                  안녕하세요, {userInfo.name}님!
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ 
                    width: {
                      xs: 6,
                      md: 8, // 데스크탑에서 더 큰 점
                    }, 
                    height: {
                      xs: 6,
                      md: 8,
                    }, 
                    backgroundColor: '#ffa500', 
                    borderRadius: '50%',
                    mr: {
                      xs: 1,
                      md: 1.5, // 데스크탑에서 더 큰 여백
                    }
                  }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: {
                        xs: '11px',
                        md: '16px', // 데스크탑에서 더 큰 폰트
                      },
                    }}
                  >
                    {userInfo.email || '이메일 정보 없음'}
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" component="li" />

          {/* 메뉴 아이템들 */}
          {currentMenuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  component={item.link.startsWith('/') ? Link : 'a'}
                  to={item.link.startsWith('/') ? item.link : undefined}
                  href={!item.link.startsWith('/') ? item.link : undefined}
                  sx={{
                    paddingY: 2,
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: {
                          xs: '12px',
                          md: '16px',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <Divider variant="middle" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* 로그아웃 버튼 - 최하단 고정 */}
      <Box sx={{ 
        borderTop: '1px solid #e0e0e0',
        p: {
          xs: 2,
          md: 3, // 데스크탑에서 더 큰 여백
        }
      }}>
        <Button
          fullWidth
          onClick={handleLogOut}
          startIcon={<LogoutIcon />}
          sx={{
            py: {
              xs: 1.5,
              md: 2, // 데스크탑에서 더 높은 버튼
            },
            borderRadius: 2,
            backgroundColor: '#f5f5f5',
            color: '#666',
            textTransform: 'none',
            fontSize: {
              xs: '14px',
              md: '18px', // 데스크탑에서 더 큰 폰트
            },
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            }
          }}
        >
          로그아웃
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 열기 버튼 */}
      <Button onClick={toggleMenu}>
        <MenuOpenIcon 
          sx={{ 
            fontSize: isMobile ? 35 : 50, 
            color: 'black' 
          }} 
        />
      </Button>

      {/* SwipeableDrawer */}
      <SwipeableDrawer
        anchor="right"
        open={show}
        onClose={toggleMenu}
        onOpen={toggleMenu}
        PaperProps={{
          sx: {
            height: '100%',   
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }
        }}
      >
        {list()}
      </SwipeableDrawer>
    </>
  );
};