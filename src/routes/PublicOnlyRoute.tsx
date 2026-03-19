import { useAuthStatus } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Spin } from "@arco-design/web-react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function PublicOnlyRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isUnauthenticated } = useAuthStatus();
  if (isLoading) {
    return (
      <div>
        <Spin tip="加载中" />
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/board" replace />;
  }
  if (isUnauthenticated) {
    return <>{children}</>;
  }
  return null;
}
