import type { team } from "@/types/team";
const BASE_URL = "/api/team";

// 创建团队
export const createTeam = async (team: Omit<team, "teamId">) => {
  const response = await fetch(`${BASE_URL}/create-team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("创建团队失败");
  }

  return response.json();
};

// 编辑团队信息
export const editTeam = async (team: team) => {
  const response = await fetch(`${BASE_URL}/edit-team`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("没有找到该团队");
    } else {
      throw new Error("编辑团队失败");
    }
  }
  return response.json();
};

// 解散团队
export const deleteTeam = async (teamId: string) => {
  const response = await fetch(`${BASE_URL}/delete-team`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamId }),
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("没有找到该团队");
    } else {
      throw new Error("解散团队失败");
    }
  }
  return response.json();
};

// 获取个人团队列表
export const getTeamList = async (userId: string) => {
  const transformUserId = encodeURIComponent(userId);
  const response = await fetch(`${BASE_URL}/get-team-list/${transformUserId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("获取团队列表失败");
  }
  return response.json();
};
