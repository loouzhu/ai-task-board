import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, queryMe, logout } from "@/api/auth";
import type { AuthStatus } from "@/types/common";
import { Message } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: { username: string; password: string }) =>
      login(userData),
    onSuccess: () => {
      Message.success("登陆成功");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/board");
    },
    onError: (error: Error) => {
      Message.error(error.message);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: { username: string; password: string }) =>
      register(userData),
    onSuccess: () => {
      Message.success("注册成功");
    },
    onError: (error: Error) => {
      Message.error(error.message || "注册失败");
    },
  });
};

export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: queryMe,
    retry: false,
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    // 无论成功与否，都要清理前端状态
    onSuccess: () => {
      Message.success("退出登陆成功");
      queryClient.clear();
      navigate("/auth", { replace: true });
    },
    onError: (error: Error) => {
      Message.error(error.message || "退出登录失败");
      queryClient.clear();
      navigate("/auth", { replace: true });
    },
  });
};

export const useAuthStatus = () => {
  const meQuery = useMeQuery();
  const user = meQuery.data ?? null;
  const status: AuthStatus = meQuery.isPending
    ? "unknown"
    : user
      ? "authenticated"
      : "unauthenticated";
  return {
    user,
    status,
    // 后面这三个状态是冗余的，但是最好都提供
    isLoading: status === "unknown",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    refetch: meQuery.refetch,
  };
};
