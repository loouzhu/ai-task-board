import { useAuthStatus } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Spin } from "@arco-design/web-react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isUnauthenticated } = useAuthStatus();
  const location = useLocation();
  if (isLoading) {
    return (
      <div>
        <Spin tip="加载中" />
      </div>
    );
  }
  if (isAuthenticated) {
    return <>{children}</>;
  }
  if (isUnauthenticated) {
    return <Navigate to="/auth" replace={true} state={{ from: location }} />;
  }
  return null;
}
