export interface task {
  boardId: string;
  createdAt: string;
  createdBy: string;
  files: [];
  subtask: string[];
  taskDeadline: string;
  taskDescription: string;
  taskId: string;
  members: string[];
  taskName: string;
  taskNumber: number;
  taskPriority: string;
  taskStatus: taskType;
  taskWorkTime: string;
}

export type taskType = "pending" | "processing" | "testing" | "completed";

export interface taskFilterParams {
  member?: string;
  taskPriority?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  taskStatus?: string;
}
export interface TaskItemProps {
  task: task;
}
