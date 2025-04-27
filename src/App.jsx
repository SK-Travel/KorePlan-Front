
import MainPage from "./pages/MainPage.jsx";
import SearchResult from "./pages/SearchResult.jsx";
import SignUpPage from './pages/SignUpPage.jsx';
import TestPage from "./pages/TestPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


export function App() {
  const router = createBrowserRouter([
    { path: "/", element: <TestPage />}, // 연동용 TEST페이지 화면 
    { path: "/mainPage", element: <MainPage />},  // 메인 페이지 화면
    { path: "/search", element: <SearchResult/>}, //검색 결과 화면
    { path: "/signUp", element: <SignUpPage />}, // 회원가입 화면
  ]);
  return <RouterProvider router={router} />;
}

