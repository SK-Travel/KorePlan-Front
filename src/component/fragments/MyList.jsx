// import React, { useState } from 'react';
// import { Button, Offcanvas } from 'react-bootstrap';
// import { List } from 'react-bootstrap-icons'; // 햄버거 아이콘
// import { Link } from 'react-router-dom';
// import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// const MyListSample = () => {
//   const [show, setShow] = useState(false);

//   const toggleMenu = () => setShow((prev) => !prev);

//   return (
//     <>
//       {/* <h2>MyList</h2> */}
//       {/* 햄버거 버튼 */}
//       <Button
//         variant="light"
//         onClick={toggleMenu}
//         style={{
//           border: 'none',
//           background: 'none',
//           fontSize: '32px',
//         }}
//       >
//         <MenuOpenIcon sx={{ fontSize: 50 }} />
//       </Button>

//       {/* 토글 메뉴 (오프캔버스) */}
//       <Offcanvas show={show} onHide={toggleMenu} placement="end" 
//         style={{
//           width: '240px', 
//           maxWidth: '90vw', 
//         }}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>My Menu</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <ul className="list-unstyled">
//             <li><a href="#">내 정보</a></li>
//             <li><a href="#">My 찜 & 리스트</a></li>
//             <li><a href="#">인기차트</a></li>
//             <Link to = "/festival"><li>이번달 축제/행사</li></Link>
//             <li><a href="#">AI 챗봇</a></li>
//           </ul>
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// };

// export default MyListSample;



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

export default function MyList() {
  //메뉴에 들어갈 리스트들.
  const menuItems = [
    { label: '내 정보', icon: <FaUser />, link: '#' },
    { label: 'My 찜 & 리스트', icon: <FaHeart />, link: '#' },
    { label: '인기차트', icon: <FaChartBar />, link: '#' },
    { label: '이번달 축제/행사', icon: <FaCalendarAlt />, link: '/festival' },
    { label: 'AI 챗봇', icon: <FaRobot />, link: '#' },
  ];
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow((prev) => !prev);
  
  const list = () => (
    <Box
    sx={{
      width: {
        xs: '50vw !important', // 모바일
        sm: '250px !important', // 태블릿
        md: '400px !important', // 데스크탑
      },
      height: '100%',
      bgcolor: '#f5f5f5',
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
            height: '34%',   // Drawer 자체 높이를 50%로
            borderTopLeftRadius: 16, //둥글게
            borderBottomLeftRadius: 16,
            backgroundColor: '#f5f5f5 !important',
          }
        }}
      >
        {list()}
      </SwipeableDrawer>
    </>
  );
};
