import * as React from 'react';
import { useState } from 'react';
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
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { FaUser, FaHeart, FaChartBar, FaCalendarAlt, FaRobot } from 'react-icons/fa'
import LogoutIcon from '@mui/icons-material/Logout';
export default function MyList() {
  //메뉴에 들어갈 리스트들.
  const menuItems = [
    { label: '내 정보', icon: <FaUser />, link: '#' },
    { label: 'My 찜 & 리스트', icon: <FaHeart />, link: '#' },
    { label: '인기차트', icon: <FaChartBar />, link: '#' },
    { label: '이번달 축제/행사', icon: <FaCalendarAlt />, link: '/festival' },
    { label: 'AI 챗봇', icon: <FaRobot />, link: '#' },
    { label: '로그아웃', icon: <LogoutIcon/>, link: '#'},
  ];
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow((prev) => !prev);
  
  const list = () => (
    <Box
    sx={{
      width: {
        xs: '50vw !important', // 모바일
        sm: '250px !important', // 태블릿
        md: '350px !important', // 데스크탑
      },
      height: '100%',
    }}
      role="presentation"
      onClick={toggleMenu}
      onKeyDown={toggleMenu}
    >
      <List>
        {menuItems.map((item, index) => (
          <>
          <ListItem key={index} disablePadding>
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
                      md: '20px',
                    },
                  },
                }}
              />

            </ListItemButton>
            
          </ListItem>
          <Divider variant="middle" component="li" />
          </>
        ))}
      </List>
  
      
      
    </Box>
  );

  return (
    <>
      {/* 열기 버튼 */}
      <Button onClick={toggleMenu}><MenuOpenIcon sx={{ fontSize: 50, color: 'black' }} /></Button>

      {/* SwipeableDrawer */}
      <SwipeableDrawer
        anchor="right"
        open={show}
        onClose={toggleMenu}
        onOpen={toggleMenu}
        PaperProps={{
          sx: {
            height: '100%',   
            borderTopLeftRadius: 16, //둥글게
            borderBottomLeftRadius: 16,
            
          }
        }}
      >
        {list()}
      </SwipeableDrawer>
    </>
  );
};
