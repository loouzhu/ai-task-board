// 获取所有用户列表
export const getAllUsers = async () => {
  const response = await fetch("/api/user/list");
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("用户列表未找到");
    } else {
      throw new Error("获取用户列表失败");
    }
  }
  const data = await response.json();
  return data;
};
