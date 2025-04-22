
import MainPage from "./pages/MainPage.jsx";
import SearchResult from "./pages/SearchResult.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
export function App() {
  const router = createBrowserRouter([

    { path: "/mainPage", element: <MainPage />},
    { path: "/search", element: <SearchResult/>} //검색 결과 화면
  ]);
  return <RouterProvider router={router} />;
}