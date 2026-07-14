import type { taskFilterParams } from "@/types/task";

export const taskKeys = {
  all: ["boardTasks"] as const,
  board: (boardId: string) => [...taskKeys.all, boardId] as const,
  list: (boardId: string, filterParams: taskFilterParams = {}) =>
    [...taskKeys.board(boardId), filterParams] as const,
};
