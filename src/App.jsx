
import MainPage from "./pages/MainPage.jsx";
import SearchResult from "./pages/SearchResult.jsx";
import SignUpPage from './pages/SignUpPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchBar from "./component/Main/SearchBar.jsx";
export function App() {
  const router = createBrowserRouter([
    { path: "/mainPage", element: <MainPage />},  // 메인 페이지 화면
    { path: "/search", element: <SearchResult/>}, //검색 결과 화면
    { path: "/signUp", element: <SignUpPage />}, // 회원가입 화면
    { path: "/ss", element: <SearchBar />}
  ]);
  return <RouterProvider router={router} />;
}

