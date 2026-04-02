import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getBoardTasks, addTask, editTask } from "@/api/task";
import type { taskFilterParams, TaskPayload } from "@/types/task";
import { Message } from "@arco-design/web-react";

interface AddTaskMutationPayload {
  task: TaskPayload;
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task, files }: AddTaskMutationPayload) => {
      if (!boardId || boardId.trim() === "") {
        throw new Error("boardId不能为空");
      }

      return addTask(boardId, task, files);
    },
    onSuccess: () => {
      Message.success("创建任务成功");
      queryClient.invalidateQueries({ queryKey: ["boardTasks", boardId] });
    },
    onError: (error: Error) => Message.error(error.message),
  });
};

interface EditTaskMutationPayload {
  taskId: string;
  task: TaskPayload;
  files?: File[];
}

export const useEditTask = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, task, files }: EditTaskMutationPayload) => {
      if (!boardId || boardId.trim() === "") {
        throw new Error("boardId不能为空");
      }
      if (!taskId || taskId.trim() === "") {
        throw new Error("taskId不能为空");
      }

      return editTask(boardId, task, taskId, files);
    },
    onSuccess: () => {
      Message.success("编辑任务成功");
      queryClient.invalidateQueries({ queryKey: ["boardTasks", boardId] });
    },
    onError: (error: Error) => Message.error(error.message),
  });
};
