import type { task } from "@/types/task";

const BASE_URL = "/api/task";

interface RawTask extends Omit<task, "members"> {
  members?: string[];
  taskMembers?: string[];
  principle?: string;
}

const normalizeTask = (rawTask: RawTask): task => {
  const members =
    rawTask.members ??
    rawTask.taskMembers ??
    (rawTask.principle ? [rawTask.principle] : []);

  return {
    ...rawTask,
    members,
  };
};

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

  if (Array.isArray(data?.tasks)) {
    return {
      ...data,
      tasks: data.tasks.map((item: RawTask) => normalizeTask(item)),
    };
  }

  return data;
};
