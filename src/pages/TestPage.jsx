import React, { useEffect, useState } from "react";
import ApiClient from "../services/ApiClient";

function TestPage() {
  const [user, setUser] = useState(null); // 상태로 유저 정보를 저장

  useEffect(() => {
    ApiClient.get("/api/user")
      .then((response) => {
        console.log("응답 데이터:", response.data);
        
        // 'user' 데이터를 상태에 저장
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  }, []);


  // 유저 정보 출력
  return (
    <div>
      <h1>백엔드 요청 테스트</h1>
      {user ? (
        <div>
          <p>아이디: {user.id}</p>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>로그인 아이디: {user.loginId}</p>
        </div>
      ) : (
        <p>유저 정보를 불러오는 중...</p>
      )}
    </div>
  );
}

export default TestPage;