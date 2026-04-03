import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/user";

// 获取所有用户列表
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });
};
