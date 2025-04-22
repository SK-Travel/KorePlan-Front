import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

export function App() {
  const router = createBrowserRouter([
    /*{ path: "/", element: <HomePage /> }, 여기다가 메인페이지 컴포넌트 경로 설정하기.*/
    { path: "/MainPage", element: <MainPage />}
    
  ]);
  return <RouterProvider router={router} />;
}