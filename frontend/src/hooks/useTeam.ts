import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@arco-design/web-react";
import {
  createTeam,
  editTeam,
  deleteTeam,
  getTeamList,
  getTeamInfo,
} from "@/api/team";

// 创建团队
export const useCreateTeam = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: async () => {
      Message.success("创建团队成功");
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ["teamList", userId] });
        await queryClient.refetchQueries({
          queryKey: ["teamList", userId],
          type: "active",
        });
      }
    },
    onError: (err: Error) => {
      Message.error("创建团队失败");
      console.log("创建团队失败", err);
    },
  });
};

// 编辑团队
export const useEditTeam = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editTeam,
    onSuccess: async () => {
      Message.success("编辑团队成功");
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ["teamList", userId] });
        await queryClient.refetchQueries({
          queryKey: ["teamList", userId],
          type: "active",
        });
      }
    },

    onError: (err: Error) => {
      Message.error("编辑团队失败");
      console.log("编辑团队失败", err);
    },
  });
};

// 解散团队
export const useDeleteTeam = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: async () => {
      Message.success("解散团队成功");
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ["teamList", userId] });
        await queryClient.refetchQueries({
          queryKey: ["teamList", userId],
          type: "active",
        });
      }
    },
    onError: (err: Error) => {
      Message.error("解散团队失败");
      console.log("解散团队失败", err);
    },
  });
};

// 获取团队列表
export const useGetTeamList = (id: string) => {
  const userId = id ?? "";
  return useQuery({
    queryKey: ["teamList", userId],
    queryFn: () => getTeamList(userId),
    enabled: !!userId,
  });
};

// 获取当前团队信息
export const useGetTeamInfo = (teamId: string) => {
  return useQuery({
    queryKey: ["teamInfo", teamId],
    queryFn: () => getTeamInfo(teamId),
    enabled: !!teamId,
  });
};
