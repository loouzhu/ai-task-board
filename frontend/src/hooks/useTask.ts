import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  getBoardTasks,
  addTask,
  editTask,
  deleteTask,
  getTaskMetrics,
  getPeriodTask,
  getFocusOnTask,
} from "@/api/task";
import type {
  task,
  taskFilterParams,
  TaskPayload,
  dateType,
  TasksResponse,
} from "@/types/task";
import { taskKeys } from "@/utils/queryKeyFactory/task";
import { Message } from "@arco-design/web-react";

interface AddTaskMutationPayload {
  task: TaskPayload;
  files?: File[];
}

interface EditTaskMutationPayload {
  taskId: string;
  task: TaskPayload;
  files?: File[];
}

interface DeleteTaskMutationPayLoad {
  taskId: string;
}

interface FocusOnTaskResponse {
  tasks: task[];
  [key: string]: unknown;
}

export const useGetBoardTasks = (
  boardId: string,
  filterParams: taskFilterParams = {},
) => {
  return useQuery<TasksResponse>({
    queryKey: taskKeys.list(boardId, filterParams),
    queryFn: () => getBoardTasks(boardId, filterParams),
    enabled: !!boardId,
  });
};

export const useAddTask = (boardId: string, filterParams: taskFilterParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task, files }: AddTaskMutationPayload) => {
      if (!boardId || boardId.trim() === "") {
        throw new Error("boardId不能为空");
      }
      return addTask(boardId, task, files);
    },
    onMutate: async ({ task }) => {
      await queryClient.cancelQueries({
        queryKey: taskKeys.list(boardId, filterParams),
      });
      // const previousTasks =
      //   queryClient.getQueriesData<TasksResponse>({
      //     queryKey: taskKeys.list(boardId, filterParams),
      //   }) ?? [];
      const optimisticTask = {
        taskId: `temp-${Date.now()}`,
        boardId: boardId,
        boardName: "temp-boardName",
        createdAt: new Date().toISOString(),
        createdBy: "me",
        files: [],
        subtask: [],
        taskDeadline: "",
        taskDescription: "",
        taskWorkTime: "",
        ...task,
      };
      const queryKey = taskKeys.list(boardId, filterParams);
      const previousData = queryClient.getQueryData<TasksResponse>(queryKey);
      if (!previousData) {
        queryClient.setQueryData(taskKeys.list(boardId, filterParams), {
          tasks: [optimisticTask],
        });
      } else {
        const tasks = previousData.tasks ?? [];
        queryClient.setQueryData(queryKey, {
          tasks: [...tasks, optimisticTask],
        });
      }
      return { queryKey, previousData };
    },
    onSuccess: () => {
      Message.success("创建任务成功");
      queryClient.invalidateQueries({ queryKey: taskKeys.board(boardId) });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      } else {
        queryClient.removeQueries({
          queryKey: context?.queryKey,
          exact: true,
        });
      }
      Message.error(error.message);
    },
  });
};

export const useEditTask = (
  boardId: string,
  filterParams: taskFilterParams,
) => {
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
    onMutate: async ({ taskId, task: payload }) => {
      const queryKey = taskKeys.list(boardId, filterParams);
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TasksResponse>(queryKey);
      if (previousData) {
        queryClient.setQueryData<TasksResponse>(queryKey, {
          ...previousData,
          tasks: previousData?.tasks.map((item) =>
            item.taskId === taskId ? { ...item, ...payload } : item,
          ),
        });
      }
      return { queryKey, previousData };
    },
    onSuccess: () => {
      Message.success("编辑任务成功");
      queryClient.invalidateQueries({ queryKey: taskKeys.board(boardId) });
    },
    onError: (error: Error, _variables, context) => {
      Message.error(error.message);
      if (context?.previousData) {
        queryClient.setQueryData(context?.queryKey, context?.previousData);
      } else {
        queryClient.removeQueries({
          queryKey: context?.queryKey,
          exact: true,
        });
      }
    },
  });
};

export const useDeleteTask = (
  boardId: string,
  filterParams: taskFilterParams,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId }: DeleteTaskMutationPayLoad) => {
      if (!boardId) {
        throw new Error("没有看板Id");
      }
      return deleteTask(boardId, taskId);
    },
    onMutate: async ({ taskId }) => {
      const queryKey = taskKeys.list(boardId, filterParams);
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TasksResponse>(queryKey);
      const filteredData = previousData?.tasks.filter(
        (taskItem) => taskItem.taskId !== taskId,
      );
      if (previousData) {
        queryClient.setQueryData(queryKey, { tasks: filteredData });
      }

      return { queryKey, previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.board(boardId) });
      Message.success("删除任务成功");
    },
    onError: (error: Error, _variable, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context?.queryKey, context?.previousData);
      }
      Message.error(error.message);
    },
  });
};

export const useGetTaskMetrics = (dateType: dateType, teamId: string) => {
  return useQuery({
    queryKey: ["taskMetrics", dateType, teamId],
    queryFn: () => getTaskMetrics(dateType, teamId),
    enabled: !!teamId,
  });
};

export const useGetPeriodTask = (dateType: dateType, teamId: string) => {
  return useQuery({
    queryKey: ["periodTask", dateType, teamId],
    queryFn: () => getPeriodTask(dateType, teamId),
    enabled: !!teamId,
  });
};

export const useGetFocusOnTask = (teamId: string) => {
  return useQuery<FocusOnTaskResponse>({
    queryKey: ["focusOnTasks", teamId],
    queryFn: () => getFocusOnTask(teamId),
    enabled: !!teamId,
  });
};
