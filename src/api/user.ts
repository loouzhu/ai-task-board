import type { userInfo } from "@/types/user";

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

// 获取单个用户的信息
export const getUserInfo = async (userId: string) => {
  const response = await fetch(`/api/user/userInfo/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("用户未找到");
    } else {
      throw new Error("获取用户信息失败");
    }
  }
  const data = await response.json();
  return data;
};

// 更新单个用户信息
export const updateUserInfo = async (userId: string, userData: userInfo) => {
  const response = await fetch(`/api/user/userInfo/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("用户未找到");
    } else {
      throw new Error("更新用户信息失败");
    }
  }
  const data = await response.json();
  return data;
};

// 获取省份列表
export const getAreaProvinces = async () => {
  const response = await fetch("/api/user/area/provinces", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("获取省份列表失败");
  }
  const data = await response.json();
  return data;
};

// 按省份获取城市列表
export const getAreaCities = async (province: string) => {
  const response = await fetch(
    `/api/user/area/cities?province=${encodeURIComponent(province)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("获取城市列表失败");
  }
  const data = await response.json();
  return data;
};
