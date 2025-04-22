import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchResult from "./pages/SearchResult.jsx";

export function App() {
  const router = createBrowserRouter([
    { path: "/search", element: <SearchResult/>} //검색 결과 화면
  ]);
  return <RouterProvider router={router} />;
}