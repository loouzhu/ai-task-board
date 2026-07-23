import { Empty, Spin } from "@arco-design/web-react";
import { useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useGetTeamList } from "@/hooks/useTeam";
import { useAuthStatus } from "@/hooks/useAuth";

export default function TeamRedirect() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, me } = useAuthStatus();
  const teamQuery = useGetTeamList(me?.user?.userId);

  const teamList = useMemo(() => {
    return teamQuery.data?.teams;
  }, [teamQuery.data?.teams]);
  console.log(teamList);

  useEffect(() => {
    if (!isAuthenticated || teamList?.length === 0 || teamList === undefined) {
      return;
    }
    navigate(`/team/${teamList[0].teamId}/board`, { replace: true });
  }, [isAuthenticated, navigate, teamList]);

  if (authLoading) {
    return (
      <div>
        <Spin tip="加载中" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (teamList?.length === 0) {
    return <Empty description="暂无团队，请先创建团队" />;
  }

  return null;
}
