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
  taskWorkTime: Date;
}

export type taskType = "pending" | "processing" | "testing" | "completed";

export interface taskFilterParams {
  member?: string;
  taskPriority?: string;
  keyword?: string;
  deadlineRange?: [string, string] | [];
}
