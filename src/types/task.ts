export interface task {
  boardId: string;
  createdAt: string;
  createdBy: string;
  files: [];
  subtask: string[];
  taskDeadline: string;
  taskDescription: string;
  taskId: string;
  taskMembers: string[];
  taskName: string;
  taskNumber: number;
  taskPriority: string;
  taskStatus: taskType;
  taskWorkTime: string;
}

export type taskType = "pending" | "processing" | "testing" | "completed";

export interface taskFilterParams {
  filterMember?: string;
  taskPriority?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  taskStatus?: string;
}
export interface TaskItemProps {
  task: task;
}

export interface TaskPayload {
  taskId?: string;
  taskNumber: number;
  taskName: string;
  taskDescription?: string;
  taskPriority: string;
  taskDeadline?: string;
  taskMembers: string[];
  taskStatus: taskType;
  taskWorkTime?: string;
  subtask?: string[];
  files?: File[];
}
