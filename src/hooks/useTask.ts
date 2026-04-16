import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useTaskStore } from "@/stores/taskStore";
import {
  getBoardTasks,
  addTask,
  editTask,
  deleteTask,
  getTaskMetrics,
  getPeriodTask,
} from "@/api/task";
import type { taskFilterParams, TaskPayload, dateType } from "@/types/task";
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

export const useDeleteTask = (boardId: string, taskId: string) => {
  const queryClient = useQueryClient();
  const currentTask = useTaskStore((state) => state.task);
  const setTask = useTaskStore((state) => state.setTask);
  return useMutation({
    mutationFn: () => {
      if (!boardId) {
        throw new Error("没有看板Id");
      }
      return deleteTask(boardId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardTasks", boardId] });
      Message.success("删除任务成功");
      if (currentTask?.taskId === taskId) {
        setTask(null);
      }
    },
    onError: (error) => {
      Message.error(error.message);
    },
  });
};

export const useGetTaskMetrics = (dateType: dateType, teamId: string) => {
  return useQuery({
    queryKey: ["taskMetrics", dateType, teamId],
    queryFn: () => getTaskMetrics(dateType, teamId),
  });
};

export const useGetPeriodTask = (dateType: dateType, teamId: string) => {
  return useQuery({
    queryKey: ["periodTask", dateType, teamId],
    queryFn: () => getPeriodTask(dateType, teamId ),
  });
};
