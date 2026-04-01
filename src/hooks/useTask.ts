import { useQuery, useMutation } from "@tanstack/react-query";
import { getBoardTasks, addTask } from "@/api/task";
import type { taskFilterParams, CreateTaskPayload } from "@/types/task";
import { Message } from "@arco-design/web-react";

interface AddTaskMutationPayload {
  task: CreateTaskPayload;
  files?: File[];
}

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

export const useAddTask = (boardId: string) => {
  return useMutation({
    mutationFn: ({ task, files }: AddTaskMutationPayload) => {
      if (!boardId || boardId.trim() === "") {
        throw new Error("boardId不能为空");
      }

      return addTask(boardId, task, files);
    },
    onSuccess: () => Message.success("创建任务成功"),
    onError: (error: Error) => Message.error(error.message),
  });
};
