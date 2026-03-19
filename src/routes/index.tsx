import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import Auth from "@/pages/Auth";
import MainLayout from "@/components/MainLayout";
import Board from "@/pages/Board";

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
        path: "/",
        element: <Navigate to="/auth" replace />,
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
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

export default router;
