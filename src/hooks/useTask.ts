import { useQuery, useMutation } from "@tanstack/react-query";
import { getBoardTasks, addTask } from "@/api/task";
import type { taskFilterParams, task } from "@/types/task";

export const useGetBoardTasks = (
  boardId: string,
  filterParams?: taskFilterParams,
) => {
  return useQuery({
    queryKey: ["boardTasks", boardId, filterParams],
    queryFn: () => getBoardTasks(boardId, filterParams),
    enabled: !!boardId,
  });
};

export const useAddTask = (boardId: string, task: task) => {
  return useMutation({
    mutationFn: () => addTask(boardId, task),
  });
};
