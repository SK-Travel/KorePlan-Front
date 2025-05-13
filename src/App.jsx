import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import MainPage from "./pages/MainPage.jsx";
import SearchResult from "./pages/SearchResult.jsx";
import TestPage from "./pages/TestPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpotDetail from "./pages/SpotDetail.jsx";
import InfoModifiedPage from './pages/InfoModifiedPage.jsx';
import FestivalPage from "./pages/FestivalPage.jsx";
import DetailFestival from "./pages/FestivalDetail.jsx";
import Intro from './pages/Intro.jsx';
import GoogleRedirectPage from './component/SignUp/GoogleRedirectPage.jsx';
import Top5Place from './component/Main/Top5Place.jsx';

export function App() {
  const router = createBrowserRouter([
    { path: "/", element: <TestPage /> }, // 연동용 TEST페이지
    { path: "/intro", element: <Intro/>}, //인트로 페이지(로그인 전)
    { path: "/signIn", element: <SignInPage /> }, // 로그인 페이지
    { path: "/signUp", element: <SignUpPage /> }, // 회원가입
    { path:"/infoModified", element: <InfoModifiedPage /> }, // 정보 수정 페이진
    { path: "/mainPage", element: <MainPage /> }, // 메인 페이지
    { path: "/search", element: <SearchResult /> }, // 검색 결과
    { path: "/spot/:id", element: <SpotDetail /> }, // 상세보기 페이지
    { path: "/festival", element: <FestivalPage/>}, // 축제 정보 페이지
    { path: "/festival/:id",element:<DetailFestival/>}, //축제 상세 정보 페이지
    { path: "/oauth2/redirection", element: <GoogleRedirectPage />}, // 구글리다이렉트패이지지
    { path: "/festival/:id",element:<DetailFestival/>},//축제 상세 정보 페이지
    { path: "/tt",element:<Top5Place/>},


  ]);
  return <RouterProvider router={router} />;
}


