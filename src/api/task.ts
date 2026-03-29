import type { task, taskFilterParams } from "@/types/task";

const BASE_URL = "/api/task";

interface RawMember {
  userId?: string;
  username?: string;
}

interface RawTask extends Omit<task, "members"> {
  members?: Array<string | RawMember>;
  taskMembers?: Array<string | RawMember>;
  principle?: string;
}

const normalizeMembers = (members?: Array<string | RawMember>) => {
  if (!Array.isArray(members)) {
    return [];
  }

  return members
    .map((member) => {
      if (typeof member === "string") {
        return member;
      }

      return member.username || member.userId || "";
    })
    .filter(Boolean);
};

const normalizeTask = (rawTask: RawTask): task => {
  const members = normalizeMembers(rawTask.members ?? rawTask.taskMembers);

  return {
    ...rawTask,
    members:
      members.length > 0
        ? members
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
