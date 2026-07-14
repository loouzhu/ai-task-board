import type {
  task,
  taskFilterParams,
  TaskPayload,
  dateType,
  TasksResponse,
} from "@/types/task";

const BASE_URL = "/api/task";

interface RawMember {
  userId?: string;
  username?: string;
}

interface RawTask extends Omit<task, "taskMembers"> {
  taskMembers?: Array<string | RawMember>;
  principle?: string;
}

interface FocusOnTaskResponse {
  tasks: task[];
  [key: string]: unknown;
}

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

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
    isOverdue: Boolean(rawTask.isOverdue),
    overdueInfo: rawTask.overdueInfo ?? "",
    taskMembers:
      taskMembers.length > 0
        ? taskMembers
        : rawTask.principle
          ? [rawTask.principle]
          : [],
  };
};

const normalizeTaskCollection = (data: unknown) => {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeTask(item as RawTask));
  }

  if (data && typeof data === "object") {
    const result = { ...(data as Record<string, unknown>) };

    if (Array.isArray(result.tasks)) {
      result.tasks = result.tasks.map((item) => normalizeTask(item as RawTask));
    }

    if (Array.isArray(result.data)) {
      result.data = result.data.map((item) => normalizeTask(item as RawTask));
    }

    if (Array.isArray(result.periodTasks)) {
      result.periodTasks = result.periodTasks.map((item) =>
        normalizeTask(item as RawTask),
      );
    }

    return result;
  }

  return data;
};

// 根据当前看板获取任务
export const getBoardTasks = async (
  boardId: string,
  filterParams?: taskFilterParams,
): Promise<TasksResponse> => {
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
  const data = await readJson(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || "获取任务失败");
  }

  if (!data) {
    return { tasks: [] };
  }

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
      throw new Error((await response.json()).message);
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
      throw new Error((await response.json()).message);
    } else if (response.status === 401) {
      throw new Error("删除任务失败：未授权");
    } else if (response.status === 500) {
      throw new Error("删除任务失败：服务器错误");
    } else {
      throw new Error("删除任务失败");
    }
  }
};

// 获取任务指标
export const getTaskMetrics = async (dateType: dateType, teamId: string) => {
  const response = await fetch(
    `${BASE_URL}/get-task-metrics/${teamId}?dateType=${dateType}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("获取任务指标失败：请求参数错误");
    } else if (response.status === 401) {
      throw new Error("获取任务指标失败：未授权");
    } else if (response.status === 500) {
      throw new Error("获取任务指标失败：服务器错误");
    } else {
      throw new Error("获取任务指标失败");
    }
  }
  const data = await response.json();
  return data;
};

// 获取本周或本月任务
export const getPeriodTask = async (dateType: dateType, teamId: string) => {
  const response = await fetch(
    `${BASE_URL}/get-period-task-data/${teamId}?dateType=${dateType}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("获取任务失败：请求参数错误");
    } else if (response.status === 401) {
      throw new Error("获取任务失败：未授权");
    } else if (response.status === 500) {
      throw new Error("获取任务失败：服务器错误");
    } else {
      throw new Error("获取任务失败");
    }
  }
  const data = await response.json();
  return normalizeTaskCollection(data);
};

// 获取重点关注任务
export const getFocusOnTask = async (
  teamId: string,
): Promise<FocusOnTaskResponse> => {
  const response = await fetch(`${BASE_URL}/focus-on-tasks/${teamId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("获取重点关注任务失败：请求参数错误");
    } else if (response.status === 401) {
      throw new Error("获取重点关注任务失败：未授权");
    } else if (response.status === 500) {
      throw new Error("获取重点关注任务失败：服务器错误");
    } else {
      throw new Error("获取重点关注任务失败");
    }
  }
  const data = await response.json();
  const normalizedData = normalizeTaskCollection(data);

  if (Array.isArray(normalizedData)) {
    return { tasks: normalizedData };
  }

  if (normalizedData && typeof normalizedData === "object") {
    const result = normalizedData as Record<string, unknown>;
    return {
      ...result,
      tasks: Array.isArray(result.tasks) ? (result.tasks as task[]) : [],
    };
  }

  return { tasks: [] };
};
