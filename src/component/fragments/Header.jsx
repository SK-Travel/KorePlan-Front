import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
import KorePlanLogo from '../../assets/KorePlan.png';

const Header = () => {
    return (
        <header className="bg-success">
            <div className="h-100 d-flex justify-content-between align-items-center mx-4" width="100%">
                <img src={KorePlanLogo} alt="KorePlan 로고" width="100" />
                <h1>KorePlan</h1>
                <h5>윤현우</h5>
            </div>
        </header>
    );
};

export default Header;