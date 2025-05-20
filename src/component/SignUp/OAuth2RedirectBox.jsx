import React, { useEffect } from 'react';

const OAuth2RedirectBox = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const name = params.get('name');
    const type = params.get('type');  // login / signup
    const token = params.get('token');
    
    if (email && name && type && token) {
      if (type === 'login') {
        alert("로그인 완료! 메인 페이지로 이동합니다.");
        // 로그인폼에 이메일/이름 저장
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        window.location.href = '/mainPage';
      } else if (type === 'signup') {
        alert("회원가입 완료! 메인 페이지로 이동합니다.");
        // 회원가입 폼에 이메일/이름 저장
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        window.location.href = '/mainPage';
      }
    } else {
      alert("잘못된 접근입니다.");
      window.location.href = '/signUp'; // 로그인 페이지로
    }
  }, []);

  return (
    <div>
      <h2>로그인 중입니다...</h2>
    </div>
  );
};

export default OAuth2RedirectBox;
