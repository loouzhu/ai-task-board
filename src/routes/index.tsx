import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import MainLayout from "@/components/MainLayout";
import Auth from "@/pages/Auth";
import Board from "@/pages/Board";
import DataView from "@/pages/DataView";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicOnlyRoute>
        <Auth />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/board" replace />,
      },
      // 主看板
      {
        path: "board",
        element: (
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        ),
      },
      // 数据页面
      {
        path: "data-view",
        element: (
          <ProtectedRoute>
            <DataView />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

export default router;
