import React, { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons'; // 햄버거 아이콘
import { Link } from 'react-router-dom';
const MyListSample = () => {
  const [show, setShow] = useState(false);

  const toggleMenu = () => setShow((prev) => !prev);

  return (
    <>
      {/* <h2>MyList</h2> */}
      {/* 햄버거 버튼 */}
      <Button
        variant="light"
        onClick={toggleMenu}
        style={{
          border: 'none',
          background: 'none',
          fontSize: '32px',
        }}
      >
        <List />
      </Button>

      {/* 토글 메뉴 (오프캔버스) */}
      <Offcanvas show={show} onHide={toggleMenu} placement="end" 
        style={{
          width: '240px', 
          maxWidth: '90vw', 
        }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list-unstyled">
            <li><a href="#">내 정보</a></li>
            <li><a href="#">My 찜 & 리스트</a></li>
            <li><a href="#">인기차트</a></li>
            <Link to = "/festival"><li>이번달 축제/행사</li></Link>
            <li><a href="#">AI 챗봇</a></li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MyListSample;

///
//--------------------드랍다운형식
// import React, { useState } from 'react';
// import { Dropdown } from 'react-bootstrap';
// import { List } from 'react-bootstrap-icons';

// const DropdownMenu = () => {
//   const [show, setShow] = useState(false);

//   const toggleDropdown = () => setShow((prev) => !prev);

//   return (
//     <div className="text-center">
//     <h2>MyList</h2>
//     <Dropdown show={show} onToggle={setShow} className="text-center">
//       <Dropdown.Toggle
//         variant="light"
//         id="dropdown-basic"
//         onClick={toggleDropdown}
//         style={{
//           border: 'none',
//           background: 'none',
//           fontSize: '32px',
//         }}
//       >
//         <List />
//       </Dropdown.Toggle>

//       <Dropdown.Menu style={{ minWidth: '160px' }}>
//         <Dropdown.Item href="#">내 정보</Dropdown.Item>
//         <Dropdown.Item href="#">My 찜 & 리스트</Dropdown.Item>
//         <Dropdown.Item href="#">인기차트</Dropdown.Item>
//         <Dropdown.Item href="#">AI 챗봇</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//     </div>
//   );
// };

// export default DropdownMenu;

