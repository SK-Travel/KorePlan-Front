import React, { useEffect } from 'react';

const GoogleRedirectPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const name = params.get('name');
    
    if (email && name) {
      // 이메일과 이름이 존재하면 회원가입 폼으로 이동
      localStorage.setItem('email', email); // 이메일 저장 (예: 회원가입 폼에서 사용할 수 있도록)
      localStorage.setItem('name', name); // 이름 저장
      alert("존재하는 이메일입니다.");
      window.location.href = '/signUp'; // 회원가입 페이지로 이동
    } else {
        alert("회원가입 완료 로그인 페이지로 이동합니다.");
        window.location.href = '/mainPage'; // 이메일 또는 이름이 없으면 로그인 페이지로 리디렉션
    }
  }, []);

  return (
    <div>
      <h2>로그인 중입니다...</h2>
    </div>
  );
};

export default GoogleRedirectPage;
