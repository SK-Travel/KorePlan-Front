import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기

const Footer = () => {
  return (
    <footer className="footer bg-success d-flex justify-content-center align-items-center mt-5 py-3 text-black">
      <h1>Copyright © KorePlan 2024</h1>
    </footer>
  );
};

export default Footer;