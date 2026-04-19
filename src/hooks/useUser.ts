import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getAreaCities,
  getAreaProvinces,
  getUserInfo,
  updateUserInfo,
} from "@/api/user";
import type { userInfo } from "@/types/user";

// 获取当前团队所有用户列表
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });
};

export const useGetUserInfoById = (userId: string) => {
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserInfo(userId),
    enabled: Boolean(userId),
  });
};

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: userInfo;
    }) => updateUserInfo(userId, userData),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["userInfo", variables.userId],
        (oldData: { userInfo?: userInfo } | undefined) => ({
          ...(oldData || {}),
          userInfo: {
            ...(oldData?.userInfo || {}),
            ...variables.userData,
          },
        }),
      );
      queryClient.invalidateQueries({
        queryKey: ["userInfo", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useAreaProvinces = () => {
  return useQuery({
    queryKey: ["area", "provinces"],
    queryFn: getAreaProvinces,
  });
};

export const useAreaCities = (province?: string) => {
  return useQuery({
    queryKey: ["area", "cities", province],
    queryFn: () => getAreaCities(province || ""),
    enabled: Boolean(province),
  });
};
