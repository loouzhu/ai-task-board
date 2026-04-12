import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import MainLayout from "@/components/MainLayout";
import Auth from "@/pages/Auth";
import Board from "@/pages/Board";
import DataView from "@/pages/DataView";
import TeamRedirect from "./TeamRedirect";

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
    path: "/team",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <TeamRedirect />,
      },
      {
        path: ":teamId",
        children: [
          {
            index: true,
            element: <Navigate to="board" replace />,
          },
          {
            path: "board/:boardId?",
            element: (
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            ),
          },
          {
            path: "data-view/:boardId?",
            element: (
              <ProtectedRoute>
                <DataView />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

export default router;
