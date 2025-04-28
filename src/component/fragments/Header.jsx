// import React from 'react';
// import {Link} from 'react-router-dom'
// //import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
// import KorePlanLogo from '../../assets/KorePlan.png';
// import MyListSample from './MyListSample';
// const Header = () => {
//     return (
//         <header className="bg-success">
//             <div className="h-100 d-flex justify-content-between align-items-center mx-4" width="100%">
//                 <Link to={`/mainPage`}><img src={KorePlanLogo} alt="KorePlan 로고" width="100" /></Link>
//                 <h1>KorePlan</h1>
                
//                 <h5>윤현우</h5><MyListSample/>
//             </div>
//         </header>
//     );
// };

// export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import {
    HeaderWrapper,
    LogoWrapper,
    LogoImage,
    Title,
    UserSection,
    UserName,
  } from '../../styles/HeaderStyle'
import KorePlanLogo from '../../assets/KorePlan.png';
import MyListSample from './MyListSample';

const Header = () => {
    return (
      <HeaderWrapper>
        
        {/* 왼쪽 로고 */}
        <LogoWrapper>
          <Link to="/mainPage">
            <LogoImage src={KorePlanLogo} alt="KorePlan 로고" />
          </Link>
        </LogoWrapper>
  
        {/* 가운데 제목 */}
        <Title>KorePlan</Title>
  
        {/* 오른쪽 사용자이름 + 햄버거버튼 */}
        <UserSection>
          <UserName>윤현우</UserName>
          <MyListSample />
        </UserSection>
  
      </HeaderWrapper>
    );
  };
  
  export default Header;
