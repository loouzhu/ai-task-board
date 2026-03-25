const BASE_URL = "/api/task";

// 根据当前看板获取任务
export const getBoardTasks = async (boardId: string) => {
  const response = await fetch(`${BASE_URL}/get-task-list/${boardId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
