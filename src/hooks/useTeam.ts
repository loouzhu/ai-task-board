import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@arco-design/web-react";
import { createTeam, editTeam, deleteTeam, getTeamList } from "@/api/team";
import { useMeQuery } from "@/hooks/useAuth";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      Message.success("创建团队成功");
      queryClient.invalidateQueries({ queryKey: ["teamList"] });
    },
    onError: (err: Error) => {
      Message.error("创建团队失败");
      console.log("创建团队失败", err);
    },
  });
};

export const useEditTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editTeam,
    onSuccess: () => {
      Message.success("编辑团队成功");
      queryClient.invalidateQueries({ queryKey: ["teamList"] });
    },

    onError: (err: Error) => {
      Message.error("编辑团队失败");
      console.log("编辑团队失败", err);
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      Message.success("删除团队成功");
      queryClient.invalidateQueries({ queryKey: ["teamList"] });
    },
    onError: (err: Error) => {
      Message.error("删除团队失败");
      console.log("删除团队失败", err);
    },
  });
};

export const useGetTeamList = () => {
  const userId = useMeQuery().data?.user?.userId ?? "";
  return useQuery({
    queryKey: ["teamList", userId],
    queryFn: () => getTeamList(userId),
    enabled: !!userId,
  });
};
