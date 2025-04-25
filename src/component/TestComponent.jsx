import React, { useEffect } from "react";
import ApiClient from "../services/ApiClient";

function TestComponent() {
  useEffect(() => {
    ApiClient.get("/api/user")
      .then((response) => {
        console.log("응답 데이터:", response.data);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  }, []);

  return <div>백엔드 요청 테스트</div>;
}

export default TestComponent;