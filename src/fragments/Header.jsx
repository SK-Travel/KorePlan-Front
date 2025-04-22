import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기

const Header = () => {
    return (
        <header className="bg-success">
            <div className="h-100 d-flex justify-content-between align-items-center mx-4">
                <img src="public/KorePlan.png" alt="KorePlan 로고" width="100" />
                <h1>KorePlan</h1>
                <h1>현우님 안녕하세요</h1>
            </div>
        </header>
    );
};

export default Header;