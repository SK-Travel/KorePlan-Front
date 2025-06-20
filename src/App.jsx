import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import MainPage from "./pages/MainPage.jsx";
import Search from "./pages/SearchPage.jsx";
import TestPage from "./pages/TestPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpotDetail from "./pages/SpotDetail.jsx";
import InfoModifiedPage from './pages/InfoModifiedPage.jsx';
import FestivalPage from "./pages/FestivalPage.jsx";
import DetailFestival from "./pages/FestivalDetail.jsx";
import Intro from './pages/Intro.jsx';
import OAuth2RedirectBox from './component/SignUp/OAuth2RedirectBox.jsx';
import Top5Place from './component/Main/Top5Place.jsx';
import AIChatPage from './pages/AIChatPage.jsx';
import RegionSearchPage from './pages/RegionSearchPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import RegionSelector from './component/RegionList/RegionSelector.jsx';
import DataCardList from './component/RegionList/DataCardList.jsx';
import MyReviewPage from './pages/MyReviewPage.jsx';

export function App() {
  const router = createBrowserRouter([
    { path: "/test", element: <TestPage /> }, // 연동용 TEST페이지
    { path: "/", element: <Intro/>}, //인트로 페이지(로그인 전)
    { path: "/signIn", element: <SignInPage /> }, // 로그인 페이지
    { path: "/signUp", element: <SignUpPage /> }, // 회원가입
    { path:"/infoModified", element: <InfoModifiedPage /> }, // 정보 수정 페이지
    { path: "/mainPage", element: <MainPage /> }, // 메인 페이지
    { path: "/search", element: <Search /> }, // 검색 페이지
    { path: "/spot/:id", element: <SpotDetail /> }, // 상세보기 페이지
    { path: "/festival", element: <FestivalPage/>}, // 축제 정보 페이지
    { path: "/festival/:contentId",element:<DetailFestival/>}, //축제 상세 정보 페이지
    { path: "/oauth2/redirection", element: <OAuth2RedirectBox />}, // Oauth2User redirect페이지
    { path: "/AIChat", element: <AIChatPage /> }, // AI 챗봇
    { path: "/region", element: <RegionSearchPage /> }, // 지역 기반 여행지 리스트 페이지
    //{ path: "/category", element: <RegionSearchPage /> }, // 카테고리 기반 여행지 리스트 페이지
    { path: "/myplan", element: <MyListPage />}, // MyList & 찜 페이지
    { path: "/review", element: <MyReviewPage/>}, // MyList & 찜 페이지

  ]);
  return <RouterProvider router={router} />;
}


