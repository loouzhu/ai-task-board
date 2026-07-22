import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import { LazyRoute } from "@/components/LazyRoute";
import TeamRedirect from "./TeamRedirect";

const Auth = LazyRoute(() => import("@/pages/Auth"));
const Board = LazyRoute(() => import("@/pages/Board"));
const MainLayout = LazyRoute(() => import("@/components/MainLayout"));
const DataView = LazyRoute(() => import("@/pages/DataView"));
const PersonalHomePage = LazyRoute(() => import("@/pages/PersonalHomepage"));

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
            path: "data-view",
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
    path: "/user",
    element: <MainLayout />,
    children: [
      {
        path: ":userId",
        element: (
          <ProtectedRoute>
            <PersonalHomePage />
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
