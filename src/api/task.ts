import type { task, taskFilterParams, TaskPayload } from "@/types/task";

const BASE_URL = "/api/task";

interface RawMember {
  userId?: string;
  username?: string;
}

interface RawTask extends Omit<task, "taskMembers"> {
  taskMembers?: Array<string | RawMember>;
  principle?: string;
}

const normalizeTaskMembers = (taskMembers?: Array<string | RawMember>) => {
  if (!Array.isArray(taskMembers)) {
    return [];
  }
  return taskMembers
    .map((member) => {
      if (typeof member === "string") {
        return member;
      }
      return member.username || member.userId || "";
    })
    .filter(Boolean);
};

const normalizeTask = (rawTask: RawTask): task => {
  const taskMembers = normalizeTaskMembers(rawTask.taskMembers);
  return {
    ...rawTask,
    isBlock: Boolean(rawTask.isBlock),
    blockInfo: rawTask.blockInfo ?? "",
    taskMembers:
      taskMembers.length > 0
        ? taskMembers
        : rawTask.principle
          ? [rawTask.principle]
          : [],
  };
};

// 根据当前看板获取任务
export const getBoardTasks = async (
  boardId: string,
  filterParams?: taskFilterParams,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(filterParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const requestUrl = queryString
    ? `${BASE_URL}/get-task-list/${boardId}?${queryString}`
    : `${BASE_URL}/get-task-list/${boardId}`;

  const response = await fetch(requestUrl, {
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

// 添加任务
export const addTask = async (
  boardId: string,
  task: TaskPayload,
  files?: File[],
) => {
  const formData = new FormData();
  formData.append("task", JSON.stringify(task));
  if (files) {
    files.forEach((file) => formData.append("files", file));
  }
  const response = await fetch(`${BASE_URL}/add-task/${boardId}`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("添加任务失败：请求参数错误");
    } else if (response.status === 401) {
      throw new Error("添加任务失败：未授权");
    } else if (response.status === 500) {
      throw new Error("添加任务失败：服务器错误");
    } else {
      throw new Error("添加任务失败");
    }
  }
  const data = await response.json();
  return normalizeTask(data);
};

// 编辑任务
export const editTask = async (
  boardId: string,
  task: TaskPayload,
  taskId: string,
  files?: File[],
) => {
  const formData = new FormData();
  formData.append("task", JSON.stringify({ ...task, taskId }));
  if (files) {
    files.forEach((file) => formData.append("files", file));
  }
  const response = await fetch(`${BASE_URL}/edit-task/${boardId}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("编辑任务失败：请求参数错误");
    } else if (response.status === 401) {
      throw new Error("编辑任务失败：未授权");
    } else if (response.status === 500) {
      throw new Error("编辑任务失败：服务器错误");
    } else {
      throw new Error("编辑任务失败");
    }
  }
  const data = await response.json();
  return normalizeTask(data);
};

// 删除任务
export const deleteTask = async (boardId: string, taskId: string) => {
  const response = await fetch(`${BASE_URL}/delete-task/${boardId}`, {
    method: "DELETE",
    body: JSON.stringify({ taskId }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("删除任务失败：请求参数错误");
    } else if (response.status === 401) {
      throw new Error("删除任务失败：未授权");
    } else if (response.status === 500) {
      throw new Error("删除任务失败：服务器错误");
    } else {
      throw new Error("删除任务失败");
    }
  }
};
