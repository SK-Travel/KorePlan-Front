import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import MainPage from "./pages/MainPage.jsx";
import SearchResult from "./pages/SearchResult.jsx";
import TestPage from "./pages/TestPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpotDetail from "./pages/SpotDetail.jsx";


export function App() {
  const router = createBrowserRouter([
    { path: "/", element: <TestPage /> }, // 연동용 TEST페이지
    { path: "/signIn", element: <SignInPage /> }, // 로그인 페이지
    { path: "/signUp", element: <SignUpPage /> }, // 회원가입
    { path: "/mainPage", element: <MainPage /> }, // 메인 페이지
    { path: "/search", element: <SearchResult /> }, // 검색 결과
    { path: "/spot/:id", element: <SpotDetail /> }, // ✅ 여기 수정! (id 받아야 함)
  ]);
  return <RouterProvider router={router} />;
}


