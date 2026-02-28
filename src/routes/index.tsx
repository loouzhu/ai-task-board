import { createBrowserRouter, Navigate} from "react-router-dom";
import Auth from "@/pages/Auth";
import MainLayout from "@/components/MainLayout";
import Board from "@/pages/Board";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path:"/",
        element: <Navigate to="/auth" replace />
      },
      // 主看板
      {
        path: "board",
        element: <Board />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

export default router;
