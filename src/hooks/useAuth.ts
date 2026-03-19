import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/api/auth";
import { Message } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: { username: string; password: string }) =>
      login(userData),
    onSuccess: (data) => {
      Message.success("登陆成功");
      localStorage.setItem("token", data.token);
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
