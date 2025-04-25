import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 필요 시 쿠키 인증 등 포함
});

export default ApiClient;